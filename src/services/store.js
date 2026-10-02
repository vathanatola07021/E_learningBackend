const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, '../data/seedData.json');
let initialData = {
  users: [],
  students: [],
  instructors: [],
  categories: [],
  courses: [],
  lessons: [],
  materials: [],
  quizzes: [],
  questions: [],
  quizAttempts: [],
  assignments: [],
  submissions: [],
  enrollments: [],
  progress: [],
  notifications: [],
  certificates: [],
  activities: [],
  favorites: [],
};

if (fs.existsSync(seedPath)) {
  try {
    initialData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  } catch (err) {
    console.error('Failed to load seedData.json', err);
  }
}

// In-memory active state (deep cloned)
const memoryStore = JSON.parse(JSON.stringify(initialData));

module.exports = {
  store: memoryStore,
  getSeedData: () => initialData,
};
