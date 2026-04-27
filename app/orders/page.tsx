"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { ArrowLeft, RefreshCw, ShoppingBag, CheckCircle2, Wallet, Clock, List } from "lucide-react";
import Link from "next/link";

function deliveryLabel(status: string) {
    if (!status) return "Pending";
    const s = String(status).toUpperCase();
    if (s === "200" || s.includes("COMPLETED") || s.includes("SUCCESS")) return "Completed";
    if (s === "400" || s.includes("FAILED") || s.includes("ERROR") || s.includes("INSUFFICIENT")) return "Failed";
    if (s.includes("PENDING") || s.includes("PROCESSING")) return "Processing";
    if (s.includes("CANCEL") || s.includes("REJECT")) return "Cancelled";
    return "Pending";
}

export default function Page() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Processing");

    const loadOrders = async () => {
        setLoading(true);
        const s = supabaseBrowser();
        const { data } = await s
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);

        setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => String(o.payment_status).toUpperCase().includes("PAID")).length;
    const totalSpent = orders.filter(o => String(o.payment_status).toUpperCase().includes("PAID")).reduce((acc, o) => acc + Number(o.amount_paid || 0), 0);

    const filteredOrders = orders.filter(o => {
        const status = deliveryLabel(o.delivery_status);
        if (activeTab === "All") return true;
        if (activeTab === "Completed") return status === "Completed";
        if (activeTab === "Processing") return status === "Processing" || status === "Pending";
        return true;
    });

    return (
        <main className="min-h-screen bg-[#f8f9fa] text-[#111827] pb-20">
            <div className="max-w-5xl mx-auto px-4 pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:bg-gray-50 transition">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black">Orders</h1>
                    </div>
                    <button 
                        onClick={loadOrders} 
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                            <ShoppingBag size={20} />
                        </div>
                        <div className="text-2xl font-black text-[#1a2b4b]">{totalOrders}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">TOTAL</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="text-2xl font-black text-emerald-500">{paidOrders}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">PAID</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                            <Wallet size={20} />
                        </div>
                        <div className="text-2xl font-black text-orange-500">${totalSpent.toFixed(2)}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">SPENT</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-100/80 p-1.5 rounded-full flex gap-1 mb-8">
                    <button 
                        onClick={() => setActiveTab("Processing")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'Processing' ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Clock size={16} className={activeTab === 'Processing' ? 'text-blue-600' : ''} /> Processing
                    </button>
                    <button 
                        onClick={() => setActiveTab("Completed")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'Completed' ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <CheckCircle2 size={16} className={activeTab === 'Completed' ? 'text-emerald-500' : ''} /> Completed
                    </button>
                    <button 
                        onClick={() => setActiveTab("All")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'All' ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <List size={16} className={activeTab === 'All' ? 'text-purple-500' : ''} /> All
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 min-h-[400px] p-8 flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 font-bold">Loading...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
                                <ShoppingBag size={32} className="text-gray-300" />
                            </div>
                            <h2 className="text-xl font-black text-[#1a2b4b] mb-2">No {activeTab.toLowerCase()} orders</h2>
                            <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
                                You haven't placed any orders yet, or your orders are still syncing.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400">
                                        <th className="pb-4 font-bold">Game</th>
                                        <th className="pb-4 font-bold">Product</th>
                                        <th className="pb-4 font-bold">Player</th>
                                        <th className="pb-4 font-bold">Price</th>
                                        <th className="pb-4 font-bold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(o => {
                                        const status = deliveryLabel(o.delivery_status);
                                        return (
                                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                <td className="py-4 font-bold text-[#1a2b4b]">{o.game_code}</td>
                                                <td className="py-4 text-gray-600">{o.catalogue_name}</td>
                                                <td className="py-4 font-medium">{o.player_name || o.player_id}</td>
                                                <td className="py-4 font-black text-orange-500">${Number(o.amount_paid || 0).toFixed(2)}</td>
                                                <td className="py-4 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                        status === 'Failed' || status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}