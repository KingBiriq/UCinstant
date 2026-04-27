"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ShoppingCart, Gamepad2, User, Phone,
    AlertTriangle, ArrowRight, ArrowLeft, X, ChevronRight
} from "lucide-react";

type Step = "id" | "checkout";

export default function CategoryClient({ cat, products }: { cat: any; products: any[] }) {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [step, setStep] = useState<Step>("id");

    // Step 1 state
    const [playerId, setPlayerId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [checking, setChecking] = useState(false);
    const [savedPlayerId, setSavedPlayerId] = useState("");
    const [savedPlayerName, setSavedPlayerName] = useState("");
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);

    // Step 2 state
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    /* ---------- helpers ---------- */
    const openModal = (p: any, forceIdStep = false) => {
        setSelectedProduct(p);
        
        if (!forceIdStep && savedPlayerId && savedPlayerId.trim() !== "") {
            setPlayerId(savedPlayerId);
            setStep("checkout");
        } else {
            setStep("id");
            setPlayerId(savedPlayerId || "");
        }
        
        // We only clear playerName if we don't have a saved one, or if we force id step
        if (!savedPlayerId || forceIdStep) {
            setPlayerName(savedPlayerName || "");
        } else {
            setPlayerName(savedPlayerName);
        }
        setChecking(false);
        setSelectedPayment(null);
        setPhone("");
        setMessage("");
    };

    const closeModal = () => setSelectedProduct(null);

    const checkPlayer = async (id: string) => {
        if (!id || id.length < 4) { setPlayerName(""); return; }
        setChecking(true);
        setPlayerName("Checking...");
        try {
            const res = await fetch("/api/g2bulk/check-player", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game: cat.game_code, user_id: id, server_id: "" }),
            });
            const data = await res.json();
            if (data.valid === "valid" || data.valid === true) {
                setPlayerName(data.name);
            } else {
                setPlayerName("Not Found");
            }
        } catch {
            setPlayerName("Error");
        } finally {
            setChecking(false);
        }
    };

    const continueToPayment = () => {
        if (!playerId || playerId.length < 4) { alert("Fadlan geli Player ID sax ah!"); return; }
        if (playerName === "Not Found" || playerName === "Error" || !playerName) {
            alert("Player ID waa khalad ama lama hubin. Fadlan hubi."); return;
        }
        if (playerName === "Checking...") { alert("Suug, weli la hubinayaa..."); return; }
        setSavedPlayerId(playerId);
        setSavedPlayerName(playerName);
        setMessage("");
        setStep("checkout");
    };

    const handlePayment = async () => {
        if (!phone || phone.length < 9) { setMessage("❌ Fadlan geli Number sax ah."); return; }

        setLoading(true);
        setMessage("Payment request ayaa telefoonkaaga loo diray, fadlan hubi...");

        try {
            // 1. Create Pending Order
            const pendingRes = await fetch("/api/orders/create-pending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: selectedProduct.id,
                    phone,
                    player_id: playerId,
                    player_name: playerName,
                    server_id: "",
                    amount_paid: selectedProduct.sell_price,
                }),
            });
            const pendingData = await pendingRes.json();
            if (!pendingData.success) {
                setMessage(pendingData.message || "❌ Order lama abuurin.");
                setLoading(false);
                return;
            }

            const orderId = pendingData.order.id;

            // 2. Call WaafiPay (eDahab uses same WaafiPay API for now)
            if (selectedPayment === "card") {
                setMessage("⚠️ Visa/MasterCard waqti dhaw ayaa lagu soo darayaa.");
                setLoading(false);
                return;
            }

            const paymentRes = await fetch("/api/payments/waafi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    amount: selectedProduct.sell_price,
                    order_id: orderId,
                    description: `${selectedProduct.title || selectedProduct.catalogue_name} - ${playerId}`,
                }),
            });
            const paymentData = await paymentRes.json();

            // 3. Handle response
            if (!paymentData.success || !paymentData.paid) {
                await fetch(`/api/admin/orders/${orderId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        payment_status: "FAILED",
                        delivery_status: "NOT_SENT",
                        waafi_reference: paymentData.referenceId || null,
                        payment_message: paymentData.message || "Payment failed",
                    }),
                });
                setMessage("❌ Payment failed ama waad cancel-gareysay. Mar kale isku day.");
                setLoading(false);
                return;
            }

            // 4. Mark as PAID
            await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    payment_status: "PAID",
                    waafi_reference: paymentData.referenceId,
                    payment_message: "Payment success",
                }),
            });

            // 5. Deliver via G2Bulk
            const deliveryRes = await fetch("/api/orders/send-delivery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId }),
            });
            const deliveryData = await deliveryRes.json();

            setMessage(
                deliveryData.success
                    ? "✅ Waa laguugu shubay! Payment Success."
                    : "⚠️ Lacagta waa la bixiyay, laakiin cilad ayaa dhacday shubida. Admin baa hubinaya."
            );

            if (deliveryData.success) {
                setTimeout(() => closeModal(), 3500);
            }
        } catch (err: any) {
            setMessage(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Parse Category Details ---------- */
    let descText = cat.description || "";
    let bannerImage = cat.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";

    if (descText.startsWith("{")) {
        try {
            const parsed = JSON.parse(descText);
            descText = parsed.text || "";
            if (parsed.banner_image) bannerImage = parsed.banner_image;
        } catch (e) {}
    }

    /* ---------- render ---------- */
    return (
        <main className="min-h-screen bg-[#151a28] text-white pb-20">

            {/* ── HERO BANNER ── */}
            <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden flex flex-col items-center justify-center pt-8">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151a28]/90 via-[#151a28]/40 to-black/30" />

                {/* Top Bar Navigation */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                    <button 
                        onClick={() => router.back()} 
                        className="bg-white hover:bg-gray-100 text-slate-800 w-10 h-10 flex items-center justify-center rounded-full transition shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full"></div>
                </div>

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                    <div className="text-white/80 text-[10px] md:text-xs font-black tracking-[0.2em] mb-1">TOP UP</div>
                    <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">{cat.name}</h1>
                    <div className="mt-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        <span className="text-white text-[11px] font-bold">Official</span>
                    </div>
                </div>
            </div>

            {/* ── SUBTITLE BANNER ── */}
            {descText && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-2 relative z-20">
                    <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #b98e57 0%, #dbb882 50%, #b98e57 100%)" }}>
                        <p className="text-[#3b2a11] font-bold text-xs md:text-sm">{descText}</p>
                        <button className="bg-white text-[#3b2a11] font-black text-[10px] md:text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 ml-4">GO</button>
                    </div>
                </div>
            )}

            {/* ── FLOATING ID BOX ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-30 -mt-10 mb-4">
                <div className="bg-white rounded-2xl md:rounded-[24px] shadow-lg border border-slate-100 p-3 md:p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                            <img src={cat.image || "https://via.placeholder.com/150"} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col pt-0.5">
                            <span className="text-slate-800 font-black text-sm md:text-base mb-0.5">Player ID</span>
                            <span className="text-slate-500 font-bold text-[10px] md:text-xs leading-tight">
                                {savedPlayerId ? (
                                    <span>
                                        Saved ID: {savedPlayerId}
                                        {savedPlayerName && <span className="text-blue-600 block sm:inline sm:ml-1">({savedPlayerName})</span>}
                                    </span>
                                ) : "Choose a pack — we'll ask for your ID"}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setPlayerId(savedPlayerId || "");
                            if (savedPlayerId) {
                                // Just check again to populate name
                                checkPlayer(savedPlayerId);
                            } else {
                                setPlayerName(savedPlayerName || "");
                            }
                            setIsIdModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-8 py-2 md:py-2.5 rounded-xl font-black text-xs md:text-sm transition shadow-sm whitespace-nowrap shrink-0"
                    >
                        {savedPlayerId ? "Change" : "Add ID"}
                    </button>
                </div>
            </div>

            {/* ── TABS & PRODUCTS AREA (LIGHT THEME) ── */}
            <div className="bg-[#f4f7fa] rounded-t-[32px] -mt-6 relative z-20 min-h-[50vh] text-[#111827] pt-2">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    
                    {/* PACKAGES HEADER */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="h-px bg-slate-300 flex-1 max-w-[100px]"></div>
                        <span className="px-4 text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Packages</span>
                        <div className="h-px bg-slate-300 flex-1 max-w-[100px]"></div>
                    </div>

                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {(products || []).map((p: any) => {
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => openModal(p)}
                                    className="bg-white rounded-[20px] md:rounded-[24px] p-2 text-left flex flex-col shadow-sm border border-slate-100"
                                >
                                    {/* Image Area */}
                                    <div className="w-full aspect-square rounded-[16px] md:rounded-[20px] overflow-hidden bg-[#151a28] flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
                                        <img src={p.image || cat.image || "https://via.placeholder.com/150"} alt={p.title} className="w-full h-full object-cover relative z-0" />
                                    </div>

                                    {/* Details Area */}
                                    <div className="px-2 pt-3 pb-2 flex flex-col flex-1">
                                        <div className="text-slate-800 font-black text-xs md:text-sm">
                                            {p.title || p.catalogue_name}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-3">
                                            <div className="text-[#10b981] font-black text-sm md:text-base tracking-tight">
                                                ${Number(p.sell_price || 0).toFixed(2)}
                                            </div>
                                            <div className="bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider group-hover:bg-[#10b981] group-hover:text-white transition-colors">
                                                Buy
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {!products?.length && <div className="text-center py-20 text-slate-400 font-bold">Products wali lama gelin category-kan.</div>}
                </div>
            </div>

            {/* ════════════════════════════════════════
                ID-ONLY MODAL (For floating box)
            ════════════════════════════════════════ */}
            {isIdModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
                    <div className="animate-[slideUp_.3s_ease-out] w-full max-w-md bg-white rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                            <div className="w-8" />
                            <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-widest">
                                Enter Player ID
                            </h2>
                            <button onClick={() => setIsIdModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                    <Gamepad2 size={14} className="text-rose-500" /> Game ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="Tusaale: 5123456788"
                                    value={playerId}
                                    onChange={e => setPlayerId(e.target.value)}
                                    onBlur={e => checkPlayer(e.target.value)}
                                    className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 font-bold text-gray-800 outline-none focus:border-blue-500 transition"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                    <User size={14} className="text-purple-500" /> Player Name
                                </label>
                                <div className={`w-full border-2 rounded-2xl px-4 py-4 font-bold text-sm transition
                                    ${!playerName ? "border-gray-100 bg-gray-50 text-gray-300" :
                                        playerName === "Checking..." ? "border-blue-100 bg-blue-50 text-blue-400" :
                                        playerName === "Not Found" || playerName === "Error" ? "border-red-100 bg-red-50 text-red-500" :
                                        "border-green-100 bg-green-50 text-green-600"}`}>
                                    {playerName || "Auto-detect"}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSavedPlayerId(playerId);
                                    setSavedPlayerName(playerName);
                                    setIsIdModalOpen(false);
                                }}
                                disabled={checking || !playerId || playerName === "Not Found" || playerName === "Error" || playerName === "Checking..."}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/25 mt-2"
                            >
                                Save Player ID
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
                PRODUCT CHECKOUT MODAL
            ════════════════════════════════════════ */}
            {selectedProduct && !isIdModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
                    <div className="animate-[slideUp_.3s_ease-out] w-full max-w-md bg-white rounded-[2rem] flex flex-col shadow-2xl overflow-hidden max-h-[95vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                            <div className="w-8" />
                            <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-widest">
                                {step === "id" ? "Enter Player ID" : "Checkout"}
                            </h2>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 pb-8 flex flex-col gap-5">

                            {/* ── PRODUCT CARD (shown in both steps) ── */}
                            <div
                                className="relative rounded-3xl p-5 overflow-hidden shadow-lg border border-blue-400/20"
                                style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}
                            >
                                {/* bg image overlay */}
                                <div className="absolute right-0 top-0 h-full w-2/5 opacity-30 pointer-events-none"
                                    style={{ backgroundImage: `url(${cat.image})`, backgroundSize: "cover", backgroundPosition: "center right" }} />

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-md shrink-0">
                                        <img src={cat.image || "https://via.placeholder.com/150"} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                    <div className="text-white">
                                        <div className="text-[10px] font-black uppercase opacity-70 tracking-widest">{cat.name}</div>
                                        <h3 className="text-lg font-black flex items-center gap-1.5 mt-0.5">
                                            <Gamepad2 size={16} className="opacity-70" />
                                            {selectedProduct.title || selectedProduct.catalogue_name}
                                        </h3>
                                        <div className="text-2xl font-black mt-1">
                                            ${Number(selectedProduct.sell_price || 0).toFixed(2)}
                                            <span className="text-xs opacity-60 ml-1">USD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ══════════════════════
                                STEP 1 — Player ID
                            ══════════════════════ */}
                            {step === "id" && (
                                <>
                                    {/* Game ID input */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                            <Gamepad2 size={14} className="text-rose-500" /> Game ID
                                        </label>
                                        <input
                                            id="player-id-input"
                                            type="text"
                                            placeholder="Tusaale: 5123456788"
                                            value={playerId}
                                            onChange={e => setPlayerId(e.target.value)}
                                            onBlur={e => checkPlayer(e.target.value)}
                                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-4 font-bold text-gray-800 outline-none focus:border-blue-500 transition"
                                        />
                                    </div>

                                    {/* Player Name (auto-detect) */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                            <User size={14} className="text-purple-500" /> Player Name
                                        </label>
                                        <div className={`w-full border-2 rounded-2xl px-4 py-4 font-bold text-sm transition
                                            ${!playerName ? "border-gray-100 bg-gray-50 text-gray-300" :
                                                playerName === "Checking..." ? "border-blue-100 bg-blue-50 text-blue-400" :
                                                playerName === "Not Found" || playerName === "Error" ? "border-red-100 bg-red-50 text-red-500" :
                                                "border-green-100 bg-green-50 text-green-600"}`}>
                                            {playerName || "Auto-detect"}
                                        </div>
                                    </div>

                                    {/* Warning */}
                                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                                            <span className="font-black">Digniin:</span> Hubi in ID-ga game-ku sax yahay. ID khaldan lacag celin lama sameyn karo.
                                        </p>
                                    </div>

                                    {/* Continue button */}
                                    <button
                                        onClick={continueToPayment}
                                        disabled={checking || !playerId || playerName === "Not Found" || playerName === "Error" || playerName === "Checking..."}
                                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/25"
                                    >
                                        Continue to Payment <ChevronRight size={18} />
                                    </button>
                                </>
                            )}

                            {/* ══════════════════════
                                STEP 2 — Checkout
                            ══════════════════════ */}
                            {step === "checkout" && (
                                <div className="animate-[slideUp_.3s_ease-out]">
                                    {/* Player info summary */}
                                    <div className="bg-gray-50 rounded-3xl divide-y divide-gray-100 border border-gray-100 mb-6">
                                        <div className="flex items-center gap-4 p-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Player Name</div>
                                                <div className="font-black text-gray-800 text-sm">{playerName}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                                <Gamepad2 size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Player ID</div>
                                                <div className="font-black text-gray-800 text-sm">{playerId}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gateway */}
                                    <div>
                                        <h3 className="text-[10px] font-black text-[#1a2b4b] uppercase tracking-widest mb-3">Gateway</h3>
                                        <div className="space-y-3">
                                            {/* Waafi */}
                                            <button
                                                onClick={() => setSelectedPayment("waafi")}
                                                className={`w-full bg-white rounded-3xl p-4 flex items-center justify-between transition-all border-2 shadow-sm
                                                    ${selectedPayment === "waafi" ? "border-blue-500 shadow-blue-100 scale-[1.02]" : "border-gray-100 hover:border-gray-200"}`}
                                            >
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                                                        <span className="text-green-600 font-black italic text-base">Wf</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-800 text-[13px]">EVC / ZAAD / SAHAL / JEEB / SOTELCO</div>
                                                        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">Fast &amp; secure payment</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-300" />
                                            </button>

                                            {/* eDahab */}
                                            <button
                                                onClick={() => setSelectedPayment("edahab")}
                                                className={`w-full bg-white rounded-3xl p-4 flex items-center justify-between transition-all border-2 shadow-sm
                                                    ${selectedPayment === "edahab" ? "border-emerald-500 shadow-emerald-100 scale-[1.02]" : "border-gray-100 hover:border-gray-200"}`}
                                            >
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-emerald-600 font-black text-[11px]">eDahab</div>
                                                    <div>
                                                        <div className="font-black text-gray-800 text-[14px]">eDahab Payment</div>
                                                        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">Secure &amp; Instant</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-300" />
                                            </button>

                                            {/* Visa/MasterCard */}
                                            <button
                                                onClick={() => setSelectedPayment("card")}
                                                className={`w-full bg-white rounded-3xl p-4 flex items-center justify-between transition-all border-2 shadow-sm opacity-50
                                                    ${selectedPayment === "card" ? "border-red-300 scale-[1.02]" : "border-gray-100 hover:border-gray-200"}`}
                                            >
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                                                        <div className="flex -space-x-1.5">
                                                            <div className="w-4 h-4 rounded-full bg-red-500 mix-blend-multiply" />
                                                            <div className="w-4 h-4 rounded-full bg-yellow-400 mix-blend-multiply" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-800 text-[14px]">Visa / MasterCard</div>
                                                        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">International Payment</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-300" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Phone + Pay (after gateway chosen) */}
                                    {(selectedPayment === "waafi" || selectedPayment === "edahab") && (
                                        <div className="animate-[slideUp_.3s_ease-out] mt-6 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                <Phone size={11} className="inline mr-1" />Numberka Lacag-bixinta
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Tusaale: 25261XXXXXXX"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 font-black text-gray-800 outline-none focus:border-blue-500 transition mb-4"
                                            />
                                            {message && (
                                                <div className={`mb-4 rounded-xl p-3 text-xs font-bold ${message.includes("❌") || message.includes("⚠️") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                                    {message}
                                                </div>
                                            )}
                                            <button
                                                onClick={handlePayment}
                                                disabled={loading || !phone}
                                                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/25"
                                            >
                                                {loading ? "Processing..." : "Pay Now"} <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}

                                    {selectedPayment === "card" && (
                                        <div className="animate-[slideUp_.3s_ease-out] mt-6 bg-gray-50 rounded-3xl p-5 text-center border border-gray-100">
                                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500">
                                                <AlertTriangle size={20} />
                                            </div>
                                            <h4 className="font-black text-[#1a2b4b] mb-1 text-sm">Coming Soon</h4>
                                            <p className="text-xs text-gray-500">Kaararka Visa iyo MasterCard waqti dhaw ayaa lagu soo darayaa!</p>
                                        </div>
                                    )}

                                    {/* Back link */}
                                    <button onClick={() => setStep("id")} className="mt-6 w-full text-xs text-gray-400 hover:text-gray-600 font-bold text-center transition">
                                        ← Ku noqo ID-ga
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
