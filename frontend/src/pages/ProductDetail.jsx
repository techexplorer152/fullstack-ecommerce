import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ProductDetail.css'
import API_URL from "../apiConfig";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];


        const productToSave = {
            ...product,

            displayImage: product.images && product.images.length > 0
                ? `${API_URL}${product.images[0]}`
                : null
        };

        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...productToSave, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (!product) {
        return <p>Product not found</p>;
    }

    return (
        <div className="product-detail">

            {product.images && product.images.length > 0 ? (
                <div className="product-detail-image">
                    <img
                        src={`${API_URL}${product.images[0]}`}
                        alt={product.name}
                    />
                </div>
            ) : (
                <div className="placeholder-img">No image available</div>
            )}

            <div className="product-info">
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>
                <p className="price"><strong>Price:</strong> ${product.price}</p>

                <div className="cart-buttons">
                    <button onClick={handleAddToCart} className="Add-to-cart">
                        Add to Cart
                    </button>
                    <div className="navigation-links">
                        <Link to="/cart" className="go-to-cart-btn">Go to Cart</Link>
                        <Link to="/products" className="back-to-products-btn">← Back to Products</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;