import { Users, Search, Plus, Edit2, Trash2 } from "lucide-react";
import ClientAlertButton from "@/components/ClientAlertButton";

import { supabaseAdmin } from "@/lib/supabase";

export default async function CustomersPage() {
    const s = supabaseAdmin();
    const { data: orders } = await s.from("orders").select("id, phone, player_name, created_at, payment_status").order("created_at", { ascending: false });

    // Extract unique customers from orders
    const customersMap = new Map();
    (orders || []).forEach(o => {
        if (!o.phone || o.phone.trim() === "") return;
        if (!customersMap.has(o.phone)) {
            customersMap.set(o.phone, {
                id: o.phone,
                name: o.player_name || "Unknown",
                email: "N/A",
                phone: o.phone,
                orders: 0,
                status: "Active",
                created: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            });
        }
        customersMap.get(o.phone).orders += 1;
    });

    const customers = Array.from(customersMap.values());

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Customers</h1>
                    <div className="text-sm font-semibold text-gray-500 mt-1">{customers.length} total customers</div>
                </div>

                <ClientAlertButton message="Macaamiisha toos ayaa loo diiwaangeliyaa marka ay wax iibsadaan!" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition">
                    <Plus size={16} /> Add Customer
                </ClientAlertButton>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="bg-white rounded-t-[1.5rem] p-4 border border-gray-50 border-b-0 flex items-center gap-3">
                <Search size={18} className="text-gray-400 ml-2" />
                <input 
                    type="text" 
                    placeholder="Search by name, email or phone..." 
                    className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder-gray-400 py-2"
                />
            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-b-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">{c.name}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{c.email}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{c.phone}</td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                            c.orders > 0 ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-400"
                                        }`}>
                                            {c.orders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-xs font-bold text-gray-400">{c.created}</td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <ClientAlertButton message="Weli lama diyaarin qeybta wax ka bedelka macmiilka." className="text-blue-500 hover:text-blue-700 transition">
                                                <Edit2 size={16} />
                                            </ClientAlertButton>
                                            <ClientAlertButton message="Ma tirtiri kartid macmiil dalab sameeyay!" className="text-red-400 hover:text-red-600 transition">
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
