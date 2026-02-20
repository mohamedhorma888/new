/**
 * Custom Exception Classes
 * Provides domain-specific exceptions for the library system
 */

class LibraryException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}

class BookNotAvailableException extends LibraryException {
  constructor(bookId) {
    super(`Book with ID ${bookId} is not available for checkout`);
    this.bookId = bookId;
  }
}

class BookNotFoundException extends LibraryException {
  constructor(bookId) {
    super(`Book with ID ${bookId} not found`);
    this.bookId = bookId;
  }
}

class MemberNotFoundException extends LibraryException {
  constructor(memberId) {
    super(`Member with ID ${memberId} not found`);
    this.memberId = memberId;
  }
}

class MemberAccountLockedExclusion extends LibraryException {
  constructor(memberId) {
    super(`Member with ID ${memberId} has an account locked due to fines`);
    this.memberId = memberId;
  }
}

class BookCopyNotFoundException extends LibraryException {
  constructor(copyId) {
    super(`Book copy with ID ${copyId} not found`);
    this.copyId = copyId;
  }
}

class InvalidCheckoutException extends LibraryException {
  constructor(reason) {
    super(`Invalid checkout operation: ${reason}`);
  }
}

class InvalidReturnException extends LibraryException {
  constructor(reason) {
    super(`Invalid return operation: ${reason}`);
  }
}

class ValidationException extends LibraryException {
  constructor(message) {
    super(`Validation failed: ${message}`);
  }
}

export {
  LibraryException,
  BookNotAvailableException,
  BookNotFoundException,
  MemberNotFoundException,
  MemberAccountLockedExclusion,
  BookCopyNotFoundException,
  InvalidCheckoutException,
  InvalidReturnException,
  ValidationException,
};
