import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import DeleteButton from "@/components/DeleteButton";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";

export default async function CategoriesPage() {
    const s = supabaseAdmin();
    const { data } = await s
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Categories</h1>
                    <div className="text-sm font-semibold text-gray-500 mt-1">{(data || []).length} active categories</div>
                </div>

                <Link href="/admin/categories/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition">
                    <Plus size={16} /> Add Category
                </Link>
            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Game Code</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(data || []).map((c: any) => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {c.image ? (
                                                <img src={c.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                            )}
                                            <div className="text-sm font-black text-[#1a2b4b]">{c.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500 font-mono">{c.game_code || "-"}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.type === 'api' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'}`}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link href={`/categories/${c.slug}`} className="text-purple-500 hover:text-purple-700 transition">
                                                <Eye size={16} />
                                            </Link>
                                            <Link href={`/admin/categories/${c.id}/edit`} className="text-blue-500 hover:text-blue-700 transition">
                                                <Edit2 size={16} />
                                            </Link>
                                            <DeleteButton url={`/api/admin/categories/${c.id}`} className="text-red-400 hover:text-red-600 transition">
                                                <Trash2 size={16} />
                                            </DeleteButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
