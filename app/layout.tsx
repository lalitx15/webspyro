import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NoZoom } from "@/components/ui/no-zoom";
import { ServiceWorkerRegister } from "@/components/ui/service-worker-register";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { AnalyticsProvider } from "@/components/seo/analytics-provider";
import { MorphingCursor } from "@/components/ui/morphing-cursor";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#EEF2F7",
};

export const metadata: Metadata = {
  title: {
    default: "Webspyra | Premium Web Development & Digital Solutions",
    template: "%s | Webspyra",
  },
  description:
    "Launch your professional business website with Webspyra. High-speed, responsive, animated, and conversion-focused web solutions.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Webspyra",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-[100dvh] font-sans antialiased bg-base text-textPrimary selection:bg-accent/20 selection:text-accent">
        <AnalyticsProvider />
        <MorphingCursor />
        <NoZoom />
        <ServiceWorkerRegister />
        <AuthProvider>
          <ToastProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
