import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';
import { fetchTotalPoints } from "../../backend/api";
import axios from "axios";

const FakeStore: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("none");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [affordableOnly, setAffordableOnly] = useState<boolean>(false);
    const [availablePoints, setAvailablePoints] = useState<number | null>(null);

    // Fetch both API and local DB products
    useEffect(() => {
        axios.get("http://localhost:2999/api/fake-store")
            .then(res => {
                const seen = new Set<string>();
                const deduped = res.data.filter((product: Product) => {
                    const key = `${product.ProductName}-${product.PriceInPoints}-${product.ImageURL}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
                setAllProducts(deduped);
            })
            .catch(err => console.error("Error loading products", err));
    }, []);

    // Fetch user points
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData && userData.id) {
            fetchTotalPoints(userData.id)
                .then(points => setAvailablePoints(points))
                .catch(error => console.error("Error fetching total points:", error));
        }
    }, []);

    // Update cart count on mount
    useEffect(() => {
        const updateCartCount = () => {
            const cartJSON = localStorage.getItem("cart");
            const cartInfo = cartJSON ? JSON.parse(cartJSON) : [];
            const total = cartInfo.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            const cartCountDiv = document.getElementById("insertCartNum");
            if (cartCountDiv) cartCountDiv.innerHTML = total.toString();
        };
        updateCartCount();
    }, []);

    // Update filtered products on filter/sort change
    useEffect(() => {
        let updated = [...allProducts];

        if (searchTerm.trim()) {
            updated = updated.filter(p =>
                p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (affordableOnly && availablePoints !== null) {
            updated = updated.filter(p => p.PriceInPoints <= availablePoints);
        }

        if (sortOrder === "lowToHigh") {
            updated.sort((a, b) => a.PriceInPoints - b.PriceInPoints);
        } else if (sortOrder === "highToLow") {
            updated.sort((a, b) => b.PriceInPoints - a.PriceInPoints);
        }

        setFilteredProducts(updated);
    }, [allProducts, searchTerm, sortOrder, affordableOnly, availablePoints]);

    const addToCart = (product: Product) => {
        const cartJSON = localStorage.getItem('cart');
        const cart: Product[] = cartJSON ? JSON.parse(cartJSON) : [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));

        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountDiv = document.getElementById("insertCartNum");
        if (cartCountDiv) cartCountDiv.innerHTML = total.toString();
    };

    return (
        <main>
            <div style={{ textAlign: "center", padding: "20px" }}>
                <div id="insertCartNum"></div>
                <div className="shopping-cart">
                    <Link to="/cart" className="black-link"><h1>View Cart</h1></Link>
                </div>
                <h1>Redeem Your Points</h1>
                <p>Available Points: <strong>{availablePoints !== null ? availablePoints : "Loading..."}</strong></p>

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
                    <select
                        id="sort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{ padding: "5px", marginRight: "10px" }}
                    >
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
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={`${product.ProductName}-${product.PriceInPoints}-${product.ImageURL}`}>
                            <img src={product.ImageURL} alt={product.ProductName} width="100" height="100" />
                            <h3>{product.ProductName}</h3>
                            <p>Price: {product.PriceInPoints} points</p>
                            <button onClick={() => addToCart(product)}>Add To Cart</button>
                        </div>
                    ))}
                </div>

                <div className="backButn">
                    <Link to="/menu" className="black-link">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
};

export default FakeStore;
