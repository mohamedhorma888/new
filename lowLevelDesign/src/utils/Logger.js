/**
 * Logger Utility
 * Provides structured logging across the application
 */
class Logger {
  static log(message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [INFO]`;
    console.log(`${prefix} ${message}`, data || '');
  }

  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [ERROR]`;
    console.error(`${prefix} ${message}`, error || '');
  }

  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [WARN]`;
    console.warn(`${prefix} ${message}`, data || '');
  }

  static debug(message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [DEBUG]`;
    console.debug(`${prefix} ${message}`, data || '');
  }
}

export default Logger;
