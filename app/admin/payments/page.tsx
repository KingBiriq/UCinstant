import { Search, Plus, Eye, Trash2 } from "lucide-react";
import ClientAlertButton from "@/components/ClientAlertButton";

import { supabaseAdmin } from "@/lib/supabase";

export default async function PaymentsPage() {
    const s = supabaseAdmin();
    const { data: orders } = await s.from("orders").select("id, amount_paid, player_name, created_at, payment_message, products(title)").eq("payment_status", "PAID").order("created_at", { ascending: false });

    const payments = (orders || []).map(o => {
        const isEdahab = o.payment_message?.toLowerCase().includes("edahab");
        return {
            id: `#${o.id.slice(0, 4)}`,
            customer: o.player_name || "Unknown",
            order: (o.products as any)?.title || "Unknown Product",
            amount: `$${Number(o.amount_paid || 0).toFixed(2)}`,
            method: isEdahab ? "EDAHAB" : "WAAFI",
            date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
    });

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount.replace('$', '')), 0);

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Payments</h1>
                    <div className="text-sm font-semibold text-gray-500 mt-1">{payments.length} payments - Total: <span className="font-bold text-[#1a2b4b]">${totalAmount.toFixed(2)}</span></div>
                </div>

                <ClientAlertButton message="Lacagaha toos ayaa loo diiwaangeliyaa marka WAAFI ama EDAHAB la isticmaalo!" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition">
                    <Plus size={16} /> Record Payment
                </ClientAlertButton>
            </div>

            {/* ── FILTERS ── */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white rounded-2xl p-3.5 border border-gray-50 flex items-center gap-3 shadow-sm">
                    <Search size={18} className="text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search payments..." 
                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder-gray-400"
                    />
                </div>
                <div className="flex bg-white rounded-2xl border border-gray-50 p-1.5 shadow-sm">
                    <button className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-black tracking-widest shadow-md">ALL</button>
                    <button className="px-6 py-2 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-black tracking-widest transition">WAAFI</button>
                    <button className="px-6 py-2 rounded-xl text-gray-500 hover:text-gray-800 text-xs font-black tracking-widest transition">EDAHAB</button>
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-xs font-bold text-gray-400">{p.id}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">{p.customer}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{p.order}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">{p.amount}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                            p.method === "WAAFI" ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                            {p.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-xs font-bold text-gray-400">{p.date}</td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <ClientAlertButton message="Halkan waxaad ka arki doontaa faahfaahinta Payment-ka (Coming soon)" className="text-purple-500 hover:text-purple-700 transition">
                                                <Eye size={16} />
                                            </ClientAlertButton>
                                            <ClientAlertButton message="Ma tirtiri kartid payment dhacay, fadlan kala xiriir Support-ka" className="text-red-400 hover:text-red-600 transition">
                                                <Trash2 size={16} />
                                            </ClientAlertButton>
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
