import { supabaseAdmin } from "@/lib/supabase";
import { Users, ShoppingCart, CreditCard, TrendingUp, Filter, Calendar } from "lucide-react";

export default async function AdminDashboardPage() {
    const s = supabaseAdmin();

    const [allOrdersResult, recentOrdersResult] = await Promise.all([
        s.from("orders").select("id, amount_paid, payment_status, phone, products(buy_price)"),
        s.from("orders").select("id, amount_paid, payment_status, player_name, created_at, products(title, buy_price, sell_price)").order("created_at", { ascending: false }).limit(10),
    ]);

    const allOrders = allOrdersResult.data || [];
    const recentOrders = recentOrdersResult.data || [];

    // Dashboard Calculations
    const uniqueCustomers = new Set(allOrders.filter(o => o.phone).map(o => o.phone)).size;
    const totalOrdersCount = allOrders.length;
    const totalVolume = allOrders.reduce((sum, o) => sum + Number(o.amount_paid || 0), 0);
    
    const paidOrders = allOrders.filter(o => o.payment_status === "PAID");
    const totalPaidVolume = paidOrders.reduce((sum, o) => sum + Number(o.amount_paid || 0), 0);
    
    const netEarnings = paidOrders.reduce((sum, o: any) => {
        const sellPrice = Number(o.amount_paid || 0);
        const buyPrice = Number(o.products?.buy_price || 0);
        return sum + (sellPrice - buyPrice);
    }, 0);

    return (
        <div className="animate-[slideUp_.3s_ease-out]">
            
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-black tracking-tight text-[#1a2b4b]">Executive Dashboard</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-semibold text-gray-500">System Live - Transaction Monitoring</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm text-sm font-bold text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>04/27/2026</span>
                        <span className="text-gray-300">→</span>
                        <span>04/27/2026</span>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <button className="w-11 h-11 bg-[#1a2b4b] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#1a2b4b]/20 transition hover:scale-105">
                        <Filter size={18} className="fill-white" />
                    </button>
                </div>
            </div>

            {/* ── CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                
                {/* Customers Card */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 text-gray-200 group-hover:text-purple-100 transition-colors">↗</div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                        <Users size={22} />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Customers</div>
                    <div className="text-3xl font-black text-[#1a2b4b]">{uniqueCustomers}</div>
                    <div className="text-xs font-bold text-purple-600 mt-2">Total active users</div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 text-gray-200 group-hover:text-blue-100 transition-colors">↗</div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                        <ShoppingCart size={22} />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Analytics</div>
                    <div className="text-3xl font-black text-[#1a2b4b]">{totalOrdersCount}</div>
                    <div className="text-xs font-bold text-blue-600 mt-2">Vol: ${totalVolume.toFixed(2)}</div>
                </div>

                {/* Paid Volume Card */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 text-gray-200 group-hover:text-emerald-100 transition-colors">↗</div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                        <CreditCard size={22} />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid Volume</div>
                    <div className="text-3xl font-black text-[#1a2b4b]">{paidOrders.length}</div>
                    <div className="text-xs font-bold text-emerald-600 mt-2">Rec: ${totalPaidVolume.toFixed(2)}</div>
                </div>

                {/* Net Earnings Card */}
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-6 right-6 text-gray-200 group-hover:text-orange-100 transition-colors">↗</div>
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                        <TrendingUp size={22} />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Net Earnings</div>
                    <div className="text-3xl font-black text-[#1a2b4b]">${netEarnings.toFixed(2)}</div>
                    <div className="text-xs font-bold text-orange-500 mt-2">Sales: ${totalPaidVolume.toFixed(2)}</div>
                </div>

            </div>

            {/* ── TABLE ── */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1a2b4b] text-white rounded-2xl flex items-center justify-center">
                            <ShoppingCart size={20} className="fill-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#1a2b4b]">Transaction Audit</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-Time Profitability &amp; Margin Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest">STABLE</span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest">v2.4.0</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="text-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">QTY</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cost (Total)</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (Item)</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Profit/Margin</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map((order: any, i) => {
                                const sellPrice = Number(order.amount_paid || 0);
                                const buyPrice = Number(order.products?.buy_price || 0);
                                const profit = sellPrice - buyPrice;
                                const margin = sellPrice > 0 ? ((profit / sellPrice) * 100).toFixed(1) : "0.0";
                                const isProfitable = profit >= 0;

                                return (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-xs font-bold text-gray-400">#{order.id.slice(0, 4)}</td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-[#1a2b4b]">{order.player_name || "Unknown"}</div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-500">x1</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">${buyPrice.toFixed(2)}</td>
                                    <td className="px-6 py-5 text-sm font-black text-[#1a2b4b]">${sellPrice.toFixed(2)}</td>
                                    <td className="px-6 py-5">
                                        <div className={`text-sm font-black ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>${profit.toFixed(2)}</div>
                                        <div className={`text-[9px] font-black tracking-widest mt-1 ${isProfitable ? 'text-emerald-500' : 'text-red-500'}`}>{margin}% MARGIN</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            order.payment_status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                        }`}>
                                            {order.payment_status || "FAILED"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right text-sm font-black text-[#1a2b4b]">
                                        ${sellPrice.toFixed(2)}
                                    </td>
                                </tr>
                                )
                            })}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-sm font-bold text-gray-400">
                                        No recent transactions found.
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