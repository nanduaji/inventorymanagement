const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

let products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Smartphone', price: 699 },
    { id: 3, name: 'Headphones', price: 199 },
    { id: 4, name: 'Keyboard', price: 49 },
    { id: 5, name: 'Mouse', price: 29 }
];

// Get all products
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(product => product.id === Number(req.params.id));
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
});

// Add a new product
app.post('/products', (req, res) => {
    const { id, name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
    }
    const newProduct = { id, name, price };
    products.push(newProduct);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// Update a product
app.patch('/products/:id', (req, res) => {
    const product = products.find(product => product.id === Number(req.params.id));
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    Object.assign(product, req.body);
    res.status(200).json({ message: "Product updated successfully", product });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(product => product.id === Number(req.params.id));
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }
    const deletedProduct = products.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
