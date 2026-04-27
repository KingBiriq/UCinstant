"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function Page({ params }: { params: { productId: string } }) {
    const [product, setProduct] = useState<any>();
    const [playerId, setPlayerId] = useState("");
    const [phone, setPhone] = useState("");
    const [player, setPlayer] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"waafi" | "edahab">("waafi");
    const [savedPhones, setSavedPhones] = useState<any[]>([]);
    const [useSavedPhone, setUseSavedPhone] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("saved_phones");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSavedPhones(parsed);
                if (parsed.length > 0) {
                    const firstPhone = parsed[0].number;
                    setPhone(firstPhone);
                    setUseSavedPhone(true);
                }
            } catch (e) {}
        }
        
        const search = new URLSearchParams(window.location.search);
        const urlPlayerId = search.get("playerId");
        if (urlPlayerId) setPlayerId(urlPlayerId);
    }, []);

    // Auto-detect payment gateway based on phone number prefix
    useEffect(() => {
        if (!phone) return;
        const cleaned = phone.replace(/\D/g, '');
        let prefix = cleaned;
        if (cleaned.startsWith('252')) prefix = cleaned.substring(3);
        else if (cleaned.startsWith('0')) prefix = cleaned.substring(1);

        if (prefix.startsWith('65') || prefix.startsWith('66')) {
            setPaymentMethod("edahab");
        } else if (prefix.length > 1) {
            setPaymentMethod("waafi");
        }
    }, [phone]);

    useEffect(() => {
        async function loadProduct() {
            const s = supabaseBrowser();

            const { data, error } = await s
                .from("products")
                .select("*, categories(*)")
                .eq("id", params.productId)
                .single();

            if (error) {
                setMessage(error.message);
                return;
            }

            setProduct(data);
        }

        loadProduct();
    }, [params.productId]);

    async function checkPlayer() {
        if (!product?.game_code) return alert("Game lama helin.");
        if (!playerId) return alert("Fadlan geli Player ID.");

        setLoading(true);
        setMessage("");
        setPlayer(null);

        try {
            const res = await fetch("/api/g2bulk/check-player", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game: product.game_code, user_id: playerId, server_id: "" }),
            });

            const data = await res.json();

            if (data.valid === "valid" || data.valid === true) {
                setPlayer(data);
                setShowPayment(true);
            } else {
                setMessage("❌ Player ID-ga waa khaldan yahay, fadlan sax.");
            }
        } catch {
            setMessage("❌ Player ID-ga waa khaldan yahay ama system busy yahay.");
        } finally {
            setLoading(false);
        }
    }

    async function createPendingOrder() {
        const pendingRes = await fetch("/api/orders/create-pending", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_id: product.id,
                phone,
                player_id: playerId,
                player_name: player?.name || "",
                server_id: "",
                amount_paid: product.sell_price,
            }),
        });

        return pendingRes.json();
    }

    async function updateOrder(orderId: string, payload: any) {
        return fetch(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    }

    async function sendDelivery(orderId: string) {
        const deliveryRes = await fetch("/api/orders/send-delivery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId }),
        });

        return deliveryRes.json();
    }

    async function payWithWaafi() {
        if (!product || !player || !phone) {
            alert("Fadlan buuxi xogta oo dhan.");
            return;
        }

        setLoading(true);
        setMessage("Payment request ayaa telefoonkaaga loo diray...");

        try {
            const pendingData = await createPendingOrder();

            if (!pendingData.success) {
                setMessage(pendingData.message || "Order lama abuurin.");
                return;
            }

            const orderId = pendingData.order.id;

            const paymentRes = await fetch("/api/payments/waafi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    amount: product.sell_price,
                    order_id: orderId,
                    description: `${product.title || product.catalogue_name} - ${playerId}`,
                }),
            });

            const paymentData = await paymentRes.json();

            if (!paymentData.success || !paymentData.paid) {
                await updateOrder(orderId, {
                    payment_status: "FAILED",
                    delivery_status: "NOT_SENT",
                    waafi_reference: paymentData.referenceId || null,
                    payment_message: paymentData.message || "Payment failed",
                });

                setMessage("❌ Payment failed ama waad cancel-gareysay. Mar kale isku day.");
                return;
            }

            await updateOrder(orderId, {
                payment_status: "PAID",
                waafi_reference: paymentData.referenceId,
                payment_message: "Payment success",
            });

            const deliveryData = await sendDelivery(orderId);

            setMessage(
                deliveryData.success
                    ? "✅ Payment success. Order-ka waa la diray!"
                    : "⚠️ Payment success, delivery failed. Admin ayaa hubinaya."
            );
        } catch (error: any) {
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    async function payWithEdahab() {
        if (!product || !player || !phone) {
            alert("Fadlan buuxi xogta oo dhan.");
            return;
        }

        setLoading(true);
        setMessage("eDahab payment request ayaa telefoonkaaga loo diray...");

        try {
            const pendingData = await createPendingOrder();

            if (!pendingData.success) {
                setMessage(pendingData.message || "Order lama abuurin.");
                return;
            }

            const orderId = pendingData.order.id;

            const paymentRes = await fetch("/api/payments/edahab", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    amount: product.sell_price,
                    order_id: orderId,
                    description: `${product.title || product.catalogue_name} - ${playerId}`,
                }),
            });

            const paymentData = await paymentRes.json();

            if (!paymentData.success || !paymentData.paid) {
                await updateOrder(orderId, {
                    payment_status: "FAILED",
                    delivery_status: "NOT_SENT",
                    waafi_reference: paymentData.referenceId || null,
                    payment_message: paymentData.message || "eDahab payment failed",
                });

                setMessage("❌ eDahab payment failed ama waad cancel-gareysay. Mar kale isku day.");
                return;
            }

            await updateOrder(orderId, {
                payment_status: "PAID",
                waafi_reference: paymentData.referenceId,
                payment_message: "eDahab payment success",
            });

            const deliveryData = await sendDelivery(orderId);

            setMessage(
                deliveryData.success
                    ? "✅ eDahab payment success. Order-ka waa la diray!"
                    : "⚠️ Payment success, delivery failed. Admin ayaa hubinaya."
            );
        } catch (error: any) {
            setMessage(error.message || "eDahab payment error.");
        } finally {
            setLoading(false);
        }
    }

    async function payNow() {
        if (paymentMethod === "edahab") return payWithEdahab();
        return payWithWaafi();
    }

    if (!product) return <main className="p-10">Loading...</main>;

    return (
        <main className="min-h-screen bg-[#f5f7fb] text-[#101828]">
            <div className="mx-auto max-w-md px-4 py-6">
                <h1 className="mb-6 text-center text-xl font-black uppercase">Checkout</h1>

                <div className="overflow-hidden rounded-[26px] bg-gradient-to-r from-blue-700 to-blue-400 p-5 text-white shadow-xl">
                    <div className="text-xs font-black uppercase text-white/80">
                        {product.game_code} Top Up
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15">
                            🎮
                        </div>

                        <div>
                            <h2 className="text-2xl font-black">
                                {product.title || product.catalogue_name}
                            </h2>
                            <div className="text-3xl font-black">
                                ${Number(product.sell_price || 0).toFixed(2)}
                                <span className="ml-1 text-sm">USD</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-7 rounded-[26px] bg-white p-4 shadow-lg">
                    <label className="text-xs font-black uppercase text-slate-400">Player ID</label>

                    <input
                        value={playerId}
                        onChange={(e) => {
                            setPlayerId(e.target.value);
                            setPlayer(null);
                            setShowPayment(false);
                            setMessage("");
                        }}
                        placeholder="Geli Player ID"
                        className="mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-4 font-bold outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={checkPlayer}
                        disabled={loading || !playerId}
                        className="mt-4 w-full rounded-2xl bg-blue-700 py-4 font-black text-white"
                    >
                        {loading ? "Checking..." : "Continue"}
                    </button>

                    {message && (
                        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {showPayment && player && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40">
                    <div className="animate-[slideUp_.25s_ease-out] w-full rounded-t-[34px] bg-white p-5 text-[#101828] shadow-2xl">
                        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300" />

                        <div className="mx-auto max-w-md">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-black">Payment</h2>
                                <button
                                    onClick={() => setShowPayment(false)}
                                    className="rounded-full bg-slate-100 px-4 py-2 font-bold"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="rounded-[24px] bg-slate-50 p-4">
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-slate-500">Player Name</span>
                                    <b>{player.name}</b>
                                </div>

                                <div className="flex justify-between border-b py-3">
                                    <span className="text-slate-500">Player ID</span>
                                    <b>{playerId}</b>
                                </div>

                                <div className="flex justify-between pt-3 text-lg">
                                    <span className="text-slate-500">Total</span>
                                    <b className="text-blue-700">
                                        ${Number(product.sell_price || 0).toFixed(2)}
                                    </b>
                                </div>
                            </div>

                            <h3 className="mt-6 text-sm font-black uppercase">Gateway</h3>

                            <div className="mt-3 space-y-3">
                                <button
                                    onClick={() => setPaymentMethod("waafi")}
                                    className={`flex w-full items-center justify-between rounded-3xl border p-4 ${paymentMethod === "waafi" ? "border-blue-600 bg-blue-50" : "bg-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50">
                                            💚
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black">EVC / ZAAD / SAHAL / JEEB</div>
                                            <div className="text-xs text-slate-400">Fast & secure payment</div>
                                        </div>
                                    </div>
                                    <span>›</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("edahab")}
                                    className={`flex w-full items-center justify-between rounded-3xl border p-4 ${paymentMethod === "edahab"
                                            ? "border-green-600 bg-green-50"
                                            : "bg-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50">
                                            🟢
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black">eDahab / Somtel</div>
                                            <div className="text-xs text-slate-400">Somtel secure payment</div>
                                        </div>
                                    </div>
                                    <span>›</span>
                                </button>

                                <button
                                    disabled
                                    className="flex w-full items-center justify-between rounded-3xl border bg-white p-4 opacity-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">
                                            💳
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black">Visa / MasterCard</div>
                                            <div className="text-xs text-slate-400">Coming soon</div>
                                        </div>
                                    </div>
                                    <span>›</span>
                                </button>
                            </div>

                            <div className="mt-6">
                                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2 mb-2">
                                    📞 NUMBERKA LACAG-BIXINTA
                                </label>
                                
                                {useSavedPhone ? (
                                    <div className="flex items-center justify-between rounded-2xl border bg-slate-50 p-4">
                                        <div className="font-bold text-lg tracking-widest">
                                            {phone.slice(0, 4)}••••{phone.slice(-4)}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setUseSavedPhone(false);
                                                setPhone("");
                                            }} 
                                            className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                                        >
                                            Beddel (Change)
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={
                                            paymentMethod === "edahab"
                                                ? "Tusaale: 25265XXXXXXX"
                                                : "Tusaale: 25261XXXXXXX"
                                        }
                                        className="w-full rounded-2xl border bg-slate-50 px-4 py-4 font-bold outline-none focus:border-blue-500 transition"
                                    />
                                )}
                            </div>

                            <button
                                onClick={payNow}
                                disabled={loading || !phone}
                                className={`mt-4 w-full rounded-2xl py-4 font-black text-white ${paymentMethod === "edahab" ? "bg-green-600" : "bg-blue-700"
                                    }`}
                            >
                                {loading
                                    ? "Processing..."
                                    : paymentMethod === "edahab"
                                        ? "Pay with eDahab"
                                        : "Pay with Waafi"}
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
                </div>
            )}
        </main>
    );
}