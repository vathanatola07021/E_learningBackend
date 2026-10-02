const db = require('../config/database');
const { store } = require('./store');

function formatNotificationRow(row) {
  return {
    id: row.id,
    userId: row.user_id || row.userId,
    title: row.title,
    message: row.message,
    type: row.type || 'general',
    isRead: Boolean(row.is_read !== undefined ? row.is_read : row.isRead),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

class NotificationService {
  static async getNotifications(userId) {
    if (!userId) return [];

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows.map(formatNotificationRow);
    }

    return store.notifications.filter((n) => n.userId === userId);
  }

  static async markAsRead(notificationId) {
    if (db.getIsDbConnected()) {
      await db.pool.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId]);
      return true;
    }

    const n = store.notifications.find((notif) => notif.id === notificationId);
    if (n) n.isRead = true;
    return true;
  }

  static async markAllAsRead(userId) {
    if (db.getIsDbConnected()) {
      await db.pool.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
      return true;
    }

    store.notifications
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.isRead = true;
      });
    return true;
  }
}

module.exports = NotificationService;
