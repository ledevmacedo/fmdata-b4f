import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "@/components/glaze/styles.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GlazePortalProvider } from "@/lib/glaze/portal";
import { AppStoreProvider } from "@/providers/app-store-provider";
import "lenis/dist/lenis.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FMData · O teu histórico de Last.fm",
  description:
    "Um arquivo pessoal de escuta: artistas, álbuns e padrões do teu histórico de Last.fm.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="glaze flex min-h-dvh flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';var r=document.documentElement;r.dataset.theme=t;if(t==='dark')r.classList.add('dark');else r.classList.remove('dark');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}})();`}
        </Script>
        <GlazePortalProvider>
          <AppStoreProvider>
            <SmoothScroll />
            {/* usePathname() is runtime-only, so the masthead streams in after the shell is prerendered. */}
            <Suspense
              fallback={<div className="h-14 border-b border-line-faint" />}
            >
              <SiteHeader />
            </Suspense>
            {children}
            <SiteFooter />
          </AppStoreProvider>
        </GlazePortalProvider>
      </body>
    </html>
  );
}
