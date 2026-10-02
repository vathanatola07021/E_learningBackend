const app = require('../app');
const http = require('http');

let server;
let port;
let baseUrl;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  return { status: response.status, body: data };
}

async function runTests() {
  console.log('------------------------------------------------------');
  console.log(' Starting EduLearn API Comprehensive Test Suite       ');
  console.log('------------------------------------------------------');

  const server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running on ${baseUrl}\n`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      failed++;
    }
  }

  let authToken = '';

  // 1. Root & Health
  await test('GET / returns 200 and welcome message', async () => {
    const res = await request('/');
    if (res.status !== 200 || !res.body.success) throw new Error(`Unexpected status ${res.status}`);
  });

  await test('GET /api/v1/health returns 200 and UP status', async () => {
    const res = await request('/api/v1/health');
    if (res.status !== 200 || res.body.data.status !== 'UP') throw new Error(`Unexpected status ${res.status}`);
  });

  // 2. Auth Endpoints
  await test('POST /api/v1/auth/login logs in student user and returns JWT token', async () => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'student@edulearn.com', password: 'password123' }),
    });
    if (res.status !== 200 || !res.body.data.token) throw new Error(`Login failed: ${res.body.message}`);
    authToken = res.body.data.token;
  });

  await test('POST /api/v1/auth/register creates a new student user and returns JWT token', async () => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test Student',
        email: `test_${Date.now()}@edulearn.com`,
        password: 'password123',
        phoneNumber: '+855 99 888 777',
      }),
    });
    if (res.status !== 201 || !res.body.data.token) throw new Error(`Register failed: ${res.body.message}`);
  });

  await test('GET /api/v1/auth/me returns authenticated student user', async () => {
    const res = await request('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200 || !res.body.data.email) throw new Error(`Get me failed: ${res.body.message}`);
  });

  // 3. Courses Endpoints
  await test('GET /api/v1/courses returns list of published courses', async () => {
    const res = await request('/api/v1/courses');
    if (res.status !== 200 || !Array.isArray(res.body.data) || res.body.data.length === 0) {
      throw new Error(`Failed to get courses: ${res.body.message}`);
    }
  });

  await test('GET /api/v1/courses/crs_01 returns course details', async () => {
    const res = await request('/api/v1/courses/crs_01');
    if (res.status !== 200 || res.body.data.id !== 'crs_01') throw new Error(`Course detail failed: ${res.body.message}`);
  });

  await test('GET /api/v1/courses/search?q=Flutter searches courses properly', async () => {
    const res = await request('/api/v1/courses/search?q=Flutter');
    if (res.status !== 200 || !Array.isArray(res.body.data) || res.body.data.length === 0) {
      throw new Error(`Course search failed: ${res.body.message}`);
    }
  });

  await test('GET /api/v1/courses/popular returns top courses', async () => {
    const res = await request('/api/v1/courses/popular');
    if (res.status !== 200 || res.body.data.length === 0) throw new Error(`Popular courses failed: ${res.body.message}`);
  });

  await test('GET /api/v1/courses/recommended returns recommended courses', async () => {
    const res = await request('/api/v1/courses/recommended');
    if (res.status !== 200 || res.body.data.length === 0) throw new Error(`Recommended courses failed: ${res.body.message}`);
  });

  // 4. Categories Endpoints
  await test('GET /api/v1/categories returns list of categories', async () => {
    const res = await request('/api/v1/categories');
    if (res.status !== 200 || res.body.data.length === 0) throw new Error(`Categories failed: ${res.body.message}`);
  });

  await test('GET /api/v1/categories/cat_mobile/courses returns courses in category', async () => {
    const res = await request('/api/v1/categories/cat_mobile/courses');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Courses by category failed`);
  });

  // 5. Lessons & Quizzes
  await test('GET /api/v1/courses/crs_01/lessons returns lessons for course', async () => {
    const res = await request('/api/v1/courses/crs_01/lessons');
    if (res.status !== 200 || res.body.data.length === 0) throw new Error(`Lessons by course failed`);
  });

  await test('GET /api/v1/lessons/les_01_01 returns lesson with materials', async () => {
    const res = await request('/api/v1/lessons/les_01_01');
    if (res.status !== 200 || !res.body.data.materials) throw new Error(`Lesson detail failed`);
  });

  await test('POST /api/v1/lessons/les_01_01/complete marks lesson completed', async () => {
    const res = await request('/api/v1/lessons/les_01_01/complete', {
      method: 'POST',
      body: JSON.stringify({ studentId: 'usr_student_01', courseId: 'crs_01' }),
    });
    if (res.status !== 200 || !res.body.success) throw new Error(`Lesson complete failed`);
  });

  await test('GET /api/v1/lessons/les_01_02/quiz returns quiz for lesson', async () => {
    const res = await request('/api/v1/lessons/les_01_02/quiz');
    if (res.status !== 200 || !res.body.data.questions) throw new Error(`Lesson quiz failed`);
  });

  await test('GET /api/v1/quizzes/quiz_01 returns quiz detail', async () => {
    const res = await request('/api/v1/quizzes/quiz_01');
    if (res.status !== 200 || res.body.data.id !== 'quiz_01') throw new Error(`Quiz detail failed`);
  });

  await test('POST /api/v1/quizzes/quiz_01/submit submits quiz and grades answers', async () => {
    const res = await request('/api/v1/quizzes/quiz_01/submit', {
      method: 'POST',
      body: JSON.stringify({
        studentId: 'usr_student_01',
        selectedAnswers: { '0': 1, '1': 1, '2': 2 },
      }),
    });
    if (res.status !== 201 || res.body.data.score === undefined) throw new Error(`Quiz submission failed`);
  });

  // 6. Assignments
  await test('GET /api/v1/courses/crs_01/assignments returns course assignments', async () => {
    const res = await request('/api/v1/courses/crs_01/assignments');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Course assignments failed`);
  });

  await test('GET /api/v1/assignments/asg_01 returns assignment detail', async () => {
    const res = await request('/api/v1/assignments/asg_01');
    if (res.status !== 200 || res.body.data.id !== 'asg_01') throw new Error(`Assignment detail failed`);
  });

  await test('POST /api/v1/assignments/asg_01/submit submits student assignment', async () => {
    const res = await request('/api/v1/assignments/asg_01/submit', {
      method: 'POST',
      body: JSON.stringify({
        studentId: 'usr_student_01',
        textSubmission: 'Here is my Flutter Clean Architecture repo link: https://github.com/test/repo',
        submissionFile: 'https://example.com/file.zip',
        comment: 'Ready for review',
      }),
    });
    if (res.status !== 201 || !res.body.data.id) throw new Error(`Submit assignment failed`);
  });

  // 7. Enrollments
  await test('POST /api/v1/enrollments/enroll enrolls student in course', async () => {
    const res = await request('/api/v1/enrollments/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'crs_02', studentId: 'usr_student_01' }),
    });
    if (res.status !== 201 || !res.body.data.id) throw new Error(`Enroll in course failed`);
  });

  await test('GET /api/v1/enrollments/my?studentId=usr_student_01 returns enrolled courses', async () => {
    const res = await request('/api/v1/enrollments/my?studentId=usr_student_01');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`My enrollments failed`);
  });

  await test('GET /api/v1/enrollments/check verifies student enrollment', async () => {
    const res = await request('/api/v1/enrollments/check?courseId=crs_01&studentId=usr_student_01');
    if (res.status !== 200 || typeof res.body.data !== 'boolean') throw new Error(`Check enrollment failed`);
  });

  // 8. Progress, Certificates, Profile, Notifications, Favorites
  await test('GET /api/v1/progress/courses/crs_01 returns student progress', async () => {
    const res = await request('/api/v1/progress/courses/crs_01?studentId=usr_student_01');
    if (res.status !== 200 || res.body.data.completedLessons === undefined) throw new Error(`Progress failed`);
  });

  await test('GET /api/v1/progress/history returns learning history activities', async () => {
    const res = await request('/api/v1/progress/history?studentId=usr_student_01');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`History failed`);
  });

  await test('GET /api/v1/certificates returns user certificates', async () => {
    const res = await request('/api/v1/certificates?studentId=usr_student_01');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Certificates failed`);
  });

  await test('GET /api/v1/profile returns student profile', async () => {
    const res = await request('/api/v1/profile?studentId=usr_student_01');
    if (res.status !== 200 || !res.body.data.fullName) throw new Error(`Profile failed`);
  });

  await test('PUT /api/v1/profile/update updates student profile', async () => {
    const res = await request('/api/v1/profile/update', {
      method: 'PUT',
      body: JSON.stringify({
        studentId: 'usr_student_01',
        fullName: 'Dara Somnang Updated',
        phoneNumber: '+855 12 999 888',
        educationLevel: 'Senior Software Engineer',
      }),
    });
    if (res.status !== 200 || res.body.data.fullName !== 'Dara Somnang Updated') throw new Error(`Update profile failed`);
  });

  await test('GET /api/v1/notifications returns user notifications', async () => {
    const res = await request('/api/v1/notifications?userId=usr_student_01');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Notifications failed`);
  });

  await test('GET /api/v1/favorites returns saved courses', async () => {
    const res = await request('/api/v1/favorites?userId=usr_student_01');
    if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error(`Favorites failed`);
  });

  await test('POST /api/v1/favorites/crs_05 bookmarks a course', async () => {
    const res = await request('/api/v1/favorites/crs_05', {
      method: 'POST',
      body: JSON.stringify({ userId: 'usr_student_01' }),
    });
    if (res.status !== 200 || !res.body.success) throw new Error(`Add favorite failed`);
  });

  await test('DELETE /api/v1/favorites/crs_05 removes a bookmarked course', async () => {
    const res = await request('/api/v1/favorites/crs_05', {
      method: 'DELETE',
      body: JSON.stringify({ userId: 'usr_student_01' }),
    });
    if (res.status !== 200 || !res.body.success) throw new Error(`Remove favorite failed`);
  });

  console.log('\n------------------------------------------------------');
  console.log(` Test Results: ${passed} passed, ${failed} failed `);
  console.log('------------------------------------------------------\n');

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
