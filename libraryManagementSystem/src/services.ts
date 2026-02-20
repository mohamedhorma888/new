import { InMemoryBookRepo, InMemoryMemberRepo, InMemoryBorrowRepo } from "./repositories";
import { BorrowRecord } from "./models";

export class NotificationService {
  sendCheckoutConfirmation(email: string, title: string, dueDate: Date) {
    console.log(`Notification: sent checkout confirmation to ${email} for '${title}', due ${dueDate.toDateString()}`);
  }

  sendFineNotice(email: string, amount: number) {
    console.log(`Notification: ${email} has fine ${amount.toFixed(2)}`);
  }
}

export class BorrowingService {
  constructor(
    private bookRepo: InMemoryBookRepo,
    private memberRepo: InMemoryMemberRepo,
    private borrowRepo: InMemoryBorrowRepo,
    private notification: NotificationService
  ) {}

  issue(bookId: string, memberId: string) {
    const member = this.memberRepo.get(memberId);
    const book = this.bookRepo.get(bookId);
    if (!member) return { ok: false, reason: "member not found" };
    if (!book) return { ok: false, reason: "book not found" };
    if (!member.canBorrow()) return { ok: false, reason: "member cannot borrow more" };
    if (!book.isAvailable()) return { ok: false, reason: "book unavailable" };

    book.checkout();
    member.incBorrowed();
    this.bookRepo.update(book);
    this.memberRepo.update(member);

    const id = this.borrowRepo.nextId();
    const rec = new BorrowRecord(id, book.id, member.id);
    this.borrowRepo.save(rec);
    this.notification.sendCheckoutConfirmation(member.email, book.title, rec.dueDate);
    return { ok: true, recordId: rec.id };
  }

  returnBook(recordId: string) {
    const rec = this.borrowRepo.get(recordId);
    if (!rec) return { ok: false, reason: "record not found" };
    if (rec.returnDate) return { ok: false, reason: "already returned" };

    rec.returnDate = new Date();
    const fine = rec.calculateFine();
    rec.fineApplied = fine;
    this.borrowRepo.update(rec);

    const book = this.bookRepo.get(rec.bookId);
    if (book) {
      book.returnCopy();
      this.bookRepo.update(book);
    }

    const member = this.memberRepo.get(rec.memberId);
    if (member) {
      member.decBorrowed();
      if (fine > 0) {
        member.finesDue += fine;
        this.notification.sendFineNotice(member.email, fine);
      }
      this.memberRepo.update(member);
    }

    return { ok: true, fine };
  }
}
