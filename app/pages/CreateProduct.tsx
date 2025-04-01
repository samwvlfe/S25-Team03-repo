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
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem" }}>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <button type="submit">Create Product</button>
      </form>
      <p>{message}</p>
          {/* Back button */}
      <div className="backButn" style={{ marginTop: "20px" }}>
        <Link to="/menu">{"<-- Back"}</Link>
      </div>
    </div>
  );
};

export default CreateProduct;