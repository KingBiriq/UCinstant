import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSupport from "@/components/FloatingSupport";

export const metadata={title:"Biriq Store - Gaming Topup",description:"Professional gaming top-up system"};

export default function Layout({children}:{children:React.ReactNode}){
    return (
        <html lang="so">
            <body>
                <Header/>
                {children}
                <Footer/>
            </body>
        </html>
    );
}
