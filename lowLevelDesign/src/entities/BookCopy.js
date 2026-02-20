/**
 * BookCopy Entity
 * Represents a physical copy of a book
 */
class BookCopy {
  static STATUS_AVAILABLE = 'AVAILABLE';
  static STATUS_CHECKED_OUT = 'CHECKED_OUT';
  static STATUS_MISSING = 'MISSING';
  static STATUS_DAMAGED = 'DAMAGED';

  constructor(copyId, bookId, barcode) {
    this.copyId = copyId;
    this.bookId = bookId;
    this.barcode = barcode;
    this.status = BookCopy.STATUS_AVAILABLE;
    this.checkedOutBy = null;
    this.checkoutDate = null;
    this.dueDate = null;
    this.createdAt = new Date();
  }

  checkout(memberId, dueDate) {
    this.status = BookCopy.STATUS_CHECKED_OUT;
    this.checkedOutBy = memberId;
    this.checkoutDate = new Date();
    this.dueDate = dueDate;
  }

  return() {
    this.status = BookCopy.STATUS_AVAILABLE;
    this.checkedOutBy = null;
    this.checkoutDate = null;
    this.dueDate = null;
  }

  markAsLost() {
    this.status = BookCopy.STATUS_MISSING;
  }

  markAsDamaged() {
    this.status = BookCopy.STATUS_DAMAGED;
  }

  isAvailable() {
    return this.status === BookCopy.STATUS_AVAILABLE;
  }

  getCopyInfo() {
    return {
      copyId: this.copyId,
      bookId: this.bookId,
      barcode: this.barcode,
      status: this.status,
      checkedOutBy: this.checkedOutBy,
      checkoutDate: this.checkoutDate,
      dueDate: this.dueDate,
    };
  }
}

export default BookCopy;
