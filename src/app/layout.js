import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import AuthProvider from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ManagX",
  description: "Full-stack authentication with Next.js and Next-Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
