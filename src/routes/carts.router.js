const express = require('express');
const cartsController = require('../controllers/cartsManager');
const router = express.Router();

// Agregar producto al carrito
router.post('/:cartId/products', async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  
  try {
    const updatedCart = await cartsController.addProductToCart(cartId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar el producto', error: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const updatedCart = await cartsController.removeProductFromCart(cartId, productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});

// Actualizar producto en el carrito
router.put('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartsController.updateProductInCart(cartId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
});

// Obtener carrito por ID
router.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await cartsController.getCartById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener el carrito', error: error.message });
  }
});

module.exports = router;