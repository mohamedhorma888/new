/**
 * Factory Pattern Implementation
 * Factories for creating Books and Members with validation
 */
import Book from '../entities/Book.js';
import Member from '../entities/Member.js';
import BookCopy from '../entities/BookCopy.js';
import Validator from '../utils/Validator.js';
import { ValidationException } from '../exceptions/LibraryExceptions.js';

/**
 * BookFactory - Creates Book instances with validation
 */
class BookFactory {
  static create(id, title, author, isbn, year, totalCopies = 1) {
    const bookData = { title, author, isbn, year };
    
    try {
      Validator.validateBookData(bookData);
    } catch (error) {
      throw new ValidationException(error.message);
    }

    return new Book(id, title, author, isbn, year, totalCopies);
  }

  /**
   * Creates a book with fluent interface and additional properties
   */
  static createWithDetails(id, title, author, isbn, year, publisher, description, totalCopies = 1) {
    const book = BookFactory.create(id, title, author, isbn, year, totalCopies);
    return book.withPublisher(publisher).withDescription(description);
  }

  /**
   * Creates multiple books from an array of data
   */
  static createBatch(booksData) {
    return booksData.map((data, index) =>
      BookFactory.createWithDetails(
        data.id,
        data.title,
        data.author,
        data.isbn,
        data.year,
        data.publisher || '',
        data.description || '',
        data.totalCopies || 1
      )
    );
  }
}

/**
 * BookCopyFactory - Creates BookCopy instances
 */
class BookCopyFactory {
  static #copyIdCounter = 1000;

  static create(bookId, barcode) {
    const copyId = `COPY-${++BookCopyFactory.#copyIdCounter}`;
    return new BookCopy(copyId, bookId, barcode);
  }

  /**
   * Creates multiple copies for a given book
   */
  static createCopies(bookId, count, barcodePrefix) {
    const copies = [];
    for (let i = 1; i <= count; i++) {
      const barcode = `${barcodePrefix}-${String(i).padStart(3, '0')}`;
      copies.push(BookCopyFactory.create(bookId, barcode));
    }
    return copies;
  }
}

/**
 * MemberFactory - Creates Member instances with validation
 */
class MemberFactory {
  static create(id, name, email, phone) {
    const memberData = { name, email, phone };
    
    try {
      Validator.validateMemberData(memberData);
    } catch (error) {
      throw new ValidationException(error.message);
    }

    return new Member(id, name, email, phone);
  }

  /**
   * Creates multiple members from an array of data
   */
  static createBatch(membersData) {
    return membersData.map(data =>
      MemberFactory.create(data.id, data.name, data.email, data.phone)
    );
  }
}

export { BookFactory, BookCopyFactory, MemberFactory };
