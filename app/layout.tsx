import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@shelby-protocol/ui/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Clone - Shelby",
  description: "Instagram clone built with Next.js, Supabase, and Shelby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var key = 'shelby-theme';
    var stored = window.localStorage.getItem(key);
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
        {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
