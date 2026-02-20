# Procedural vs Module Pattern: Quick Comparison Guide

## Side-by-Side Feature Comparison

### 1. GLOBAL SCOPE

**Procedural:**
```javascript
let cart = []; // Global - anyone can access/modify
```

**Module Pattern:**
```javascript
const ShoppingCart = (function() {
  let items = []; // Private - only accessible within closure
  return { /* public methods */ };
})();
```

---

## 2. ADDING ITEMS

**Procedural:**
```javascript
function addItem(itemName, quantity, price) {
  const existingItem = cart.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name: itemName, quantity, price });
  }
}
```

**Module Pattern:**
```javascript
addItem: function(itemName, quantity, price) {
  try {
    validateInput(itemName, quantity, price); // Validation!
    const index = findItemIndex(itemName);    // Private helper
    if (index > -1) {
      items[index].quantity += quantity;
    } else {
      items.push({ name: itemName, quantity, price });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`); // Error handling!
  }
}
```

**Key Differences:**
- ✅ Module Pattern has input validation
- ✅ Module Pattern has error handling
- ✅ Module Pattern uses private helpers
- ❌ Procedural has none of these

---

## 3. VIEWING CART

**Procedural:**
```javascript
function viewCart() {
  if (cart.length === 0) {
    console.log("Cart is empty");
    return;
  }
  let totalPrice = 0;
  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    totalPrice += itemTotal;
    console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
  });
  console.log(`Total: ${totalPrice.toFixed(2)} TND`);
}
```

**Module Pattern:**
```javascript
viewCart: function() {
  if (items.length === 0) {
    console.log("Cart is empty");
    return;
  }
  console.log("\n--- SHOPPING CART ---");
  let totalPrice = 0;
  items.forEach(item => {
    const itemTotal = calculateItemTotal(item); // Uses private helper
    totalPrice += itemTotal;
    console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
  });
  console.log(`\nTotal: ${totalPrice.toFixed(2)} TND\n`);
}
```

---

## 4. DATA ACCESS AND SECURITY

**Procedural - UNSAFE:**
```javascript
// Anyone can modify the cart directly!
cart[0].quantity = -999; // Invalid quantity set!
cart[0].price = "hello"; // Type violation!
cart = null; // Cart destroyed!
```

**Module Pattern - SAFE:**
```javascript
// Can't access items directly - it's private
ShoppingCart.items; // undefined
// Must use public interface
ShoppingCart.updateItemQuantity("Apple", 5); // Safe, validated
```

---

## 5. EXTENSIBILITY

**Procedural:**
Adding a new feature requires modifying the global space:
```javascript
// Global discount variable
let discountRate = 0;

// New global function
function applyDiscount(rate) {
  discountRate = rate; // Side effect - states changed globally
}

// Must modify existing functions
function viewCart() {
  // Now need to calculate with discount...
  // This spreads change across multiple places
}
```

**Module Pattern:**
New features are encapsulated:
```javascript
const ShoppingCart = (function() {
  let items = [];
  let discountRate = 0; // Private

  return {
    // ... existing methods ...
    applyDiscount: function(rate) {
      discountRate = rate; // No global side effects
    },
    getCartTotal: function() {
      const total = items.reduce(...);
      return total * (1 - discountRate); // Isolated logic
    }
  };
})();
```

---

## 6. TESTING

**Procedural - DIFFICULT:**
```javascript
// Problem: State persists between tests
describe('Cart Tests', () => {
  test('addItem increases cart', () => {
    addItem("Apple", 2, 1.5);
    expect(cart.length).toBe(1);
    // Problem: cart is still populated after test!
    // Need manual cleanup: cart = [];
  });
  
  test('another test', () => {
    // cart might still have Apple from previous test!
    addItem("Orange", 3, 2.0);
    expect(cart.length).toBe(...) // Unpredictable!
  });
});
```

**Module Pattern - EASY:**
```javascript
describe('ShoppingCart Tests', () => {
  test('addItem increases cart', () => {
    ShoppingCart.clearCart(); // Clean slate
    ShoppingCart.addItem("Apple", 2, 1.5);
    expect(ShoppingCart.getCartSize()).toBe(2); // Each method has clear input/output
  });
  
  test('another test', () => {
    ShoppingCart.clearCart(); // Independent test
    ShoppingCart.addItem("Orange", 3, 2.0);
    expect(ShoppingCart.getCartSize()).toBe(3); // Reliable
  });
});
```

---

## 7. CODE ORGANIZATION

**Procedural:**
```
- addItem function
- removeItem function
- viewCart function
- clearCart function
- getCartSize function
- getCartTotal function
↑ All mixed at same level
```

**Module Pattern:**
```
ShoppingCart
├── Private Functions
│   ├── calculateItemTotal
│   ├── findItemIndex
│   └── validateInput
└── Public API
    ├── addItem
    ├── removeItem
    ├── viewCart
    ├── clearCart
    ├── getCartSize
    ├── getCartTotal
    ├── getItems
    └── updateItemQuantity
```
Clear hierarchy and relationship between functions.

---

## Quick Decision Matrix

| Factor | Procedural | Module |
|--------|-----------|--------|
| Learning curve | Easy ✅ | Moderate ⚠️ |
| Complexity < 50 lines | Better ✅ | Overkill ❌ |
| Data protection | None ❌ | Complete ✅ |
| Scalability | Poor ❌ | Good ✅ |
| Maintenance | Hard ❌ | Easy ✅ |
| Testing | Difficult ❌ | Simple ✅ |
| Global pollution | Yes ❌ | No ✅ |
| Multiple instances | Problematic ⚠️ | Easy ✅ |
| Team development | Poor ❌ | Good ✅ |

---

## Getting the Best of Both Worlds

**Procedural for learning and simple scripts:**
- Beginner-friendly
- Good for understanding basics
- Fast to write for small projects

**Module Pattern for professional code:**
- Production-ready
- Team-friendly
- Future-proof
- Easier to maintain and extend

**Real-world approach:**
Start with procedural, refactor to Module Pattern as code grows!
