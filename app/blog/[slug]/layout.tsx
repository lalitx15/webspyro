import type { Metadata } from "next";
import { blogPostsData } from "@/lib/inner-pages-data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com").replace(/\/+$/, "");

export function generateStaticParams() {
  return blogPostsData.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPostsData.find((item) => item.slug === params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: "Webspyra",
      images: post.cover_image ? [{ url: post.cover_image, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default function BlogArticleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
