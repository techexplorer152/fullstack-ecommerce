import React, { useEffect, useState } from "react";
import API_URL from "../apiConfig";
import "./Checkout.css";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);

        const totalPrice = savedCart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setTotal(totalPrice);
    }, []);

    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cartItems }),
            });

            if (!response.ok) {
                throw new Error("Failed to place order");
            }

            const data = await response.json();
            alert(`Order confirmed! Order ID: ${data.orderId}`);

            localStorage.removeItem("cart");
            setCartItems([]);
            setTotal(0);
        } catch (error) {
            console.error(error);
            alert("Something went wrong while placing your order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            <div className="checkout-section">
                <h3>Order Summary</h3>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul className="order-summary">
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                {item.name} x {item.quantity} — $
                                {(item.price * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}
                <h4>Total: ${total.toFixed(2)}</h4>
            </div>

            <div className="checkout-section">
                <h3>Shipping Address</h3>
                <input type="text" placeholder="Full Name" />
                <input type="text" placeholder="Address" />
                <input type="text" placeholder="City" />
                <input type="text" placeholder="Postal Code" />
            </div>

            <div className="checkout-section">
                <h3>Payment Info</h3>
                <input type="text" placeholder="Card Number" />
                <input type="text" placeholder="Expiration Date" />
                <input type="text" placeholder="CVV" />
            </div>

            <button className="confirm-btn" onClick={handleConfirmOrder} disabled={loading}>
                {loading ? "Placing Order..." : "Confirm Order"}
            </button>
        </div>
    );
}

export default Checkout;
