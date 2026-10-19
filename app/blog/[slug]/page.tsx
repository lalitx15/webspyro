"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Share2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { PublicLayout, useQuoteModal } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { blogPostsData } from "@/lib/inner-pages-data";

interface BlogArticlePageProps {
  params: { slug: string };
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { openQuoteModal } = useQuoteModal();
  const post = blogPostsData.find((b) => b.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPostsData
    .filter((b) => b.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover_image],
    datePublished: "2026-10-14T09:00:00+05:30",
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Webspyra",
      logo: {
        "@type": "ImageObject",
        url: "https://webspyra.com/logo.png",
      },
    },
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://webspyra.com/blog/${post.slug}`;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <PublicLayout>
      {/* JSON-LD Article Schema for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-4xl mx-auto space-y-12">
        <OrbsBackground variant="hero" />

        {/* Back Link */}
        <SectionReveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-textSecondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Insights
          </Link>
        </SectionReveal>

        {/* Article Header */}
        <div className="space-y-6">
          <SectionReveal delay={0.05} className="flex flex-wrap items-center gap-2.5">
            <Badge variant="blue">{post.category_label}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-textSecondary font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-accent font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time}
            </span>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-textPrimary tracking-tight leading-[1.18]">
              {post.title}
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <p className="text-base sm:text-lg text-textSecondary leading-relaxed">
              {post.excerpt}
            </p>
          </SectionReveal>

          {/* Author Card & Share Button */}
          <SectionReveal delay={0.2} className="flex items-center justify-between pt-2 border-t border-b border-slate-200/60 py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 shadow-sm">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-textPrimary leading-tight">
                  {post.author.name}
                </h4>
                <p className="text-xs text-textSecondary">{post.author.role}</p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4 text-accent" />}
            >
              Share Article
            </Button>
          </SectionReveal>
        </div>

        {/* Hero Cover Image */}
        <SectionReveal delay={0.25}>
          <div className="relative h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </SectionReveal>

        {/* TipTap / Editorial Content */}
        <SectionReveal delay={0.3}>
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white space-y-6 text-textPrimary leading-relaxed">
            <div
              className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:text-textPrimary prose-h2:mt-8 prose-h2:mb-3 prose-p:text-textSecondary prose-p:text-base prose-p:leading-relaxed prose-li:text-textSecondary prose-strong:text-textPrimary prose-ul:space-y-2 prose-ul:my-4"
              dangerouslySetInnerHTML={{ __html: post.content_html }}
            />

            {/* Tags Strip */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-2">
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-pill bg-slate-100 text-xs font-semibold text-textSecondary"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Related Articles */}
        <SectionReveal className="space-y-6 pt-6">
          <div className="space-y-1">
            <Badge variant="mint">Recommended Reading</Badge>
            <h3 className="font-display text-2xl font-extrabold text-textPrimary">
              More Insights from Webspyra
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <GlassCard key={rel.id} enableTilt glowColor="blue" className="p-6 space-y-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-pill bg-accent/10 text-accent uppercase">
                  {rel.category_label}
                </span>
                <Link href={`/blog/${rel.slug}`}>
                  <h4 className="font-display font-bold text-base text-textPrimary hover:text-accent transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
                <p className="text-xs text-textSecondary line-clamp-2">
                  {rel.excerpt}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionReveal>

        {/* CTA Banner */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white text-center space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-textPrimary">
              Ready to upgrade your website architecture?
            </h2>
            <p
              className="text-sm text-black max-w-md mx-auto font-medium"
              style={{ color: "#000000", opacity: 1 }}
            >
              Get in touch with Webspyra for a complimentary audit of your current site&apos;s speed and SEO ranking opportunities.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => openQuoteModal()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-glow"
            >
              Request Free Technical Audit
            </Button>
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
