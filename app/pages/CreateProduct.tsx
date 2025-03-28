import React, { useState } from "react";
import axios from "axios";

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
        title,
        price: parseFloat(price),
        description,
        image,
        category,
      });

      setMessage("✅ Product created successfully!");
      setTitle("");
      setPrice("");
      setDescription("");
      setImage("");
      setCategory("");
    } catch (error) {
      console.error("Product creation failed:", error);
      setMessage("❌ Failed to create product.");
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
    </div>
  );
};

export default CreateProduct;