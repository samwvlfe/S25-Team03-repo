import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";

const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [userPoints, setUserPoints] = useState<number>(100);

    useEffect(() => {
        fetch("http://127.0.0.1:2999/api/fake-store")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    const handleRedeem = (product: Product) => {
        if (userPoints >= product.price) {
            setUserPoints(userPoints - product.price);
            alert(`You redeemed ${product.title} for ${product.price} points!`);
        } else {
            alert("Not enough points!");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Redeem Your Points</h1>
            <p>Available Points: <strong>{userPoints}</strong></p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <img src={product.image} alt={product.title} width="100" height="100" />
                        <h3>{product.title}</h3>
                        <p>Price: {product.price} points</p>
                        <button onClick={() => handleRedeem(product)}>Redeem</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FakeStore;