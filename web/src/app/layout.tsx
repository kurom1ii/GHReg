import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GHReg Dashboard",
  description: "Outlook Mail + GitHub Account Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply stored theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex bg-background antialiased">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen">
          <div className="pt-6 px-6 md:pt-8 md:px-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
