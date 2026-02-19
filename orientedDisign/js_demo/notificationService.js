class NotificationService {
  constructor() {
    this.subscribers = new Map();
  }

  register(user) {
    this.subscribers.set(user.userId, user);
  }

  unregister(user) {
    this.subscribers.delete(user.userId);
  }

  notifyUser(userId, message) {
    const user = this.subscribers.get(userId);
    if (user) user.notify(message);
  }

  notifyOverdues(transactions, librarySystem) {
    for (const t of transactions) {
      if (t.overdue && !t.returned) {
        const user = this.subscribers.get(t.userId);
        const book = librarySystem.books.get(t.bookId);
        if (user && book) {
          user.notify(`Book '${book.title}' is overdue. Transaction: ${t.transactionId}`);
        }
      }
    }
  }
}

module.exports = NotificationService;
