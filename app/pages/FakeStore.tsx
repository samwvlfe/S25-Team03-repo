import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';

const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [userPoints, setUserPoints] = useState<number>(100);
    const [sortOrder, setSortOrder] = useState<string>("none");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [affordableOnly, setAffordableOnly] = useState<boolean>(false);

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

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSortOrder(value);
    };

    const filteredProducts = products
        .filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product =>
            !affordableOnly || product.price <= userPoints
        )
        .sort((a, b) => {
            if (sortOrder === "lowToHigh") return a.price - b.price;
            if (sortOrder === "highToLow") return b.price - a.price;
            return 0;
        });

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Redeem Your Points</h1>
            <p>Available Points: <strong>{userPoints}</strong></p>

            {/* Filters */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "5px", marginRight: "10px" }}
                />

                <label htmlFor="sort" style={{ marginRight: "10px" }}>Sort by price:</label>
                <select id="sort" value={sortOrder} onChange={handleSortChange} style={{ padding: "5px", marginRight: "10px" }}>
                    <option value="none">-- Select --</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={affordableOnly}
                        onChange={(e) => setAffordableOnly(e.target.checked)}
                        style={{ marginRight: "5px" }}
                    />
                    Show affordable only
                </label>
            </div>

            {/* Product Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <img src={product.image} alt={product.title} width="100" height="100" />
                        <h3>{product.title}</h3>
                        <p>Price: {product.price} points</p>
                        <button onClick={() => handleRedeem(product)}>Redeem</button>
                    </div>
                ))}
            </div>

            {/* Back button */}
            <div className="backButn" style={{ marginTop: "20px" }}>
                <Link to="/menu">{"<-- Back"}</Link>
            </div>
        </div>
    );
};

export default FakeStore;
