# Library Management System (Simplified)

This demo implements a simple Library Management System using OOP principles and design patterns:

- Factory Pattern: `UserFactory` creates `Student` and `Teacher` users.
- Singleton Pattern: `LibrarySystem` is a singleton managing users, books, and transactions.
- Observer Pattern: `NotificationService` notifies registered users about overdue books.

Quick run:

```bash
python demo.py
```

Files:
- library/user.py — `User`, `Student`, `Teacher`
- library/user_factory.py — `UserFactory`
- library/book.py — `Book`
- library/borrow_transaction.py — `BorrowTransaction`
- library/notification_service.py — `NotificationService`
- library/library_system.py — `LibrarySystem` (Singleton)
- demo.py — small runner demonstrating features

JavaScript demo:

Run the Node.js demo from the `js_demo` folder:

```bash
node js_demo/demo.js
```

Files:
- js_demo/user.js — `User`, `Student`, `Teacher`
- js_demo/userFactory.js — `UserFactory`
- js_demo/book.js — `Book`
- js_demo/borrowTransaction.js — `BorrowTransaction`
- js_demo/notificationService.js — `NotificationService`
- js_demo/librarySystem.js — `LibrarySystem` (Singleton)
- js_demo/demo.js — Node demo
