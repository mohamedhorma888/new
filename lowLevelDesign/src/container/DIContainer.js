/**
 * Dependency Injection Container
 * Manages dependency resolution and injection
 */
import Logger from '../utils/Logger.js';

/**
 * Container class for managing dependencies
 */
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Register a service factory
   * @param {string} name - Service name
   * @param {Function} factory - Factory function that creates the service
   * @param {Object} options - { isSingleton: boolean }
   */
  register(name, factory, options = {}) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for '${name}' must be a function`);
    }

    this.services.set(name, {
      factory,
      isSingleton: options.isSingleton || false,
    });

    Logger.debug(`Registered service: ${name}`);
    return this;
  }

  /**
   * Register a singleton service (created once and reused)
   */
  registerSingleton(name, factory) {
    return this.register(name, factory, { isSingleton: true });
  }

  /**
   * Register a value directly (for constants or pre-created instances)
   */
  registerValue(name, value) {
    if (typeof value === 'function') {
      throw new Error(`Cannot register a function as value. Use register() instead.`);
    }
    this.singletons.set(name, value);
    Logger.debug(`Registered value: ${name}`);
    return this;
  }

  /**
   * Resolve a service by name
   */
  resolve(name) {
    if (!this.services.has(name) && !this.singletons.has(name)) {
      throw new Error(`Service '${name}' not registered in container`);
    }

    // Check if it's a registered value
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const { factory, isSingleton } = this.services.get(name);

    // Return singleton if already created
    if (isSingleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create new instance
    const instance = factory(this);

    // Store singleton
    if (isSingleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Check if a service is registered
   */
  has(name) {
    return this.services.has(name) || this.singletons.has(name);
  }

  /**
   * Get all registered service names
   */
  getServiceNames() {
    return Array.from(new Set([...this.services.keys(), ...this.singletons.keys()]));
  }

  /**
   * Bind a service to its dependencies
   * Creates a service and injects its dependencies
   */
  bindService(name, dependencies = []) {
    const service = this.resolve(name);
    const { factory } = this.services.get(name);

    // If the factory function has dependencies, resolve them
    if (factory.length > 0 && !this.singletons.has(name)) {
      const args = dependencies.map(dep => this.resolve(dep));
      return factory(...args);
    }

    return service;
  }

  /**
   * Clear all registered services
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    Logger.debug('DI Container cleared');
  }

  /**
   * Get container statistics
   */
  getStats() {
    return {
      totalServices: this.services.size,
      singletons: this.singletons.size,
      services: Array.from(this.services.keys()),
      registeredValues: Array.from(this.singletons.keys()),
    };
  }
}

/**
 * Create a configured DI container with default services
 */
function createContainer() {
  const container = new DIContainer();
  
  // Register utilities as singletons
  container.registerValue('logger', Logger);
  
  return container;
}

export { DIContainer, createContainer };
