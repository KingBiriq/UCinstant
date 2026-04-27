"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import { Gift, Coins, ChevronRight, ArrowLeft } from "lucide-react";

export default function RewardsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const s = supabaseBrowser();
            
            // We fetch UC products from the main products table
            const { data } = await s
                .from("products")
                .select("*, categories(name)")
                .ilike("name", "%UC%")
                .eq("active", true)
                .order("price", { ascending: true });

            setProducts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-[#1a2b4b] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f7fa] pb-24">
            {/* ── HEADER ── */}
            <div className="bg-white px-5 pt-10 pb-8 rounded-b-[3rem] shadow-sm border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-50" />
                
                <Link href="/wallet" className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
                    <ArrowLeft size={14} /> Back to Wallet
                </Link>

                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#1a2b4b] flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Gift size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#1a2b4b] leading-tight">Buy UC</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Use your Cashback Balance</p>
                    </div>
                </div>
            </div>

            {/* ── PRODUCTS GRID ── */}
            <div className="px-5 mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2">
                {products.length > 0 ? (
                    products.map((p) => (
                        <div key={p.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col group active:scale-[0.98] transition-transform">
                            <div className="flex items-center gap-5">
                                {/* Icon Container */}
                                <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                                    <ShoppingBag size={32} />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-lg font-black text-[#1a2b4b] line-clamp-1">{p.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Price</div>
                                        <div className="text-xl font-black text-[#1a2b4b]">${Number(p.price || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Buy Button */}
                            <Link href={`/checkout/${p.id}?method=cashback`} className="mt-6 w-full bg-[#1a2b4b] hover:bg-[#2a3b5b] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 uppercase text-xs tracking-widest">
                                Buy with Cashback <ChevronRight size={16} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Gift size={32} />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No UC Products Found</p>
                    </div>
                )}
            </div>

            {/* ── INFO BOX ── */}
            <div className="px-5 mt-10">
                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2 leading-tight">Sidee u shaqaysaa?</h3>
                        <p className="text-blue-100 text-[11px] font-bold leading-relaxed max-w-[240px]">
                            Mar kasta oo aad wax iibsato, waxaad helaysaa 1% Cashback iyo Points. Kuwaas ayaad ku furan kartaa alaabtan bilaashka ah!
                        </p>
                    </div>
                    <Gift size={80} className="absolute bottom-[-20px] right-[-10px] text-white/10 -rotate-12" />
                </div>
            </div>
        </main>
    );
}