"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function EditBannerPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        game_code: "linear-gradient(to right, #3b82f6, #8b5cf6)",
        image: "",
        subtitle: "",
        link: "",
        sort_order: 0,
        active: true,
    });

    const colors = [
        "linear-gradient(to right, #8b5cf6, #ec4899)",
        "linear-gradient(to right, #f97316, #facc15)",
        "linear-gradient(to right, #0ea5e9, #38bdf8)",
        "linear-gradient(to right, #10b981, #34d399)",
        "linear-gradient(to right, #f43f5e, #fb7185)",
        "linear-gradient(to right, #3b82f6, #60a5fa)",
        "#ec4899",
        "#1f2937",
    ];

    useEffect(() => {
        async function fetchBanner() {
            try {
                const res = await fetch(`/api/admin/categories/${id}`);
                const data = await res.json();
                if (data.success && data.category) {
                    let subtitle = "";
                    let link = "";
                    try {
                        if (data.category.description?.startsWith("{")) {
                            const p = JSON.parse(data.category.description);
                            subtitle = p.subtitle || "";
                            link = p.link || "";
                        }
                    } catch(e) {}

                    setForm({
                        name: data.category.name || "",
                        game_code: data.category.game_code || "linear-gradient(to right, #3b82f6, #8b5cf6)",
                        image: data.category.image || "",
                        subtitle,
                        link,
                        sort_order: data.category.sort_order || 0,
                        active: data.category.active !== false,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch banner", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBanner();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload = {
            name: form.name,
            game_code: form.game_code,
            image: form.image,
            sort_order: form.sort_order,
            active: form.active,
            description: JSON.stringify({
                is_banner: true,
                subtitle: form.subtitle,
                link: form.link
            })
        };

        const res = await fetch(`/api/admin/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        setSaving(false);

        if (data.success) {
            alert("Banner updated successfully!");
            router.push("/admin/landing?tab=banners");
        } else {
            alert(data.message || "Failed to update banner");
        }
    }

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading banner...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto animate-[slideUp_.3s_ease-out]">
            <Link href="/admin/landing?tab=banners" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1a2b4b] mb-6 transition">
                <ArrowLeft size={16} /> Back to Banners
            </Link>

            <div className="mb-6">
                <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Edit Banner</h1>
                <p className="text-sm font-bold text-gray-400 mt-1">Update banner information</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                
                {/* Background Image */}
                <ImageUpload
                    label="Background Image (Optional)"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                />

                {/* Background Colors */}
                <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Background Color</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setForm({ ...form, game_code: c })}
                                className={`w-12 h-12 rounded-xl border-2 transition-transform ${form.game_code === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ background: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Title</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                            placeholder="e.g. Diamonds & UC"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Subtitle</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                            placeholder="e.g. Sida Ugu Dhaqsiyaha Badan"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Link URL</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                            placeholder="https://..."
                            value={form.link}
                            onChange={(e) => setForm({ ...form, link: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Sort Order</label>
                        <input
                            type="number"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-purple-500 outline-none transition-all"
                            value={form.sort_order}
                            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <div className="font-bold text-[#1a2b4b] text-sm">Active</div>
                        <div className="text-xs text-gray-500">Show this banner in the public slider</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={form.active}
                            onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                    </label>
                </div>

                <button
                    disabled={saving}
                    type="submit"
                    className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-[0.98] disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
