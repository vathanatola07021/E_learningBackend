const db = require('../config/database');
const { store } = require('./store');

function formatCategoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    iconUrl: row.icon_url || row.iconUrl || '',
    status: row.status || 'active',
    courseCount: Number(row.course_count !== undefined ? row.course_count : (row.courseCount || 0)),
  };
}

class CategoryService {
  static async getCategories() {
    if (db.getIsDbConnected()) {
      const sql = `
        SELECT cat.*, COUNT(c.id) AS course_count
        FROM categories cat
        LEFT JOIN courses c ON cat.id = c.category_id AND c.status = 'published'
        WHERE cat.status = 'active'
        GROUP BY cat.id
        ORDER BY cat.name ASC
      `;
      const [rows] = await db.pool.execute(sql);
      return rows.map(formatCategoryRow);
    }

    return store.categories.map((cat) => {
      const count = store.courses.filter((c) => c.categoryId === cat.id).length;
      return {
        ...cat,
        courseCount: count || cat.courseCount || 0,
      };
    });
  }

  static async getCategoryById(id) {
    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
      if (rows.length === 0) throw new Error('Category not found');
      return formatCategoryRow(rows[0]);
    }

    const cat = store.categories.find((c) => c.id === id);
    if (!cat) throw new Error('Category not found');
    return cat;
  }
}

module.exports = CategoryService;
