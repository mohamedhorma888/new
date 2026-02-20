# 📚 Library Management System

A modular, production-ready Library Management System built with JavaScript ES modules, demonstrating advanced design patterns and best practices for Node.js development.

## 🏗️ Architecture Overview

This system showcases professional software design patterns and principles:

### Design Patterns Implemented

#### 1. **Factory Pattern** (`src/patterns/Factory.js`)
Creates objects with validation and encapsulation of creation logic.

- **BookFactory**: Creates and validates Book instances
- **BookCopyFactory**: Creates physical copies of books
- **MemberFactory**: Creates and validates Member instances

```javascript
// Example: Creating a book with validation
const book = BookFactory.createWithDetails(
  'BOOK-001',
  'The Great Gatsby',
  'F. Scott Fitzgerald',
  '978-0-7432-7356-5',
  1925,
  'Scribner',
  'A classic American novel',
  3
);
```

#### 2. **Strategy Pattern** (`src/patterns/Strategy.js`)
Encapsulates different fine calculation algorithms, allowing them to be selected at runtime.

- **FlatRateFineStrategy**: Fixed rate per day
- **ProgressiveFineStrategy**: Escalating rates based on days overdue
- **FixedCapFineStrategy**: Fixed amount regardless of duration
- **NoFineStrategy**: No fines

```javascript
// Example: Switching fine calculation strategies
const fineService = new FineService(eventPublisher);

// Use progressive strategy
fineService.setStrategy(new ProgressiveFineStrategy(5, 7, 10, 14, 20));

const fine = fineService.calculateFine(dueDate, returnDate);
```

#### 3. **Observer Pattern** (`src/patterns/Observer.js`)
Decouples event notifications from event sources. Observers react to library events.

- **EmailNotificationObserver**: Sends email notifications
- **SMSNotificationObserver**: Sends SMS notifications
- **LoggingObserver**: Logs events to system
- **DatabaseObserver**: Persists events to database

```javascript
// Example: Setting up observers
const eventPublisher = new EventPublisher();
eventPublisher.subscribe(new EmailNotificationObserver());
eventPublisher.subscribe(new SMSNotificationObserver());
eventPublisher.subscribe(new LoggingObserver());

// Events are automatically published
eventPublisher.publishEvent(EventType.BOOK_CHECKED_OUT, {
  memberId: 'MEM-001',
  bookTitle: 'The Great Gatsby',
  dueDate: new Date(),
});
```

#### 4. **Dependency Injection** (`src/container/DIContainer.js`)
Manages object creation and dependency resolution, promoting loose coupling.

- Singleton and transient service lifetimes
- Automatic dependency resolution
- Service registration and resolution

```javascript
// Example: Setting up DI container
const container = new DIContainer();

container.registerSingleton('bookService', (c) => {
  const eventPublisher = c.resolve('eventPublisher');
  return new BookService(eventPublisher);
});

const bookService = container.resolve('bookService');
```

## 📁 Project Structure

```
src/
├── index.js                    # Application entry point and demo
├── entities/                   # Domain models
│   ├── Book.js                # Book entity
│   ├── BookCopy.js            # Individual book copy
│   ├── Member.js              # Library member
│   └── Transaction.js         # Transaction records
├── patterns/                   # Design pattern implementations
│   ├── Factory.js             # Factory pattern
│   ├── Strategy.js            # Strategy pattern
│   └── Observer.js            # Observer pattern
├── services/                   # Business logic services
│   ├── BookService.js         # Book management
│   ├── MemberService.js       # Member management
│   ├── FineService.js         # Fine calculations
│   └── LibraryService.js      # Main orchestrator
├── container/                  # Dependency injection
│   └── DIContainer.js         # DI container
├── utils/                      # Utility modules
│   ├── Logger.js              # Structured logging
│   ├── Validator.js           # Input validation
│   └── DateUtils.js           # Date manipulation
└── exceptions/                 # Custom exceptions
    └── LibraryExceptions.js   # Domain exceptions
```

