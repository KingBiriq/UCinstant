"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [form, setForm] = useState({
        name: "",
        slug: "",
        game_code: "",
        image: "",
        banner_image: "",
        description: "",
        type: "api",
        active: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/admin/categories/${id}`);
                const data = await res.json();
                if (data.success && data.category) {
                    let descText = data.category.description || "";
                    let bannerImage = "";

                    // Try parsing JSON if description contains JSON
                    if (descText.startsWith("{")) {
                        try {
                            const parsed = JSON.parse(descText);
                            descText = parsed.text || "";
                            bannerImage = parsed.banner_image || "";
                        } catch (e) {
                            // fallback
                        }
                    }

                    setForm({
                        name: data.category.name || "",
                        slug: data.category.slug || "",
                        game_code: data.category.game_code || "",
                        image: data.category.image || "",
                        description: descText,
                        banner_image: bannerImage,
                        type: data.category.type || "api",
                        active: data.category.active !== false,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch category", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    async function save() {
        if (!form.name || !form.slug) {
            alert("Fadlan geli name iyo slug.");
            return;
        }

        const payload = {
            ...form,
            // If it's a partner, we use 'manual' type to avoid database check constraint errors
            type: form.type === "partner" ? "manual" : form.type,
            description: JSON.stringify({
                text: form.description,
                banner_image: form.banner_image,
                is_partner: form.type === "partner"
            })
        };

        const res = await fetch(`/api/admin/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Category update failed");
            return;
        }

        alert("Category updated successfully!");
        router.push("/admin/landing");
    }

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (
        <div className="animate-[slideUp_.3s_ease-out] max-w-3xl mx-auto">
            <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b] mb-8">Edit Category</h1>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 p-8 space-y-6">
                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Category Name</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="e.g. PUBG Mobile"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">URL Slug</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="e.g. pubgm, free_fire"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Game Code (G2Bulk API)</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="e.g. pubgm"
                        value={form.game_code}
                        onChange={(e) => setForm({ ...form, game_code: e.target.value })}
                    />
                </div>

                <ImageUpload
                    label="Category Icon (Square)"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                />

                <ImageUpload
                    label="Banner Image (Wide)"
                    value={form.banner_image}
                    onChange={(url) => setForm({ ...form, banner_image: url })}
                />

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Subtitle / Description</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all min-h-24 resize-y"
                        placeholder="e.g. Recharge & Spin UC | Friends Get Free Coupons..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Type</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="api">API Category</option>
                        <option value="manual">Manual Category</option>
                        <option value="partner">Payment Partner</option>
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={(e) => setForm({ ...form, active: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm font-bold text-[#1a2b4b]">Active Category</span>
                    </label>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button 
                        onClick={save} 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3.5 font-black tracking-wide text-sm shadow-md shadow-purple-600/20 transition-all"
                    >
                        Update Category
                    </button>
                </div>
            </div>
        </div>
    );
}
