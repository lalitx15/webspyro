import type { Metadata } from "next";
import { servicesData } from "@/lib/inner-pages-data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com").replace(/\/+$/, "");

export function generateStaticParams() {
  return servicesData.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = servicesData.find((item) => item.slug === params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `${siteUrl}/services/${service.slug}`;
  const description = service.short_desc || service.tagline;

  return {
    title: service.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: service.title,
      description,
      siteName: "Webspyra",
    },
    twitter: {
      card: "summary",
      title: service.title,
      description,
    },
  };
}

export default function ServiceDetailLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
