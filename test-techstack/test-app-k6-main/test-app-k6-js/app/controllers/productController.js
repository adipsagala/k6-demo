const Product = require('../models/productModel');
const redisClient = require('../redis');

// Create a new product
exports.createProduct = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Name is required',
      data: {}
    });
  }

  try {
    const id = await Product.create(name);
    res.json({
      status: 'SUCCESS',
      message: 'New product created!',
      data: { id, name }
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAIL',
      message: 'Database error',
      data: { error: err.message }
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({
      status: 'SUCCESS',
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAIL',
      message: 'Database error',
      data: { error: err.message }
    });
  }
};

// Get a product with caching
exports.getProductsWithCache = async (req, res) => {
  try {
    const cacheKey = "test-app-k6:js:products_all"
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json({
        status: 'SUCCESS',
        message: 'Products retrieved from cache',
        data: JSON.parse(cachedData)
      });
    }

    const products = await Product.getAll();

    // Simpan ke redis, TTL 60 detik
    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 60
    });

    res.json({
      status: 'SUCCESS',
      message: 'Products retrieved from database',
      data: products
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAIL',
      message: 'Server error',
      data: { error: err.message }
    });
  }
};

// Get a product by ID
exports.searchProducts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      status: 'FAIL',
      message: 'Query parameter "q" is required',
      data: {}
    });
  }

  try {
    const results = await Product.searchByName(q);
    res.json({
      status: 'SUCCESS',
      message: 'Search results retrieved',
      data: results
    });
  } catch (err) {
    res.status(500).json({
      status: 'FAIL',
      message: 'Database error',
      data: { error: err.message }
    });
  }
};
