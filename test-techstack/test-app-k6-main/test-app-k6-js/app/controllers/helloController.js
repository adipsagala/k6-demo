// simple controller for testing
exports.hello = (req, res) => {
    res.json({
      status: 'SUCCESS',
      message: 'Hello World!',
      data: {}
    });
  };
  