import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const handwriting = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "A Birthday Experience",
  description: "A cinematic interactive birthday journey",
  robots: "noindex, nofollow",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${handwriting.variable} h-full overflow-hidden`}
      suppressHydrationWarning
    >
      <body
        className="h-full overflow-hidden bg-primary font-body text-text-primary antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
