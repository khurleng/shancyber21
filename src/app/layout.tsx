import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Footer } from "@/components/Footer";

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const PopupWidget = dynamic(() => import('@/components/PopupWidget'), { ssr: false });


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shan Cyber",
  description: "Empowering Your Digital Future, သၢင်ႈတၢင်ႉႁဵင်းပၢႆးယွတ်ႇမၢႆမိူဝ်းၼႃႈသူ",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon11.png?v=2",
    },
    {
      rel: "shortcut icon",
      type: "image/png",
      url: "/favicon1.png?v=2",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon1.png?v=2",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="lg:mx-12">{children}</div>
          <Footer />
          <PopupWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
