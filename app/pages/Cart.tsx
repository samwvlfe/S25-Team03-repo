import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/Product";
import { fetchTotalPoints } from "../../backend/api";
import { Message } from "@aws-amplify/ui-react";


// Extend the Product type to include quantity.
interface AggregatedCartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [aggregatedCart, setAggregatedCart] = useState<AggregatedCartItem[]>([]);
  const [availablePoints, setAvailablePoints] = useState<number | null>(null);

  useEffect(() => {
    // Get the cart items from local storage.
    const cartJSON = localStorage.getItem("cart");
    if (cartJSON) {
        const cart: Product[] = JSON.parse(cartJSON);
        const aggregated = cart.reduce((acc: { [key: number]: AggregatedCartItem }, item) => {
            if (acc[item.ProductID]) {
                acc[item.ProductID].quantity += 1;
            }
            else {
                acc[item.ProductID] = { ...item, quantity: 1 };
            }
            return acc;
        }, {});

        // Convert the aggregated object into an array.
        setAggregatedCart(Object.values(aggregated));
    }
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
    } 
    else {
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

  const totalPrice = aggregatedCart.reduce(
    (sum, item) => sum + item.PriceInPoints * item.quantity,
    0
  );

  // BE SURE TO ROUND THE PRICE UP OR DOWN TO WHOLE NUMBER
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const submitTotalPrice = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const driverID = userData.id;
      const priceRounded = Math.ceil(totalPrice);
      const orderItems = aggregatedCart.map(item => item.ProductName).join(', ');

      //make sure user has enough points
      if(((availablePoints !== null ? availablePoints : 0) - priceRounded) < 0){
        window.alert("Not Enough Points!");
        return -1;
      }
      // Replace with your actual API endpoint.
      const response = await fetch("https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          u_DriverID: driverID,
          u_CartPrice: priceRounded,
          uOrder: orderItems
         }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Purchase submitted successfully:", data);
      window.alert("Thank you for your purchase!");
      // Empty the cart when purchase is successful.
      setAggregatedCart([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error submitting purchase:", error);
    }
  };


  return (
    <div style={{ padding: "40px" }}>
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
              <tr key={item.ProductID}>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <img
                    src={item.ImageURL}
                    alt={item.ProductName}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td style={{ padding: "10px" }}>{item.ProductName}</td>
                <td style={{ padding: "10px" }}>{item.PriceInPoints} points</td>
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

      {/* Buy button */}
      <div className="buy-BTN">
        <button onClick={submitTotalPrice}>PURCHASE</button>
      </div>
      

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