## 🚀 Key Features

### Core Operations

#### Book Management
- Add books to catalog with multiple copies
- Search by title or author
- Track available and checked-out copies
- Manage physical book copies with barcodes

```javascript
// Add a book to catalog
bookService.addBook(
  'BOOK-001',
  'The Great Gatsby',
  'F. Scott Fitzgerald',
  '978-0-7432-7356-5',
  1925,
  'Scribner',
  'A classic American novel',
  3 // 3 physical copies
);

// Search for books
const results = bookService.searchByTitle('Gatsby');
```

#### Member Management
- Register members with validation
- Track member status and checkouts
- Manage member fines and account locks
- View member history and statistics

```javascript
// Register a new member
memberService.registerMember(
  'MEM-001',
  'John Doe',
  'john@example.com',
  '555-0001'
);

// Check if member can borrow
if (memberService.canBorrow('MEM-001')) {
  // Perform checkout
}
```

#### Checkout/Return System
- Checkout books with automatic due dates
- Calculate fines for overdue returns
- Renew books (extend checkout period)
- Maintain complete transaction history

```javascript
// Checkout a book
const result = libraryService.checkoutBook('MEM-001', 'BOOK-001', 14);
// Returns: { transaction, bookCopy, member, dueDate }

// Return a book (fine calculated automatically)
const returnResult = libraryService.returnBook('MEM-001', copyId);

// Renew a book
const renewal = libraryService.renewBook('MEM-001', copyId, 7);
```

#### Fine Management
- Pluggable fine calculation strategies
- Support for custom strategies
- Fine history tracking
- Member account locking for unpaid fines

```javascript
// Create fine service with progressive strategy
const strategy = new ProgressiveFineStrategy(5, 7, 10, 14, 20);
const fineService = new FineService(eventPublisher, strategy);

// Assess fine on return
const fine = fineService.assessFine(
  memberId,
  copyId,
  dueDate,
  returnDate,
  memberService
);

// Pay fine
memberService.payFine(memberId, 25.00);
```

### Event System
Subscribe to library events for notifications:

```javascript
// Available events:
// - BOOK_CHECKED_OUT
// - BOOK_RETURNED
// - BOOK_OVERDUE
// - FINE_ASSESSED
// - MEMBER_STATUS_CHANGED
// - BOOK_ADDED_TO_CATALOG
// - BOOK_COPY_CREATED

eventPublisher.publishEvent(EventType.BOOK_CHECKED_OUT, {
  memberId: 'MEM-001',
  bookTitle: 'The Great Gatsby',
  dueDate: new Date(),
});
```

### Utilities

**Logger** - Structured logging with timestamps and severity levels
```javascript
Logger.log('Book added', { bookId, totalCopies });
Logger.error('Invalid operation', error);
Logger.warn('Account status', { threshold: 500 });
```

**Validator** - Input validation for domain objects
```javascript
Validator.validateMemberData({ name, email, phone });
Validator.validateBookData({ title, author, isbn, year });
Validator.isValidEmail('user@example.com');
```

**DateUtils** - Date manipulation and formatting
```javascript
const dueDate = DateUtils.addDays(new Date(), 14);
const daysOverdue = DateUtils.getDifferenceInDays(dueDate, new Date());
const formatted = DateUtils.formatDate(date, 'YYYY-MM-DD HH:MM:SS');
```

## 📊 Data Models

### Book
```javascript
{
  id: 'BOOK-001',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  isbn: '978-0-7432-7356-5',
  year: 1925,
  totalCopies: 3,
  description: 'A classic American novel',
  publisher: 'Scribner',
  createdAt: Date
}
```

### Member
```javascript
{
  id: 'MEM-001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-0001',
  status: 'ACTIVE', // ACTIVE, INACTIVE, LOCKED
  membershipDate: Date,
  fineBalance: 0,
  checkedOutBooks: ['COPY-1001', 'COPY-1002']
}
```

