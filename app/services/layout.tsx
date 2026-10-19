import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Website Development Services",
  description: "Explore Webspyra's business website, e-commerce, and custom web application development services built for performance, mobile usability, and search visibility.",
  alternates: { canonical: `${siteUrl}/services` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/services`,
    title: "Website Development Services | Webspyra",
    description: "Business websites, e-commerce stores, and custom web applications built for speed and search visibility.",
    siteName: "Webspyra",
  },
};
export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
