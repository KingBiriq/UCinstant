"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus } from "lucide-react";

export default function PaymentChannelsPage() {
    const [numbers, setNumbers] = useState<any[]>([]);
    const [addType, setAddType] = useState<"none" | "number" | "card">("none");
    const [newNumber, setNewNumber] = useState("");
    const [newNetwork, setNewNetwork] = useState("EVC Plus");
    const [cardData, setCardData] = useState({
        number: "", expiry: "", cvc: "", firstName: "", lastName: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem("saved_phones");
        if (saved) {
            try {
                setNumbers(JSON.parse(saved));
            } catch (e) {}
        } else {
            // Default mock data to show the design initially
            setNumbers([
                { id: "1", number: "610573693", network: "EVC Plus" },
                { id: "2", number: "610000000", network: "eDahab" }
            ]);
        }
    }, []);

    const saveNumbers = (newNums: any[]) => {
        setNumbers(newNums);
        localStorage.setItem("saved_phones", JSON.stringify(newNums));
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (addType === "number") {
            if (!newNumber) return;
            const newNums = [...numbers, { 
                id: Date.now().toString(), 
                number: newNumber, 
                network: newNetwork 
            }];
            saveNumbers(newNums);
            setNewNumber("");
        } else if (addType === "card") {
            if (!cardData.number) return;
            const newNums = [...numbers, { 
                id: Date.now().toString(), 
                number: cardData.number, 
                network: "MasterCard" 
            }];
            saveNumbers(newNums);
            setCardData({ number: "", expiry: "", cvc: "", firstName: "", lastName: "" });
        }
        
        setAddType("none");
    };

    const handleRemove = (id: string) => {
        const newNums = numbers.filter(n => n.id !== id);
        saveNumbers(newNums);
    };

    const maskNumber = (num: string) => {
        if (num.length <= 4) return num;
        const last4 = num.slice(-4);
        return `•••• •••• ${last4}`;
    };

    return (
        <main className="min-h-screen bg-[#f4f7fb] pt-8 pb-32 font-sans">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* ── HEADER ── */}
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition mb-6">
                        <ArrowLeft size={16} /> Back to Profile
                    </Link>
                    <h1 className="text-2xl font-black text-[#1a2b4b] tracking-wide uppercase">PAYMENT CHANNELS</h1>
                </div>

                {/* ── MY CHANNELS SECTION ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                        <h2 className="text-lg font-black text-[#1a2b4b]">Payment Channels</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setAddType(addType === "number" ? "none" : "number")}
                            className="text-blue-500 hover:text-blue-400 font-bold text-sm flex items-center gap-1 transition"
                        >
                            Add New Number <Plus size={16} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={() => setAddType(addType === "card" ? "none" : "card")}
                            className="text-blue-500 hover:text-blue-400 font-bold text-sm flex items-center gap-1 transition"
                        >
                            Add New Card <Plus size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* ── ADD FORM ── */}
                {addType === "number" && (
                    <form onSubmit={handleAdd} className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 md:p-8 mb-8 animate-[slideDown_.2s_ease-out]">
                        <h3 className="text-[#1a2b4b] font-bold mb-4 border-l-2 border-blue-600 pl-2">Add a Mobile Number</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Phone Number</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                    placeholder="e.g. 61xxxxxxx"
                                    value={newNumber}
                                    onChange={(e) => setNewNumber(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Network</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition appearance-none"
                                    value={newNetwork}
                                    onChange={(e) => setNewNetwork(e.target.value)}
                                >
                                    <option className="bg-white">EVC Plus</option>
                                    <option className="bg-white">eDahab</option>
                                    <option className="bg-white">Zaad</option>
                                    <option className="bg-white">Sahal</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setAddType("none")} className="px-8 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                            <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition shadow-sm">Save</button>
                        </div>
                    </form>
                )}

                {addType === "card" && (
                    <form onSubmit={handleAdd} className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 md:p-8 mb-8 animate-[slideDown_.2s_ease-out]">
                        <h3 className="text-[#1a2b4b] font-bold mb-6 border-l-2 border-blue-600 pl-2">Add a Credit/Debit/Prepaid Card</h3>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Card No.</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                        placeholder="Fill the blank"
                                        value={cardData.number}
                                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                        autoFocus
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Expiration date</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                            placeholder="MM/YY"
                                            value={cardData.expiry}
                                            onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Security Code</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                            placeholder="Fill the blank"
                                            value={cardData.cvc}
                                            onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">First Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                            placeholder="Fill the blank"
                                            value={cardData.firstName}
                                            onChange={(e) => setCardData({...cardData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Last Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-blue-600 transition"
                                            placeholder="Fill the blank"
                                            value={cardData.lastName}
                                            onChange={(e) => setCardData({...cardData, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-start pt-2">
                                <div className="w-56 h-36 bg-gradient-to-br from-[#1a2b4b] to-[#0f1930] rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
                                    <div className="w-10 h-8 bg-white/20 rounded-md backdrop-blur-sm"></div>
                                    <div className="flex justify-between items-end w-full relative z-10">
                                        <div className="text-white/80 text-[10px] font-bold">
                                            <div className="mb-1 text-white/50">Card holder</div>
                                            <div className="tracking-widest font-mono text-white">••••</div>
                                        </div>
                                        <div className="text-white/80 text-[10px] font-bold text-right">
                                            <div className="mb-1 text-white/50">Expires</div>
                                            <div className="tracking-widest font-mono text-white">••••</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-[10px] text-slate-500 flex items-start gap-2 max-w-[220px]">
                                    <span className="font-black text-emerald-500 mt-0.5">PCI</span>
                                    <span>Your Card Information is secured by PCI DSS compliant systems.</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-slate-800 font-bold text-sm">Link your card and enjoy your rewards!</span>
                            </label>
                            
                            <div className="flex items-center gap-4 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                                <div className="text-2xl drop-shadow-sm">🎁</div>
                                <p className="text-orange-600 text-xs font-bold leading-tight">Save a card to get now! Just mark the checkbox below. Check details</p>
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs mt-6 mb-6 leading-relaxed">
                            To protect this transaction, we will initiate a one-dollar pre-authorization deduction. There will be no actual deduction for this transaction. Please process now
                        </p>

                        <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
                            <button type="button" onClick={() => setAddType("none")} className="w-full sm:w-auto px-10 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                            <button type="submit" className="w-full sm:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition shadow-sm border border-blue-600">Save</button>
                        </div>
                    </form>
                )}

                {/* ── CARDS GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {numbers.map((num) => (
                        <div key={num.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#d97706] to-[#fbbf24] p-6 shadow-xl aspect-[1.8/1] flex flex-col justify-between group">
                            {/* Overlay pattern for texture */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_0%,transparent_100%)] pointer-events-none"></div>
                            
                            <div className="relative z-10 flex items-center gap-3">
                                {/* Simulated Wallet Icon / Logo */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-80 mix-blend-multiply translate-x-1"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 mix-blend-multiply -translate-x-1"></div>
                                </div>
                            </div>

                            <div className="relative z-10 w-full text-center mt-2">
                                <span className="font-mono text-2xl font-bold text-white tracking-[0.2em] md:tracking-[0.3em] drop-shadow-md">
                                    {maskNumber(num.number)}
                                </span>
                            </div>

                            <div className="relative z-10 flex items-center justify-between w-full mt-auto pt-4 border-t border-white/20">
                                <span className="text-white font-bold text-sm drop-shadow-sm">{num.network}</span>
                                <button 
                                    onClick={() => handleRemove(num.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/10 hover:bg-black/20 rounded-lg text-white/90 text-xs font-bold transition backdrop-blur-sm"
                                >
                                    <Trash2 size={12} /> remove
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {numbers.length === 0 && addType === "none" && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold bg-white">
                            No payment channels found. Click above to add one.
                        </div>
                    )}
                </div>

                {/* ── FOOTER LOGO ── */}
                <div className="mt-16 pt-8 border-t border-slate-200 text-center md:text-left">
                    <p className="text-slate-400 text-xs font-bold">
                        Biriq Store is the official recharge store. Pay Safe, fast and fun at Biriq Store.
                    </p>
                </div>

            </div>
        </main>
    );
}
