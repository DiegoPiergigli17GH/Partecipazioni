import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

import { ParallaxBackground } from "@/components/parallax-background";

import "./globals.css";

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
});

const heading = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Whimsical Canarian Lunch",
  description:
    "I cast end of summer banquet. Requires zero mana, just bring your appetite.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${sans.variable} ${heading.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ParallaxBackground />
        <div className="page-shell relative z-10 flex min-h-full flex-col">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
