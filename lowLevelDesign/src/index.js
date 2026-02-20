/**
 * Main Application Entry Point
 * Demonstrates the Library Management System with dependency injection
 */
import { DIContainer, createContainer } from './container/DIContainer.js';
import Logger from './utils/Logger.js';
import DateUtils from './utils/DateUtils.js';

// Import services
import BookService from './services/BookService.js';
import MemberService from './services/MemberService.js';
import FineService from './services/FineService.js';
import LibraryService from './services/LibraryService.js';

// Import patterns
import {
  EventPublisher,
  EmailNotificationObserver,
  SMSNotificationObserver,
  LoggingObserver,
  DatabaseObserver,
} from './patterns/Observer.js';
import {
  FlatRateFineStrategy,
  ProgressiveFineStrategy,
  FixedCapFineStrategy,
} from './patterns/Strategy.js';

/**
 * Setup Application with Dependency Injection
 */
function setupApplication() {
  const container = createContainer();

  // Register EventPublisher as singleton
  container.registerSingleton('eventPublisher', () => new EventPublisher());

  // Register Services with dependencies
  container.registerSingleton('bookService', (c) => {
    const eventPublisher = c.resolve('eventPublisher');
    return new BookService(eventPublisher);
  });

  container.registerSingleton('memberService', (c) => {
    const eventPublisher = c.resolve('eventPublisher');
    return new MemberService(eventPublisher);
  });

  container.registerSingleton('fineService', (c) => {
    const eventPublisher = c.resolve('eventPublisher');
    const strategy = new FlatRateFineStrategy(5); // $5 per day
    return new FineService(eventPublisher, strategy);
  });

  container.registerSingleton('libraryService', (c) => {
    const bookService = c.resolve('bookService');
    const memberService = c.resolve('memberService');
    const fineService = c.resolve('fineService');
    const eventPublisher = c.resolve('eventPublisher');
    return new LibraryService(bookService, memberService, fineService, eventPublisher);
  });

  return container;
}

/**
 * Setup Observers to handle events
 */
function setupObservers(container) {
  const eventPublisher = container.resolve('eventPublisher');

  // Register all observers
  eventPublisher.subscribe(new EmailNotificationObserver());
  eventPublisher.subscribe(new SMSNotificationObserver());
  eventPublisher.subscribe(new LoggingObserver());
  eventPublisher.subscribe(new DatabaseObserver());

  Logger.log(`✅ Registered ${eventPublisher.getObserverCount()} observers`);
}

/**
 * Demo: Add sample books to catalog
 */
function seedBooks(bookService) {
  Logger.log('\n📚 Adding books to catalog...');

  const books = [
    {
      id: 'BOOK-001',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      year: 1925,
      publisher: 'Scribner',
      description: 'A classic American novel',
      totalCopies: 3,
    },
    {
      id: 'BOOK-002',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      year: 1960,
      publisher: 'J. B. Lippincott',
      description: 'An American classic of modern literature',
      totalCopies: 4,
    },
    {
      id: 'BOOK-003',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-26423-9',
      year: 1949,
      publisher: 'Secker & Warburg',
      description: 'A dystopian novel',
      totalCopies: 2,
    },
  ];

  books.forEach(book => {
    bookService.addBook(
      book.id,
      book.title,
      book.author,
      book.isbn,
      book.year,
      book.publisher,
      book.description,
      book.totalCopies
    );
  });
}

/**
 * Demo: Register members
 */
