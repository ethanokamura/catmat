import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/context/auth-context";
import Navbar from "@/components/shared/navbar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://catmat.shop"),
  title: "CATMAT",
  description:
    "Quality desk mats crafted for the modern workspace. Minimalist design meets exceptional functionality.",
  keywords: ["desk mat", "mousepad", "workspace", "minimalist", "premium"],
  openGraph: {
    title: "CATMAT",
    description: "Quality desk mats crafted for the modern workspace",
    type: "website",
    url: "https://catmat.shop",
    siteName: "CATMAT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CATMAT - Quality desk mats for the modern workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CATMAT",
    description: "Quality desk mats crafted for the modern workspace",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
