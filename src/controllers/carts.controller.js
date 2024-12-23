const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCartById = async (id) => {
  try {
    const cart = await Cart.findById(id).populate('products.product');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  } catch (error) {
    throw new Error('Error al obtener el carrito');
  }
};

const createCart = async () => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al crear el carrito');
  }
};

const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al agregar el producto al carrito');
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al eliminar el producto del carrito');
  }
};

const updateProductQuantityInCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!productInCart) {
      throw new Error('Producto no encontrado en el carrito');
    }

    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al actualizar la cantidad del producto en el carrito');
  }
};

const clearCart = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = [];
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
};

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantityInCart,
  clearCart
};
