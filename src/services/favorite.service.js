const db = require('../config/database');
const { store } = require('./store');

class FavoriteService {
  static async getFavorites(userId) {
    const effectiveUserId = userId || 'usr_student_01';

    if (db.getIsDbConnected()) {
      const sql = `
        SELECT c.*, 
               cat.name AS category_name, 
               inst.name AS instructor_name, 
               inst.avatar AS instructor_avatar,
               1 AS is_saved
        FROM user_favorites uf
        INNER JOIN courses c ON uf.course_id = c.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN instructors inst ON c.instructor_id = inst.id
        WHERE uf.user_id = ?
        ORDER BY uf.created_at DESC
      `;
      const [rows] = await db.pool.execute(sql, [effectiveUserId]);
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
        isSaved: true,
        categoryName: r.category_name || '',
        instructorName: r.instructor_name || '',
        instructorAvatar: r.instructor_avatar || null,
      }));
    }

    const savedIds = store.favorites
      .filter((f) => f.userId === effectiveUserId)
      .map((f) => f.courseId);

    return store.courses
      .filter((c) => savedIds.includes(c.id))
      .map((c) => {
        const cat = store.categories.find((cat) => cat.id === c.categoryId);
        const inst = store.instructors.find((i) => i.id === c.instructorId);
        return {
          ...c,
          categoryName: cat ? cat.name : (c.categoryName || ''),
          instructorName: inst ? inst.name : (c.instructorName || ''),
          instructorAvatar: inst ? inst.avatar : (c.instructorAvatar || null),
          isSaved: true,
        };
      });
  }

  static async saveFavorite(userId, courseId) {
    const effectiveUserId = userId || 'usr_student_01';
    const favId = `fav_${courseId}_${effectiveUserId}`;

    if (db.getIsDbConnected()) {
      await db.pool.execute(
        'INSERT IGNORE INTO user_favorites (id, user_id, course_id) VALUES (?, ?, ?)',
        [favId, effectiveUserId, courseId]
      );
      return true;
    }

    const exists = store.favorites.some((f) => f.userId === effectiveUserId && f.courseId === courseId);
    if (!exists) {
      store.favorites.push({ id: favId, userId: effectiveUserId, courseId });
    }
    return true;
  }

  static async removeFavorite(userId, courseId) {
    const effectiveUserId = userId || 'usr_student_01';

    if (db.getIsDbConnected()) {
      await db.pool.execute(
        'DELETE FROM user_favorites WHERE user_id = ? AND course_id = ?',
        [effectiveUserId, courseId]
      );
      return true;
    }

    const index = store.favorites.findIndex((f) => f.userId === effectiveUserId && f.courseId === courseId);
    if (index !== -1) {
      store.favorites.splice(index, 1);
    }
    return true;
  }
}

module.exports = FavoriteService;
