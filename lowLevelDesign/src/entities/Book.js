/**
 * Book Entity
 * Represents a book in the library catalog
 */
class Book {
  constructor(id, title, author, isbn, year, totalCopies = 1) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.year = year;
    this.totalCopies = totalCopies;
    this.description = '';
    this.publisher = '';
    this.createdAt = new Date();
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withPublisher(publisher) {
    this.publisher = publisher;
    return this;
  }

  getBookInfo() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      year: this.year,
      totalCopies: this.totalCopies,
      description: this.description,
      publisher: this.publisher,
    };
  }

  isAvailable(availableCopies) {
    return availableCopies > 0;
  }
}

export default Book;
