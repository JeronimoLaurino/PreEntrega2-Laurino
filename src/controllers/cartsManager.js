const Cart = require('../models/cart');
const Product = require('../models/product');

const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (existingProductIndex > -1) {
      // Si el producto ya está en el carrito, solo actualizamos la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, lo agregamos
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al agregar el producto al carrito: ' + error.message);
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al eliminar el producto del carrito: ' + error.message);
  }
};

const updateProductInCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error('Producto no encontrado en el carrito');
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al actualizar el producto en el carrito: ' + error.message);
  }
};

const getCartById = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId).populate('products.productId');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  } catch (error) {
    throw new Error('Error al obtener el carrito: ' + error.message);
  }
};

module.exports = {
  addProductToCart,
  removeProductFromCart,
  updateProductInCart,
  getCartById
};