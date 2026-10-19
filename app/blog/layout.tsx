import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Web Development, SEO & E-Commerce Insights",
  description: "Practical guides on website performance, technical SEO, modern web design, and e-commerce growth for Indian businesses.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: "Web Development, SEO & E-Commerce Insights",
    description: "Practical guides on website performance, technical SEO, modern web design, and e-commerce growth for Indian businesses.",
    siteName: "Webspyra",
  },
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
