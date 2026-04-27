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

            {/* ── MOBILE BOTTOM NAVIGATION (Reverted & Simplified) ── */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-100 px-4 py-2">
                <nav className="flex justify-between items-center relative px-2">
                    {[
                        { href: '/', icon: Home, label: 'Home' },
                        { href: '/orders', icon: ShoppingBag, label: 'Orders' },
                        { href: '/contact', icon: PhoneCall, label: 'Contact' },
                        { href: '/profile', icon: User, label: 'Profile' },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.label}
                                href={item.href} 
                                className="relative flex-1 flex flex-col items-center justify-center h-14 w-full group"
                            >
                                <div className="flex flex-col items-center justify-center transition-all duration-300">
                                    <div className={`flex items-center justify-center transition-all duration-300 ${
                                        isActive 
                                            ? 'w-12 h-12 bg-blue-500 text-white rounded-full border-[3px] border-white shadow-lg shadow-blue-400/20' 
                                            : 'w-10 h-10 text-slate-400 group-hover:text-blue-400'
                                    }`}>
                                        <Icon size={isActive ? 20 : 24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black tracking-wide mt-1 transition-all duration-300 ${isActive ? 'text-blue-500 opacity-100' : 'text-slate-400 opacity-0 h-0'}`}>
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
