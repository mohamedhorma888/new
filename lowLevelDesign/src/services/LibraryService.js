/**
 * LibraryService
 * Main orchestrator service for library operations
 * Uses dependency injection to manage services
 */
import Logger from '../utils/Logger.js';
import DateUtils from '../utils/DateUtils.js';
import Transaction from '../entities/Transaction.js';
import {
  BookNotAvailableException,
  InvalidCheckoutException,
  InvalidReturnException,
  MemberAccountLockedExclusion,
} from '../exceptions/LibraryExceptions.js';
import { EventType } from '../patterns/Observer.js';

class LibraryService {
  constructor(bookService, memberService, fineService, eventPublisher) {
    this.bookService = bookService;
    this.memberService = memberService;
    this.fineService = fineService;
    this.eventPublisher = eventPublisher;
    this.transactions = new Map(); // transactionId -> Transaction
    this.checkoutRecords = new Map(); // copyId -> { memberId, checkoutDate, dueDate }
    this.transactionCounter = 0;
    Logger.log('LibraryService initialized');
  }

  /**
   * Checkout a book to a member
   */
  checkoutBook(memberId, bookId, checkoutDays = 14) {
    // Validate member exists and can borrow
    const member = this.memberService.getMember(memberId);
    if (!member.canBorrow()) {
      throw new MemberAccountLockedExclusion(memberId);
    }

    // Get book and find available copy
    const book = this.bookService.getBook(bookId);
    const availableCopies = this.bookService.getAvailableCopies(bookId);

    if (availableCopies.length === 0) {
      throw new BookNotAvailableException(bookId);
    }

    // Select first available copy
    const bookCopy = availableCopies[0];
    const checkoutDate = new Date();
    const dueDate = DateUtils.addDays(checkoutDate, checkoutDays);

    // Update book copy
    bookCopy.checkout(memberId, dueDate);

    // Record checkout in member
    this.memberService.checkoutBook(memberId, bookCopy.copyId);

    // Record checkout
    this.checkoutRecords.set(bookCopy.copyId, {
      memberId,
      checkoutDate,
      dueDate,
    });

    // Create transaction
    const transaction = this.createTransaction(
      Transaction.TYPE_CHECKOUT,
      memberId,
      bookCopy.copyId,
      {
        bookTitle: book.title,
        checkoutDate,
        dueDate,
        checkoutDays,
      }
    );

    // Publish event
    this.eventPublisher.publishEvent(EventType.BOOK_CHECKED_OUT, {
      memberId,
      memberName: member.name,
      memberEmail: member.email,
      bookCopyId: bookCopy.copyId,
      bookTitle: book.title,
      checkoutDate,
      dueDate,
    });

    Logger.log(`Book checked out`, {
      memberId,
      bookId,
      bookTitle: book.title,
      dueDate: DateUtils.formatDate(dueDate),
    });

    return {
      transaction,
      bookCopy,
      member,
      dueDate,
    };
  }

  /**
   * Return a book to the library
   */
  returnBook(memberId, bookCopyId) {
    // Validate member and book copy
    const member = this.memberService.getMember(memberId);
    const bookCopy = this.bookService.getBookCopy(bookCopyId);

    // Verify checkout record exists
    if (!this.checkoutRecords.has(bookCopyId)) {
      throw new InvalidReturnException('Book copy was not checked out');
    }

    const checkoutRecord = this.checkoutRecords.get(bookCopyId);
    if (checkoutRecord.memberId !== memberId) {
      throw new InvalidReturnException('Book was not checked out by this member');
    }

    // Get book info for event
    const book = this.bookService.getBook(bookCopy.bookId);
    const returnDate = new Date();
    const { dueDate } = checkoutRecord;

    // Calculate and assess fine if overdue
    this.fineService.assessFine(memberId, bookCopyId, dueDate, returnDate, this.memberService);

    // Update book copy status
    bookCopy.return();

    // Record return in member
    this.memberService.returnBook(memberId, bookCopyId);

    // Remove checkout record
    this.checkoutRecords.delete(bookCopyId);

    // Create transaction
    const transaction = this.createTransaction(
      Transaction.TYPE_RETURN,
      memberId,
      bookCopyId,
      {
        bookTitle: book.title,
        returnDate,
        dueDate,
        daysLate: Math.max(0, DateUtils.getDifferenceInDays(dueDate, returnDate)),
      }
    );

    // Publish event
    this.eventPublisher.publishEvent(EventType.BOOK_RETURNED, {
      memberId,
      memberName: member.name,
      bookCopyId,
      bookTitle: book.title,
      returnDate,
      dueDate,
    });

    Logger.log(`Book returned`, {
      memberId,
      bookCopyId,
      bookTitle: book.title,
      onTime: returnDate <= dueDate,
    });

    return {
      transaction,
      bookCopy,
      member,
      fine: this.fineService.getFineForCopy(bookCopyId),
    };
  }

  /**
   * Renew a book checkout
   */
  renewBook(memberId, bookCopyId, additionalDays = 7) {
    const member = this.memberService.getMember(memberId);
    const bookCopy = this.bookService.getBookCopy(bookCopyId);

    // Validate checkout record
    if (!this.checkoutRecords.has(bookCopyId)) {
      throw new InvalidCheckoutException('Book copy was not checked out');
    }

    const checkoutRecord = this.checkoutRecords.get(bookCopyId);
    if (checkoutRecord.memberId !== memberId) {
      throw new InvalidCheckoutException('Book was not checked out by this member');
    }

    // Extend due date
    const newDueDate = DateUtils.addDays(checkoutRecord.dueDate, additionalDays);
    bookCopy.dueDate = newDueDate;
    checkoutRecord.dueDate = newDueDate;

    Logger.log(`Book renewed`, { memberId, bookCopyId, newDueDate });
    return {
      memberId,
      bookCopyId,
      newDueDate,
    };
  }

  /**
   * Create a transaction record
   */
  createTransaction(type, memberId, bookCopyId = null, details = {}) {
    const transactionId = `TXN-${++this.transactionCounter}`;
    const transaction = new Transaction(transactionId, type, memberId, bookCopyId);
    transaction.addDetails(details);
    this.transactions.set(transactionId, transaction);
    return transaction;
  }

  /**
   * Get all transactions
   */
  getTransactions() {
    return Array.from(this.transactions.values());
  }

  /**
   * Get transactions for a member
   */
  getMemberTransactions(memberId) {
    return this.getTransactions().filter(t => t.memberId === memberId);
  }

  /**
   * Get library report
   */
  getLibraryReport() {
    return {
      bookStats: this.bookService.getCatalogStats(),
      memberStats: this.memberService.getMemberStats(),
      fineStats: this.fineService.getFineStats(),
      activeCheckouts: this.checkoutRecords.size,
      totalTransactions: this.transactions.size,
      fineStrategy: this.fineService.getStrategyDescription(),
    };
  }
}

export default LibraryService;
