class User {
  constructor(userId, name, email) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.borrowedTransactions = [];
  }

  maxBorrowLimit() {
    throw new Error('maxBorrowLimit() must be implemented by subclasses');
  }

  canBorrow() {
    return this.borrowedTransactions.length < this.maxBorrowLimit();
  }

  notify(message) {
    console.log(`Notification for ${this.name} (${this.userId}): ${message}`);
  }
}

class Student extends User {
  maxBorrowLimit() {
    return 3;
  }
}

class Teacher extends User {
  maxBorrowLimit() {
    return 10;
  }
}

module.exports = { User, Student, Teacher };
