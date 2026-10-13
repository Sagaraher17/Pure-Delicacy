import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import { foodService } from "../services/foodService";

const EMPTY_FORM = { name: "", category: "Veg", price: "", imglink: "" };

function Menu() {
    const [foods, setFoods] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const fetchFoods = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await foodService.getAll();
            setFoods(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load food items.");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchFoods(); }, [fetchFoods]);

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setEditingId(null);
        setError("");
        setMessage("");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        const name = formData.name.trim();
        const price = Number(formData.price);
        const imglink = formData.imglink.trim();

        if (!name) return setError("Please enter a dish name.");
        if (formData.price === "" || isNaN(price) || price < 0) {
            return setError("Please enter a valid, non-negative price.");
        }
        if (imglink) {
            try {
                const url = new URL(imglink);
                if (!["http:", "https:"].includes(url.protocol)) throw new Error();
            } catch {
                return setError("Please enter a valid HTTP or HTTPS image URL.");
            }
        }
        const payload = { name, category: formData.category, price, imglink };
        setSaving(true);
        try {
            if (editingId !== null) {
                const updated = await foodService.update(editingId, payload);
                setFoods((prev) => prev.map((f) => (String(f.id) === String(editingId) ? updated : f)));
                setMessage("Food item updated successfully.");
            } else {
                const created = await foodService.create(payload);
                setFoods((prev) => [...prev, created]);
                setMessage("Food item added successfully.");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Unable to save the food item.");
        } finally {
            setSaving(false);
        }
    }
    const handleEdit = (food) => {
        setFormData({
            name: food.name || "",
            category: food.category || "Veg",
            price: String(food.price ?? ""),
            imglink: food.imglink || "",
        });
        setEditingId(food.id);
        setError("");
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this food item?")) return;
        setDeletingId(id);
        setError("");
        setMessage("");
        try {
            await foodService.remove(id);
            setFoods((prev) => prev.filter((f) => String(f.id) !== String(id)));
            if (String(editingId) === String(id)) resetForm();
            setMessage("Food item deleted successfully.");
        } catch (err) {
            setError(err.message || "Unable to delete the food item.");
        } finally {
            setDeletingId(null);
        }
    }
    const filteredFoods = foods.filter((f) => {
        const matchesSearch = (f.name || "").toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = categoryFilter === "All" || (f.category || "Other") === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    const isBusy = saving || deletingId !== null;
    return (
        <main className="container py-4 py-md-5">
            {/* Header */}
            <header className="page-header text-center mb-4 mb-md-5">
                <span className="eyebrow">REACT CRUD PROJECT</span>
                <h1 className="display-5 fw-bold mt-2">Pure Delicacy</h1>
                <p className="text-body-secondary mb-0">Add, manage, and discover your favourite dishes.</p>
            </header>
            {/* Form Section */}
            <section className="form-panel mb-5">
                <div className="mb-4">
                    <h2 className="h4 fw-bold">{editingId !== null ? "Update Food Item" : "Add a New Dish"}</h2>
                    <p className="text-body-secondary small mb-0">Enter the details below to manage your menu.</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <Input id="name" label="Dish Name" placeholder="e.g. Paneer Tikka" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange}>
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input id="price" label="Price (₹)" type="number" placeholder="e.g. 249" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input id="imglink" label="Image URL (optional)" type="url" placeholder="https://example.com/food.jpg" value={formData.imglink} onChange={handleChange} />
                        </div>
                        <div className="col-12 d-flex flex-wrap gap-2 mt-4">
                            <Button type="submit" className="btn btn-primary px-4" disabled={saving}>
                                {saving ? "Saving..." : editingId !== null ? "Update Dish" : "Add Dish"}
                            </Button>
                            <Button type="button" className="btn btn-outline-secondary px-4" onClick={resetForm} disabled={saving}>
                                {editingId !== null ? "Cancel Edit" : "Clear Form"}
                            </Button>
                        </div>
                    </div>
                </form>
            </section>

            {/* Menu Exploration Section */}
            <section aria-labelledby="menu-heading">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                    <div>
                        <h2 id="menu-heading" className="h3 fw-bold mb-1">Explore the Menu</h2>
                        <p className="text-body-secondary mb-0">{foods.length} {foods.length === 1 ? "dish" : "dishes"} in your collection</p>
                    </div>
                    <Button className="btn btn-outline-primary" onClick={fetchFoods} disabled={loading}>
                        {loading ? "Loading..." : "Refresh Menu"}
                    </Button>
                </div>

                {/* Filters */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-7">
                        <Input id="search" label="Search dishes" placeholder="Search by dish name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="col-12 col-md-5">
                        <label htmlFor="categoryFilter" className="form-label">Filter by category</label>
                        <select id="categoryFilter" className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Content States */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" />
                        <p className="text-body-secondary">Loading your menu...</p>
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <div className="empty-state text-center py-5">
                        <h3 className="h5">{foods.length === 0 ? "Your menu is empty" : "No matching dishes"}</h3>
                        <p className="text-body-secondary mb-0">{foods.length === 0 ? "Add your first dish using the form above." : "Try another search term or category."}</p>
                    </div>
                ) : (
                    <div className="row g-4 align-items-stretch">
                        {filteredFoods.map((food) => {
                            const isDeleting = String(deletingId) === String(food.id);
                            return (
                                <div className="col-12 col-sm-6 col-lg-4 d-flex" key={food.id}>
                                    <div className="d-flex flex-column w-100">
                                        <div className="flex-grow-1"><Card food={food} /></div>
                                        <div className="d-flex gap-2 mt-3">
                                            <Button className="btn btn-outline-primary flex-fill" onClick={() => handleEdit(food)} disabled={isBusy}>
                                                Edit
                                            </Button>
                                            <Button className="btn btn-outline-danger flex-fill" onClick={() => handleDelete(food.id)} disabled={isBusy}>
                                                {isDeleting ? "Deleting..." : "Delete"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <footer className="text-center mt-5 pt-4 border-top">
                <p className="small text-body-secondary mb-0">Built with React, Bootstrap and JSON Server.</p>
            </footer>
        </main>
    );
}

export default Menu;