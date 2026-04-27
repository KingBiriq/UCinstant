import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import DeleteButton from "@/components/DeleteButton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default async function LandingManagerPage({ searchParams }: { searchParams: { tab?: string } }) {
    const tab = searchParams.tab || "categories";
    const s = supabaseAdmin();

    const { data } = await s
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

    const isBanner = (c: any) => c.description?.includes('"is_banner":true') || c.type === 'banner';
    const categories = (data || []).filter(c => !isBanner(c));
    const banners = (data || []).filter(c => isBanner(c)).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    return (
        <div className="animate-[slideUp_.3s_ease-out] max-w-5xl mx-auto">
            {/* ── HEADER ── */}
            <div className="mb-6">
                <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Landing Page Manager</h1>
                <p className="text-sm font-semibold text-gray-500 mt-1">Manage your website content</p>
            </div>

            {/* ── TABS ── */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
                <Link href="?tab=categories" className={`${tab === 'categories' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'} px-6 py-2.5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-colors`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Categories
                </Link>
                <button className="text-gray-400 font-bold text-sm flex items-center gap-2 pb-2.5 px-2 cursor-not-allowed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    Posts
                </button>
                <button className="text-gray-400 font-bold text-sm flex items-center gap-2 pb-2.5 px-2 cursor-not-allowed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    Pages
                </button>
                <Link href="?tab=banners" className={`${tab === 'banners' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'} px-6 py-2.5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-colors`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Banners
                </Link>
            </div>

            {/* ── CONTENT ── */}
            {tab === 'categories' && (
                <>
                    <div className="flex justify-end mb-4">
                        <Link href="/admin/categories/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition">
                            <Plus size={16} /> Add Category
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {categories.map((c: any) => {
                            let descText = c.description || "No description";
                            if (descText.startsWith("{")) {
                                try {
                                    const parsed = JSON.parse(descText);
                                    descText = parsed.text || "No description";
                                } catch (e) {}
                            }

                            return (
                                <div key={c.id} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition">
                                    <div>
                                        <h3 className="text-[13px] font-black text-[#1a2b4b] uppercase tracking-wider">{c.name}</h3>
                                        <p className="text-[11px] text-gray-400 font-bold mt-1 max-w-md truncate">{descText}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 ml-4">
                                        <Link href={`/admin/categories/${c.id}/edit`} className="text-blue-500 hover:text-blue-700 transition">
                                            <Edit2 size={16} />
                                        </Link>
                                        <DeleteButton url={`/api/admin/categories/${c.id}`} className="text-red-400 hover:text-red-600 transition">
                                            <Trash2 size={16} />
                                        </DeleteButton>
                                    </div>
                                </div>
                            );
                        })}
                        {categories.length === 0 && (
                            <div className="p-8 text-center text-gray-400 font-bold text-sm">
                                No categories found.
                            </div>
                        )}
                    </div>
                </>
            )}

            {tab === 'banners' && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-black text-[#1a2b4b]">Slider Banners</h2>
                            <p className="text-xs font-bold text-gray-400">{banners.length} banners — ordered by sort order</p>
                        </div>
                        <Link href="/admin/landing/banners/new" className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 transition">
                            <Plus size={16} /> Add Banner
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {banners.map((b: any) => {
                            let link = "";
                            let bg_color = b.game_code || "linear-gradient(to right, #3b82f6, #8b5cf6)";
                            try {
                                if (b.description?.startsWith("{")) {
                                    const p = JSON.parse(b.description);
                                    link = p.link || "";
                                }
                            } catch (e) {}

                            return (
                                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                    <div 
                                        className="h-24 md:h-32 w-full flex flex-col items-center justify-center relative bg-cover bg-center"
                                        style={{ background: b.image ? `url(${b.image}) center/cover` : bg_color }}
                                    >
                                        <div className="absolute inset-0 bg-black/20" />
                                        <h3 className="relative z-10 text-white font-black text-xl tracking-wide drop-shadow-md">{b.name || "Untitled"}</h3>
                                    </div>
                                    <div className="p-4 flex items-center justify-between bg-white">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${b.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {b.active ? "Active" : "Inactive"}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold truncate max-w-[200px] md:max-w-md">{link || "No link"}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Link href={`/admin/landing/banners/${b.id}/edit`} className="text-purple-500 hover:text-purple-700 transition">
                                                <Edit2 size={16} />
                                            </Link>
                                            <DeleteButton url={`/api/admin/categories/${b.id}`} className="text-red-400 hover:text-red-600 transition">
                                                <Trash2 size={16} />
                                            </DeleteButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {banners.length === 0 && (
                            <div className="p-8 text-center text-gray-400 font-bold text-sm bg-white rounded-2xl border border-gray-100">
                                No banners found. Create one to show on the landing page!
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
