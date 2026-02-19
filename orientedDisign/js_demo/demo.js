const UserFactory = require('./userFactory');
const Book = require('./book');
const lib = require('./librarySystem');

function runDemo() {
  // Create users
  const alice = UserFactory.createUser('student', 'U1', 'Alice', 'alice@example.com');
  const bob = UserFactory.createUser('teacher', 'U2', 'Bob', 'bob@example.com');

  lib.addUser(alice);
  lib.addUser(bob);

  // Register for notifications
  lib.notificationService.register(alice);
  lib.notificationService.register(bob);

  // Add books
  const b1 = new Book('B1', 'Design Patterns', 'Gamma et al.', 2);
  const b2 = new Book('B2', 'Clean Code', 'Robert C. Martin', 1);
  lib.addBook(b1);
  lib.addBook(b2);

  // Borrow books
  const tx1 = lib.borrowBook('U1', 'B1');
  console.log('Alice borrowed transaction:', tx1);
  const tx2 = lib.borrowBook('U2', 'B2');
  console.log('Bob borrowed transaction:', tx2);

  // View borrowed books for Alice
  const aliceBooks = lib.viewBorrowedBooks('U1');
  console.log('Alice borrowed transactions:');
  aliceBooks.forEach((t) => console.log(t));

  // Simulate overdue
  if (tx1) lib.markTransactionOverdue(tx1);
  lib.notifyOverdueUsers();

  // Return a book
  if (tx1) {
    const ok = lib.returnBook(tx1);
    console.log(`Alice returned ${tx1}: ${ok}`);
  }
}

if (require.main === module) runDemo();
