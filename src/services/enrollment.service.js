const db = require('../config/database');
const { store } = require('./store');
const CourseService = require('./course.service');

function formatEnrollmentRow(row) {
  return {
    id: row.id,
    studentId: row.student_id || row.studentId,
    courseId: row.course_id || row.courseId,
    enrollmentDate: row.enrollment_date || row.enrollmentDate,
    status: row.status || 'active',
    progress: parseFloat(row.progress || 0.0),
  };
}

class EnrollmentService {
  static async enrollInCourse(courseId, studentId) {
    if (!courseId || !studentId) {
      throw new Error('courseId and studentId are required');
    }

    const enrollmentId = `enr_${Date.now()}`;
    const dateStr = new Date().toISOString();

    if (db.getIsDbConnected()) {
      // Check existing
      const [existing] = await db.pool.execute(
        'SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?',
        [courseId, studentId]
      );
      if (existing.length > 0) {
        return formatEnrollmentRow(existing[0]);
      }

      await db.pool.execute(
        'INSERT INTO enrollments (id, student_id, course_id, enrollment_date, status, progress) VALUES (?, ?, ?, ?, ?, ?)',
        [enrollmentId, studentId, courseId, dateStr, 'active', 0.0]
      );

      // Increment enrollment count in courses
      await db.pool.execute('UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = ?', [courseId]);

      // Initialize course progress
      await db.pool.execute(
        `INSERT INTO course_progress (id, course_id, student_id, completed_lessons, total_lessons, completed_quizzes, total_quizzes, submitted_assignments, total_assignments, percentage, last_activity)
         VALUES (?, ?, ?, 0, (SELECT COUNT(*) FROM lessons WHERE course_id = ?), 0, (SELECT COUNT(*) FROM quizzes WHERE course_id = ?), 0, (SELECT COUNT(*) FROM assignments WHERE course_id = ?), 0.0, ?)
         ON DUPLICATE KEY UPDATE last_activity = ?`,
        [`prog_${courseId}_${studentId}`, courseId, studentId, courseId, courseId, courseId, dateStr, dateStr]
      );

      // Add learning activity
      const [cRows] = await db.pool.execute('SELECT title FROM courses WHERE id = ?', [courseId]);
      const courseTitle = cRows.length > 0 ? cRows[0].title : 'Course';
      await db.pool.execute(
        'INSERT INTO learning_activities (id, user_id, course_id, course_title, type, title, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [`act_${Date.now()}`, studentId, courseId, courseTitle, 'courseEnrolled', `Enrolled in ${courseTitle}`, dateStr]
      );

      return {
        id: enrollmentId,
        studentId,
        courseId,
        enrollmentDate: dateStr,
        status: 'active',
        progress: 0.0,
      };
    }

    // Fallback store
    const existing = store.enrollments.find((e) => e.courseId === courseId && e.studentId === studentId);
    if (existing) return existing;

    const newEnrollment = {
      id: enrollmentId,
      studentId,
      courseId,
      enrollmentDate: dateStr,
      status: 'active',
      progress: 0.0,
    };
    store.enrollments.push(newEnrollment);

    // Update course enrollment count
    const course = store.courses.find((c) => c.id === courseId);
    if (course) {
      course.enrollmentCount = (course.enrollmentCount || 0) + 1;
    }

    return newEnrollment;
  }

  static async getEnrolledCourses(studentId) {
    if (!studentId) return [];

    if (db.getIsDbConnected()) {
      const sql = `
        SELECT c.*, 
               cat.name AS category_name, 
               inst.name AS instructor_name, 
               inst.avatar AS instructor_avatar,
               (SELECT COUNT(*) FROM user_favorites uf WHERE uf.course_id = c.id AND uf.user_id = ?) > 0 AS is_saved
        FROM enrollments e
        INNER JOIN courses c ON e.course_id = c.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN instructors inst ON c.instructor_id = inst.id
        WHERE e.student_id = ?
        ORDER BY e.created_at DESC
      `;
      const [rows] = await db.pool.execute(sql, [studentId, studentId]);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        categoryId: r.category_id,
        description: r.description || '',
        imageUrl: r.image_url || '',
        instructorId: r.instructor_id,
        duration: r.duration || '',
        level: r.level || 'All Levels',
        lessonCount: Number(r.lesson_count || 0),
        rating: parseFloat(r.rating || 4.5),
        enrollmentCount: Number(r.enrollment_count || 0),
        status: r.status || 'published',
        price: parseFloat(r.price || 0.0),
        isFree: Boolean(r.is_free),
        isSaved: Boolean(r.is_saved),
        categoryName: r.category_name || '',
        instructorName: r.instructor_name || '',
        instructorAvatar: r.instructor_avatar || null,
      }));
    }

    // Fallback store
    const enrolledIds = store.enrollments
      .filter((e) => e.studentId === studentId)
      .map((e) => e.courseId);

    const allCourses = await CourseService.getCourses(studentId);
    return allCourses.filter((c) => enrolledIds.includes(c.id));
  }

  static async isEnrolled(courseId, studentId) {
    if (!courseId || !studentId) return false;

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT id FROM enrollments WHERE course_id = ? AND student_id = ? LIMIT 1',
        [courseId, studentId]
      );
      return rows.length > 0;
    }

    return store.enrollments.some((e) => e.courseId === courseId && e.studentId === studentId);
  }

  static async getEnrollment(courseId, studentId) {
    if (!courseId || !studentId) return null;

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM enrollments WHERE course_id = ? AND student_id = ? LIMIT 1',
        [courseId, studentId]
      );
      return rows.length > 0 ? formatEnrollmentRow(rows[0]) : null;
    }

    return store.enrollments.find((e) => e.courseId === courseId && e.studentId === studentId) || null;
  }

  static async getAllEnrollments() {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM enrollments ORDER BY created_at DESC');
      return rows.map(formatEnrollmentRow);
    }
    return store.enrollments;
  }
}

module.exports = EnrollmentService;
