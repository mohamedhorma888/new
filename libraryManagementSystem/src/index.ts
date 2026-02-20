import { InMemoryBookRepo, InMemoryMemberRepo, InMemoryBorrowRepo } from "./repositories";
import { Book, Member } from "./models";
import { BorrowingService, NotificationService } from "./services";

async function main() {
  const bookRepo = new InMemoryBookRepo();
  const memberRepo = new InMemoryMemberRepo();
  const borrowRepo = new InMemoryBorrowRepo();
  const notification = new NotificationService();
  const borrowing = new BorrowingService(bookRepo, memberRepo, borrowRepo, notification);

  // seed
  const book = new Book("B1", "978-0-123456-47-2", "The Example Book", ["A. Author"], 2, 2);
  bookRepo.save(book);
  const member = new Member("M1", "Jane Doe", "jane@example.com");
  memberRepo.save(member);

  console.log("-- initial state --");
  console.log(`Book available copies: ${book.copiesAvailable}`);
  console.log(`Member borrowed: ${member.borrowedCount}`);

  // issue
  const res = borrowing.issue(book.id, member.id);
  console.log("issue result:", res);

  console.log("-- after issue --");
  console.log(`Book available copies: ${bookRepo.get(book.id)?.copiesAvailable}`);
  console.log(`Member borrowed: ${memberRepo.get(member.id)?.borrowedCount}`);

  // fetch record id from borrowRepo (simple demo)
  const rec = borrowRepo.findActiveByBook(book.id);
  if (rec) {
    console.log("Returning book now (simulate overdue by adjusting dates)...");
    // simulate overdue by setting dueDate in past
    rec.dueDate = new Date(new Date().getTime() - 5 * 24 * 3600 * 1000); // 5 days ago
    borrowRepo.update(rec);

    const ret = borrowing.returnBook(rec.id);
    console.log("return result:", ret);
  }

  console.log("-- final state --");
  console.log(`Book available copies: ${bookRepo.get(book.id)?.copiesAvailable}`);
  console.log(`Member borrowed: ${memberRepo.get(member.id)?.borrowedCount}`);
  console.log(`Member fines: ${memberRepo.get(member.id)?.finesDue}`);
}

main().catch(err => console.error(err));
