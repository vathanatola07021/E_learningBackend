const db = require('../config/database');
const { store } = require('./store');

function formatQuestionRow(row) {
  let options = row.options_json || row.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (e) {
      options = [];
    }
  }
  return {
    id: row.id,
    quizId: row.quiz_id || row.quizId,
    questionText: row.question_text || row.questionText,
    type: row.type || 'multiple_choice',
    options: Array.isArray(options) ? options : [],
    correctAnswerIndex: Number(row.correct_answer_index !== undefined ? row.correct_answer_index : (row.correctAnswerIndex || 0)),
    explanation: row.explanation || '',
  };
}

function formatQuizRow(row, questions = []) {
  return {
    id: row.id,
    lessonId: row.lesson_id || row.lessonId,
    courseId: row.course_id || row.courseId,
    title: row.title,
    description: row.description || '',
    totalQuestions: questions.length || Number(row.total_questions || row.totalQuestions || 0),
    timeLimitMinutes: Number(row.time_limit_minutes || row.timeLimitMinutes || 15),
    passingScore: parseFloat(row.passing_score || row.passingScore || 70.0),
    maximumAttempts: Number(row.maximum_attempts || row.maximumAttempts || 3),
    questions,
  };
}

function formatAttemptRow(row) {
  let selected = row.selected_answers_json || row.selectedAnswers;
  if (typeof selected === 'string') {
    try {
      selected = JSON.parse(selected);
    } catch (e) {
      selected = {};
    }
  }
  return {
    id: row.id,
    quizId: row.quiz_id || row.quizId,
    studentId: row.student_id || row.studentId,
    score: Number(row.score || 0),
    percentage: parseFloat(row.percentage || 0.0),
    correctAnswers: Number(row.correct_answers !== undefined ? row.correct_answers : (row.correctAnswers || 0)),
    incorrectAnswers: Number(row.incorrect_answers !== undefined ? row.incorrect_answers : (row.incorrectAnswers || 0)),
    passed: Boolean(row.passed),
    attemptDate: row.attempt_date || row.attemptDate || new Date().toISOString(),
    selectedAnswers: selected || {},
  };
}

class QuizService {
  static async getQuizById(quizId) {
    if (db.getIsDbConnected()) {
      const [quizRows] = await db.pool.execute('SELECT * FROM quizzes WHERE id = ?', [quizId]);
      if (quizRows.length === 0) throw new Error('Quiz not found');

      const [qRows] = await db.pool.execute('SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_order ASC', [quizId]);
      const questions = qRows.map(formatQuestionRow);

      return formatQuizRow(quizRows[0], questions);
    }

    const quiz = store.quizzes.find((q) => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');
    const questions = (store.questions || []).filter((q) => q.quizId === quizId);
    return {
      ...quiz,
      questions,
    };
  }

  static async getQuizByLesson(lessonId) {
    if (db.getIsDbConnected()) {
      const [quizRows] = await db.pool.execute('SELECT * FROM quizzes WHERE lesson_id = ? LIMIT 1', [lessonId]);
      if (quizRows.length === 0) throw new Error('Quiz not found for this lesson');

      const quizId = quizRows[0].id;
      const [qRows] = await db.pool.execute('SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_order ASC', [quizId]);
      const questions = qRows.map(formatQuestionRow);

      return formatQuizRow(quizRows[0], questions);
    }

    const quiz = store.quizzes.find((q) => q.lessonId === lessonId);
    if (!quiz) throw new Error('Quiz not found for this lesson');
    const questions = (store.questions || []).filter((q) => q.quizId === quiz.id);
    return {
      ...quiz,
      questions,
    };
  }

  static async submitQuizAttempt({ quizId, studentId, selectedAnswers = {} }) {
    const quiz = await this.getQuizById(quizId);
    const questions = quiz.questions || [];

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : selectedAnswers[String(idx)];
      if (chosen !== undefined && Number(chosen) === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const total = questions.length || 1;
    const incorrectCount = total - correctCount;
    const percentage = Math.round((correctCount / total) * 100 * 10) / 10;
    const score = correctCount * 10;
    const passed = percentage >= quiz.passingScore;
    const attemptId = `att_${Date.now()}`;
    const dateStr = new Date().toISOString();

    if (db.getIsDbConnected()) {
      await db.pool.execute(
        `INSERT INTO quiz_attempts (id, quiz_id, student_id, score, percentage, correct_answers, incorrect_answers, passed, attempt_date, selected_answers_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          attemptId,
          quizId,
          studentId,
          score,
          percentage,
          correctCount,
          incorrectCount,
          passed ? 1 : 0,
          dateStr,
          JSON.stringify(selectedAnswers),
        ]
      );

      // Add learning activity
      await db.pool.execute(
        `INSERT INTO learning_activities (id, user_id, course_id, course_title, type, title, timestamp, score_or_detail)
         VALUES (?, ?, ?, ?, 'quizAttempted', ?, ?, ?)`,
        [
          `act_${Date.now()}`,
          studentId,
          quiz.courseId,
          quiz.title,
          `Completed Quiz: ${quiz.title}`,
          dateStr,
          `Score: ${percentage}% (${passed ? 'Passed' : 'Failed'})`,
        ]
      );

      return {
        id: attemptId,
        quizId,
        studentId,
        score,
        percentage,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        passed,
        attemptDate: dateStr,
        selectedAnswers,
      };
    }

    const attempt = {
      id: attemptId,
      quizId,
      studentId,
      score,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      passed,
      attemptDate: dateStr,
      selectedAnswers,
    };
    store.quizAttempts.push(attempt);
    return attempt;
  }

  static async getQuizAttempts(quizId) {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM quiz_attempts WHERE quiz_id = ? ORDER BY created_at DESC', [quizId]);
      return rows.map(formatAttemptRow);
    }
    return store.quizAttempts.filter((qa) => qa.quizId === quizId);
  }
}

module.exports = QuizService;
