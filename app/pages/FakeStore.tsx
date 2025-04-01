import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';
import axios from "axios";

const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [userPoints, setUserPoints] = useState<number>(100);
    const [sortOrder, setSortOrder] = useState<string>("none");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [affordableOnly, setAffordableOnly] = useState<boolean>(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:2999/api/products")
          .then(res => setProducts(res.data))
          .catch(err => console.error("Error loading products", err));
      }, []);

    const handleRedeem = (product: Product) => {
        if (userPoints >= product.PriceInPoints) {
            setUserPoints(userPoints - product.PriceInPoints);
            alert(`You redeemed ${product.ProductName} for ${product.PriceInPoints} points!`);
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
            product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product =>
            !affordableOnly || product.PriceInPoints <= userPoints
        )
        .sort((a, b) => {
            if (sortOrder === "lowToHigh") return a.PriceInPoints - b.PriceInPoints;
            if (sortOrder === "highToLow") return b.PriceInPoints - a.PriceInPoints;
            return 0;
        });

    return (
        <main>
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

                    {/* Product Grid */}
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product.ProductID}>
                                <img src={product.ImageURL} alt={product.ProductName} width="100" height="100" />
                                <h3>{product.ProductName}</h3>
                                <p>Price: {product.PriceInPoints} points</p>
                                <button onClick={() => handleRedeem(product)}>Redeem</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back button */}
                <div className="backButn" style={{ marginTop: "20px" }}>
                    <Link to="/menu">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
};

export default FakeStore;
