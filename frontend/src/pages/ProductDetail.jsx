import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ProductDetail.css';
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
        if (!id || id === "undefined") return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
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

    if (loading) return <div className="loader">Loading product...</div>;

    if (!product) {
        return (
            <div className="error-container">
                <p>Product not found</p>
                <Link replace to="/products" className="back-link">Back to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="product-page-container">
            <div className="product-detail">
                <div className="product-image-section">
                    {product.images && product.images.length > 0 ? (


                                <img
                                    src={product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`}
                                    alt={product.name}
                                    className="placeholder-img"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Image+Not+Found'; }}
                                />

                    ) : (
                        <div className="placeholder-img">No image available</div>
                    )}
                </div>

                <div className="product-info-section">
                    <div className="info-header">
                        <h2>{product.name}</h2>
                        <div className="price-tag">${product.price}</div>
                    </div>

                    <p className="description">{product.description}</p>

                    <div className="action-area">
                        <button onClick={handleAddToCart} className="add-to-cart-btn">
                            Add to Cart
                        </button>
                        <div className="secondary-actions">
                            <Link to="/cart" className="nav-btn cart-link">View Cart</Link>
                            <Link to="/products" className="nav-btn back-link">Catalog</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;