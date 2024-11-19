const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.json());

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    let products = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const limit = parseInt(req.query.limit);
    if (limit) products = products.slice(0, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const product = products.find(p => p.id == pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const products = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };

    products.push(newProduct);
    await writeFile(path.join(__dirname, 'data', 'productos.json'), products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  try {
    const products = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const productIndex = products.findIndex(p => p.id == pid);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
    products[productIndex] = updatedProduct;

    await writeFile(path.join(__dirname, 'data', 'productos.json'), products);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const updatedProducts = products.filter(p => p.id != pid);
    if (updatedProducts.length === products.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await writeFile(path.join(__dirname, 'data', 'productos.json'), updatedProducts);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const carts = await readFile(path.join(__dirname, 'data', 'carrito.json'));
    const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    const newCart = { id, products: [] };

    carts.push(newCart);
    await writeFile(path.join(__dirname, 'data', 'carrito.json'), carts);

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await readFile(path.join(__dirname, 'data', 'carrito.json'));
    const cart = carts.find(c => c.id == cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los carritos' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const carts = await readFile(path.join(__dirname, 'data', 'carrito.json'));
    const cart = carts.find(c => c.id == cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const product = await readFile(path.join(__dirname, 'data', 'productos.json'));
    const foundProduct = product.find(p => p.id == pid);
    if (!foundProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product == pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await writeFile(path.join(__dirname, 'data', 'carrito.json'), carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});