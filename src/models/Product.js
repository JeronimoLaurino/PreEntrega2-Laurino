const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: true }
});

// Verificamos si el modelo 'Product' ya está registrado
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;