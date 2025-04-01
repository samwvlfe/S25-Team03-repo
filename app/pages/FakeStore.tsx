import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';
import { fetchTotalPoints } from "../../backend/api";

const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [availablePoints, setAvailablePoints] = useState<number | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:2999/api/fake-store")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
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

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <div id ="insertCartNum"></div>
            <div className="shopping-cart">
                <Link to="/cart" className="black-link" ><h1>View Cart</h1></Link>
            </div>
            <h1>Redeem Your Points</h1>
            {/* // POINTS HERE */}
            <p>Available Points: <strong>{availablePoints !== null ? availablePoints : "Loading..."}</strong></p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <img src={product.image} alt={product.title} width="100" height="100" />
                        <h3>{product.title}</h3>
                        <p>Price: {product.price} points</p>
                        <button onClick={() => addToCart(product)}>Add To Cart</button>
                    </div>
                ))}
            </div>
            {/* back to menu button */}
            <div className="backButn">
                <Link to="/menu" className="black-link" >{"<-- Back"}</Link>
            </div>
        </div>
    );
};

export default FakeStore;