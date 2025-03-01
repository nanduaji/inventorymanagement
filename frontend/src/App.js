import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [lastProductId, setLastProductId] = useState(0);
  const [currentProduct, setCurrentProduct] = useState({ id: "", name: "", price: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:3001/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) {
          const maxId = Math.max(...data.map((product) => product.id));
          setLastProductId(maxId);
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching products!");
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" })
        .then(() => {
          fetchProducts();
          toast.success("Product deleted successfully!");
        })
        .catch((error) => {
          toast.error("Failed to delete product!");
          console.error("Error deleting product:", error);
        });
    }
  };

  const openModal = (product = { id: "", name: "", price: "" }) => {
    setCurrentProduct(product);
    setEditMode(!!product.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, price } = currentProduct;

    if (!name || !price || isNaN(price)) {
      toast.warning("Please enter a valid name and numeric price!");
      return;
    }

    const newId = editMode ? id : lastProductId + 1;

    const url = editMode ? `http://localhost:3001/products/${id}` : "http://localhost:3001/products";
    const method = editMode ? "PATCH" : "POST";
    const successMessage = editMode ? "Product updated successfully!" : "Product added successfully!";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newId, name, price: Number(price) }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchProducts();
        setShowModal(false);
        setLastProductId(newId);
        toast.success(successMessage);
      })
      .catch((error) => {
        toast.error("Error saving product!");
        console.error("Error saving product:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Product Management</h2>
      <button className="btn btn-primary my-3" onClick={fetchProducts}>
        Load Products
      </button>
      <button className="btn btn-success m-3" onClick={() => openModal()}>
        Add a Product
      </button>

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
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
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td >
                    <button className="btn btn-warning btn-sm" onClick={() => openModal(product)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm m-2" onClick={() => deleteProduct(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editMode ? "Edit Product" : "Add Product"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentProduct.name}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          id: editMode ? currentProduct.id : lastProductId + 1,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentProduct.price}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          id: editMode ? currentProduct.id : lastProductId + 1,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Update" : "Add"} Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
