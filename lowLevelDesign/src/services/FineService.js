/**
 * FineService
 * Manages fine calculations using Strategy pattern
 */
import Logger from '../utils/Logger.js';
import { FlatRateFineStrategy } from '../patterns/Strategy.js';
import { EventType } from '../patterns/Observer.js';

class FineService {
  constructor(eventPublisher, fineCalculationStrategy = null) {
    this.eventPublisher = eventPublisher;
    // Use FlatRateFineStrategy as default
    this.strategy = fineCalculationStrategy || new FlatRateFineStrategy(5);
    this.fineHistory = new Map(); // bookCopyId -> { fineAmount, date }
    Logger.log('FineService initialized', { strategy: this.strategy.getDescription?.() || 'Default' });
  }

  /**
   * Set the fine calculation strategy
   */
  setStrategy(strategy) {
    this.strategy = strategy;
    Logger.log('Fine calculation strategy changed', { strategy: strategy.getDescription?.() || 'Unknown' });
    return this;
  }

  /**
   * Calculate fine for an overdue book
   */
  calculateFine(dueDate, returnDate) {
    return this.strategy.calculate(dueDate, returnDate);
  }

  /**
   * Calculate and record fine for a book return
   */
  assessFine(memberId, bookCopyId, dueDate, returnDate, memberService) {
    const fineAmount = this.calculateFine(dueDate, returnDate);

    if (fineAmount > 0) {
      // Record in history
      this.fineHistory.set(bookCopyId, {
        memberId,
        fineAmount,
        dueDate,
        returnDate,
        assessedAt: new Date(),
      });

      // Add fine to member's account
      memberService.addFine(memberId, fineAmount);

      // Publish event
      this.eventPublisher.publishEvent(EventType.FINE_ASSESSED, {
        memberId,
        bookCopyId,
        amount: fineAmount,
        dueDate,
        returnDate,
      });

      Logger.log(`Fine assessed`, { memberId, bookCopyId, amount: fineAmount });
    }

    return fineAmount;
  }

  /**
   * Get fine history for a book copy
   */
  getFineForCopy(bookCopyId) {
    return this.fineHistory.get(bookCopyId) || null;
  }

  /**
   * Get all fine history
   */
  getFineHistory() {
    return Array.from(this.fineHistory.values());
  }

  /**
   * Get total fines collected
   */
  getTotalFinesCollected() {
    return Array.from(this.fineHistory.values()).reduce((sum, record) => sum + record.fineAmount, 0);
  }

  /**
   * Get fine statistics
   */
  getFineStats() {
    const history = this.getFineHistory();
    if (history.length === 0) {
      return {
        totalFinesIssued: 0,
        averageFine: 0,
        totalFinesCollected: 0,
        highestFine: 0,
      };
    }

    return {
      totalFinesIssued: history.length,
      averageFine: history.reduce((sum, f) => sum + f.fineAmount, 0) / history.length,
      totalFinesCollected: this.getTotalFinesCollected(),
      highestFine: Math.max(...history.map(f => f.fineAmount)),
    };
  }

  /**
   * Get currently applied strategy description
   */
  getStrategyDescription() {
    return this.strategy.getDescription?.() || 'Unknown Strategy';
  }
}

export default FineService;
