/**
 * Member Entity
 * Represents a library member
 */
class Member {
  static STATUS_ACTIVE = 'ACTIVE';
  static STATUS_INACTIVE = 'INACTIVE';
  static STATUS_LOCKED = 'LOCKED';

  constructor(id, name, email, phone) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.status = Member.STATUS_ACTIVE;
    this.membershipDate = new Date();
    this.fineBalance = 0;
    this.checkedOutBooks = [];
    this.borrowHistory = [];
  }

  canBorrow() {
    return this.status === Member.STATUS_ACTIVE && this.fineBalance < 500; // Max fine allowed
  }

  addFine(amount) {
    this.fineBalance += amount;
    if (this.fineBalance >= 500) {
      this.status = Member.STATUS_LOCKED;
    }
  }

  payFine(amount) {
    this.fineBalance = Math.max(0, this.fineBalance - amount);
    if (this.fineBalance < 500 && this.status === Member.STATUS_LOCKED) {
      this.status = Member.STATUS_ACTIVE;
    }
  }

  checkout(bookCopyId) {
    if (!this.checkedOutBooks.includes(bookCopyId)) {
      this.checkedOutBooks.push(bookCopyId);
    }
  }

  return(bookCopyId) {
    this.checkedOutBooks = this.checkedOutBooks.filter(id => id !== bookCopyId);
    this.borrowHistory.push({
      bookCopyId,
      returnDate: new Date(),
    });
  }

  getCurrentCheckouts() {
    return this.checkedOutBooks.length;
  }

  getMemberInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      status: this.status,
      membershipDate: this.membershipDate,
      fineBalance: this.fineBalance,
      checkedOutBooks: this.checkedOutBooks,
    };
  }
}

export default Member;
