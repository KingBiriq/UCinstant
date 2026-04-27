"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === "all" || p.category_id === activeCategory;
        const matchesSearch = (p.title || p.catalogue_name || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const allCount = products.length;

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Products</h1>
                    <div className="text-sm font-semibold text-gray-500 mt-1">{allCount} products across {categories.length} categories</div>
                </div>

                <Link href="/admin/products/new" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-600/20 transition">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {/* ── CATEGORY TABS ── */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button 
                    onClick={() => setActiveCategory("all")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest transition-all ${
                        activeCategory === "all" ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                    }`}
                >
                    ALL <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === "all" ? "bg-white/20" : "bg-gray-100"}`}>{allCount}</span>
                </button>
                
                {categories.map(cat => {
                    const count = products.filter(p => p.category_id === cat.id).length;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                isActive ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                            }`}
                        >
                            {cat.image_url ? (
                                <img src={cat.image_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                            ) : null}
                            {cat.name} <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>
                        </button>
                    )
                })}

                <Link 
                    href="/admin/categories/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-white text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 hover:border-gray-300 transition-all"
                >
                    <Plus size={12} /> New Category
                </Link>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="bg-white rounded-[1.5rem] p-4 border border-gray-50 flex items-center gap-3 mb-6 shadow-sm">
                <Search size={18} className="text-gray-400 ml-2" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." 
                    className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder-gray-400"
                />
            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cost</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profit</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p: any) => {
                                const buyPrice = Number(p.api_price || p.buy_price || 0);
                                const sellPrice = Number(p.sell_price || 0);
                                const profit = sellPrice - buyPrice;
                                const isProfitable = profit >= 0;

                                return (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                            )}
                                            <div>
                                                <div className="text-sm font-black text-[#1a2b4b]">{p.title || p.catalogue_name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 mt-1">{p.game_code || "-"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-500">0</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-gray-500">${buyPrice.toFixed(2)}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">${sellPrice.toFixed(2)}</td>
                                    <td className="px-6 py-5">
                                        <div className={`text-sm font-black ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>${profit.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link href={`/checkout/${p.id}`} className="text-purple-500 hover:text-purple-700 transition">
                                                <Eye size={16} />
                                            </Link>
                                            <Link href={`/admin/products/${p.id}/edit`} className="text-blue-500 hover:text-blue-700 transition">
                                                <Edit2 size={16} />
                                            </Link>
                                            <div className="text-red-400 hover:text-red-600 transition cursor-pointer">
                                                <DeleteButton url={`/api/admin/products/${p.id}`} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-bold text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
