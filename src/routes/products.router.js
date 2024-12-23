const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsManager');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

module.exports = router;