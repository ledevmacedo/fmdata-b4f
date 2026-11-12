import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/components/glaze/styles.css";
import { GlazePortalProvider } from "@/lib/glaze/portal";
import { AppStoreProvider } from "@/providers/app-store-provider";
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
  title: "FMData",
  description: "Histórico de reproduções do Last.fm.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="glaze min-h-dvh">
        <GlazePortalProvider>
          <AppStoreProvider>{children}</AppStoreProvider>
        </GlazePortalProvider>
      </body>
    </html>
  );
}
