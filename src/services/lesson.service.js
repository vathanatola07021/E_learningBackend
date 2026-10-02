const db = require('../config/database');
const { store } = require('./store');

function formatMaterialRow(row) {
  return {
    id: row.id,
    lessonId: row.lesson_id || row.lessonId,
    title: row.title,
    type: row.type || 'pdf',
    fileUrl: row.file_url || row.fileUrl || '',
    uploadDate: row.upload_date || row.uploadDate || '',
    description: row.description || '',
    fileSize: row.file_size || row.fileSize || '2.0 MB',
  };
}

function formatLessonRow(row, materials = [], isCompleted = false) {
  return {
    id: row.id,
    courseId: row.course_id || row.courseId,
    title: row.title,
    description: row.description || '',
    order: Number(row.lesson_order !== undefined ? row.lesson_order : (row.order || 1)),
    videoUrl: row.video_url || row.videoUrl || '',
    duration: row.duration || '00:00',
    materials,
    status: row.status || 'published',
    isCompleted: Boolean(isCompleted),
    isLocked: Boolean(row.is_locked !== undefined ? row.is_locked : row.isLocked),
  };
}

class LessonService {
  static async getLessonsByCourse(courseId, studentId = null) {
    if (db.getIsDbConnected()) {
      const sql = `
        SELECT l.*,
               (SELECT COUNT(*) FROM lesson_completions lc WHERE lc.lesson_id = l.id AND lc.student_id = ?) > 0 AS is_completed
        FROM lessons l
        WHERE l.course_id = ?
        ORDER BY l.lesson_order ASC
      `;
      const [lessonRows] = await db.pool.execute(sql, [studentId || '', courseId]);

      // Fetch materials for all lessons in this course
      const [matRows] = await db.pool.execute(
        `SELECT m.* FROM materials m 
         INNER JOIN lessons l ON m.lesson_id = l.id 
         WHERE l.course_id = ?`,
        [courseId]
      );

      const matMap = {};
      matRows.forEach((m) => {
        if (!matMap[m.lesson_id]) matMap[m.lesson_id] = [];
        matMap[m.lesson_id].push(formatMaterialRow(m));
      });

      return lessonRows.map((l) => formatLessonRow(l, matMap[l.id] || [], l.is_completed));
    }

    // Fallback store
    const courseLessons = store.lessons.filter((l) => l.courseId === courseId);
    return courseLessons.map((l) => {
      const mats = (store.materials || []).filter((m) => m.lessonId === l.id);
      return {
        ...l,
        materials: mats,
      };
    });
  }

  static async getLessonById(lessonId, studentId = null) {
    if (db.getIsDbConnected()) {
      const sql = `
        SELECT l.*,
               (SELECT COUNT(*) FROM lesson_completions lc WHERE lc.lesson_id = l.id AND lc.student_id = ?) > 0 AS is_completed
        FROM lessons l
        WHERE l.id = ?
        LIMIT 1
      `;
      const [rows] = await db.pool.execute(sql, [studentId || '', lessonId]);
      if (rows.length === 0) throw new Error('Lesson not found');

      const [matRows] = await db.pool.execute('SELECT * FROM materials WHERE lesson_id = ?', [lessonId]);
      const materials = matRows.map(formatMaterialRow);

      return formatLessonRow(rows[0], materials, rows[0].is_completed);
    }

    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    const mats = (store.materials || []).filter((m) => m.lessonId === lessonId);
    return {
      ...lesson,
      materials: mats,
    };
  }

  static async markLessonCompleted(lessonId, studentId, courseId = null) {
    const effectiveStudentId = studentId || 'usr_student_01';
    const dateStr = new Date().toISOString();

    if (db.getIsDbConnected()) {
      // Find courseId if not provided
      let finalCourseId = courseId;
      if (!finalCourseId) {
        const [lRows] = await db.pool.execute('SELECT course_id FROM lessons WHERE id = ?', [lessonId]);
        if (lRows.length > 0) finalCourseId = lRows[0].course_id;
      }

      await db.pool.execute(
        `INSERT IGNORE INTO lesson_completions (id, student_id, lesson_id, course_id, completed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [`comp_${lessonId}_${effectiveStudentId}`, effectiveStudentId, lessonId, finalCourseId, dateStr]
      );

      // Update progress
      if (finalCourseId) {
        const [totalRows] = await db.pool.execute('SELECT COUNT(*) as cnt FROM lessons WHERE course_id = ?', [finalCourseId]);
        const [compRows] = await db.pool.execute(
          'SELECT COUNT(*) as cnt FROM lesson_completions WHERE course_id = ? AND student_id = ?',
          [finalCourseId, effectiveStudentId]
        );
        const total = totalRows[0].cnt || 1;
        const comp = compRows[0].cnt || 0;
        const pct = Math.min(100.0, Math.round((comp / total) * 100));

        await db.pool.execute(
          `INSERT INTO course_progress (id, course_id, student_id, completed_lessons, total_lessons, percentage, last_activity)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE completed_lessons = ?, percentage = ?, last_activity = ?`,
          [
            `prog_${finalCourseId}_${effectiveStudentId}`,
            finalCourseId,
            effectiveStudentId,
            comp,
            total,
            pct,
            dateStr,
            comp,
            pct,
            dateStr,
          ]
        );
      }
      return true;
    }

    // Fallback store
    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (lesson) lesson.isCompleted = true;
    return true;
  }
}

module.exports = LessonService;