function seedMembers(memberService) {
  Logger.log('\n👥 Registering members...');

  const members = [
    { id: 'MEM-001', name: 'John Doe', email: 'john@example.com', phone: '555-0001' },
    { id: 'MEM-002', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0002' },
    { id: 'MEM-003', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0003' },
  ];

  members.forEach(member => {
    memberService.registerMember(member.id, member.name, member.email, member.phone);
  });
}

/**
 * Demo: Perform checkout and return operations
 */
function demoCheckoutOperations(libraryService, bookService, memberService) {
  Logger.log('\n📖 Performing checkout operations...');

  try {
    // Checkout book
    const checkout1 = libraryService.checkoutBook('MEM-001', 'BOOK-001', 14);
    Logger.log('✅ Checkout successful');

    const checkout2 = libraryService.checkoutBook('MEM-002', 'BOOK-002', 7);
    Logger.log('✅ Checkout successful');

    // Simulate return with fine (overdue)
    Logger.log('\n🔄 Simulating book return (overdue)...');
    const bookCopy = checkout1.bookCopy;
    
    // Artificially set due date to past
    bookCopy.dueDate = DateUtils.subtractDays(new Date(), 5);

    const returnOp = libraryService.returnBook('MEM-001', bookCopy.copyId);
    Logger.log('✅ Return successful', { fine: returnOp.fine });

    // Renew a book
    Logger.log('\n🔁 Renewing book...');
    const renewal = libraryService.renewBook('MEM-002', checkout2.bookCopy.copyId, 7);
    Logger.log('✅ Renewal successful', { newDueDate: DateUtils.formatDate(renewal.newDueDate) });
  } catch (error) {
    Logger.error('Operation failed', error);
  }
}

/**
 * Demo: Test different fine calculation strategies
 */
function demoStrategyPattern(container) {
  Logger.log('\n💰 Demonstrating Strategy Pattern (Fine Calculations)...');

  const fineService = container.resolve('fineService');
  const dueDate = new Date('2024-01-01');
  const returnDate = new Date('2024-01-15');

  const strategies = [
    new FlatRateFineStrategy(5),
    new ProgressiveFineStrategy(5, 7, 10, 14, 20),
    new FixedCapFineStrategy(50),
  ];

  strategies.forEach((strategy) => {
    fineService.setStrategy(strategy);
    const fine = fineService.calculateFine(dueDate, returnDate);
    Logger.log(`Strategy: ${strategy.getDescription()}`, { fine: `$${fine}` });
  });
}

/**
 * Demo: Display library report
 */
function generateLibraryReport(libraryService) {
  Logger.log('\n📊 Library Report:\n');
  const report = libraryService.getLibraryReport();
  console.table({
    'Total Books': report.bookStats.totalBooks,
    'Total Copies': report.bookStats.totalCopies,
    'Available Copies': report.bookStats.availableCopies,
    'Checked Out': report.bookStats.checkedOutCopies,
    'Total Members': report.memberStats.totalMembers,
    'Active Members': report.memberStats.activeMembers,
    'Members with Fines': report.memberStats.membersWithFines,
    'Total Fines': `$${report.memberStats.totalFines.toFixed(2)}`,
    'Fine Strategy': report.fineStrategy,
  });
}

/**
 * Main Application
 */
async function main() {
  console.clear();
  Logger.log('🏛️  Library Management System - Starting Application...\n');

  try {
    // Setup
    Logger.log('Setting up application with Dependency Injection...');
    const container = setupApplication();
    setupObservers(container);

    // Seed data
    const bookService = container.resolve('bookService');
    const memberService = container.resolve('memberService');
    const libraryService = container.resolve('libraryService');

    seedBooks(bookService);
    seedMembers(memberService);

    // Run demos
    Logger.log('\n' + '='.repeat(60));
    demoCheckoutOperations(libraryService, bookService, memberService);

    Logger.log('\n' + '='.repeat(60));
    demoStrategyPattern(container);

    Logger.log('\n' + '='.repeat(60));
    generateLibraryReport(libraryService);

    // Show transactions
    Logger.log('\n📋 Recent Transactions:');
    libraryService.getTransactions().forEach(txn => {
      Logger.log(`[${txn.type}] Member: ${txn.memberId}, Copy: ${txn.bookCopyId}`);
    });

    Logger.log('\n✅ Demo completed successfully!');
  } catch (error) {
    Logger.error('Application error:', error);
    process.exit(1);
  }
}

// Start application
main().catch(Logger.error);
