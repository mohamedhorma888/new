// ============================================
// ITERATION 1: EXTRACT METHODS & IMPROVE NAMING
// ============================================
// Refactoring improvements:
// - Renamed abbreviated variables (n->name, p->price, q->qty, c->category, t->total)
// - Extracted magic numbers into constants
// - Extracted validation logic into separate methods
// - Extracted item creation into its own method
// - Extracted discount and tax calculations into separate methods
// - Improved method names for clarity (mutateCustomerType -> setCustomerType)
// - Better code organization
// ============================================

// Constants - Eliminated magic numbers
const TAX_RATE = 0.08;
const DEFAULT_DISCOUNT = 0;
const CATEGORY_DISCOUNTS = {
  electronics: 0.9,
  clothing: 0.85,
  books: 1.0
};
const CUSTOMER_DISCOUNTS = {
  regular: 1.0,
  premium: 0.95,
  vip: 0.9
};

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.discountPercentage = DEFAULT_DISCOUNT;
    this.customerType = "regular";
    this.appliedDiscounts = [];
  }

  // REFACTORING: Extracted validation logic
  validateItemInput(name, price, quantity, category) {
    if (!name || price < 0 || quantity < 0) {
      console.error("Invalid item input");
      return false;
    }
    return true;
  }

  // REFACTORING: Extracted category discount calculation
  calculateCategoryDiscount(category, price) {
    const discountMultiplier = CATEGORY_DISCOUNTS[category] || 1.0;
    return price * discountMultiplier;
  }

  // REFACTORING: Extracted item creation
  createCartItem(name, price, quantity, category) {
    const discountedPrice = this.calculateCategoryDiscount(category, price);
    return {
      name: name,
      price: discountedPrice,
      quantity: quantity,
      category: category,
      subtotal: discountedPrice * quantity
    };
  }

  // IMPROVED: Clearer method with extracted validation
  addItem(name, price, quantity, category) {
    if (!this.validateItemInput(name, price, quantity, category)) {
      return;
    }

    const item = this.createCartItem(name, price, quantity, category);
    this.items.push(item);
    this.total += item.subtotal;
    this.recalculateTotals();

    console.log(`Item added: ${item.name}`);
  }

  // IMPROVED: Clearer method with better variable names
  removeItem(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        this.total -= this.items[i].subtotal;
        this.items.splice(i, 1);
        this.recalculateTotals();
        console.log(`Item removed: ${name}`);
        return;
      }
    }
  }

  // REFACTORING: Extracted subtotal calculation
  calculateSubtotal() {
    let subtotal = 0;
    for (const item of this.items) {
      subtotal += item.subtotal;
    }
    return subtotal;
  }

  // REFACTORING: Extracted tax calculation
  calculateTax(subtotal) {
    return subtotal * TAX_RATE;
  }

  // REFACTORING: Extracted customer discount calculation
  applyCustomerDiscount(subtotal) {
    const discountMultiplier = CUSTOMER_DISCOUNTS[this.customerType] || 1.0;
    return subtotal * discountMultiplier;
  }

  // IMPROVED: Renamed and refactored - separated concerns
  recalculateTotals() {
    const subtotal = this.calculateSubtotal();
    const customerAdjusted = this.applyCustomerDiscount(subtotal);
    this.tax = this.calculateTax(customerAdjusted);
    this.total = customerAdjusted + this.tax;
  }

  // IMPROVED: Clearer method names and extracted calculation
  applyDiscount(discountType) {
    if (discountType === "percent10") {
      this.discountPercentage = 10;
    } else if (discountType === "percent20") {
      this.discountPercentage = 20;
    } else if (discountType === "flatrate") {
      this.total -= 5;
    }
    
    this.appliedDiscounts.push(discountType);
    this.recalculateTotals();
  }

  // REFACTORING: Extracted formatting logic
  formatCurrency(value) {
    return value.toFixed(2);
  }

  // REFACTORING: Extracted display logic
  formatItemDisplay(item) {
    return `${item.name}: $${this.formatCurrency(item.price)} x ${item.quantity}`;
  }

  // IMPROVED: Now only handles formatting, calculation logic extracted
  getCartInfo() {
    let output = "=== CART ===\n";
    
    for (const item of this.items) {
      output += this.formatItemDisplay(item) + "\n";
    }
    
    const subtotal = this.calculateSubtotal();
    output += `Subtotal: $${this.formatCurrency(subtotal)}\n`;
    output += `Tax: $${this.formatCurrency(this.tax)}\n`;
    output += `Total: $${this.formatCurrency(this.total)}\n`;
    output += `Discounts applied: ${this.appliedDiscounts.join(", ")}\n`;
    
    return output;
  }

  // IMPROVED: Better method name, extracted validation
  setCustomerType(customerType) {
    if (!CUSTOMER_DISCOUNTS.hasOwnProperty(customerType)) {
      console.error(`Unknown customer type: ${customerType}`);
      return;
    }
    this.customerType = customerType;
    this.recalculateTotals();
  }

  // IMPROVED: Getter without side effects
  getItems() {
    return [...this.items]; // Return copy to prevent mutation
  }

  // IMPROVED: Extracted checkout validation
  validateCheckout() {
    if (this.items.length === 0) {
      console.error("Cart is empty");
      return false;
    }
    return true;
  }

  // IMPROVED: Clearer checkout with extracted logic
  checkout() {
    if (!this.validateCheckout()) {
      return false;
    }

    const finalTotal = this.total;
    
    if (this.customerType === "vip") {
      console.log("VIP bonus: +100 loyalty points");
    }

    console.log(`Order placed. Total: $${this.formatCurrency(finalTotal)}`);
    
    // Clear cart
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.discountPercentage = DEFAULT_DISCOUNT;
    this.appliedDiscounts = [];

    return true;
  }
}

// TEST: Verify refactored code works identically
console.log("\n=== ITERATION 1: REFACTORED CODE TEST ===\n");
const cart = new ShoppingCart();
cart.addItem("Laptop", 1000, 1, "electronics");
cart.addItem("Shirt", 50, 2, "clothing");
cart.addItem("Book", 20, 1, "books");

console.log(cart.getCartInfo());

cart.applyDiscount("percent10");
console.log("After discount:\n" + cart.getCartInfo());

cart.setCustomerType("vip");
console.log("After setting to VIP:\n" + cart.getCartInfo());

cart.checkout();
