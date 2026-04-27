"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Gamepad2, Gift, ShoppingBag, ChevronRight, Coins } from "lucide-react";

function SuccessContent() {
    const params = useSearchParams();
    const router = useRouter();
    const orderId = params.get("order_id");
    const [order, setOrder] = useState<any>(null);
    const [cashback, setCashback] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) { router.replace("/"); return; }

        async function load() {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                const data = await res.json();
                if (data.success && data.order) {
                    setOrder(data.order);
                    setCashback(Number(data.order.amount_paid || 0) * 0.01);
                }
            } catch { }
            finally { setLoading(false); }
        }
        load();
    }, [orderId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    const productName = order?.products?.title || order?.catalogue_name || "Your Product";
    const amountPaid = Number(order?.amount_paid || 0);
    const playerId = order?.player_id || "";

    return (
        <main className="min-h-screen bg-[#f4f7fa] flex flex-col items-center justify-start px-4 pt-10 pb-20 font-sans">
            {/* ── SUCCESS ICON ── */}
            <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-5">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20 animate-bounce">
                        <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tight leading-none">Purchase Successful</h1>
                <p className="text-slate-500 text-sm mt-3 font-bold">Dalabkaaga si guul leh ayaa loo dhammeeyay!</p>
            </div>

            {/* ── PURCHASE REWARDS CARD ── */}
            <div className="w-full max-w-md bg-white rounded-[15px] p-6 mb-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-[10px] bg-yellow-50 text-yellow-600 flex items-center justify-center">
                        <Gift size={16} />
                    </div>
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Purchase Rewards</h2>
                </div>

                <div className="flex items-center justify-between bg-slate-50 rounded-[15px] p-5 border border-slate-100/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[12px] bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                            <Coins size={24} className="text-white" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Cashback Helay</div>
                            <div className="text-2xl font-black text-[#1a2b4b] leading-tight">${cashback.toFixed(3)} <span className="text-xs text-slate-400 font-bold ml-0.5">USD</span></div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Rate</div>
                        <div className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">1%</div>
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-4 text-center font-bold leading-relaxed">
                    Cashback-kaaga <span className="text-blue-600 font-black">Cashback Market-ka</span> waxaad ka iibsan kartaa alaab kala duwan 🎁
                </p>
            </div>

            {/* ── ORDER DETAILS ── */}
            <div className="w-full max-w-md bg-white rounded-[15px] p-6 mb-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Gamepad2 size={16} />
                    </div>
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Details</h2>
                </div>

                <div className="space-y-4 px-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Product</span>
                        <span className="text-sm font-black text-[#1a2b4b] uppercase">{productName}</span>
                    </div>
                    <div className="w-full h-px bg-slate-50" />
                    {playerId && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Player ID</span>
                                <span className="text-sm font-black text-[#1a2b4b]">{playerId}</span>
                            </div>
                            <div className="w-full h-px bg-slate-50" />
                        </>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Amount Paid</span>
                        <span className="text-sm font-black text-emerald-500">${amountPaid.toFixed(2)} USD</span>
                    </div>
                    <div className="w-full h-px bg-slate-50" />
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Status</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle size={10} /> Delivered
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50/50 border border-blue-100/30 rounded-[15px] p-4">
                    <p className="text-[11px] text-blue-600 font-black text-center leading-relaxed italic">
                        Game-ka fur oo dalabkaaga ka fiirso — UC-gaagu wuu soo geli doonaa 🎮
                    </p>
                </div>
            </div>

            {/* ── BUTTONS ── */}
            <div className="w-full max-w-md space-y-4 px-2">
                <Link
                    href="/"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.95] text-white font-black py-4 rounded-[15px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 text-[11px] uppercase tracking-widest"
                >
                    <ShoppingBag size={18} />
                    Return to Shop
                </Link>

                <Link
                    href="/wallet"
                    className="w-full bg-white hover:bg-slate-50 border border-slate-100 text-[#1a2b4b] font-black py-4 rounded-[15px] flex items-center justify-center gap-3 transition-all text-[11px] uppercase tracking-widest shadow-sm"
                >
                    <Gift size={18} className="text-yellow-500" />
                    Cashback Market
                    <ChevronRight size={16} className="text-slate-300" />
                </Link>
            </div>

            {/* ── BRAND FOOTER ── */}
            <div className="mt-12 text-center pb-10">
                <div className="text-[#1a2b4b] font-black text-xl mb-1 flex items-center justify-center gap-1">
                    <span className="text-blue-600 uppercase">Biriq</span> Store
                </div>
                <p className="text-[9px] text-slate-300 font-black tracking-[0.2em] uppercase">
                    Official Game Recharge Partner
                </p>
            </div>
        </main>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
