import { supabaseAdmin } from "@/lib/supabase";
import { Search, Plus, Eye, Trash2 } from "lucide-react";

export default async function OrdersPage() {
    const s = supabaseAdmin();
    const { data: orders } = await s.from("orders").select("*, products(title)").order("created_at", { ascending: false }).limit(100);

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Orders</h1>
                    <div className="text-sm font-semibold text-gray-500 mt-1">{(orders || []).length} recent orders</div>
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Player</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(orders || []).map((o: any) => (
                                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-xs font-bold text-gray-400">#{o.id.slice(0, 4)}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">{o.phone || o.customer_phone || "N/A"}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{o.products?.title || o.catalogue_name || "Unknown"}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">{o.player_name || o.player_id}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            o.payment_status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                        }`}>
                                            {o.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            o.delivery_status === "SENT" ? "bg-blue-50 text-blue-600" : o.delivery_status === "FAILED" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                                        }`}>
                                            {o.delivery_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-xs font-bold text-gray-400">
                                        {new Date(o.created_at).toLocaleDateString()}
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
