"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [cats, setCats] = useState<any[]>([]);
    const [apiProducts, setApiProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        active: true,
    });

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch Categories
                const s = supabaseBrowser();
                const { data: catData, error: catError } = await s
                    .from("categories")
                    .select("*")
                    .order("name");

                if (!catError && catData) {
                    setCats(catData);
                }

                // Fetch Product details
                const res = await fetch(`/api/admin/products/${id}`);
                const data = await res.json();

                if (data.success && data.product) {
                    setForm({
                        category_id: data.product.category_id || "",
                        product_type: data.product.product_type || "api",
                        game_code: data.product.game_code || "",
                        catalogue_id: data.product.catalogue_id || "",
                        catalogue_name: data.product.catalogue_name || "",
                        title: data.product.title || "",
                        description: data.product.description || "",
                        image: data.product.image || "",
                        api_price: Number(data.product.api_price || 0),
                        sell_price: Number(data.product.sell_price || 0),
                        active: data.product.active !== false,
                    });

                    // If it's an API product, load API products for the dropdown
                    if (data.product.product_type === "api" && data.product.game_code) {
                        const apiRes = await fetch(`/api/g2bulk/catalogue/${data.product.game_code}`);
                        const apiData = await apiRes.json();
                        setApiProducts(apiData.products || []);
                    }
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    async function chooseCategory(catId: string) {
        const selected = cats.find((c) => c.id === catId);

        setForm((prev: any) => ({
            ...prev,
            category_id: catId,
            game_code: selected?.game_code || "",
            product_type: selected?.type || "api",
            catalogue_id: "",
            catalogue_name: "",
            title: "",
            api_price: 0,
        }));

        if (selected?.type === "api" && selected?.game_code) {
            setLoading(true);
            try {
                const res = await fetch(`/api/g2bulk/catalogue/${selected.game_code}`);
                const data = await res.json();
                setApiProducts(data.products || []);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        } else {
            setApiProducts([]);
        }
    }

    function chooseApiProduct(catlogueId: string) {
        const product = apiProducts.find(
            (p) => String(p.catalogue_id) === String(catlogueId)
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

        const res = await fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) {
            alert(data.message || "Product update failed");
            return;
        }

        alert("Product updated!");
        router.push("/admin/products");
    }

    const profit = Number(form.sell_price || 0) - Number(form.api_price || 0);

    if (loading && !cats.length) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (
        <div className="animate-[slideUp_.3s_ease-out] max-w-4xl mx-auto">
            <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b] mb-8">Edit Product</h1>

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

                <ImageUpload
                    label="Product Image (Optional)"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                />

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

                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={(e) => setForm({ ...form, active: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm font-bold text-[#1a2b4b]">Active Product</span>
                    </label>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button
                        onClick={save}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl py-3.5 font-black tracking-wide text-sm shadow-md shadow-purple-600/20 transition-all"
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
