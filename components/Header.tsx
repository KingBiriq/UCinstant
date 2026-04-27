"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Bell, Menu, User, Home, ShoppingBag, PhoneCall, UserCircle } from "lucide-react";

export default function Header() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* ── TOP HEADER (Desktop & Mobile) ── */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
                    
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                            <Gamepad2 size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-black tracking-tight text-[#1a2b4b]">BIRIQ</span>
                                <span className="text-xl font-black tracking-tight text-pink-500">STORE</span>
                            </div>
                        </div>
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <Link href="/" className={`text-sm font-bold ${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Home</Link>
                        <Link href="#" className="text-sm font-bold text-gray-600 hover:text-blue-600">Shuruudaha</Link>
                        <Link href="/orders" className={`text-sm font-bold ${pathname === '/orders' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Orders</Link>
                        <Link href="#" className="text-sm font-bold text-gray-600 hover:text-blue-600">News</Link>
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-800 transition">
                            <Bell size={22} />
                        </button>
                        
                        {/* Desktop Profile Button */}
                        <Link href="/profile" className="hidden md:flex items-center gap-2 bg-[#1a2b4b] hover:bg-[#0f1930] text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-md shadow-[#1a2b4b]/20">
                            <User size={16} /> Profile
                        </Link>
                        
                        {/* Mobile Menu Icon */}
                        <button className="md:hidden text-gray-800">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── MOBILE BOTTOM NAVIGATION (Animated White & Orange) ── */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-gradient-to-t from-[#f4f7fb] via-[#f4f7fb]/80 to-transparent pt-10 pb-4 px-4 pointer-events-none">
                <nav className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex justify-between items-center relative pointer-events-auto px-2">
                    {[
                        { href: '/', icon: Home, label: 'Home' },
                        { href: '/orders', icon: ShoppingBag, label: 'Orders' },
                        { href: '#', icon: PhoneCall, label: 'Contact' },
                        { href: '/profile', icon: User, label: 'Profile' },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.label}
                                href={item.href} 
                                className="relative flex-1 flex flex-col items-center justify-center h-16 w-full group"
                            >
                                <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-out ${isActive ? '-translate-y-5' : 'translate-y-0 group-hover:-translate-y-1'}`}>
                                    <div className={`flex items-center justify-center transition-all duration-500 ease-out ${
                                        isActive 
                                            ? 'w-14 h-14 bg-orange-500 text-white rounded-full border-[6px] border-[#f4f7fb] shadow-[0_8px_16px_rgba(249,115,22,0.4)]' 
                                            : 'w-10 h-10 text-slate-400 group-hover:text-orange-400'
                                    }`}>
                                        <Icon size={isActive ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                </div>
                                <span className={`absolute bottom-2 text-[10px] font-black tracking-wide transition-all duration-500 ease-out ${isActive ? 'translate-y-0 opacity-100 text-orange-500' : 'translate-y-4 opacity-0 text-slate-400'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
