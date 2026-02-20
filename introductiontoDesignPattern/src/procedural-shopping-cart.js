/**
 * Procedural Programming: Shopping Cart System
 * 
 * This file implements a shopping cart using pure procedural programming.
 * It uses global variables and functions to manage cart operations.
 * 
 * Pros: Simple, straightforward, easy to understand
 * Cons: Global scope pollution, no encapsulation, difficulty in scaling
 */

// Global cart data structure
let cart = [];

/**
 * Adds an item to the cart
 * @param {string} itemName - The name of the item
 * @param {number} quantity - The quantity of the item
 * @param {number} price - The price per unit
 */
function addItem(itemName, quantity, price) {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === itemName);
  
  if (existingItem) {
    // If item exists, increase quantity
    existingItem.quantity += quantity;
  } else {
    // If item doesn't exist, add new item
    cart.push({
      name: itemName,
      quantity: quantity,
      price: price
    });
  }
  
  console.log(`Added ${quantity} ${itemName}(s) at ${price} TND each`);
}

/**
 * Removes an item from the cart by name
 * @param {string} itemName - The name of the item to remove
 */
function removeItem(itemName) {
  const index = cart.findIndex(item => item.name === itemName);
  
  if (index > -1) {
    const removedItem = cart.splice(index, 1);
    console.log(`Removed ${removedItem[0].name} from cart`);
  } else {
    console.log(`Item "${itemName}" not found in cart`);
  }
}

/**
 * Displays all items in the cart and calculates total price
 */
function viewCart() {
  if (cart.length === 0) {
    console.log("Cart is empty");
    return;
  }
  
  console.log("\n--- SHOPPING CART ---");
  let totalPrice = 0;
  
  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    totalPrice += itemTotal;
    console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
  });
  
  console.log(`\nTotal: ${totalPrice.toFixed(2)} TND\n`);
}

/**
 * Clears all items from the cart
 */
function clearCart() {
  cart = [];
  console.log("Cart cleared");
}

/**
 * Gets the total number of items in the cart
 * @returns {number} Total quantity of items
 */
function getCartSize() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Gets the total price of all items in the cart
 * @returns {number} Total price
 */
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.quantity * item.price), 0);
}

// ==================== DEMO USAGE ====================
console.log("=== PROCEDURAL SHOPPING CART DEMO ===\n");

addItem("Apple", 2, 1.5);
addItem("Orange", 3, 2.0);
viewCart();

addItem("Banana", 1, 0.8);
viewCart();

removeItem("Apple");
viewCart();

clearCart();
console.log("After clearing:");
viewCart();
