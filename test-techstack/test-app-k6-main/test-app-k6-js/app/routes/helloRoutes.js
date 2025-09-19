const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

// Define the routes for the helloController
router.route('/hello')
  .get(helloController.hello)
  .all((req, res) => {
    res.status(405).json({
      status: 'FAIL',
      message: 'Method Not Allowed',
      data: {}
    });
  });

module.exports = router;
