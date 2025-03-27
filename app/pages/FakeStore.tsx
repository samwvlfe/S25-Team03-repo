import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { Link } from 'react-router-dom';


const FakeStore: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:2999/api/fake-store")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);


    // when redeem buttom is pressed, item is added to cart
    const addToCart = (product: Product) => {
        const cartJSON = localStorage.getItem('cart');
        // empty array to add more products to 
        let cart: Product[] = cartJSON ? JSON.parse(cartJSON) : [];
        // add new product
        cart.push(product);
        //save whole cart
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="shopping-cart">
                <Link to="/cart" className="black-link" ><h1>View Cart</h1></Link>
            </div>
            <h1>Redeem Your Points</h1>
            <p>Available Points: <strong>Loading...</strong></p>
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