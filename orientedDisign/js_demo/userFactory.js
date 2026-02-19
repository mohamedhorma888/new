const { Student, Teacher } = require('./user');

class UserFactory {
  static createUser(type, userId, name, email) {
    const t = (type || '').toLowerCase();
    if (t === 'student') return new Student(userId, name, email);
    if (t === 'teacher') return new Teacher(userId, name, email);
    throw new Error(`Unknown user type: ${type}`);
  }
}

module.exports = UserFactory;
