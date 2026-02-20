/**
 * Date Utilities
 * Provides date manipulation and formatting methods
 */
class DateUtils {
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static subtractDays(date, days) {
    return DateUtils.addDays(date, -days);
  }

  static getDifferenceInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
  }

  static isOverdue(dueDate) {
    return new Date() > dueDate;
  }

  static daysUntilDue(dueDate) {
    return DateUtils.getDifferenceInDays(new Date(), dueDate);
  }

  static formatDate(date, format = 'YYYY-MM-DD') {
    if (!(date instanceof Date)) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formats = {
      'YYYY-MM-DD': `${year}-${month}-${day}`,
      'DD/MM/YYYY': `${day}/${month}/${year}`,
      'YYYY-MM-DD HH:MM:SS': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    };

    return formats[format] || formats['YYYY-MM-DD'];
  }

  static getCurrentDate() {
    return new Date();
  }

  static getStartOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static getEndOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
}

export default DateUtils;
