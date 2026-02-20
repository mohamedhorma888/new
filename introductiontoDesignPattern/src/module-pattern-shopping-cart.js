/**
 * Module Pattern: Shopping Cart System
 * 
 * This file implements a shopping cart using the Module pattern.
 * The Module pattern uses closures to encapsulate data and methods,
 * preventing global scope pollution and providing better organization.
 * 
 * Pros: Encapsulation, private data, organized code, scalable
 * Cons: Slightly more complex, memory overhead for multiple instances
 */

const ShoppingCart = (function() {
  // Private variable - not accessible from outside
  let items = [];

  /**
   * Private helper function to calculate item total
   * @param {object} item - The cart item
   * @returns {number} Total price for the item
   */
  function calculateItemTotal(item) {
    return item.quantity * item.price;
  }

  /**
   * Private helper function to find item index
   * @param {string} itemName - Name of the item to find
   * @returns {number} Index of the item, or -1 if not found
   */
  function findItemIndex(itemName) {
    return items.findIndex(item => item.name === itemName);
  }

  /**
   * Private helper function to validate inputs
   * @param {string} itemName - Item name
   * @param {number} quantity - Item quantity
   * @param {number} price - Item price
   * @throws {Error} If validation fails
   */
  function validateInput(itemName, quantity, price) {
    if (!itemName || typeof itemName !== 'string') {
      throw new Error('Item name must be a non-empty string');
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a positive integer');
    }
    if (price < 0 || typeof price !== 'number') {
      throw new Error('Price must be a non-negative number');
    }
  }

  // Public API - these are the only methods accessible from outside
  return {
    /**
     * Adds an item to the cart
     * @param {string} itemName - The name of the item
     * @param {number} quantity - The quantity of the item
     * @param {number} price - The price per unit
     */
    addItem: function(itemName, quantity, price) {
      try {
        validateInput(itemName, quantity, price);
        
        const index = findItemIndex(itemName);
        
        if (index > -1) {
          // Item exists, increase quantity
          items[index].quantity += quantity;
        } else {
          // Item doesn't exist, add new item
          items.push({
            name: itemName,
            quantity: quantity,
            price: price
          });
        }
        
        console.log(`✓ Added ${quantity} ${itemName}(s) at ${price} TND each`);
      } catch (error) {
        console.error(`✗ Error adding item: ${error.message}`);
      }
    },

    /**
     * Removes an item from the cart by name
     * @param {string} itemName - The name of the item to remove
     */
    removeItem: function(itemName) {
      const index = findItemIndex(itemName);
      
      if (index > -1) {
        const removedItem = items.splice(index, 1);
        console.log(`✓ Removed ${removedItem[0].name} from cart`);
      } else {
        console.log(`✗ Item "${itemName}" not found in cart`);
      }
    },

    /**
     * Displays all items in the cart with total price
     */
    viewCart: function() {
      if (items.length === 0) {
        console.log("Cart is empty");
        return;
      }
      
      console.log("\n--- SHOPPING CART ---");
      let totalPrice = 0;
      
      items.forEach(item => {
        const itemTotal = calculateItemTotal(item);
        totalPrice += itemTotal;
        console.log(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} TND`);
      });
      
      console.log(`\nTotal: ${totalPrice.toFixed(2)} TND\n`);
    },

    /**
     * Clears all items from the cart
     */
    clearCart: function() {
      items = [];
      console.log("✓ Cart cleared");
    },

    /**
     * Gets the total number of items in the cart
     * @returns {number} Total quantity of items
     */
    getCartSize: function() {
      return items.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Gets the total price of all items in the cart
     * @returns {number} Total price
     */
    getCartTotal: function() {
      return items.reduce((total, item) => total + calculateItemTotal(item), 0);
    },

    /**
     * Gets a copy of all items in the cart (prevents external modification)
     * @returns {array} Array of items
     */
    getItems: function() {
      return JSON.parse(JSON.stringify(items)); // Deep copy to prevent external changes
    },

    /**
     * Updates the quantity of an item
     * @param {string} itemName - The name of the item
     * @param {number} newQuantity - The new quantity
     */
    updateItemQuantity: function(itemName, newQuantity) {
      try {
        if (newQuantity <= 0 || !Number.isInteger(newQuantity)) {
          throw new Error('Quantity must be a positive integer');
        }
        
        const index = findItemIndex(itemName);
        
        if (index > -1) {
          items[index].quantity = newQuantity;
          console.log(`✓ Updated ${itemName} quantity to ${newQuantity}`);
        } else {
          console.log(`✗ Item "${itemName}" not found in cart`);
        }
      } catch (error) {
        console.error(`✗ Error updating quantity: ${error.message}`);
      }
    }
  };
})();

// ==================== DEMO USAGE ====================
console.log("=== MODULE PATTERN SHOPPING CART DEMO ===\n");

ShoppingCart.addItem("Apple", 2, 1.5);
ShoppingCart.addItem("Orange", 3, 2.0);
ShoppingCart.viewCart();

ShoppingCart.addItem("Banana", 1, 0.8);
ShoppingCart.viewCart();

ShoppingCart.removeItem("Apple");
ShoppingCart.viewCart();

console.log("Cart size:", ShoppingCart.getCartSize());
console.log("Cart total:", ShoppingCart.getCartTotal().toFixed(2), "TND");

ShoppingCart.updateItemQuantity("Orange", 5);
ShoppingCart.viewCart();

ShoppingCart.clearCart();
console.log("After clearing:");
ShoppingCart.viewCart();

// Demonstrate encapsulation - this won't work:
// ShoppingCart.items.push(...) // Error: items is private
// console.log(ShoppingCart.items); // undefined
