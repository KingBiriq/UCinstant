"use client";

import { useState } from "react";

export default function Page() {
    const [form, setForm] = useState({
        name: "",
        slug: "",
        game_code: "",
        image: "",
        description: "",
        type: "api",
    });

    async function save() {
        if (!form.name || !form.slug) {
            alert("Fadlan geli name iyo slug.");
            return;
        }

        const payload = {
            ...form,
            // Pack banner and description into the existing description field as JSON to avoid database migration
            description: JSON.stringify({
                text: form.description,
                banner_image: form.banner_image
            })
        };

        const res = await fetch("/api/admin/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Category save failed");
            return;
        }

        alert("Category added!");
        window.location.href = "/admin/landing";
    }

    return (
        <div className="animate-[slideUp_.3s_ease-out] max-w-3xl mx-auto">
            <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b] mb-8">Add Category</h1>

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

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Category Icon URL</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="Square icon URL (e.g. logo.png)"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Banner Image URL</label>
                    <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                        placeholder="Wide banner URL (e.g. banner.png)"
                        value={form.banner_image || ""}
                        onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                    />
                </div>

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
                    </select>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button 
                        onClick={save} 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3.5 font-black tracking-wide text-sm shadow-md shadow-purple-600/20 transition-all"
                    >
                        Save Category
                    </button>
                </div>
            </div>
        </div>
    );
}