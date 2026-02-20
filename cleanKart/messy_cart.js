// ============================================
// ITERATION 0: MESSY INITIAL VERSION
// ============================================
// This is intentionally bad code demonstrating:
// - Long methods with multiple responsibilities
// - Code duplication
// - Tight coupling
// - Poor naming conventions
// - Magic numbers/strings
// - No separation of concerns
// ============================================

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.discountPercentage = 0;
    this.customerType = "regular";
    this.appliedDiscounts = [];
  }

  // CODE SMELL: God Method - does too many things
  addItem(name, price, qty, category) {
    // Validation mixed with business logic
    if (!name || price < 0 || qty < 0) {
      return;
    }

    // Magic number 0.1
    let p = price;
    if (category === "electronics") {
      p = price * 0.9;
    }
    if (category === "clothing") {
      p = price * 0.85;
    }

    // Duplication of item creation
    let item = {
      n: name,
      p: p,
      q: qty,
      c: category,
      t: p * qty
    };

    this.items.push(item);
    this.total = this.total + item.t;

    // Side effect: modifying tax globally
    this.recalculateTax();

    console.log("Item added: " + name);
  }

  // CODE SMELL: Duplication - another god method
  removeItem(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].n === name) {
        this.total = this.total - this.items[i].t;
        this.items.splice(i, 1);
        this.recalculateTax();
        console.log("Item removed: " + name);
        return;
      }
    }
  }

  // CODE SMELL: Hard-coded tax rate, mixed concerns
  recalculateTax() {
    let subtotal = 0;
    for (let i = 0; i < this.items.length; i++) {
      subtotal = subtotal + this.items[i].t;
    }
    // Magic number 0.08
    this.tax = subtotal * 0.08;
    this.total = subtotal + this.tax;

    // CODE SMELL: Discount logic buried deep
    if (this.customerType === "premium") {
      this.total = this.total * 0.95;
    }
    if (this.customerType === "vip") {
      this.total = this.total * 0.9;
    }
  }

  // CODE SMELL: Duplicate discount calculation
  applyDiscount(discountType) {
    if (discountType === "percent10") {
      this.discountPercentage = 10;
      this.appliedDiscounts.push("percent10");
    }
    if (discountType === "percent20") {
      this.discountPercentage = 20;
      this.appliedDiscounts.push("percent20");
    }
    if (discountType === "FLATRATE") {
      this.total = this.total - 5;
      this.appliedDiscounts.push("FLATRATE");
    }

    this.recalculateTax();
  }

  // CODE SMELL: No responsibility SoC
  getCartInfo() {
    let str = "=== CART ===\n";
    for (let i = 0; i < this.items.length; i++) {
      str = str + this.items[i].n + ": " + this.items[i].p + " x " + this.items[i].q + "\n";
    }
    str = str + "Subtotal: " + (this.total - this.tax).toFixed(2) + "\n";
    str = str + "Tax: " + this.tax.toFixed(2) + "\n";
    str = str + "Total: " + this.total.toFixed(2) + "\n";
    str = str + "Discounts applied: " + this.appliedDiscounts.join(",") + "\n";
    return str;
  }

  // CODE SMELL: Procedural checkout with mixed concerns
  checkout() {
    // Validation
    if (this.items.length === 0) {
      console.log("Cart is empty!");
      return false;
    }

    // Duplicate total calculation
    let finalTotal = 0;
    for (let i = 0; i < this.items.length; i++) {
      finalTotal = finalTotal + this.items[i].t;
    }

    // Discount calculation duplication
    if (this.discountPercentage > 0) {
      finalTotal = finalTotal * (1 - this.discountPercentage / 100);
    }

    // Tax calculation duplication
    finalTotal = finalTotal + (finalTotal * 0.08);

    // Customer type bonus
    if (this.customerType === "vip") {
      console.log("VIP bonus: +100 loyalty points");
    }

    console.log("Order placed. Total: $" + finalTotal.toFixed(2));
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.discountPercentage = 0;

    return true;
  }

  // CODE SMELL: Unclear naming, side effects
  mutateCustomerType(t) {
    this.customerType = t;
    this.recalculateTax();
  }

  // CODE SMELL: Getter with side effect
  viewItems() {
    console.log("Items in cart: " + this.items.length);
    return this.items;
  }
}

// TEST: Basic usage
console.log("\n=== INITIAL MESSY CODE TEST ===\n");
const cart = new ShoppingCart();
cart.addItem("Laptop", 1000, 1, "electronics");
cart.addItem("Shirt", 50, 2, "clothing");
cart.addItem("Book", 20, 1, "books");

console.log(cart.getCartInfo());

cart.applyDiscount("percent10");
console.log("After discount:\n" + cart.getCartInfo());

cart.mutateCustomerType("vip");
console.log("After setting to VIP:\n" + cart.getCartInfo());

cart.checkout();
