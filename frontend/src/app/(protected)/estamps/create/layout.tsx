import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
