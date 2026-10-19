"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, BookOpen, Send } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/ui/section-reveal";
import { OrbsBackground } from "@/components/ui/orbs-background";
import { useToast } from "@/components/ui/toast";
import { blogPostsData } from "@/lib/inner-pages-data";

export default function BlogPage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const blogTabs = [
    { id: "all", label: "All Insights" },
    { id: "tech", label: "Tech & Speed" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "growth", label: "Pricing & SEO" },
    { id: "design", label: "UI & Modern Web" },
  ];

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesTab = activeTab === "all" || post.category === activeTab;
    const matchesQuery =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim() && emailSub.includes("@")) {
      setIsSubscribed(true);
      success("Subscribed!", "You will receive our weekly web growth insights.");
    }
  };

  return (
    <PublicLayout>
      <div className="relative min-h-screen py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto space-y-16">
        <OrbsBackground variant="hero" />

        {/* Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <SectionReveal>
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" pulseDot>
                Engineering & Design Insights
              </Badge>
              <Badge variant="mint">Direct From Our Architects</Badge>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-black tracking-tight leading-[1.12]" style={{ color: "#000000" }}>
              Actionable guides to grow your revenue online.
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
              Read in-depth analysis on modern Next.js architecture, Google Core Web Vitals, conversion optimization, and Indian e-commerce strategies.
            </p>
          </SectionReveal>
        </div>

        {/* Filter Tabs & Search Bar */}
        <SectionReveal delay={0.25} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs tabs={blogTabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & guides..."
              className="w-full h-11 pl-10 pr-4 rounded-pill bg-white/90 border border-slate-200 text-xs sm:text-sm text-black font-medium focus:outline-none focus:border-accent shadow-sm"
            />
          </div>
        </SectionReveal>

        {/* Blog Posts Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <StaggerItem key={post.id}>
              <GlassCard
                enableTilt
                glowColor="blue"
                className="overflow-hidden flex flex-col justify-between h-full group"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-pill bg-white/90 text-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                      {post.category_label}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-black font-semibold">
                      <span>{post.published_at}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-accent font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {post.reading_time}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-black group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-black font-medium leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-pill bg-slate-100 text-[10px] font-bold text-black"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author Card Footer */}
                <div className="px-7 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black leading-none">
                        {post.author.name}
                      </p>
                      <p className="text-[10px] text-black font-medium">{post.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <p className="font-display font-bold text-xl text-textPrimary">
              No articles found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(""); setActiveTab("all"); }}>
              View All Articles
            </Button>
          </div>
        )}

        {/* Newsletter Signup Box */}
        <SectionReveal>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-white text-center space-y-5 max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-textPrimary">
                Stay ahead of the curve.
              </h3>
              <p
                className="text-xs sm:text-sm text-black max-w-md mx-auto font-medium"
                style={{ color: "#000000", opacity: 1 }}
              >
                Receive our latest web growth case studies, Google SEO updates, and design tips directly in your inbox.
              </p>
            </div>

            {isSubscribed ? (
              <p className="text-sm font-bold text-success">
                ✓ You are subscribed to Webspyra Insights!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Enter your work email..."
                  required
                  className="flex-1 h-12 px-4 rounded-pill bg-white/90 border border-slate-200 text-xs sm:text-sm text-textPrimary focus:outline-none focus:border-accent shadow-sm"
                />
                <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </SectionReveal>
      </div>
    </PublicLayout>
  );
}
