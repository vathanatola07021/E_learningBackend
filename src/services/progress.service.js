const db = require('../config/database');
const { store } = require('./store');

function formatProgressRow(row) {
  return {
    courseId: row.course_id || row.courseId,
    completedLessons: Number(row.completed_lessons !== undefined ? row.completed_lessons : (row.completedLessons || 0)),
    totalLessons: Number(row.total_lessons !== undefined ? row.total_lessons : (row.totalLessons || 0)),
    completedQuizzes: Number(row.completed_quizzes !== undefined ? row.completed_quizzes : (row.completedQuizzes || 0)),
    totalQuizzes: Number(row.total_quizzes !== undefined ? row.total_quizzes : (row.totalQuizzes || 0)),
    submittedAssignments: Number(row.submitted_assignments !== undefined ? row.submitted_assignments : (row.submittedAssignments || 0)),
    totalAssignments: Number(row.total_assignments !== undefined ? row.total_assignments : (row.totalAssignments || 0)),
    percentage: parseFloat(row.percentage || 0.0),
    lastActivity: row.last_activity || row.lastActivity || new Date().toISOString(),
  };
}

function formatActivityRow(row) {
  return {
    id: row.id,
    userId: row.user_id || row.userId,
    courseId: row.course_id || row.courseId,
    courseTitle: row.course_title || row.courseTitle,
    type: row.type || 'lessonCompleted',
    title: row.title,
    timestamp: row.timestamp || new Date().toISOString(),
    scoreOrDetail: row.score_or_detail || row.scoreOrDetail || null,
  };
}

function formatCertificateRow(row) {
  return {
    id: row.id,
    studentId: row.student_id || row.studentId,
    studentName: row.student_name || row.studentName,
    courseId: row.course_id || row.courseId,
    courseTitle: row.course_title || row.courseTitle,
    issueDate: row.issue_date || row.issueDate,
    certificateCode: row.certificate_code || row.certificateCode,
    credentialUrl: row.credential_url || row.credentialUrl || '',
    instructorName: row.instructor_name || row.instructorName || '',
  };
}

class ProgressService {
  static async getCourseProgress(courseId, studentId) {
    if (!courseId || !studentId) {
      throw new Error('courseId and studentId are required');
    }

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM course_progress WHERE course_id = ? AND student_id = ? LIMIT 1',
        [courseId, studentId]
      );
      if (rows.length > 0) {
        return formatProgressRow(rows[0]);
      }

      // Compute dynamically if not yet stored
      const [totLessons] = await db.pool.execute('SELECT COUNT(*) as cnt FROM lessons WHERE course_id = ?', [courseId]);
      const [compLessons] = await db.pool.execute(
        'SELECT COUNT(*) as cnt FROM lesson_completions WHERE course_id = ? AND student_id = ?',
        [courseId, studentId]
      );
      const total = totLessons[0].cnt || 0;
      const completed = compLessons[0].cnt || 0;
      const pct = total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0.0;

      return {
        courseId,
        completedLessons: completed,
        totalLessons: total,
        completedQuizzes: 0,
        totalQuizzes: 0,
        submittedAssignments: 0,
        totalAssignments: 0,
        percentage: pct,
        lastActivity: new Date().toISOString(),
      };
    }

    const prog = store.progress.find((p) => p.courseId === courseId && p.studentId === studentId);
    if (prog) return prog;

    return {
      courseId,
      completedLessons: 0,
      totalLessons: store.lessons.filter((l) => l.courseId === courseId).length || 0,
      completedQuizzes: 0,
      totalQuizzes: store.quizzes.filter((q) => q.courseId === courseId).length || 0,
      submittedAssignments: 0,
      totalAssignments: store.assignments.filter((a) => a.courseId === courseId).length || 0,
      percentage: 0.0,
      lastActivity: new Date().toISOString(),
    };
  }

  static async getLearningHistory(studentId) {
    if (!studentId) return [];

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM learning_activities WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
        [studentId]
      );
      return rows.map(formatActivityRow);
    }

    return store.activities.filter((a) => a.userId === studentId);
  }

  static async getCertificates(studentId) {
    if (!studentId) return [];

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC',
        [studentId]
      );
      return rows.map(formatCertificateRow);
    }

    return store.certificates.filter((c) => c.studentId === studentId);
  }

  static async getCertificateById(certificateId) {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM certificates WHERE id = ? LIMIT 1', [certificateId]);
      if (rows.length === 0) return null;
      return formatCertificateRow(rows[0]);
    }

    return store.certificates.find((c) => c.id === certificateId) || null;
  }
}

module.exports = ProgressService;
