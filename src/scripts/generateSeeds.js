const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const fakeDbPath = path.resolve(__dirname, '../../../E-learning/lib/data/datasources/remote/fake_api/fake_database.dart');
const rawDart = fs.readFileSync(fakeDbPath, 'utf8');

function extractSection(fileContent, startMarker, endMarker) {
  const startIndex = fileContent.indexOf(startMarker);
  if (startIndex === -1) return null;
  const fromStart = fileContent.substring(startIndex);
  const listStart = fromStart.indexOf('[');
  if (listStart === -1) return null;

  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let endIndex = -1;

  for (let i = listStart; i < fromStart.length; i++) {
    const ch = fromStart[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (!inString && (ch === "'" || ch === '"')) {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (inString && ch === stringChar) {
      inString = false;
      continue;
    }
    if (!inString) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex === -1) return null;
  return fromStart.substring(listStart, endIndex + 1);
}

function dartListToJsObject(dartCode) {
  let s = dartCode;

  // Replace DateTime expressions
  s = s.replace(/DateTime\.now\(\)\.subtract\(const Duration\(hours: (\d+)\)\)\.toIso8601String\(\)/g, (m, h) => {
    return JSON.stringify(new Date(Date.now() - h * 3600 * 1000).toISOString());
  });
  s = s.replace(/DateTime\.now\(\)\.subtract\(const Duration\(days: (\d+)\)\)\.toIso8601String\(\)/g, (m, d) => {
    return JSON.stringify(new Date(Date.now() - d * 86400 * 1000).toISOString());
  });
  s = s.replace(/DateTime\.now\(\)\.add\(const Duration\(days: (\d+)\)\)\.toIso8601String\(\)/g, (m, d) => {
    return JSON.stringify(new Date(Date.now() + d * 86400 * 1000).toISOString());
  });
  s = s.replace(/DateTime\.now\(\)\.toIso8601String\(\)/g, () => JSON.stringify(new Date().toISOString()));

  const chars = s.split('');
  let inString = false;
  let stringChar = '';
  let escape = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (!inString && (ch === "'" || ch === '"')) {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (inString && ch === stringChar) {
      inString = false;
      continue;
    }
    if (!inString) {
      if (ch === '(') {
        let j = i - 1;
        while (j >= 0 && /\s/.test(chars[j])) j--;
        let identEnd = j + 1;
        while (j >= 0 && /[a-zA-Z0-9_]/.test(chars[j])) j--;
        const ident = chars.slice(j + 1, identEnd).join('');
        if (ident.length > 0 && /^[A-Z]/.test(ident)) {
          let constCheck = j;
          while (constCheck >= 0 && /\s/.test(chars[constCheck])) constCheck--;
          if (constCheck >= 4) {
            const maybeConst = chars.slice(constCheck - 4, constCheck + 1).join('');
            if (maybeConst === 'const') {
              for (let k = constCheck - 4; k <= constCheck; k++) chars[k] = ' ';
            }
          }
          for (let k = j + 1; k < identEnd; k++) chars[k] = ' ';

          chars[i] = '{';

          let subDepth = 1;
          let subInString = false;
          let subStringChar = '';
          let subEscape = false;
          for (let m = i + 1; m < chars.length; m++) {
            const mch = chars[m];
            if (subEscape) {
              subEscape = false;
              continue;
            }
            if (mch === '\\') {
              subEscape = true;
              continue;
            }
            if (!subInString && (mch === "'" || mch === '"')) {
              subInString = true;
              subStringChar = mch;
              continue;
            }
            if (subInString && mch === subStringChar) {
              subInString = false;
              continue;
            }
            if (!subInString) {
              if (mch === '(' || mch === '{') subDepth++;
              else if (mch === ')' || mch === '}') {
                subDepth--;
                if (subDepth === 0) {
                  chars[m] = '}';
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  const jsCode = chars.join('');
  return eval(`(${jsCode})`);
}

async function generate() {
  const users = dartListToJsObject(extractSection(rawDart, 'static final List<UserModel> users =', ';'));
  const students = dartListToJsObject(extractSection(rawDart, 'static final List<StudentModel> students =', ';'));
  const instructors = dartListToJsObject(extractSection(rawDart, 'static final List<Map<String, dynamic>> instructors =', ';'));
  const categories = dartListToJsObject(extractSection(rawDart, 'static final List<CategoryModel> categories =', ';'));
  const courses = dartListToJsObject(extractSection(rawDart, 'static final List<CourseModel> courses =', ';'));
  const lessons = dartListToJsObject(extractSection(rawDart, 'static final List<LessonModel> lessons =', ';'));
  const quizzes = dartListToJsObject(extractSection(rawDart, 'static final List<QuizModel> quizzes =', ';'));
  const assignments = dartListToJsObject(extractSection(rawDart, 'static final List<AssignmentModel> assignments =', ';'));
  const submissions = dartListToJsObject(extractSection(rawDart, 'static final List<SubmissionModel> submissions =', ';'));
  const enrollments = dartListToJsObject(extractSection(rawDart, 'static final List<EnrollmentModel> enrollments =', ';'));
  const progress = dartListToJsObject(extractSection(rawDart, 'static final List<CourseProgressModel> progressList =', ';'));
  const quizAttempts = dartListToJsObject(extractSection(rawDart, 'static final List<QuizAttemptModel> quizAttempts =', ';'));
  const notifications = dartListToJsObject(extractSection(rawDart, 'static final List<NotificationModel> notifications =', ';'));
  const certificates = dartListToJsObject(extractSection(rawDart, 'static final List<CertificateModel> certificates =', ';'));
  const activities = dartListToJsObject(extractSection(rawDart, 'static final List<LearningActivityModel> learningActivities =', ';'));

  // Default hash for 'password123'
  const passwordHash = await bcrypt.hash('password123', 10);

  // Extract materials from lessons
  const materials = [];
  lessons.forEach((les) => {
    if (les.materials && Array.isArray(les.materials)) {
      les.materials.forEach((mat) => {
        materials.push({
          id: mat.id,
          lessonId: les.id,
          title: mat.title,
          type: mat.type || 'pdf',
          fileUrl: mat.fileUrl || '',
          uploadDate: mat.uploadDate || '',
          description: mat.description || '',
          fileSize: mat.fileSize || '2.0 MB',
        });
      });
    }
  });

  // Extract questions from quizzes
  const questions = [];
  quizzes.forEach((q) => {
    if (q.questions && Array.isArray(q.questions)) {
      q.questions.forEach((qu, idx) => {
        questions.push({
          id: qu.id,
          quizId: q.id,
          questionText: qu.questionText,
          type: qu.type || 'multiple_choice',
          options: qu.options || [],
          correctAnswerIndex: qu.correctAnswerIndex || 0,
          explanation: qu.explanation || '',
          questionOrder: idx + 1,
        });
      });
    }
  });

  // Extract user favorites (crs_01, crs_04, crs_10 for usr_student_01)
  const favorites = [];
  courses.forEach((c) => {
    if (c.isSaved) {
      favorites.push({
        id: `fav_${c.id}_student`,
        userId: 'usr_student_01',
        courseId: c.id,
      });
    }
  });

  // Attach password_hash to users
  users.forEach((u) => {
    u.passwordHash = passwordHash;
  });

  // Build seedData object
  const seedData = {
    users,
    students,
    instructors,
    categories,
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      categoryId: c.categoryId,
      description: c.description,
      imageUrl: c.imageUrl,
      instructorId: c.instructorId,
      duration: c.duration,
      level: c.level,
      lessonCount: c.lessonCount,
      rating: c.rating,
      enrollmentCount: c.enrollmentCount,
      status: c.status,
      price: c.price,
      isFree: c.isFree ? 1 : 0,
    })),
    lessons: lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      description: l.description,
      order: l.order,
      videoUrl: l.videoUrl,
      duration: l.duration,
      status: l.status,
      isLocked: l.isLocked ? 1 : 0,
    })),
    materials,
    quizzes: quizzes.map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      courseId: q.courseId,
      title: q.title,
      description: q.description,
      totalQuestions: q.totalQuestions,
      timeLimitMinutes: q.timeLimitMinutes,
      passingScore: q.passingScore,
      maximumAttempts: q.maximumAttempts,
    })),
    questions,
    quizAttempts: quizAttempts.map((qa) => ({
      id: qa.id,
      quizId: qa.quizId,
      studentId: qa.studentId,
      score: qa.score,
      percentage: qa.percentage,
      correctAnswers: qa.correctAnswers,
      incorrectAnswers: qa.incorrectAnswers,
      passed: qa.passed ? 1 : 0,
      attemptDate: qa.attemptDate,
      selectedAnswers: qa.selectedAnswers || {},
    })),
    assignments,
    submissions,
    enrollments: enrollments.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      courseId: e.courseId,
      enrollmentDate: e.enrollmentDate,
      status: e.status,
      progress: e.progress,
    })),
    progress: progress.map((p) => ({
      id: `prog_${p.courseId}_student`,
      courseId: p.courseId,
      studentId: 'usr_student_01',
      completedLessons: p.completedLessons,
      totalLessons: p.totalLessons,
      completedQuizzes: p.completedQuizzes,
      totalQuizzes: p.totalQuizzes,
      submittedAssignments: p.submittedAssignments,
      totalAssignments: p.totalAssignments,
      percentage: p.percentage,
      lastActivity: p.lastActivity,
    })),
    notifications: notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead ? 1 : 0,
      createdAt: n.createdAt,
    })),
    certificates,
    activities,
    favorites,
  };

  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dataDir, 'seedData.json'), JSON.stringify(seedData, null, 2), 'utf8');
  console.log('Saved src/data/seedData.json');

  // Generate seed.sql
  function escapeSql(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
    return `'${String(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }

  let sql = `-- ==============================================================
-- EduLearn E-Learning Platform - MySQL Seed Data
-- ==============================================================

USE \`edulearn_db\`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users
TRUNCATE TABLE \`users\`;
INSERT INTO \`users\` (\`id\`, \`email\`, \`password_hash\`, \`full_name\`, \`role\`, \`profile_photo\`) VALUES
${seedData.users.map((u) => `(${escapeSql(u.id)}, ${escapeSql(u.email)}, ${escapeSql(u.passwordHash)}, ${escapeSql(u.fullName)}, ${escapeSql(u.role)}, ${escapeSql(u.profilePhoto)})`).join(',\n')};

-- 2. Students
TRUNCATE TABLE \`students\`;
INSERT INTO \`students\` (\`id\`, \`student_id\`, \`full_name\`, \`gender\`, \`date_of_birth\`, \`phone_number\`, \`email\`, \`profile_photo\`, \`education_level\`, \`account_status\`) VALUES
${seedData.students.map((s) => `(${escapeSql(s.id)}, ${escapeSql(s.studentId)}, ${escapeSql(s.fullName)}, ${escapeSql(s.gender)}, ${escapeSql(s.dateOfBirth)}, ${escapeSql(s.phoneNumber)}, ${escapeSql(s.email)}, ${escapeSql(s.profilePhoto)}, ${escapeSql(s.educationLevel)}, ${escapeSql(s.accountStatus)})`).join(',\n')};

-- 3. Instructors
TRUNCATE TABLE \`instructors\`;
INSERT INTO \`instructors\` (\`id\`, \`name\`, \`title\`, \`bio\`, \`avatar\`, \`user_id\`) VALUES
${seedData.instructors.map((i) => `(${escapeSql(i.id)}, ${escapeSql(i.name)}, ${escapeSql(i.title)}, ${escapeSql(i.bio)}, ${escapeSql(i.avatar)}, ${escapeSql(i.user_id || 'usr_instructor_01')})`).join(',\n')};

-- 4. Categories
TRUNCATE TABLE \`categories\`;
INSERT INTO \`categories\` (\`id\`, \`name\`, \`description\`, \`icon_url\`, \`status\`, \`course_count\`) VALUES
${seedData.categories.map((c) => `(${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.description)}, ${escapeSql(c.iconUrl)}, ${escapeSql(c.status)}, ${c.courseCount || 0})`).join(',\n')};

-- 5. Courses
TRUNCATE TABLE \`courses\`;
INSERT INTO \`courses\` (\`id\`, \`title\`, \`category_id\`, \`description\`, \`image_url\`, \`instructor_id\`, \`duration\`, \`level\`, \`lesson_count\`, \`rating\`, \`enrollment_count\`, \`status\`, \`price\`, \`is_free\`) VALUES
${seedData.courses.map((c) => `(${escapeSql(c.id)}, ${escapeSql(c.title)}, ${escapeSql(c.categoryId)}, ${escapeSql(c.description)}, ${escapeSql(c.imageUrl)}, ${escapeSql(c.instructorId)}, ${escapeSql(c.duration)}, ${escapeSql(c.level)}, ${c.lessonCount}, ${c.rating}, ${c.enrollmentCount}, ${escapeSql(c.status)}, ${c.price}, ${c.isFree})`).join(',\n')};

-- 6. Lessons
TRUNCATE TABLE \`lessons\`;
INSERT INTO \`lessons\` (\`id\`, \`course_id\`, \`title\`, \`description\`, \`lesson_order\`, \`video_url\`, \`duration\`, \`status\`, \`is_locked\`) VALUES
${seedData.lessons.map((l) => `(${escapeSql(l.id)}, ${escapeSql(l.courseId)}, ${escapeSql(l.title)}, ${escapeSql(l.description)}, ${l.order}, ${escapeSql(l.videoUrl)}, ${escapeSql(l.duration)}, ${escapeSql(l.status)}, ${l.isLocked})`).join(',\n')};

-- 7. Materials
TRUNCATE TABLE \`materials\`;
INSERT INTO \`materials\` (\`id\`, \`lesson_id\`, \`title\`, \`type\`, \`file_url\`, \`upload_date\`, \`description\`, \`file_size\`) VALUES
${seedData.materials.map((m) => `(${escapeSql(m.id)}, ${escapeSql(m.lessonId)}, ${escapeSql(m.title)}, ${escapeSql(m.type)}, ${escapeSql(m.fileUrl)}, ${escapeSql(m.uploadDate)}, ${escapeSql(m.description)}, ${escapeSql(m.fileSize)})`).join(',\n')};

-- 8. Quizzes
TRUNCATE TABLE \`quizzes\`;
INSERT INTO \`quizzes\` (\`id\`, \`lesson_id\`, \`course_id\`, \`title\`, \`description\`, \`total_questions\`, \`time_limit_minutes\`, \`passing_score\`, \`maximum_attempts\`) VALUES
${seedData.quizzes.map((q) => `(${escapeSql(q.id)}, ${escapeSql(q.lessonId)}, ${escapeSql(q.courseId)}, ${escapeSql(q.title)}, ${escapeSql(q.description)}, ${q.totalQuestions}, ${q.timeLimitMinutes}, ${q.passingScore}, ${q.maximumAttempts})`).join(',\n')};

-- 9. Questions
TRUNCATE TABLE \`questions\`;
INSERT INTO \`questions\` (\`id\`, \`quiz_id\`, \`question_text\`, \`type\`, \`options_json\`, \`correct_answer_index\`, \`explanation\`, \`question_order\`) VALUES
${seedData.questions.map((qu) => `(${escapeSql(qu.id)}, ${escapeSql(qu.quizId)}, ${escapeSql(qu.questionText)}, ${escapeSql(qu.type)}, ${escapeSql(qu.options)}, ${qu.correctAnswerIndex}, ${escapeSql(qu.explanation)}, ${qu.questionOrder})`).join(',\n')};

-- 10. Quiz Attempts
TRUNCATE TABLE \`quiz_attempts\`;
INSERT INTO \`quiz_attempts\` (\`id\`, \`quiz_id\`, \`student_id\`, \`score\`, \`percentage\`, \`correct_answers\`, \`incorrect_answers\`, \`passed\`, \`attempt_date\`, \`selected_answers_json\`) VALUES
${seedData.quizAttempts.map((qa) => `(${escapeSql(qa.id)}, ${escapeSql(qa.quizId)}, ${escapeSql(qa.studentId)}, ${qa.score}, ${qa.percentage}, ${qa.correctAnswers}, ${qa.incorrectAnswers}, ${qa.passed}, ${escapeSql(qa.attemptDate)}, ${escapeSql(qa.selectedAnswers)})`).join(',\n')};

-- 11. Assignments
TRUNCATE TABLE \`assignments\`;
INSERT INTO \`assignments\` (\`id\`, \`course_id\`, \`lesson_id\`, \`title\`, \`description\`, \`instruction\`, \`due_date\`, \`supporting_file\`, \`maximum_score\`) VALUES
${seedData.assignments.map((a) => `(${escapeSql(a.id)}, ${escapeSql(a.courseId)}, ${escapeSql(a.lessonId)}, ${escapeSql(a.title)}, ${escapeSql(a.description)}, ${escapeSql(a.instruction)}, ${escapeSql(a.dueDate)}, ${escapeSql(a.supportingFile)}, ${a.maximumScore})`).join(',\n')};

-- 12. Assignment Submissions
TRUNCATE TABLE \`assignment_submissions\`;
INSERT INTO \`assignment_submissions\` (\`id\`, \`assignment_id\`, \`student_id\`, \`submission_date\`, \`submission_file\`, \`text_submission\`, \`comment\`, \`status\`, \`score\`, \`grade\`, \`feedback\`, \`reviewed_date\`) VALUES
${seedData.submissions.map((sub) => `(${escapeSql(sub.id)}, ${escapeSql(sub.assignmentId)}, ${escapeSql(sub.studentId)}, ${escapeSql(sub.submissionDate)}, ${escapeSql(sub.submissionFile)}, ${escapeSql(sub.textSubmission)}, ${escapeSql(sub.comment)}, ${escapeSql(sub.status)}, ${sub.score}, ${escapeSql(sub.grade)}, ${escapeSql(sub.feedback)}, ${escapeSql(sub.reviewedDate)})`).join(',\n')};

-- 13. Enrollments
TRUNCATE TABLE \`enrollments\`;
INSERT INTO \`enrollments\` (\`id\`, \`student_id\`, \`course_id\`, \`enrollment_date\`, \`status\`, \`progress\`) VALUES
${seedData.enrollments.map((e) => `(${escapeSql(e.id)}, ${escapeSql(e.studentId)}, ${escapeSql(e.courseId)}, ${escapeSql(e.enrollmentDate)}, ${escapeSql(e.status)}, ${e.progress})`).join(',\n')};

-- 14. Course Progress
TRUNCATE TABLE \`course_progress\`;
INSERT INTO \`course_progress\` (\`id\`, \`course_id\`, \`student_id\`, \`completed_lessons\`, \`total_lessons\`, \`completed_quizzes\`, \`total_quizzes\`, \`submitted_assignments\`, \`total_assignments\`, \`percentage\`, \`last_activity\`) VALUES
${seedData.progress.map((p) => `(${escapeSql(p.id)}, ${escapeSql(p.courseId)}, ${escapeSql(p.studentId)}, ${p.completedLessons}, ${p.totalLessons}, ${p.completedQuizzes}, ${p.totalQuizzes}, ${p.submittedAssignments}, ${p.totalAssignments}, ${p.percentage}, ${escapeSql(p.lastActivity)})`).join(',\n')};

-- 15. Certificates
TRUNCATE TABLE \`certificates\`;
INSERT INTO \`certificates\` (\`id\`, \`student_id\`, \`student_name\`, \`course_id\`, \`course_title\`, \`issue_date\`, \`certificate_code\`, \`credential_url\`, \`instructor_name\`) VALUES
${seedData.certificates.map((cert) => `(${escapeSql(cert.id)}, ${escapeSql(cert.studentId)}, ${escapeSql(cert.studentName)}, ${escapeSql(cert.courseId)}, ${escapeSql(cert.courseTitle)}, ${escapeSql(cert.issueDate)}, ${escapeSql(cert.certificateCode)}, ${escapeSql(cert.credentialUrl)}, ${escapeSql(cert.instructorName)})`).join(',\n')};

-- 16. Learning Activities
TRUNCATE TABLE \`learning_activities\`;
INSERT INTO \`learning_activities\` (\`id\`, \`user_id\`, \`course_id\`, \`course_title\`, \`type\`, \`title\`, \`timestamp\`, \`score_or_detail\`) VALUES
${seedData.activities.map((act) => `(${escapeSql(act.id)}, ${escapeSql(act.userId)}, ${escapeSql(act.courseId)}, ${escapeSql(act.courseTitle)}, ${escapeSql(act.type)}, ${escapeSql(act.title)}, ${escapeSql(act.timestamp)}, ${escapeSql(act.scoreOrDetail)})`).join(',\n')};

-- 17. Notifications
TRUNCATE TABLE \`notifications\`;
INSERT INTO \`notifications\` (\`id\`, \`user_id\`, \`title\`, \`message\`, \`type\`, \`is_read\`, \`created_at\`) VALUES
${seedData.notifications.map((n) => `(${escapeSql(n.id)}, ${escapeSql(n.userId)}, ${escapeSql(n.title)}, ${escapeSql(n.message)}, ${escapeSql(n.type)}, ${n.isRead}, ${escapeSql(n.createdAt)})`).join(',\n')};

-- 18. User Favorites
TRUNCATE TABLE \`user_favorites\`;
INSERT INTO \`user_favorites\` (\`id\`, \`user_id\`, \`course_id\`) VALUES
${seedData.favorites.map((f) => `(${escapeSql(f.id)}, ${escapeSql(f.userId)}, ${escapeSql(f.courseId)})`).join(',\n')};

SET FOREIGN_KEY_CHECKS = 1;
`;

  const seedSqlPath = path.resolve(__dirname, '../../seed.sql');
  fs.writeFileSync(seedSqlPath, sql, 'utf8');
  console.log('Saved seed.sql');
}

generate().catch(console.error);
