const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('productDetail', { product });
  } catch (error) {
    console.log('Error al obtener el producto:', error);
    res.status(500).send('Error al obtener el producto');
  }
};

module.exports = {
  getProducts,
  getProductById
};