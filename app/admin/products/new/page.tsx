"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

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

            const { data, error } = await s
                .from("categories")
                .select("*")
                .eq("active", true)
                .order("name");

            if (error) {
                alert(error.message);
                return;
            }

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
        if (!form.category_id) {
            alert("Fadlan dooro category.");
            return;
        }

        if (!form.title) {
            alert("Fadlan geli title.");
            return;
        }

        if (!form.sell_price || Number(form.sell_price) <= 0) {
            alert("Fadlan geli sell price sax ah.");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) {
            alert(data.message || "Product save failed");
            return;
        }

        alert("Product added!");
        window.location.href = "/admin/products";
    }

    const profit =
        Number(form.sell_price || 0) - Number(form.api_price || 0);

    return (
        <div className="animate-[slideUp_.3s_ease-out] max-w-4xl mx-auto">
            <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b] mb-8">Add Product</h1>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 p-8 space-y-6">
                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Category</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
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
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">API Product (G2Bulk)</label>
                        <select
                            className="w-full bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 text-sm font-bold text-purple-900 focus:bg-white focus:border-purple-500 outline-none transition-all"
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
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Product Title</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="e.g. 60 UC"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Image URL</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="https://..."
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Description</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all min-h-24 resize-y"
                        placeholder="Optional description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Buy Price (API)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-gray-500 focus:bg-white focus:border-purple-500 outline-none transition-all"
                                type="number"
                                placeholder="0.00"
                                value={form.api_price}
                                onChange={(e) => setForm({ ...form, api_price: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Sell Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a2b4b] font-bold">$</span>
                            <input
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-black text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                                type="number"
                                placeholder="0.00"
                                value={form.sell_price}
                                onChange={(e) => setForm({ ...form, sell_price: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Profit</label>
                        <div className={`w-full border rounded-xl px-4 py-3 text-sm font-black flex items-center justify-between ${profit >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                            <span>Net Profit</span>
                            <span>${profit.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button
                        onClick={save}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl py-3.5 font-black tracking-wide text-sm shadow-md shadow-purple-600/20 transition-all"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}