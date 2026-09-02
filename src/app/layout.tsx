import type { Metadata } from "next";
import { Cinzel_Decorative, Figtree, Fraunces } from "next/font/google";

import { ParallaxBackground } from "@/components/parallax-background";
import { ScrollIntro } from "@/components/scroll-intro";

import "./globals.css";

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
});

const heading = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

const scrollTitle = Cinzel_Decorative({
  variable: "--font-cinzel-scroll",
  subsets: ["latin"],
  weight: "700",
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
      className={`${sans.variable} ${heading.variable} ${scrollTitle.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("pranzo-scroll-intro")==="1")document.documentElement.classList.add("scroll-intro-seen")}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`.scroll-intro{display:none!important}`}</style>
        </noscript>
        <ParallaxBackground />
        <ScrollIntro />
        <div className="page-shell relative z-10 flex min-h-full flex-col">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
