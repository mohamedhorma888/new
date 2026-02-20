/**
 * Validator Utility
 * Provides input validation methods
 */
class Validator {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidISBN(isbn) {
    // Simple ISBN validation: must be 10 or 13 digits
    const cleanISBN = isbn.replace(/-/g, '');
    return /^\d{10}(\d{3})?$/.test(cleanISBN);
  }

  static isValidPhoneNumber(phone) {
    // Simple phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  }

  static isNotEmpty(value) {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  static isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  static isPositiveNumber(value) {
    return typeof value === 'number' && value > 0;
  }

  static validateMemberData(memberData) {
    if (!Validator.isNotEmpty(memberData.name)) {
      throw new Error('Member name is required');
    }
    if (!Validator.isValidEmail(memberData.email)) {
      throw new Error('Invalid email format');
    }
    if (!Validator.isValidPhoneNumber(memberData.phone)) {
      throw new Error('Invalid phone number');
    }
    return true;
  }

  static validateBookData(bookData) {
    if (!Validator.isNotEmpty(bookData.title)) {
      throw new Error('Book title is required');
    }
    if (!Validator.isNotEmpty(bookData.author)) {
      throw new Error('Book author is required');
    }
    if (!Validator.isValidISBN(bookData.isbn)) {
      throw new Error('Invalid ISBN format');
    }
    if (!Validator.isPositiveNumber(bookData.year)) {
      throw new Error('Publication year must be a positive number');
    }
    return true;
  }
}

export default Validator;
