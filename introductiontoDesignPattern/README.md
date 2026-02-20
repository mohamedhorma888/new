# Introduction to Design Patterns: Shopping Cart System

A complete exploration of procedural programming and design pattern refactoring using a shopping cart system as an example.

## 📁 Project Structure

```
introductiontoDesignPattern/
├── src/
│   ├── procedural-shopping-cart.js      # Part 1: Procedural implementation
│   └── module-pattern-shopping-cart.js  # Part 2: Module pattern refactored version
├── docs/
│   └── REFLECTION.md                     # Reflection report (200-300 words)
├── package.json                          # Project configuration
└── README.md                             # This file
```

## 🎯 Objective

This exercise contrasts two approaches to building a shopping cart system:
1. **Procedural Programming** - Simple, straightforward functions and global variables
2. **Module Pattern** - Encapsulated, organized code using closures

## 📦 Part 1: Procedural Shopping Cart

**File:** `src/procedural-shopping-cart.js`

### Features
- ✅ Add items to cart (item name, quantity, price)
- ✅ View all items and calculate total price
- ✅ Remove items by name
- ✅ Clear entire cart
- ✅ Get cart size and total

### Implementation Characteristics
- **Uses:** Global variables, standalone functions
- **Pros:** Simple, easy to understand for beginners
- **Cons:** Global scope pollution, no encapsulation, difficulty in scaling

### Example Usage
```javascript
addItem("Apple", 2, 1.5);
addItem("Orange", 3, 2.0);
viewCart();
// Output:
// Apple (x2) - 3.00 TND
// Orange (x3) - 6.00 TND
// Total: 9.00 TND

removeItem("Apple");
viewCart();
// Output:
// Orange (x3) - 6.00 TND
// Total: 6.00 TND
```

## 🎨 Part 2: Module Pattern Refactored Version

**File:** `src/module-pattern-shopping-cart.js`

### Design Pattern Selection: Module Pattern

The **Module Pattern** was chosen for refactoring because it:
- Provides **encapsulation** through closures
- Creates a **private scope** for data
- Exposes a **clean public API**
- Prevents **global scope pollution**
- Makes code more **maintainable and testable**

### Implementation Characteristics
- **Uses:** IIFE (Immediately Invoked Function Expression), closures
- **Pros:** Data encapsulation, better organization, scalability
- **Cons:** Slightly more complex, memory overhead per instance

### Enhanced Features
All original features plus:
- ✨ Input validation for all operations
- ✨ `getItems()` - Returns a deep copy of cart items
- ✨ `updateItemQuantity()` - Modify item quantities
- ✨ Error handling with user-friendly messages
- ✨ Private helper functions for code organization

### Example Usage
```javascript
ShoppingCart.addItem("Apple", 2, 1.5);
ShoppingCart.addItem("Orange", 3, 2.0);
ShoppingCart.viewCart();

ShoppingCart.updateItemQuantity("Orange", 5);
ShoppingCart.viewCart();

console.log("Cart size:", ShoppingCart.getCartSize());
console.log("Cart total:", ShoppingCart.getCartTotal());

ShoppingCart.removeItem("Apple");
ShoppingCart.clearCart();
```

### Key Differences from Procedural Version

| Aspect | Procedural | Module Pattern |
|--------|-----------|-----------------|
| **Scope** | Global | Private (Closure) |
| **Encapsulation** | None | Complete |
| **Validation** | None | Built-in |
| **API** | Functions | Object with methods |
| **Data Access** | Direct | Controlled |
| **Extensibility** | Difficult | Easy |
| **Testing** | Problematic | Straightforward |

## 🚀 Running the Code

### Prerequisites
- Node.js installed on your system

### Run Procedural Version
```bash
npm run demo:procedural
# or
node src/procedural-shopping-cart.js
```

### Run Module Pattern Version
```bash
npm run demo:module
# or
node src/module-pattern-shopping-cart.js
```

### Run Both Demos
```bash
npm run demo:all
```

## 📚 Reflection Report

A comprehensive reflection report is included in `docs/REFLECTION.md` that covers:

### Topics Addressed
1. **Challenges Faced During Refactoring**
   - Global scope pollution
   - Lack of encapsulation
   - Code organization issues

2. **How Design Patterns Improved the Code**
   - Encapsulation benefits
   - Data integrity mechanisms
   - Maintainability improvements
   - Scalability advantages
   - Enhanced testability

3. **When to Choose Design Patterns**
   - When to use procedural code
   - When to use design patterns
   - Real-world considerations

**Length:** ~300 words (within specification)

## 💡 Learning Outcomes

After completing this exercise, students will understand:

1. **Procedural Programming**
   - How to structure code functionally
   - Global variable usage and its drawbacks
   - The simplicity of straightforward implementations

2. **Design Patterns**
   - What the Module pattern is and how it works
   - How closures enable encapsulation in JavaScript
   - The benefits of organizing code with design patterns

3. **Best Practices**
   - When to apply design patterns
   - How to refactor existing code
   - The trade-offs between simplicity and architecture

4. **JavaScript Fundamentals**
   - IIFE (Immediately Invoked Function Expressions)
   - Closures and scope
   - Object methods and the public API concept

## 🔄 Comparison: From Procedural to Module Pattern

### Before (Procedural)
```javascript
// Global variable - accessible from anywhere
let cart = [];

// Standalone function
function addItem(itemName, quantity, price) {
  // can directly modify global cart
  cart.push({...});
}
```

### After (Module Pattern)
```javascript
// Cart is private, wrapped in closure
const ShoppingCart = (function() {
  let items = []; // PRIVATE - cannot be accessed directly
  
  // Validation is private
  function validateInput(itemName, quantity, price) {...}
  
  // Public API
  return {
    addItem: function(itemName, quantity, price) {
      validateInput(...); // Use validation
      // Only this method can modify items
    },
    viewCart: function() {...},
    removeItem: function(itemName) {...},
    // ... more methods
  };
})();
```

## 📝 Deliverables Checklist

- ✅ **Procedural Implementation** - `src/procedural-shopping-cart.js`
- ✅ **Module Pattern Refactored Version** - `src/module-pattern-shopping-cart.js`
- ✅ **Reflection Report** - `docs/REFLECTION.md` (250+ words)
- ✅ **Documentation** - This README and inline code comments
- ✅ **Running Examples** - Both files include demo usage

## 🎓 Additional Resources

### Design Patterns in JavaScript
- **Module Pattern** - Great for encapsulation, commonly used before ES6
- **Singleton Pattern** - Ensures single instance of an object
- **Factory Pattern** - Creates objects based on conditions
- **Observer Pattern** - Event-driven programming

### Why Module Pattern?
The Module Pattern was chosen because:
- It's foundational to understanding JavaScript closures
- It's production-ready (used in many libraries)
- It directly addresses procedural programming issues
- It bridges the gap to modern ES6 classes

## 📄 License

MIT License - Free to use and modify for educational purposes

---

**Created:** February 2026  
**Exercise:** Introduction to Design Patterns and Procedural Programming
