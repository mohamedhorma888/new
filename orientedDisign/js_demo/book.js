class Book {
  constructor(bookId, title, author, totalCopies = 1) {
    this.bookId = bookId;
    this.title = title;
    this.author = author;
    this.totalCopies = totalCopies;
    this.availableCopies = totalCopies;
  }

  borrow() {
    if (this.availableCopies > 0) {
      this.availableCopies -= 1;
      return true;
    }
    return false;
  }

  returnCopy() {
    if (this.availableCopies < this.totalCopies) {
      this.availableCopies += 1;
    }
  }
}

module.exports = Book;
