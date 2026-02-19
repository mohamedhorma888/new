const NotificationService = require('./notificationService');
const BorrowTransaction = require('./borrowTransaction');

class LibrarySystem {
  constructor() {
    if (LibrarySystem._instance) return LibrarySystem._instance;
    this.users = new Map();
    this.books = new Map();
    this.transactions = new Map();
    this._nextTransaction = 1;
    this.notificationService = new NotificationService();
    LibrarySystem._instance = this;
  }

  addUser(user) {
    this.users.set(user.userId, user);
  }

  addBook(book) {
    this.books.set(book.bookId, book);
  }

  borrowBook(userId, bookId) {
    const user = this.users.get(userId);
    const book = this.books.get(bookId);
    if (!user || !book) return null;
    if (!user.canBorrow()) return null;
    if (!book.borrow()) return null;

    const txId = `T${this._nextTransaction++}`;
    const tx = new BorrowTransaction(txId, userId, bookId);
    this.transactions.set(txId, tx);
    user.borrowedTransactions.push(txId);
    return txId;
  }

  returnBook(transactionId) {
    const tx = this.transactions.get(transactionId);
    if (!tx || tx.returned) return false;
    tx.markReturned();
    const book = this.books.get(tx.bookId);
    if (book) book.returnCopy();
    const user = this.users.get(tx.userId);
    if (user) {
      const idx = user.borrowedTransactions.indexOf(transactionId);
      if (idx !== -1) user.borrowedTransactions.splice(idx, 1);
    }
    return true;
  }

  viewBorrowedBooks(userId) {
    const user = this.users.get(userId);
    if (!user) return [];
    return user.borrowedTransactions.map((tId) => this.transactions.get(tId)).filter(Boolean);
  }

  markTransactionOverdue(transactionId) {
    const tx = this.transactions.get(transactionId);
    if (tx) tx.markOverdue();
  }

  notifyOverdueUsers() {
    this.notificationService.notifyOverdues(this.transactions.values(), this);
  }
}

module.exports = new LibrarySystem();
