
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminProducts.css";
import API_URL from "../apiConfig";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const [images, setImages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem("authToken");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(data);
        } catch {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        setImages([...e.target.files]);
    };

    const resetForm = () => {
        setForm({ name: "", description: "", price: "", stock: "" });
        setImages([]);
        setEditingId(null);
        setMessage("");
        setError("");
    };

    const submitProduct = async (method) => {
        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("stock", form.stock);

            images.forEach((file) => {
                formData.append("images", file);
            });

            const url = editingId
                ? `${API_URL}/admin/products/${editingId}`
                : `${API_URL}/admin/products`;

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error();

            setMessage(
                editingId
                    ? "✅ Product updated successfully"
                    : "✅ Product created successfully"
            );

            resetForm();
            fetchProducts();
        } catch {
            setError("❌ Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        });
        setImages([]);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;

        try {
            await fetch(`${API_URL}/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } catch {
            setError("❌ Failed to delete product");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <AdminLayout>
            <div className="admin-products">
                <h2>Admin – Manage Products</h2>

                {message && <p className="admin-success">{message}</p>}
                {error && <p className="admin-error">{error}</p>}

                <h3>{editingId ? "Edit Product" : "Create Product"}</h3>

                <div className="product-form">
                    <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                    <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                    <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
                    <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />

                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                    />

                    {editingId ? (
                        <>
                            <button onClick={() => submitProduct("PUT")} disabled={submitting}>
                                Save Changes
                            </button>
                            <button onClick={resetForm}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => submitProduct("POST")} disabled={submitting}>
                            Add Product
                        </button>
                    )}
                </div>

                <h3>All Products</h3>

                <table className="admin-table">
                    <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>${p.price}</td>
                            <td>
                                {p.images?.length > 0 && (
                                    <img
                                        src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}${p.images[0]}`}
                                        width="50"
                                        alt={p.name}
                                        style={{ borderRadius: '4px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img"; }}
                                    />
                                )}
                            </td>
                            <td>
                                <button onClick={() => startEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default AdminProducts;