### BookCopy
```javascript
{
  copyId: 'COPY-1001',
  bookId: 'BOOK-001',
  barcode: '978-0-7432-7356-5-001',
  status: 'AVAILABLE', // AVAILABLE, CHECKED_OUT, MISSING, DAMAGED
  checkedOutBy: 'MEM-001',
  checkoutDate: Date,
  dueDate: Date
}
```

### Transaction
```javascript
{
  id: 'TXN-1',
  type: 'CHECKOUT', // CHECKOUT, RETURN, FINE_PAYMENT
  memberId: 'MEM-001',
  bookCopyId: 'COPY-1001',
  timestamp: Date,
  details: { /* operation-specific data */ }
}
```

## 🛠️ Running the Application

### Prerequisites
- Node.js 14+ (for ES modules support)

### Installation & Execution

```bash
# Navigate to project directory
cd lowLevelDesign

# Run the demo
npm start

# Run with file watching
npm run dev
```

The demo will:
1. Initialize the DI container with all services
2. Setup event observers for notifications
3. Add sample books to the catalog
4. Register sample members
5. Demonstrate checkout/return operations
6. Show strategy pattern with different fine calculations
7. Generate a library report
8. Display all transactions

## 🔌 Extensibility

### Creating Custom Observers
```javascript
class SlackNotificationObserver extends NotificationObserver {
  notify(event) {
    // Send notification to Slack
  }
}

eventPublisher.subscribe(new SlackNotificationObserver());
```

### Creating Custom Fine Strategies
```javascript
class CustomFineStrategy extends FineCalculationStrategy {
  calculate(dueDate, returnDate) {
    // Your custom calculation logic
    return fineAmount;
  }
  
  getDescription() {
    return 'My Custom Strategy';
  }
}

fineService.setStrategy(new CustomFineStrategy());
```

### Adding New Services
```javascript
// Register in DI container
container.registerSingleton('reportService', (c) => {
  const bookService = c.resolve('bookService');
  const memberService = c.resolve('memberService');
  return new ReportService(bookService, memberService);
});

// Use it
const reportService = container.resolve('reportService');
```

## 🧪 Exception Handling

The system defines domain-specific exceptions:

```javascript
- BookNotAvailableException      // No copies available
- BookNotFoundException          // Book doesn't exist
- MemberNotFoundException        // Member doesn't exist
- MemberAccountLockedExclusion   // Account locked due to fines
- BookCopyNotFoundException      // Copy doesn't exist
- InvalidCheckoutException       // Can't checkout
- InvalidReturnException         // Can't return
- ValidationException           // Validation failed
```

```javascript
try {
  libraryService.checkoutBook(memberId, bookId);
} catch (error) {
  if (error instanceof BookNotAvailableException) {
    Logger.warn('Book not available');
  } else if (error instanceof MemberAccountLockedExclusion) {
    Logger.warn('Member account locked');
  }
}
```

## 📈 Generating Reports

```javascript
const report = libraryService.getLibraryReport();

// Report includes:
// - Book statistics (total, available, checked out)
// - Member statistics (total, active, with fines)
// - Fine statistics (total issued, collected, average)
// - Current fine strategy in use
// - Active checkouts count
```

## 🎯 Design Principles Applied

1. **Single Responsibility**: Each class has one reason to change
2. **Open/Closed**: Open for extension (strategies), closed for modification
3. **Liskov Substitution**: All strategies are interchangeable
4. **Interface Segregation**: Lean, focused interfaces
5. **Dependency Inversion**: Depend on abstractions, not concrete implementations
6. **DRY (Don't Repeat Yourself)**: Shared utilities and common patterns
7. **SOLID Principles**: Throughout the architecture

## 📝 License

MIT

## 👨‍💻 Author

Created as a demonstration of professional JavaScript design patterns and architecture.
