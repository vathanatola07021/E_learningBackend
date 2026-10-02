const db = require('../config/database');
const { store } = require('./store');

function formatStudentRow(row) {
  return {
    id: row.id,
    studentId: row.student_id || row.studentId || `STU-${row.id}`,
    fullName: row.full_name || row.fullName || '',
    gender: row.gender || 'Not Specified',
    dateOfBirth: row.date_of_birth || row.dateOfBirth || '',
    phoneNumber: row.phone_number || row.phoneNumber || '',
    email: row.email || '',
    profilePhoto: row.profile_photo || row.profilePhoto || '',
    educationLevel: row.education_level || row.educationLevel || 'Undergraduate',
    accountStatus: row.account_status || row.accountStatus || 'active',
  };
}

class ProfileService {
  static async getStudentProfile(studentId) {
    if (!studentId) throw new Error('studentId is required');

    if (db.getIsDbConnected()) {
      const [rows] = await db.pool.execute(
        'SELECT * FROM students WHERE id = ? OR student_id = ? LIMIT 1',
        [studentId, studentId]
      );
      if (rows.length > 0) {
        return formatStudentRow(rows[0]);
      }

      // Check if user exists to create student profile on-the-fly
      const [uRows] = await db.pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [studentId]);
      if (uRows.length > 0) {
        const u = uRows[0];
        const studentCode = `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await db.pool.execute(
          `INSERT INTO students (id, student_id, full_name, gender, date_of_birth, phone_number, email, profile_photo, education_level, account_status)
           VALUES (?, ?, ?, 'Not Specified', '', '', ?, ?, 'Undergraduate', 'active')`,
          [u.id, studentCode, u.full_name, u.email, u.profile_photo || '']
        );
        return {
          id: u.id,
          studentId: studentCode,
          fullName: u.full_name,
          gender: 'Not Specified',
          dateOfBirth: '',
          phoneNumber: '',
          email: u.email,
          profilePhoto: u.profile_photo || '',
          educationLevel: 'Undergraduate',
          accountStatus: 'active',
        };
      }

      throw new Error('Student profile not found');
    }

    const student = store.students.find((s) => s.id === studentId || s.studentId === studentId);
    if (student) return student;

    const user = store.users.find((u) => u.id === studentId);
    if (user) {
      const defaultStudent = {
        id: user.id,
        studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: user.fullName,
        gender: 'Not Specified',
        dateOfBirth: '',
        phoneNumber: '',
        email: user.email,
        profilePhoto: user.profilePhoto || '',
        educationLevel: 'Undergraduate',
        accountStatus: 'active',
      };
      store.students.push(defaultStudent);
      return defaultStudent;
    }

    throw new Error('Student profile not found');
  }

  static async updateProfile({ studentId, fullName, phoneNumber, educationLevel, dateOfBirth, profilePhoto }) {
    if (!studentId) throw new Error('studentId is required');

    if (db.getIsDbConnected()) {
      await db.pool.execute(
        `UPDATE students 
         SET full_name = COALESCE(?, full_name),
             phone_number = COALESCE(?, phone_number),
             education_level = COALESCE(?, education_level),
             date_of_birth = COALESCE(?, date_of_birth),
             profile_photo = COALESCE(?, profile_photo)
         WHERE id = ? OR student_id = ?`,
        [
          fullName || null,
          phoneNumber || null,
          educationLevel || null,
          dateOfBirth || null,
          profilePhoto || null,
          studentId,
          studentId,
        ]
      );

      // Also sync full_name & profile_photo to users table
      if (fullName || profilePhoto) {
        await db.pool.execute(
          'UPDATE users SET full_name = COALESCE(?, full_name), profile_photo = COALESCE(?, profile_photo) WHERE id = ?',
          [fullName || null, profilePhoto || null, studentId]
        );
      }

      return this.getStudentProfile(studentId);
    }

    let student = store.students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) {
      student = await this.getStudentProfile(studentId);
    }

    if (fullName !== undefined) student.fullName = fullName;
    if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
    if (educationLevel !== undefined) student.educationLevel = educationLevel;
    if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;
    if (profilePhoto !== undefined) student.profilePhoto = profilePhoto;

    const user = store.users.find((u) => u.id === studentId);
    if (user) {
      if (fullName) user.fullName = fullName;
      if (profilePhoto) user.profilePhoto = profilePhoto;
    }

    return student;
  }
}

module.exports = ProfileService;
