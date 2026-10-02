const db = require('../config/database');
const { store } = require('./store');

function formatAssignmentRow(row) {
  return {
    id: row.id,
    courseId: row.course_id || row.courseId,
    lessonId: row.lesson_id || row.lessonId,
    title: row.title,
    description: row.description || '',
    instruction: row.instruction || '',
    dueDate: row.due_date || row.dueDate || '',
    supportingFile: row.supporting_file || row.supportingFile || '',
    maximumScore: Number(row.maximum_score !== undefined ? row.maximum_score : (row.maximumScore || 100)),
  };
}

function formatSubmissionRow(row) {
  return {
    id: row.id,
    assignmentId: row.assignment_id || row.assignmentId,
    studentId: row.student_id || row.studentId,
    submissionDate: row.submission_date || row.submissionDate || new Date().toISOString(),
    submissionFile: row.submission_file || row.submissionFile || null,
    textSubmission: row.text_submission || row.textSubmission || '',
    comment: row.comment || null,
    status: row.status || 'submitted',
    score: row.score !== null && row.score !== undefined ? Number(row.score) : null,
    grade: row.grade || null,
    feedback: row.feedback || null,
    reviewedDate: row.reviewed_date || row.reviewedDate || null,
  };
}

class AssignmentService {
  static async getAssignmentsByCourse(courseId) {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM assignments WHERE course_id = ? ORDER BY created_at ASC', [courseId]);
      return rows.map(formatAssignmentRow);
    }
    return store.assignments.filter((a) => a.courseId === courseId);
  }

  static async getAssignmentById(assignmentId) {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM assignments WHERE id = ? LIMIT 1', [assignmentId]);
      if (rows.length === 0) throw new Error('Assignment not found');
      return formatAssignmentRow(rows[0]);
    }
    const a = store.assignments.find((asg) => asg.id === assignmentId);
    if (!a) throw new Error('Assignment not found');
    return a;
  }

  static async submitAssignment({ assignmentId, studentId, textSubmission, submissionFile, comment }) {
    if (!assignmentId || !studentId) {
      throw new Error('assignmentId and studentId are required');
    }

    const subId = `sub_${Date.now()}`;
    const dateStr = new Date().toISOString();

    if (db.getIsDbConnected()) {
      await db.pool.execute(
        `INSERT INTO assignment_submissions (id, assignment_id, student_id, submission_date, submission_file, text_submission, comment, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted')`,
        [subId, assignmentId, studentId, dateStr, submissionFile || null, textSubmission || '', comment || null]
      );

      // Fetch assignment for learning activity
      const [aRows] = await db.pool.execute(
        `SELECT a.title, c.id AS course_id, c.title AS course_title 
         FROM assignments a 
         INNER JOIN courses c ON a.course_id = c.id 
         WHERE a.id = ?`,
        [assignmentId]
      );
      if (aRows.length > 0) {
        const asg = aRows[0];
        await db.pool.execute(
          `INSERT INTO learning_activities (id, user_id, course_id, course_title, type, title, timestamp, score_or_detail)
           VALUES (?, ?, ?, ?, 'assignmentSubmitted', ?, ?, 'Status: Submitted')`,
          [`act_${Date.now()}`, studentId, asg.course_id, asg.course_title, `Submitted: ${asg.title}`, dateStr]
        );
      }

      return {
        id: subId,
        assignmentId,
        studentId,
        submissionDate: dateStr,
        submissionFile: submissionFile || null,
        textSubmission: textSubmission || '',
        comment: comment || null,
        status: 'submitted',
        score: null,
        grade: null,
        feedback: null,
        reviewedDate: null,
      };
    }

    const submission = {
      id: subId,
      assignmentId,
      studentId,
      submissionDate: dateStr,
      submissionFile: submissionFile || null,
      textSubmission: textSubmission || '',
      comment: comment || null,
      status: 'submitted',
      score: null,
      grade: null,
      feedback: null,
      reviewedDate: null,
    };
    store.submissions.push(submission);
    return submission;
  }

  static async getMySubmission(assignmentId, studentId) {
    if (!assignmentId || !studentId) return null;

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ? ORDER BY created_at DESC LIMIT 1',
        [assignmentId, studentId]
      );
      return rows.length > 0 ? formatSubmissionRow(rows[0]) : null;
    }

    const sub = store.submissions
      .slice()
      .reverse()
      .find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
    return sub || null;
  }
}

module.exports = AssignmentService;
