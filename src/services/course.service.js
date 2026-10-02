const db = require('../config/database');
const { store } = require('./store');

function formatCourseRow(row, isSaved = false) {
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id || row.categoryId,
    description: row.description || '',
    imageUrl: row.image_url || row.imageUrl || '',
    instructorId: row.instructor_id || row.instructorId,
    duration: row.duration || '',
    level: row.level || 'All Levels',
    lessonCount: Number(row.lesson_count || row.lessonCount || 0),
    rating: parseFloat(row.rating || 4.5),
    enrollmentCount: Number(row.enrollment_count || row.enrollmentCount || 0),
    status: row.status || 'published',
    price: parseFloat(row.price || 0.0),
    isFree: Boolean(row.is_free !== undefined ? row.is_free : row.isFree),
    isSaved: Boolean(isSaved),
    categoryName: row.category_name || row.categoryName || '',
    instructorName: row.instructor_name || row.instructorName || '',
    instructorAvatar: row.instructor_avatar || row.instructorAvatar || null,
  };
}

class CourseService {
  static async getCourses(userId = null) {
    if (db.getIsDbConnected()) {
      const sql = `
        SELECT c.*, 
               cat.name AS category_name, 
               inst.name AS instructor_name, 
               inst.avatar AS instructor_avatar,
               (SELECT COUNT(*) FROM user_favorites uf WHERE uf.course_id = c.id AND uf.user_id = ?) > 0 AS is_saved
        FROM courses c
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN instructors inst ON c.instructor_id = inst.id
        WHERE c.status = 'published'
        ORDER BY c.rating DESC, c.enrollment_count DESC
      `;
      const [rows] = await db.pool.execute(sql, [userId || '']);
      return rows.map((r) => formatCourseRow(r, r.is_saved));
    }

    // Fallback store
    return store.courses.map((c) => {
      const cat = store.categories.find((cat) => cat.id === c.categoryId);
      const inst = store.instructors.find((i) => i.id === c.instructorId);
      const isSaved = store.favorites.some((f) => f.courseId === c.id && (!userId || f.userId === userId));
      return {
        ...c,
        categoryName: cat ? cat.name : (c.categoryName || ''),
        instructorName: inst ? inst.name : (c.instructorName || ''),
        instructorAvatar: inst ? inst.avatar : (c.instructorAvatar || null),
        isSaved,
      };
    });
  }

  static async getCourseById(courseId, userId = null) {
    if (db.getIsDbConnected()) {
      const sql = `
        SELECT c.*, 
               cat.name AS category_name, 
               inst.name AS instructor_name, 
               inst.avatar AS instructor_avatar,
               (SELECT COUNT(*) FROM user_favorites uf WHERE uf.course_id = c.id AND uf.user_id = ?) > 0 AS is_saved
        FROM courses c
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN instructors inst ON c.instructor_id = inst.id
        WHERE c.id = ?
        LIMIT 1
      `;
      const [rows] = await db.pool.execute(sql, [userId || '', courseId]);
      if (rows.length === 0) throw new Error('Course not found');
      return formatCourseRow(rows[0], rows[0].is_saved);
    }

    const c = store.courses.find((course) => course.id === courseId);
    if (!c) throw new Error('Course not found');
    const cat = store.categories.find((cat) => cat.id === c.categoryId);
    const inst = store.instructors.find((i) => i.id === c.instructorId);
    const isSaved = store.favorites.some((f) => f.courseId === c.id && (!userId || f.userId === userId));
    return {
      ...c,
      categoryName: cat ? cat.name : (c.categoryName || ''),
      instructorName: inst ? inst.name : (c.instructorName || ''),
      instructorAvatar: inst ? inst.avatar : (c.instructorAvatar || null),
      isSaved,
    };
  }

  static async searchCourses({ query = '', categoryId, level, sortBy }, userId = null) {
    const all = await this.getCourses(userId);
    let filtered = all;

    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q) ||
          c.instructorName.toLowerCase().includes(q)
      );
    }

    if (categoryId && categoryId.trim().length > 0) {
      filtered = filtered.filter((c) => c.categoryId === categoryId);
    }

    if (level && level.trim().length > 0 && level.toLowerCase() !== 'all') {
      filtered = filtered.filter((c) => c.level.toLowerCase() === level.toLowerCase());
    }

    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case 'popular':
          filtered.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
          break;
        case 'highest_rated':
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return filtered;
  }

  static async getPopularCourses(userId = null) {
    const courses = await this.getCourses(userId);
    return [...courses].sort((a, b) => b.enrollmentCount - a.enrollmentCount).slice(0, 8);
  }

  static async getRecommendedCourses(userId = null) {
    const courses = await this.getCourses(userId);
    return [...courses].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }

  static async getCoursesByCategory(categoryId, userId = null) {
    const courses = await this.getCourses(userId);
    return courses.filter((c) => c.categoryId === categoryId);
  }
}

module.exports = CourseService;
