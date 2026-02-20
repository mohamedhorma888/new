/**
 * BookService
 * Manages library books and book copies
 */
import Logger from '../utils/Logger.js';
import DateUtils from '../utils/DateUtils.js';
import { BookFactory, BookCopyFactory } from '../patterns/Factory.js';
import { BookNotAvailableException, BookNotFoundException, BookCopyNotFoundException } from '../exceptions/LibraryExceptions.js';
import { EventType } from '../patterns/Observer.js';

class BookService {
  constructor(eventPublisher) {
    this.books = new Map(); // bookId -> Book
    this.bookCopies = new Map(); // copyId -> BookCopy
    this.booksByIsbn = new Map(); // isbn -> bookId
    this.eventPublisher = eventPublisher;
    Logger.log('BookService initialized');
  }

  /**
   * Add a new book to the catalog
   */
  addBook(bookId, title, author, isbn, year, publisher, description, totalCopies = 1) {
    if (this.books.has(bookId)) {
      throw new Error(`Book with ID ${bookId} already exists`);
    }

    const book = BookFactory.createWithDetails(
      bookId,
      title,
      author,
      isbn,
      year,
      publisher,
      description,
      totalCopies
    );

    this.books.set(bookId, book);
    this.booksByIsbn.set(isbn, bookId);

    // Create book copies
    const copies = BookCopyFactory.createCopies(bookId, totalCopies, isbn);
    copies.forEach(copy => {
      this.bookCopies.set(copy.copyId, copy);
    });

    // Publish event
    this.eventPublisher.publishEvent(EventType.BOOK_ADDED_TO_CATALOG, {
      bookId,
      title,
      author,
      copies: totalCopies,
    });

    Logger.log(`Book added: ${title} by ${author}`, { bookId, totalCopies });
    return book;
  }

  /**
   * Get a book by ID
   */
  getBook(bookId) {
    if (!this.books.has(bookId)) {
      throw new BookNotFoundException(bookId);
    }
    return this.books.get(bookId);
  }

  /**
   * Get a book by ISBN
   */
  getBookByISBN(isbn) {
    const bookId = this.booksByIsbn.get(isbn);
    if (!bookId) {
      throw new BookNotFoundException(isbn);
    }
    return this.getBook(bookId);
  }

  /**
   * Get all books
   */
  getAllBooks() {
    return Array.from(this.books.values());
  }

  /**
   * Get a book copy
   */
  getBookCopy(copyId) {
    if (!this.bookCopies.has(copyId)) {
      throw new BookCopyNotFoundException(copyId);
    }
    return this.bookCopies.get(copyId);
  }

  /**
   * Get available copies for a book
   */
  getAvailableCopies(bookId) {
    this.getBook(bookId); // Validate book exists
    const copies = Array.from(this.bookCopies.values()).filter(
      copy => copy.bookId === bookId && copy.isAvailable()
    );
    return copies;
  }

  /**
   * Get total available count for a book
   */
  getAvailableCopiesCount(bookId) {
    return this.getAvailableCopies(bookId).length;
  }

  /**
   * Get all checked out copies for a book
   */
  getCheckedOutCopies(bookId) {
    this.getBook(bookId); // Validate book exists
    const copies = Array.from(this.bookCopies.values()).filter(
      copy => copy.bookId === bookId && !copy.isAvailable()
    );
    return copies;
  }

  /**
   * Search books by title
   */
  searchByTitle(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllBooks().filter(book =>
      book.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search books by author
   */
  searchByAuthor(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllBooks().filter(book =>
      book.author.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get catalog statistics
   */
  getCatalogStats() {
    return {
      totalBooks: this.books.size,
      totalCopies: this.bookCopies.size,
      availableCopies: Array.from(this.bookCopies.values()).filter(c => c.isAvailable()).length,
      checkedOutCopies: Array.from(this.bookCopies.values()).filter(c => !c.isAvailable()).length,
    };
  }
}

export default BookService;
