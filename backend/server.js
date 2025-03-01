const express = require('express');
const cors = require('cors');
const winston = require('winston');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Logger configuration
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

let products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Smartphone', price: 699 },
    { id: 3, name: 'Headphones', price: 199 },
    { id: 4, name: 'Keyboard', price: 49 },
    { id: 5, name: 'Mouse', price: 29 }
];

// Get all products
app.get('/products', (req, res) => {
    logger.info('Fetching all products');
    res.status(200).json(products);
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(product => product.id === Number(req.params.id));
    if (!product) {
        logger.warn(`Product with ID ${req.params.id} not found`);
        return res.status(404).json({ error: "Product not found" });
    }
    logger.info(`Fetched product: ${JSON.stringify(product)}`);
    res.status(200).json(product);
});

// Add a new product
app.post('/products', (req, res) => {
    const { id, name, price } = req.body;
    if (!name || !price) {
        logger.error('Product creation failed: Missing name or price');
        return res.status(400).json({ error: "Name and price are required" });
    }
    const newProduct = { id, name, price };
    products.push(newProduct);
    logger.info(`Product added: ${JSON.stringify(newProduct)}`);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// Update a product
app.patch('/products/:id', (req, res) => {
    const product = products.find(product => product.id === Number(req.params.id));
    if (!product) {
        logger.warn(`Update failed: Product with ID ${req.params.id} not found`);
        return res.status(404).json({ error: "Product not found" });
    }
    Object.assign(product, req.body);
    logger.info(`Product updated: ${JSON.stringify(product)}`);
    res.status(200).json({ message: "Product updated successfully", product });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(product => product.id === Number(req.params.id));
    if (productIndex === -1) {
        logger.warn(`Delete failed: Product with ID ${req.params.id} not found`);
        return res.status(404).json({ error: "Product not found" });
    }
    const deletedProduct = products.splice(productIndex, 1);
    logger.info(`Product deleted: ${JSON.stringify(deletedProduct)}`);
    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
});

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
});
