"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, Users, ShoppingCart, CreditCard, 
    Package, BarChart2, Globe, LogOut, Shield 
} from "lucide-react";
import ClientAlertButton from "@/components/ClientAlertButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Payments", href: "/admin/payments", icon: CreditCard },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Reports", href: "/admin/reports", icon: BarChart2 },
        { name: "Landing Page", href: "/admin/landing", icon: Globe },
    ];

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-[#f5f7fb] overflow-hidden text-[#1a2b4b]">
            
            {/* ── MOBILE HEADER ── */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <Shield size={16} className="fill-purple-600 text-purple-100" />
                    </div>
                    <span className="font-black text-lg tracking-tight">Admin Panel</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>

            {/* ── MOBILE MENU OVERLAY ── */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between h-full overflow-y-auto transition-transform duration-300
                md:relative md:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
            `}>
                <div>
                    {/* Brand */}
                    <div className="h-20 flex items-center px-6 gap-3 border-b border-gray-50 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <Shield size={20} className="fill-purple-600 text-purple-100" />
                        </div>
                        <span className="font-black text-lg tracking-tight">Admin Panel</span>
                    </div>

                    {/* Nav Links */}
                    <nav className="px-4 space-y-1">
                        {links.map(link => {
                            const isActive = pathname === link.href || (link.href !== "/admin" && link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                                        isActive 
                                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                                >
                                    <link.icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer User Info */}
                <div className="p-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div>
                            <div className="text-sm font-black">Biriq Store</div>
                            <div className="text-xs text-gray-400">biriqstore@gmail.com</div>
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-600 tracking-wider">ADMIN</div>
                        </div>
                    </div>
                    <ClientAlertButton message="Weli lama xirin nidaamka Login-ka (Coming Soon)" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition">
                        <LogOut size={16} /> Logout
                    </ClientAlertButton>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
}
