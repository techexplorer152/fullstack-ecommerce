import { useState, useEffect } from "react";
import "./Cart.css";
import API_URL from "../apiConfig";

const API_URL = API_URL;

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
        calculateTotal(cart);
    }, []);

    const calculateTotal = (cart) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleRemove = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setMessage("❌ You must be logged in to place an order.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cartItems }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Order placed successfully!");
                localStorage.removeItem("cart");
                setCartItems([]);
                setTotalPrice(0);
            } else {
                setMessage(data.message || "❌ Failed to place order");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error placing order");
        }
    };

    return (
        <section className="cart-section">
            <div className="cart-container">
                <h2>Your Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <div className="empty-cart-container">
                        <p className="empty-cart">Your cart is currently empty.</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">

                                    <div className="cart-item-image-wrapper">
                                        {item.displayImage ? (
                                            <img
                                                src={item.displayImage}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                        ) : item.images && item.images.length > 0 ? (
                                            <img
                                                src={`${API_URL}${item.images[0]}`}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                        ) : (
                                            <div className="cart-no-image">No Image</div>
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-price">
                                            ${Number(item.price).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Total: ${totalPrice.toFixed(2)}</h3>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Confirm & Place Order
                            </button>
                        </div>
                    </>
                )}

                {message && <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </section>
    );
}

export default Cart;