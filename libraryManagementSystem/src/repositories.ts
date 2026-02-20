import { Book, Member, BorrowRecord } from "./models";

export class InMemoryBookRepo {
  private books = new Map<string, Book>();

  save(book: Book) {
    this.books.set(book.id, book);
  }

  get(id: string): Book | undefined {
    return this.books.get(id);
  }

  findByTitle(q: string): Book[] {
    const lower = q.toLowerCase();
    return Array.from(this.books.values()).filter(b => b.title.toLowerCase().includes(lower));
  }

  update(book: Book) {
    this.books.set(book.id, book);
  }
}

export class InMemoryMemberRepo {
  private members = new Map<string, Member>();

  save(m: Member) { this.members.set(m.id, m); }
  get(id: string): Member | undefined { return this.members.get(id); }
  update(m: Member) { this.members.set(m.id, m); }
}

export class InMemoryBorrowRepo {
  private records = new Map<string, BorrowRecord>();
  private counter = 1;

  nextId(): string { return "BR" + (this.counter++); }
  save(r: BorrowRecord) { this.records.set(r.id, r); }
  get(id: string): BorrowRecord | undefined { return this.records.get(id); }
  update(r: BorrowRecord) { this.records.set(r.id, r); }
  findActiveByBook(bookId: string): BorrowRecord | undefined {
    return Array.from(this.records.values()).find(r => r.bookId === bookId && r.returnDate === null);
  }
}
