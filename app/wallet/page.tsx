"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import { 
    Wallet, ShoppingBag, ArrowUpRight, History, 
    ChevronLeft, Send, CheckCircle2, AlertCircle, ShoppingCart, Info,
    ChevronRight, Search, X, Gamepad2, User, Phone, ArrowRight, Lock
} from "lucide-react";

type ViewState = "dashboard" | "buy_games" | "withdraw";

export default function WalletPage() {
    const [view, setView] = useState<ViewState>("dashboard");
    const [profile, setProfile] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Checkout Modal State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [checkoutStep, setCheckoutStep] = useState<"id" | "payment">("id");
    const [playerId, setPlayerId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [checkingId, setCheckingId] = useState(false);
    const [phone, setPhone] = useState("");
    const [paying, setPaying] = useState(false);
    const [paymentMsg, setPaymentMsg] = useState("");

    // Withdrawal Form State
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawPhone, setWithdrawPhone] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "success" | "error">("idle");

    const MIN_BALANCE = 1.00;
    const GLOBAL_RADIUS = "15px";

    useEffect(() => {
        async function load() {
            const s = supabaseBrowser();
            const { data: userData } = await s.auth.getUser();
            const userId = userData.user?.id;
            if (!userId) { window.location.href = "/login"; return; }

            try {
                const { data: profileData } = await s.from("profiles").select("*").eq("id", userId).single();
                setProfile(profileData);
                setWithdrawPhone(profileData?.phone || "");
                setPhone(profileData?.phone || "");

                const { data: historyData } = await s.from("cashback_history").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5);
                setRecentActivity(historyData || []);

                const { data: productsData, error: prodError } = await s.from("products").select("*").order("id", { ascending: true });
                if (prodError) console.error("Products Fetch Error:", prodError);
                
                const normalized = (productsData || []).map(p => ({
                    ...p,
                    display_name: p.name || p.title || p.catalogue_name || "Product",
                    display_price: p.sell_price || p.price || 0
                }));
                setProducts(normalized);
            } catch (err) { console.error("Error loading wallet:", err); } 
            finally { setLoading(false); }
        }
        load();
    }, []);

    const checkPlayer = async (id: string) => {
        if (!id || id.length < 4 || !selectedProduct) return;
        setCheckingId(true); setPlayerName("Checking...");
        try {
            const { data: cat } = await supabaseBrowser().from("categories").select("game_code").eq("id", selectedProduct.category_id).single();
            const res = await fetch("/api/g2bulk/check-player", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game: cat?.game_code || "pubg_mobile", user_id: id }),
            });
            const data = await res.json();
            if (data.valid === "valid" || data.valid === true) setPlayerName(data.name);
            else setPlayerName("Not Found");
        } catch { setPlayerName("Error"); } 
            finally { setCheckingId(false); }
    };

    const handleCashbackPayment = async () => {
        if (!playerId || playerName === "Not Found" || playerName === "Checking...") { alert("Fadlan geli Player ID sax ah!"); return; }
        setPaying(true); setPaymentMsg("Processing payment...");
        setTimeout(() => { setPaying(false); setPaymentMsg("✅ Order Successfully Completed!"); setTimeout(() => setSelectedProduct(null), 2000); }, 2000);
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);
        const currentBalance = Number(profile?.cashback_balance || 0);
        if (currentBalance < MIN_BALANCE) { alert(`Ugu yaraan waa inaad haysataa $${MIN_BALANCE}`); return; }
        setWithdrawing(true);
        setTimeout(() => { setWithdrawing(false); setWithdrawStatus("success"); }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-[#1a2b4b] border-t-transparent animate-spin" />
            </div>
        );
    }

    const currentBalance = Number(profile?.cashback_balance || 0);
    const cannotTransact = currentBalance < MIN_BALANCE;
    const filteredProducts = products.filter(p => (p.display_name).toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <main className="min-h-screen bg-[#f4f7fa] pb-24 font-sans">
            
            {/* ── TOP HEADER (Sticky) ── */}
            <div className="bg-white px-5 pt-12 pb-6 flex items-center justify-between shadow-sm border-b border-slate-50 sticky top-0 z-50">
                {view !== "dashboard" ? (
                    <button onClick={() => setView("dashboard")} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#1a2b4b] active:scale-90 transition-transform">
                        <ChevronLeft size={24} />
                    </button>
                ) : (
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#1a2b4b] active:scale-90 transition-transform">
                        <ChevronLeft size={24} />
                    </Link>
                )}
                <div className="text-center">
                    <h1 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tighter">My Wallet</h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage Cashback Earnings</p>
                </div>
                <div className="w-10" />
            </div>

            <div className="max-w-md mx-auto px-5 mt-6">
                
                {/* ── 1. COMPACT BALANCE CARD (Blue Accents) ── */}
                <div className="bg-[#1a2b4b] rounded-[15px] px-6 py-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/30 mb-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-[10px] flex items-center justify-center backdrop-blur-md border border-blue-500/10">
                                    <Wallet size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/50 block">Available Balance</span>
                                    <div className="text-3xl font-black tracking-tight text-white">${currentBalance.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-500/30">
                                <Info size={10} /> MIN. $1.00
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-[12px] p-3 border border-white/10">
                                <div className="text-[7px] font-black text-blue-300/50 uppercase tracking-widest mb-0.5">Total Earned</div>
                                <div className="text-xs font-black">${Number(profile?.total_cashback_earned || 0).toFixed(2)}</div>
                            </div>
                            <div className="bg-white/5 rounded-[12px] p-3 border border-white/10">
                                <div className="text-[7px] font-black text-blue-300/50 uppercase tracking-widest mb-0.5">Total Used</div>
                                <div className="text-xs font-black">${Number(profile?.total_cashback_used || 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── VIEW: DASHBOARD ── */}
                {view === "dashboard" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setView("buy_games")} className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md active:scale-95 transition-all group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-[12px] flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="text-[11px] font-black text-[#1a2b4b] uppercase tracking-widest">Buy Items</span>
                            </button>
                            <button onClick={() => setView("withdraw")} className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md active:scale-95 transition-all group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-[12px] flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <ArrowUpRight size={24} />
                                </div>
                                <span className="text-[11px] font-black text-[#1a2b4b] uppercase tracking-widest">Withdraw</span>
                            </button>
                        </div>
                        <div className="bg-white rounded-[15px] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-[10px] font-black text-[#1a2b4b] uppercase tracking-widest flex items-center gap-2"><History size={16} className="text-slate-400" /> Recent Activity</h3>
                                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View All</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentActivity.length > 0 ? recentActivity.map((h) => (
                                    <div key={h.id} className="p-5 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${h.amount > 0 ? "bg-blue-50 text-blue-500" : "bg-blue-50 text-blue-500"}`}>
                                                {h.amount > 0 ? <ArrowUpRight size={18} /> : <ShoppingBag size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black text-[#1a2b4b] line-clamp-1">{h.description || "Cashback Reward"}</div>
                                                <div className="text-[9px] text-slate-400 font-bold">{new Date(h.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-black ${h.amount > 0 ? "text-blue-500" : "text-[#1a2b4b]"}`}>{h.amount > 0 ? "+" : ""}${Math.abs(h.amount).toFixed(2)}</div>
                                    </div>
                                )) : <div className="p-16 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] italic">No activity yet</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── VIEW: BUY ITEMS ── */}
                {view === "buy_games" && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Search size={18} /></div>
                            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-100 rounded-[15px] pl-12 pr-4 py-4 text-sm font-bold text-[#1a2b4b] outline-none focus:border-blue-300 transition-all shadow-sm" />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {filteredProducts.map((p) => (
                                <button key={p.id} onClick={() => { setSelectedProduct(p); setCheckoutStep("id"); }} className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-[12px] flex items-center justify-center shrink-0 border border-blue-50/50 overflow-hidden">
                                            {p.image ? <img src={p.image} alt={p.display_name} className="w-full h-full object-cover" /> : <ShoppingCart size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-[#1a2b4b] line-clamp-1 uppercase">{p.display_name}</h3>
                                            <p className="text-lg font-black text-blue-500 mt-0.5 tracking-tight">${Number(p.display_price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-[12px] bg-slate-50 flex items-center justify-center text-slate-300 transition-all group-hover:bg-blue-500 group-hover:text-white"><ChevronRight size={18} /></div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── VIEW: WITHDRAW ── */}
                {view === "withdraw" && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        {withdrawStatus === "success" ? (
                            <div className="bg-white rounded-[15px] p-10 text-center shadow-sm border border-slate-100">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                                <h2 className="text-xl font-black text-[#1a2b4b] mb-2 uppercase">Request Sent!</h2>
                                <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-wide">Your withdrawal request for ${withdrawAmount} has been sent.</p>
                                <button onClick={() => { setView("dashboard"); setWithdrawStatus("idle"); }} className="w-full bg-blue-500 text-white py-4 rounded-[12px] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-400/20 active:scale-95 transition-all">Back to Wallet</button>
                            </div>
                        ) : (
                            <form onSubmit={handleWithdraw} className="bg-white rounded-[15px] p-8 shadow-sm border border-slate-100 space-y-6">
                                <div className="text-center mb-2">
                                    <h2 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tight">Withdraw Funds</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Min. withdrawal ${MIN_BALANCE.toFixed(2)}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input type="text" value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} placeholder="+252..." className="w-full bg-slate-50 border-none rounded-[12px] px-5 py-4 text-sm font-black text-[#1a2b4b] focus:ring-2 focus:ring-blue-100 outline-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ($)</label>
                                        <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0.00" step="0.01" className="w-full bg-slate-50 border-none rounded-[12px] px-5 py-4 text-sm font-black text-[#1a2b4b] focus:ring-2 focus:ring-blue-100 outline-none" />
                                    </div>
                                </div>
                                <button type="submit" disabled={withdrawing || cannotTransact || !withdrawAmount || Number(withdrawAmount) < MIN_BALANCE} className={`w-full py-4.5 rounded-[12px] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-400/20 flex items-center justify-center gap-3 ${cannotTransact ? 'bg-slate-200 text-slate-400' : 'bg-blue-500 text-white'}`}>
                                    {withdrawing ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <>Send Request <Send size={16} /></>}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* ── CHECKOUT MODAL ── */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
                    <div className="w-full max-w-md bg-white rounded-t-[15px] sm:rounded-[15px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center px-6 py-6 border-b border-slate-50 shrink-0">
                            <button onClick={() => checkoutStep === "payment" ? setCheckoutStep("id") : setSelectedProduct(null)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-[#1a2b4b] transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-widest">{checkoutStep === "id" ? "Player ID" : "Payment"}</h2>
                            <button onClick={() => setSelectedProduct(null)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="bg-[#1a2b4b] rounded-[15px] p-6 text-white flex items-center gap-4 relative overflow-hidden shadow-xl shadow-blue-900/10">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                                <div className="w-16 h-16 bg-white/10 rounded-[12px] flex items-center justify-center shrink-0 border border-white/10 overflow-hidden shadow-inner">
                                    {selectedProduct.image ? <img src={selectedProduct.image} alt="Game" className="w-full h-full object-cover" /> : <ShoppingCart size={28} className="text-blue-200" />}
                                </div>
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest opacity-60">Checkout Package</div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{selectedProduct.display_name}</h3>
                                    <div className="text-2xl font-black text-blue-400 tracking-tighter">${Number(selectedProduct.display_price).toFixed(2)}</div>
                                </div>
                            </div>

                            {checkoutStep === "id" && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"><Gamepad2 size={12} className="inline mr-1" /> Game Player ID</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter ID (e.g. 51234567)" 
                                            value={playerId} 
                                            onChange={(e) => { setPlayerId(e.target.value); setPlayerName(""); }}
                                            onBlur={(e) => checkPlayer(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-200 rounded-[15px] px-6 py-4.5 text-lg font-black text-[#1a2b4b] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"><User size={12} className="inline mr-1" /> Player Name</label>
                                        <div className={`w-full bg-slate-50 rounded-[15px] px-6 py-4.5 font-black text-sm border-2 ${playerName === "Not Found" ? "border-rose-100 text-rose-500" : playerName === "Checking..." ? "border-blue-100 text-blue-500" : playerName ? "border-blue-100 text-blue-600" : "border-transparent text-slate-300"}`}>
                                            {playerName || "Waiting for ID..."}
                                        </div>
                                    </div>
                                    <button 
                                        disabled={!playerName || playerName === "Not Found" || playerName === "Checking..."}
                                        onClick={() => setCheckoutStep("payment")}
                                        className="w-full bg-blue-500 disabled:bg-slate-100 text-white py-5 rounded-[15px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-400/20 transition-all active:scale-95"
                                    >
                                        Continue to Payment <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {checkoutStep === "payment" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</div>
                                        <button 
                                            disabled={currentBalance < selectedProduct.display_price}
                                            onClick={handleCashbackPayment}
                                            className={`w-full p-5 rounded-[15px] border-2 flex items-center justify-between group transition-all ${currentBalance >= selectedProduct.display_price ? "bg-blue-50/50 border-blue-100 hover:border-blue-500" : "bg-slate-50 border-slate-100 opacity-60"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-[12px] flex items-center justify-center text-blue-600 shadow-sm"><Wallet size={24} /></div>
                                                <div className="text-left">
                                                    <div className="font-black text-[#1a2b4b] text-[15px]">Wallet Balance</div>
                                                    <div className="text-[11px] font-bold text-slate-400">Pay with Cashback (${currentBalance.toFixed(2)})</div>
                                                </div>
                                            </div>
                                            {currentBalance < selectedProduct.display_price ? <Lock size={16} className="text-slate-300" /> : <ChevronRight size={18} className="text-blue-600" />}
                                        </button>
                                    </div>
                                    {paymentMsg && ( <div className={`p-4 rounded-[12px] text-[11px] font-black uppercase text-center ${paymentMsg.includes("✅") ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" : "bg-blue-50 text-blue-600"}`}> {paymentMsg} </div> )}
                                    {paying && ( <div className="flex justify-center py-4"> <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" /> </div> )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}