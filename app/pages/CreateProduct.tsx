import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


const CreateProduct: React.FC = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://127.0.0.1:2999/api/create-product", {
        productName: title,
        priceInPoints: parseInt(price),
        description,
        imageURL: image,
        //companyID: 3 
      });
  
      setMessage("✅ Product created!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error creating product.");
    }
  };
  

  return (
    <main>
      <div className="account-form">
        <h2>Create New Product</h2>
        <form className="application-form" onSubmit={handleSubmit}>
          <label>Product Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <label>Price:</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" required />
          <label>Description:</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
          <label>Image URL:</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
          <label>Category:</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
          <input value="Create Product" type="submit" />
        </form>
        <p>{message}</p>
            {/* Back button */}
        <div className="backButn" style={{ marginTop: "20px" }}>
          <Link to="/menu">{"<-- Back"}</Link>
        </div>
      </div>
    </main>
  );
};

export default CreateProduct;