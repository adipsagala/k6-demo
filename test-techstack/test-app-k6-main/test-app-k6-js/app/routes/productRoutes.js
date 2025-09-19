const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define the routes for the productController
router.route('/products')
  .get(productController.getProducts)
  .post(productController.createProduct)
  .all((req, res) => {
    res.status(405).json({
      status: 'FAIL',
      message: 'Method Not Allowed',
      data: {}
    });
  });

router.route('/products-with-cache')
  .get(productController.getProductsWithCache)
  .all((req, res) => {
    res.status(405).json({
      status: 'FAIL',
      message: 'Method Not Allowed',
      data: {}
    });
  });

router.route('/products-where-like')
  .get(productController.searchProducts)
  .all((req, res) => {
    res.status(405).json({
      status: 'FAIL',
      message: 'Method Not Allowed',
      data: {}
    });
  });

module.exports = router;
