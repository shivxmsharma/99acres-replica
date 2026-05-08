import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { CompareProvider } from "@/context/CompareContext";
import AiAssistant from "@/components/ai/AiAssistant";
import NotificationListener from "@/components/common/NotificationListener";
import CompareBar from "@/components/property/CompareBar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "99acres Replica | Real Estate, Property in India, Buy/Sale/Rent",
  description: "Exact replica of 99acres.com - Real estate portal for buying, selling, and renting properties.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CompareProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <NotificationListener />
              <CompareBar />
              <AiAssistant />
              <Toaster position="top-center" reverseOrder={false} />
            </div>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
