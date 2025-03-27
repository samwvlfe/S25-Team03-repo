import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/Product";


// Extend the Product type to include quantity.
interface AggregatedCartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [aggregatedCart, setAggregatedCart] = useState<AggregatedCartItem[]>([]);

  useEffect(() => {
    // Get the cart items from local storage.
    const cartJSON = localStorage.getItem("cart");
    if (cartJSON) {
        const cart: Product[] = JSON.parse(cartJSON);
        const aggregated = cart.reduce((acc: { [key: number]: AggregatedCartItem }, item) => {
            if (acc[item.id]) {
                acc[item.id].quantity += 1;
            }
            else {
                acc[item.id] = { ...item, quantity: 1 };
            }
            return acc;
        }, {});

        // Convert the aggregated object into an array.
        setAggregatedCart(Object.values(aggregated));
    }
  }, []);

  // Update localStorage whenever the aggregatedCart is modified.
  const updateCartStorage = (updatedCart: AggregatedCartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (index: number) => {
    const updatedCart = [...aggregatedCart];
    updatedCart[index].quantity += 1;
    setAggregatedCart(updatedCart);
    updateCartStorage(updatedCart);
  };

  const decreaseQuantity = (index: number) => {
    const updatedCart = [...aggregatedCart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setAggregatedCart(updatedCart);
    updateCartStorage(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = [...aggregatedCart];
    updatedCart.splice(index, 1);
    setAggregatedCart(updatedCart);
    updateCartStorage(updatedCart);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Shopping Cart</h1>
      {aggregatedCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedCart.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td style={{ padding: "10px" }}>{item.title}</td>
                <td style={{ padding: "10px" }}>{item.price} points</td>
                <td style={{ padding: "10px" }}>{item.quantity}</td>
                <td style={{ padding: "10px" }}>
                  <button onClick={() => increaseQuantity(index)}>+</button>
                  <button onClick={() => decreaseQuantity(index)}>-</button>
                  <button onClick={() => removeItem(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="backButn">
        <Link to="/menu" className="black-link">Back to Menu</Link>
      </div>
      <div className="back-to-store">
        <Link to="/fake-store" className="black-link">Back to Store</Link>
      </div>
    </div>
  );
};

export default Cart;
