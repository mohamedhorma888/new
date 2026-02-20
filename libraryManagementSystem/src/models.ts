export enum BookStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  ISSUED = "ISSUED",
  OVERDUE = "OVERDUE",
  LOST = "LOST",
  MAINTENANCE = "MAINTENANCE",
}

export class Book {
  constructor(
    public id: string,
    public isbn: string,
    public title: string,
    public authors: string[],
    public copiesTotal: number = 1,
    public copiesAvailable: number = 1,
    public status: BookStatus = BookStatus.AVAILABLE
  ) {}

  isAvailable(): boolean {
    return this.copiesAvailable > 0 && this.status === BookStatus.AVAILABLE;
  }

  checkout(): void {
    if (!this.isAvailable()) throw new Error("Book not available");
    this.copiesAvailable -= 1;
    if (this.copiesAvailable === 0) this.status = BookStatus.ISSUED;
  }

  returnCopy(): void {
    this.copiesAvailable += 1;
    if (this.copiesAvailable > 0) this.status = BookStatus.AVAILABLE;
  }
}

export class Member {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public maxAllowed: number = 5,
    public borrowedCount: number = 0,
    public finesDue: number = 0
  ) {}

  canBorrow(): boolean {
    return this.borrowedCount < this.maxAllowed;
  }

  incBorrowed(): void {
    this.borrowedCount += 1;
  }

  decBorrowed(): void {
    if (this.borrowedCount > 0) this.borrowedCount -= 1;
  }

  payFine(amount: number): void {
    this.finesDue = Math.max(0, this.finesDue - amount);
  }
}

export class BorrowRecord {
  public returnDate: Date | null = null;
  public fineApplied: number = 0;

  constructor(
    public id: string,
    public bookId: string,
    public memberId: string,
    public issueDate: Date = new Date(),
    public dueDate: Date = new Date(new Date().getTime() + 14 * 24 * 3600 * 1000) // 14 days
  ) {}

  isOverdue(): boolean {
    return this.returnDate === null && new Date() > this.dueDate;
  }

  calculateFine(perDay = 0.5): number {
    const end = this.returnDate ?? new Date();
    const days = Math.max(0, Math.ceil((end.getTime() - this.dueDate.getTime()) / (24 * 3600 * 1000)));
    return days * perDay;
  }
}
