import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';


const SponsorCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [companyID, setCompanyID] = useState<number | null>(null);

  // Simulate getting companyID from login/session
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.companyID) {
      setCompanyID(storedUser.companyID);
    }
  }, []);

  useEffect(() => {
    if (!companyID) return;
    axios
      .get(`http://127.0.0.1:2999/api/products?companyID=${companyID}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading catalog", err));
  }, [companyID]);

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`http://127.0.0.1:2999/api/products/${productId}`);
      setProducts(products.filter(p => p.ProductID !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Sponsor Product Catalog</h2>
      {products.map((product) => (
        <div key={product.ProductID} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{product.ProductName}</h3>
          <p>{product.Description}</p>
          <p>Price: {product.PriceInPoints} points</p>
          {product.ImageURL && (
            <img src={product.ImageURL} alt={product.ProductName} width="100" />
          )}
          <br />
          <button onClick={() => handleDelete(product.ProductID)}>Delete</button>
        </div>
      ))}
      {/* Back button */}
      <div className="backButn" style={{ marginTop: "20px" }}>
          <Link to="/menu">{"<-- Back"}</Link>
      </div>
    </div>
  );
};

export default SponsorCatalog;
