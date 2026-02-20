/**
 * Observer Pattern Implementation
 * Notification system for library events
 */
import Logger from '../utils/Logger.js';

/**
 * NotificationObserver - Interface-like abstraction for observers
 */
class NotificationObserver {
  /**
   * Handle a library event
   * @param {Object} event
   */
  notify(event) {
    throw new Error('notify() must be implemented by subclass');
  }
}

/**
 * Event class for library events
 */
class LibraryEvent {
  constructor(type, data) {
    this.type = type;
    this.data = data;
    this.timestamp = new Date();
  }
}

/**
 * Event Types
 */
const EventType = {
  BOOK_CHECKED_OUT: 'BOOK_CHECKED_OUT',
  BOOK_RETURNED: 'BOOK_RETURNED',
  BOOK_OVERDUE: 'BOOK_OVERDUE',
  FINE_ASSESSED: 'FINE_ASSESSED',
  MEMBER_STATUS_CHANGED: 'MEMBER_STATUS_CHANGED',
  BOOK_ADDED_TO_CATALOG: 'BOOK_ADDED_TO_CATALOG',
  BOOK_COPY_CREATED: 'BOOK_COPY_CREATED',
};

/**
 * EmailNotificationObserver
 * Sends email notifications
 */
class EmailNotificationObserver extends NotificationObserver {
  notify(event) {
    const { type, data } = event;
    Logger.log(`📧 Email Notification [${type}]:`, {
      to: data.memberEmail || 'library@system.com',
      subject: this.getSubjectForEvent(type),
      body: this.getBodyForEvent(type, data),
    });
  }

  getSubjectForEvent(type) {
    const subjects = {
      BOOK_CHECKED_OUT: 'Book Successfully Checked Out',
      BOOK_RETURNED: 'Book Successfully Returned',
      BOOK_OVERDUE: 'Book Overdue Reminder',
      FINE_ASSESSED: 'Library Fine Assessed',
      MEMBER_STATUS_CHANGED: 'Account Status Changed',
      BOOK_ADDED_TO_CATALOG: 'New Book Added to Library',
    };
    return subjects[type] || 'Library Notification';
  }

  getBodyForEvent(type, data) {
    switch (type) {
      case EventType.BOOK_CHECKED_OUT:
        return `You have checked out: ${data.bookTitle}. Due date: ${data.dueDate}`;
      case EventType.BOOK_OVERDUE:
        return `Your book "${data.bookTitle}" is overdue. Please return it to avoid fines.`;
      case EventType.FINE_ASSESSED:
        return `A fine of $${data.amount} has been assessed to your account.`;
      default:
        return 'An event has occurred in your library account.';
    }
  }
}

/**
 * SMSNotificationObserver
 * Sends SMS notifications
 */
class SMSNotificationObserver extends NotificationObserver {
  notify(event) {
    const { type, data } = event;
    Logger.log(`📱 SMS Notification [${type}]:`, {
      to: data.memberPhone || '+1-XXX-XXX-XXXX',
      message: this.getMessageForEvent(type, data),
    });
  }

  getMessageForEvent(type, data) {
    switch (type) {
      case EventType.BOOK_CHECKED_OUT:
        return `Library: You checked out "${data.bookTitle}". Due: ${data.dueDate}`;
      case EventType.BOOK_OVERDUE:
        return `Library ALERT: "${data.bookTitle}" is overdue!`;
      case EventType.FINE_ASSESSED:
        return `Library: Fine of $${data.amount} assessed.`;
      default:
        return 'Library notification for your account.';
    }
  }
}

/**
 * LoggingObserver
 * Logs all events to the system
 */
class LoggingObserver extends NotificationObserver {
  notify(event) {
    Logger.log(`📝 System Log [${event.type}]:`, event.data);
  }
}

/**
 * DatabaseObserver
 * Persists events to database (simulated)
 */
class DatabaseObserver extends NotificationObserver {
  constructor() {
    super();
    this.events = [];
  }

  notify(event) {
    this.events.push(event);
    Logger.debug(`💾 Event persisted to database [${event.type}]`);
  }

  getEventHistory() {
    return this.events;
  }

  clearHistory() {
    this.events = [];
  }
}

/**
 * EventPublisher - Subject in Observer Pattern
 * Manages observers and publishes events
 */
class EventPublisher {
  constructor() {
    this.observers = [];
  }

  /**
   * Register an observer
   */
  subscribe(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      Logger.debug('Observer subscribed');
    }
  }

  /**
   * Unregister an observer
   */
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    Logger.debug('Observer unsubscribed');
  }

  /**
   * Publish an event to all observers
   */
  publish(event) {
    this.observers.forEach(observer => {
      try {
        observer.notify(event);
      } catch (error) {
        Logger.error(`Error notifying observer: ${error.message}`);
      }
    });
  }

  /**
   * Publish a specific event type with data
   */
  publishEvent(eventType, data) {
    const event = new LibraryEvent(eventType, data);
    this.publish(event);
  }

  /**
   * Get the number of registered observers
   */
  getObserverCount() {
    return this.observers.length;
  }

  /**
   * Remove all observers
   */
  clear() {
    this.observers = [];
  }
}

export {
  NotificationObserver,
  LibraryEvent,
  EventType,
  EmailNotificationObserver,
  SMSNotificationObserver,
  LoggingObserver,
  DatabaseObserver,
  EventPublisher,
};
