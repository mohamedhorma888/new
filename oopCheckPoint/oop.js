class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
  }
}

class ShoppingCartItem {
  constructor(product, quantity = 1) {
    if (!(product instanceof Product)) {
      throw new TypeError('product must be a Product instance');
    }
    this.product = product;
    this.quantity = Number(quantity);
  }

  totalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    const idx = this.items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      this.items[idx].quantity += Number(quantity);
    } else {
      this.items.push(new ShoppingCartItem(product, quantity));
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.totalPrice(), 0);
  }

  clear() {
    this.items = [];
  }

  displayItems() {
    if (this.items.length === 0) {
      console.log('Shopping cart is empty.');
      return [];
    }
    const lines = this.items.map(i =>
      i.product.name + ' (id: ' + i.product.id + ') x ' + i.quantity + ' = ' + i.totalPrice().toFixed(2)
    );
    console.log(lines.join('\n'));
    console.log('Total: ' + this.getTotal().toFixed(2));
    return lines;
  }
}

module.exports = { Product, ShoppingCartItem, ShoppingCart };
