/**
 * Transaction Entity
 * Represents a checkout or return transaction
 */
class Transaction {
  static TYPE_CHECKOUT = 'CHECKOUT';
  static TYPE_RETURN = 'RETURN';
  static TYPE_FINE_PAYMENT = 'FINE_PAYMENT';

  constructor(id, type, memberId, bookCopyId = null) {
    this.id = id;
    this.type = type;
    this.memberId = memberId;
    this.bookCopyId = bookCopyId;
    this.timestamp = new Date();
    this.details = {};
  }

  addDetails(details) {
    this.details = { ...this.details, ...details };
    return this;
  }

  getTransactionInfo() {
    return {
      id: this.id,
      type: this.type,
      memberId: this.memberId,
      bookCopyId: this.bookCopyId,
      timestamp: this.timestamp,
      details: this.details,
    };
  }
}

export default Transaction;
