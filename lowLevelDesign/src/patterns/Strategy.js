/**
 * Strategy Pattern Implementation
 * Different strategies for calculating fines
 */
import DateUtils from '../utils/DateUtils.js';

/**
 * FineCalculationStrategy - Interface-like abstraction for fine calculations
 * Defines the contract that all strategies must follow
 */
class FineCalculationStrategy {
  /**
   * Calculate fine based on dueDate and returnDate
   * @param {Date} dueDate
   * @param {Date} returnDate
   * @returns {number} Fine amount
   */
  calculate(dueDate, returnDate) {
    throw new Error('calculate() must be implemented by subclass');
  }
}

/**
 * FlatRateFineStrategy
 * Charges a flat rate per day of overdue
 */
class FlatRateFineStrategy extends FineCalculationStrategy {
  constructor(finePerDay = 5) {
    super();
    this.finePerDay = finePerDay;
  }

  calculate(dueDate, returnDate) {
    if (returnDate <= dueDate) {
      return 0;
    }
    const daysOverdue = DateUtils.getDifferenceInDays(dueDate, returnDate);
    return Math.max(0, daysOverdue * this.finePerDay);
  }

  getDescription() {
    return `Flat Rate: $${this.finePerDay} per day`;
  }
}

/**
 * ProgressiveFineStrategy
 * Charges increasing rates for longer overdue periods
 */
class ProgressiveFineStrategy extends FineCalculationStrategy {
  constructor(baseFine = 5, maxDaysLevel1 = 7, level2Fine = 10, maxDaysLevel2 = 14, level3Fine = 20) {
    super();
    this.baseFine = baseFine;
    this.maxDaysLevel1 = maxDaysLevel1;
    this.level2Fine = level2Fine;
    this.maxDaysLevel2 = maxDaysLevel2;
    this.level3Fine = level3Fine;
  }

  calculate(dueDate, returnDate) {
    if (returnDate <= dueDate) {
      return 0;
    }

    const daysOverdue = DateUtils.getDifferenceInDays(dueDate, returnDate);
    let fine = 0;

    if (daysOverdue <= this.maxDaysLevel1) {
      fine = daysOverdue * this.baseFine;
    } else if (daysOverdue <= this.maxDaysLevel2) {
      fine = this.maxDaysLevel1 * this.baseFine + (daysOverdue - this.maxDaysLevel1) * this.level2Fine;
    } else {
      fine = this.maxDaysLevel1 * this.baseFine +
             (this.maxDaysLevel2 - this.maxDaysLevel1) * this.level2Fine +
             (daysOverdue - this.maxDaysLevel2) * this.level3Fine;
    }

    return Math.min(fine, 500); // Cap at $500
  }

  getDescription() {
    return `Progressive: ${this.baseFine}/day (1-${this.maxDaysLevel1}), ${this.level2Fine}/day (${this.maxDaysLevel1 + 1}-${this.maxDaysLevel2}), ${this.level3Fine}/day (${this.maxDaysLevel2 + 1}+)`;
  }
}

/**
 * FixedCapFineStrategy
 * Charges a fixed amount regardless of how late, up to a cap
 */
class FixedCapFineStrategy extends FineCalculationStrategy {
  constructor(fixedAmount = 50) {
    super();
    this.fixedAmount = fixedAmount;
  }

  calculate(dueDate, returnDate) {
    if (returnDate <= dueDate) {
      return 0;
    }
    return this.fixedAmount;
  }

  getDescription() {
    return `Fixed Cap: $${this.fixedAmount} flat fee`;
  }
}

/**
 * NoFineStrategy
 * No fines regardless of return date
 */
class NoFineStrategy extends FineCalculationStrategy {
  calculate(dueDate, returnDate) {
    return 0;
  }

  getDescription() {
    return 'No Fines';
  }
}

export {
  FineCalculationStrategy,
  FlatRateFineStrategy,
  ProgressiveFineStrategy,
  FixedCapFineStrategy,
  NoFineStrategy,
};
