const { Product, ShoppingCart } = require('./oop');

// Create products
const apple = new Product(1, 'Apple', 0.5);
const banana = new Product(2, 'Banana', 0.3);
const cookie = new Product(3, 'Cookie', 1.25);

// Create shopping cart
const cart = new ShoppingCart();

// Add items to the cart
cart.addItem(apple, 4);
cart.addItem(banana, 10);
cart.addItem(cookie, 2);

console.log('Cart after adding items:');
cart.displayItems();

// Remove an item
console.log('\nRemoving Banana (id 2)...');
cart.removeItem(2);

console.log('Cart after removing Banana:');
cart.displayItems();

console.log('\nFinal total: ' + cart.getTotal().toFixed(2));
