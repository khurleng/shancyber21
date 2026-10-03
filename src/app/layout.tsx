import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  title: "Shan Cyber — Ideas into possibilities",
  description: "Computer care, IT equipment, web development, graphic design, and practical digital skills. Build your digital future with Shan Cyber.",
  icons: { icon: "/favicon1.png", apple: "/favicon1.png" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" forcedTheme="light"><a href="#main-content" className="skip-link">Skip to content</a><Navbar/><main id="main-content">{children}</main><Footer/></ThemeProvider></body></html>;
}
