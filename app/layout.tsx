import "./globals.css";import Header from "@/components/Header";
export const metadata={title:"Biriq Store - Gaming Topup",description:"Professional gaming top-up system"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="so"><body><Header/>{children}</body></html>}
