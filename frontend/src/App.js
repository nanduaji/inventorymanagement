import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [lastProductId,setLastProductId] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts());
  };

  const updateProduct = (id) => {
    const newName = prompt("Enter new name:");
    const newPrice = prompt("Enter new price:");
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, price: Number(newPrice) })
    }).then(() => fetchProducts());
  };
  const addProduct = () => {
    const name = prompt("Enter name:");
    const price = prompt("Enter price:");
    const newId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
    setLastProductId(newId);
    fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId, name, price: Number(price) })
    }).then(() => fetchProducts());
};


  return (
    <div className="container mt-5">
      <h2 className="text-center">Product Management</h2>
      <button className="btn btn-primary my-3" onClick={fetchProducts}>Load Products</button>
      <button className="btn btn-primary m-3" onClick={addProduct}>Add a Product</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => updateProduct(product.id)}>Edit</button>
                <button className="btn btn-danger btn-sm m-2" onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
