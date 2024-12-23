const Product = require('../models/Product');

const getProducts = async (filters) => {
  try {
    const { limit = 10, page = 1, sort = 'asc', query = '' } = filters;
    const sortOrder = sort === 'asc' ? 1 : -1;

    const queryFilters = query
      ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
          ]
        }
      : {};

    const totalProducts = await Product.countDocuments(queryFilters);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(queryFilters)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ price: sortOrder });

    return {
      payload: products,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null
    };
  } catch (error) {
    throw new Error('Error al obtener productos');
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

const addProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error al agregar producto');
  }
};

const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      throw new Error('Producto no encontrado');
    }
    return updatedProduct;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error('Producto no encontrado');
    }
    return deletedProduct;
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};