const express = require('express');
const app = express();
const PORT = 3001;


app.use(express.json());


app.get('/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 999 },
        { id: 2, name: 'Smartphone', price: 699 },
        { id: 3, name: 'Headphones', price: 199 },
        { id: 4, name: 'Keyboard', price: 49 },
        { id: 5, name: 'Mouse', price: 29 }
    ];
    res.json(products);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

