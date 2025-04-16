import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';
import { fetchTotalPoints } from "../../backend/api";
import axios from "axios";

const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("none");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [affordableOnly, setAffordableOnly] = useState<boolean>(false);
    const [availablePoints, setAvailablePoints] = useState<number | null>(null);

    useEffect(() => {
        axios.get("http://98.81.104.135:2999/api/fake-store")
          .then(res => setProducts(res.data))
          .catch(err => console.error("Error loading products", err));
      }, []);


    // fetch points
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData && userData.id) {
            fetchTotalPoints(userData.id)
                .then(points => setAvailablePoints(points))
                .catch(error => console.error("Error fetching total points:", error));
        }
    }, []);

    // update cart count 
    useEffect(() => {
        const updateCartCount = () => {
            let total = 0;
            const cartJSON = localStorage.getItem("cart");
            const cartInfo = cartJSON ? JSON.parse(cartJSON) : [];
            if (Array.isArray(cartInfo)) {
                total = cartInfo.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            }
            const cartCountDiv = document.getElementById("insertCartNum");
            if (cartCountDiv) {
                cartCountDiv.innerHTML = total.toString();
            }
        };

        updateCartCount();
    }, []);

    // redeem buttom is pressed, item is added to cart
    const addToCart = (product: Product) => {
        const cartJSON = localStorage.getItem('cart');
        let cart: Product[] = cartJSON ? JSON.parse(cartJSON) : [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        // update the cart count after adding item
        let total = 0;
        if (cart) {
            total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
        const cartCountDiv = document.getElementById("insertCartNum");
        if (cartCountDiv) {
            cartCountDiv.innerHTML = total.toString();
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
            !affordableOnly || (availablePoints !== null && product.PriceInPoints <= availablePoints)
        )
        .sort((a, b) => {
            if (sortOrder === "lowToHigh") return a.PriceInPoints - b.PriceInPoints;
            if (sortOrder === "highToLow") return b.PriceInPoints - a.PriceInPoints;
            return 0;
        });

    return (
        <main>
            <div style={{ textAlign: "center", padding: "20px" }}>
                <div id ="insertCartNum"></div>
                <div className="shopping-cart">
                    <Link to="/cart" className="black-link" ><h1>View Cart</h1></Link>
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
                                <button onClick={() => addToCart(product)}>Add To Cart</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back button */}
                <div className="backButn">
                    <Link to="/menu" className="black-link" >{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
};

export default FakeStore;
