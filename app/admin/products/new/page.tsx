"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";

export default function Page() {
    const [cats, setCats] = useState<any[]>([]);
    const [apiProducts, setApiProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<any>({
        category_id: "",
        product_type: "api",
        game_code: "",
        catalogue_id: "",
        catalogue_name: "",
        title: "",
        description: "",
        image: "",
        api_price: 0,
        sell_price: 0,
    });

    useEffect(() => {
        async function loadCategories() {
            const s = supabaseBrowser();
            const { data } = await s
                .from("categories")
                .select("*")
                .eq("active", true)
                .order("name");

            setCats(data || []);
        }

        loadCategories();
    }, []);

    async function chooseCategory(id: string) {
        const selected = cats.find((c) => c.id === id);

        setForm((prev: any) => ({
            ...prev,
            category_id: id,
            game_code: selected?.game_code || "",
            product_type: selected?.type || "api",
            catalogue_id: "",
            catalogue_name: "",
            title: "",
            api_price: 0,
        }));

        if (selected?.type === "api" && selected?.game_code) {
            setLoading(true);
            const res = await fetch(`/api/g2bulk/catalogue/${selected.game_code}`);
            const data = await res.json();
            setApiProducts(data.products || []);
            setLoading(false);
        } else {
            setApiProducts([]);
        }
    }

    function chooseApiProduct(id: string) {
        const product = apiProducts.find(
            (p) => String(p.catalogue_id) === String(id)
        );

        if (!product) return;

        setForm((prev: any) => ({
            ...prev,
            catalogue_id: String(product.catalogue_id),
            catalogue_name: product.catalogue_name,
            title: product.catalogue_name,
            api_price: Number(product.api_price || 0),
        }));
    }

    async function save() {
        if (!form.category_id) return alert("Fadlan dooro category.");
        if (!form.title) return alert("Fadlan geli title.");
        if (!form.sell_price || Number(form.sell_price) <= 0) {
            return alert("Fadlan geli sell price sax ah.");
        }

        setLoading(true);

        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) return alert(data.message || "Product save failed");

        alert("Product added!");
        window.location.href = "/admin/products";
    }

    const profit = Number(form.sell_price || 0) - Number(form.api_price || 0);

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-[28px] font-black text-[#1a2b4b]">
                Add Product
            </h1>

            <div className="space-y-6 rounded-[1.5rem] border border-gray-50 bg-white p-8 shadow-sm">
                <div>
                    <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                        Category
                    </label>
                    <select
                        className="input"
                        value={form.category_id}
                        onChange={(e) => chooseCategory(e.target.value)}
                    >
                        <option value="">Choose Category...</option>
                        {cats.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.type}) — {c.game_code || "manual"}
                            </option>
                        ))}
                    </select>
                </div>

                {apiProducts.length > 0 && (
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                            API Product
                        </label>
                        <select
                            className="input"
                            value={form.catalogue_id}
                            onChange={(e) => chooseApiProduct(e.target.value)}
                        >
                            <option value="">Choose API Product...</option>
                            {apiProducts.map((p) => (
                                <option key={p.catalogue_id} value={p.catalogue_id}>
                                    {p.catalogue_name} | ID {p.catalogue_id} | API ${p.api_price}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                        Product Title
                    </label>
                    <input
                        className="input"
                        placeholder="e.g. 60 UC"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <ImageUpload
                    label="Product Image (Optional)"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                />

                <div>
                    <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                        Description
                    </label>
                    <textarea
                        className="input min-h-24"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <input
                        className="input"
                        type="number"
                        placeholder="API Price"
                        value={form.api_price}
                        onChange={(e) =>
                            setForm({ ...form, api_price: Number(e.target.value) })
                        }
                    />

                    <input
                        className="input"
                        type="number"
                        placeholder="Sell Price"
                        value={form.sell_price}
                        onChange={(e) =>
                            setForm({ ...form, sell_price: Number(e.target.value) })
                        }
                    />

                    <div className="rounded-xl bg-emerald-50 px-4 py-3 font-black text-emerald-600">
                        Profit ${profit.toFixed(2)}
                    </div>
                </div>

                <button onClick={save} disabled={loading} className="btn w-full">
                    {loading ? "Saving..." : "Save Product"}
                </button>
            </div>
        </div>
    );
}