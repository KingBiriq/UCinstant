"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { 
    ArrowLeft, RefreshCw, ShoppingBag, CheckCircle2, 
    Wallet, Clock, List, X, Share2, Download, ChevronLeft, Eye, ReceiptIcon,
    ChevronRight, AlertCircle, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

function getOrderStatus(order: any) {
    const payment = String(order.payment_status || "").toUpperCase();
    const delivery = String(order.delivery_status || "").toUpperCase();
    if (payment !== "PAID") return "Failed";
    if (delivery === "400" || delivery.includes("FAILED") || delivery.includes("ERROR") || delivery.includes("INSUFFICIENT")) return "Action Required";
    if (delivery === "200" || delivery.includes("COMPLETED") || delivery.includes("SUCCESS")) return "Completed";
    return "Processing";
}

export default function Page() {
    const [orders, setOrders] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const loadData = async () => {
        setLoading(true);
        const s = supabaseBrowser();
        
        // Load Categories first for images
        const { data: cats } = await s.from("categories").select("id, image, game_code");
        setCategories(cats || []);

        const { data } = await s
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => String(o.payment_status).toUpperCase().includes("PAID")).length;
    const totalSpent = orders.filter(o => String(o.payment_status).toUpperCase().includes("PAID")).reduce((acc, o) => acc + Number(o.amount_paid || 0), 0);

    const filteredOrders = orders.filter(o => {
        const status = getOrderStatus(o);
        if (activeTab === "All") return true;
        if (activeTab === "Completed") return status === "Completed";
        if (activeTab === "Failed") return status === "Failed";
        if (activeTab === "Processing") return status === "Processing";
        return true;
    });

    const getGameImage = (order: any) => {
        // Try to match by game_code or category_id
        const cat = categories.find(c => c.game_code === order.game_code);
        return cat?.image || "https://ui-avatars.com/api/?name=" + (order.game_code || "G") + "&background=1a2b4b&color=fff";
    };

    return (
        <main className="min-h-screen bg-[#f4f7fa] text-[#111827] pb-32 font-sans">
            <div className="max-w-2xl mx-auto px-5 pt-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[#1a2b4b] hover:bg-slate-50 transition">
                            <ChevronLeft size={22} />
                        </Link>
                        <h1 className="text-2xl font-black text-[#1a2b4b] tracking-tight">Orders</h1>
                    </div>
                    <button onClick={loadData} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1a2b4b]">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                            <ShoppingBag size={18} />
                        </div>
                        <div className="text-xl font-black text-[#1a2b4b]">{totalOrders}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</div>
                    </div>
                    <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2.5">
                            <CheckCircle2 size={18} />
                        </div>
                        <div className="text-xl font-black text-emerald-500">{paidOrders}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paid</div>
                    </div>
                    <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-2.5">
                            <Wallet size={18} />
                        </div>
                        <div className="text-xl font-black text-orange-500">${totalSpent.toFixed(2)}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Spent</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-slate-200/50 p-1 rounded-full flex items-center mb-8 gap-1">
                    {["All", "Completed", "Processing"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-white text-[#1a2b4b] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab === "Processing" && <Clock size={14} />}
                            {tab === "Completed" && <CheckCircle2 size={14} />}
                            {tab === "All" && <List size={14} />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-[#1a2b4b] border-t-transparent animate-spin rounded-full mb-4" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Orders...</span>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-[15px] p-16 text-center shadow-sm border border-slate-100">
                             <div className="w-16 h-16 bg-slate-50 rounded-[15px] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <ShoppingBag size={24} className="text-slate-200" />
                             </div>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No {activeTab} orders found</p>
                        </div>
                    ) : filteredOrders.map((o) => {
                        const status = getOrderStatus(o);
                        const gameIcon = getGameImage(o);
                        return (
                            <div key={o.id} className="bg-white rounded-[15px] p-3 shadow-sm border border-slate-100 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-[12px] overflow-hidden border border-slate-100 shrink-0 shadow-inner">
                                            <img src={gameIcon} className="w-full h-full object-cover" alt="Game" />
                                        </div>
                                        <div>
                                            <h3 className="text-[13px] font-black text-[#1a2b4b] leading-tight uppercase tracking-tight line-clamp-1">{o.catalogue_name}</h3>
                                            <div className="text-[9px] font-bold text-slate-400 mt-0.5 flex items-center gap-2">
                                                Qty 1 <span className="opacity-20">|</span> ID {o.player_id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-base font-black text-[#1a2b4b] flex items-center justify-end gap-1 tracking-tighter">
                                            <ArrowUpRight size={14} className="text-emerald-500" /> ${Number(o.amount_paid).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 pt-2 border-t border-slate-50">
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                        status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                        status === "Action Required" ? "bg-orange-50 text-orange-600" :
                                        status === "Failed" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                                    }`}>
                                        <CheckCircle2 size={10} /> {status}
                                        <span className="opacity-30 text-[7px] ml-1 font-bold">{new Date(o.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedOrder(o)}
                                        className="bg-white border border-slate-100 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#1a2b4b] flex items-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        <Eye size={12} /> Receipt
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── RECEIPT MODAL ── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-t-[15px] sm:rounded-[15px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-[12px] overflow-hidden border border-slate-100 shadow-inner">
                                    <img src={getGameImage(selectedOrder)} className="w-full h-full object-cover" alt="Game" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-[#1a2b4b] uppercase leading-tight">{selectedOrder.game_code}</h2>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">TXN ID #{selectedOrder.id.toString().slice(-4)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-4 flex-1 overflow-y-auto">
                            <div className={`w-full py-4 rounded-[12px] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border mb-8 ${
                                getOrderStatus(selectedOrder) === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100/50" : "bg-blue-50 text-blue-600 border-blue-100 shadow-sm"
                            }`}>
                                <CheckCircle2 size={16} /> {getOrderStatus(selectedOrder)}
                            </div>

                            <div className="bg-slate-50/50 rounded-[15px] overflow-hidden border border-slate-100">
                                <div className="divide-y divide-slate-100">
                                    <div className="px-6 py-4 flex justify-between items-center group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</span>
                                        <span className="text-[11px] font-black text-[#1a2b4b] text-right uppercase tracking-tight">{selectedOrder.catalogue_name}</span>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                                        <span className="text-[11px] font-black text-[#1a2b4b]">1</span>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Player ID</span>
                                        <span className="text-[11px] font-black text-[#1a2b4b]">{selectedOrder.player_id}</span>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Player Name</span>
                                        <span className="text-[11px] font-black text-emerald-600">{selectedOrder.player_name || "Unknown"}</span>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                                        <span className="text-[11px] font-black text-[#1a2b4b] uppercase">{selectedOrder.payment_method || "Wallet"}</span>
                                    </div>
                                    <div className="px-6 py-6 flex justify-between items-center bg-orange-50/30">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-lg font-black text-orange-500">${Number(selectedOrder.amount_paid).toFixed(2)}</span>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded At</span>
                                        <span className="text-[10px] font-bold text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 shrink-0 flex gap-3">
                            <button 
                                onClick={() => {
                                    const text = `🧾 Biriq Store Receipt\n\nProduct: ${selectedOrder.catalogue_name}\nPlayer ID: ${selectedOrder.player_id}\nAmount: $${Number(selectedOrder.amount_paid).toFixed(2)}\nStatus: ${getOrderStatus(selectedOrder)}\nDate: ${new Date(selectedOrder.created_at).toLocaleString()}`;
                                    if (navigator.share) {
                                        navigator.share({ title: 'Order Receipt', text, url: window.location.href }).catch(() => {});
                                    } else {
                                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                        window.open(url, '_blank');
                                    }
                                }}
                                className="flex-1 bg-[#1a2b4b] text-white py-4 rounded-[15px] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95 transition-all"
                            >
                                <Share2 size={18} /> Share Receipt
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[15px] border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function ArrowUpRight({size, className}: {size: number, className?: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
        </svg>
    )
}