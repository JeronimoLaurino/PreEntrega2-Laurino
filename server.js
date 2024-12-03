const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs').promises;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const products = await fs.readFile(path.join(__dirname, 'data', 'productos.json'), 'utf-8');
    res.render('home', { products: JSON.parse(products) });
  } catch (error) {
    res.status(500).send('Error al leer los productos');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await fs.readFile(path.join(__dirname, 'data', 'productos.json'), 'utf-8');
    res.render('realTimeProducts', { products: JSON.parse(products) });
  } catch (error) {
    res.status(500).send('Error al leer los productos');
  }
});

app.post('/api/products', async (req, res) => {
  const { title, price } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const products = await fs.readFile(path.join(__dirname, 'data', 'productos.json'), 'utf-8');
    const productList = JSON.parse(products);
    const newProduct = { id: productList.length + 1, title, price };
    productList.push(newProduct);
    await fs.writeFile(path.join(__dirname, 'data', 'productos.json'), JSON.stringify(productList, null, 2));
    
    io.emit('newProduct', newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const products = await fs.readFile(path.join(__dirname, 'data', 'productos.json'), 'utf-8');
    const productList = JSON.parse(products);
    const updatedProducts = productList.filter(product => product.id != id);

    if (updatedProducts.length === productList.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await fs.writeFile(path.join(__dirname, 'data', 'productos.json'), JSON.stringify(updatedProducts, null, 2));
    io.emit('deleteProduct', id);

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');
  
  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});
