import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { Sidebar, BottomNav } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/components/auth/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowVolt | P2P Energy Marketplace",
  description: "Cloud-native P2P energy trading platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50">
        <AuthProvider>
          <ReactQueryProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 w-full md:pl-64 h-full relative">
                <Header />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
                  {children}
                </main>
              </div>
            </div>
            <BottomNav />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
