const express = require('express');
const app = express();
const helloRoutes = require('./routes/helloRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());
app.use('/', helloRoutes);
app.use('/', productRoutes);

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
