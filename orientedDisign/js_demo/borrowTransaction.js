class BorrowTransaction {
  constructor(transactionId, userId, bookId) {
    this.transactionId = transactionId;
    this.userId = userId;
    this.bookId = bookId;
    this.borrowedAt = new Date();
    this.returned = false;
    this.overdue = false;
  }

  markReturned() {
    this.returned = true;
  }

  markOverdue() {
    this.overdue = true;
  }
}

module.exports = BorrowTransaction;
