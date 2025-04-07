import { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [priceInPoints, setPriceInPoints] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:2999/api/products", {
        productName,
        priceInPoints: parseInt(priceInPoints),
        description,
        imageURL
      });

      setMessage("✅ Product added!");
      setProductName("");
      setPriceInPoints("");
      setDescription("");
      setImageURL("");
    } catch (err) {
      setMessage("❌ Error adding product.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "1rem" }}>
      <h2>Create a Product</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={productName} onChange={e => setProductName(e.target.value)} required />
        <input placeholder="Price in Points" type="number" value={priceInPoints} onChange={e => setPriceInPoints(e.target.value)} required />
        <input placeholder="Image URL" value={imageURL} onChange={e => setImageURL(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Add Product</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateProduct;