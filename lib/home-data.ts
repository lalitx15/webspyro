import { createBrowserClient } from "@/lib/supabase/client";

export interface HeroData {
  badge_text: string;
  title: string;
  highlighted_word: string;
  subtitle: string;
  chips: string[];
  cta_primary_text: string;
  cta_secondary_text: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface PlanItem {
  id: string;
  category_id: string;
  category_slug?: string;
  name: string;
  tagline?: string;
  old_price: number;
  price: number;
  discount_percentage?: number;
  gst_percentage: number;
  deal_end_time?: string;
  is_popular: boolean;
  renewal_price: number;
  delivery_days: number;
  sort_order: number;
  feature_groups?: Array<{
    name: string;
    features: Array<{ text: string; is_free_badge: boolean }>;
  }>;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  category_id?: string;
  category_slug: string;
  live_url?: string;
  thumbnail_url: string;
  challenge?: string;
  solution?: string;
  results_stats?: Record<string, string>;
  tech_tags: string[];
  is_featured: boolean;
}

export interface TestimonialItem {
  id: string;
  client_name: string;
  business_name: string;
  avatar_url?: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// Fallback Defaults
export const defaultHero: HeroData = {
  badge_text: "WE BUILD WEBSITES THAT HELP BUSINESSES GROW",
  title: "A better website. More trust.",
  highlighted_word: "More customers.",
  subtitle:
    "Fast, modern websites built to turn visitors into enquiries — without the agency complexity.",
  chips: [
    "Website starts from ₹6,999/-",
    "Free .com/.in Domain",
    "Free Cloud Hosting",
    "5-7 Days Express Delivery",
  ],
  cta_primary_text: "GET A FREE WEBSITE QUOTE →",
  cta_secondary_text: "See our work",
};

export const defaultStats: StatItem[] = [
  { id: "stat-1", label: "Happy Clients", value: 500, suffix: "+" },
  { id: "stat-2", label: "Google Rating", value: 4.9, suffix: "★" },
  { id: "stat-3", label: "Projects Delivered", value: 650, suffix: "+" },
  { id: "stat-4", label: "Years Experience", value: 6, suffix: "+" },
];

export const defaultPlans: PlanItem[] = [
  // Portfolio & Landing Page Plans
  {
    id: "plan-portfolio-1",
    category_id: "portfolio",
    category_slug: "portfolio",
    name: "Basic Landing Page",
    tagline: "Fast & clean single page / portfolio for individuals & creators (without domain & hosting).",
    old_price: 5999,
    price: 2999,
    discount_percentage: 50,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 0,
    delivery_days: 2,
    sort_order: 1,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "1 High-Converting Landing / Portfolio Page", is_free_badge: false },
          { text: "Without Domain & Hosting (Use Own/Free)", is_free_badge: false },
          { text: "100% Mobile, Tablet & Desktop Responsive", is_free_badge: false },
          { text: "Social Media & Bio Links Integration", is_free_badge: true },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Direct WhatsApp Click-to-Chat Button", is_free_badge: false },
          { text: "Click-to-Call Instant Contact Button", is_free_badge: false },
          { text: "Ultra-Fast Page Load (<2s)", is_free_badge: true },
        ],
      },
      {
        name: "Website Security & Support",
        features: [
          { text: "HTTPS SSL Compatible Setup", is_free_badge: true },
          { text: "Basic On-Page SEO & Meta Tags", is_free_badge: true },
          { text: "30 Days Free Technical Bug Support", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-portfolio-2",
    category_id: "portfolio",
    category_slug: "portfolio",
    name: "Pro Portfolio & Landing",
    tagline: "High-converting personal branding or business landing page with 1-Year free domain & hosting.",
    old_price: 9999,
    price: 4999,
    discount_percentage: 50,
    gst_percentage: 18,
    is_popular: true,
    renewal_price: 1999,
    delivery_days: 3,
    sort_order: 2,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Multi-Section High-Converting Landing Page", is_free_badge: false },
          { text: "Free .com or .in Domain (1st Year Included)", is_free_badge: true },
          { text: "Free Fast SSD Cloud Hosting (1 Year Included)", is_free_badge: true },
          { text: "100% Mobile & Tablet App-Like View", is_free_badge: false },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Interactive Project Showcase & Gallery", is_free_badge: false },
          { text: "Direct WhatsApp Chat & Call Button", is_free_badge: false },
          { text: "WhatsApp Chat & Google Maps Integration", is_free_badge: false },
        ],
      },
      {
        name: "Website Security & Support",
        features: [
          { text: "Free Lifetime SSL Certificate", is_free_badge: true },
          { text: "Complete On-Page SEO & Sitemap Setup", is_free_badge: true },
          { text: "6 Months Free Maintenance Support", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-portfolio-3",
    category_id: "portfolio",
    category_slug: "portfolio",
    name: "Elite Dynamic Showcase",
    tagline: "Premium animated showcase with 3D interactions, 1-Year free domain/hosting & analytics.",
    old_price: 13999,
    price: 6999,
    discount_percentage: 50,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 2499,
    delivery_days: 5,
    sort_order: 3,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Premium Multi-Section Portfolio / Landing", is_free_badge: false },
          { text: "Free .com or .in Domain (1st Year Included)", is_free_badge: true },
          { text: "Free NVMe Cloud Server Hosting (1 Year)", is_free_badge: true },
          { text: "1 Professional Business Email Account", is_free_badge: true },
        ],
      },
      {
        name: "Extra Comparative Features",
        features: [
          { text: "Apple-Grade Micro-Animations (Framer & GSAP)", is_free_badge: true },
          { text: "Interactive Case Studies & Testimonial Slider", is_free_badge: false },
          { text: "Google Analytics 4 & Meta Pixel Setup", is_free_badge: true },
          { text: "Dynamic Content / Easy Edit CMS Option", is_free_badge: true },
        ],
      },
      {
        name: "Website Security & Support",
        features: [
          { text: "Advanced Cloudflare DDoS Protection + SSL", is_free_badge: true },
          { text: "High-Ranking Technical SEO Schema", is_free_badge: true },
          { text: "1 Year Dedicated Priority VIP Support", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-business-1",
    category_id: "business",
    category_slug: "business",
    name: "Starter Business",
    tagline: "Ideal for startups & local service providers seeking a clean professional presence.",
    old_price: 14999,
    price: 8999,
    discount_percentage: 40,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 2999,
    delivery_days: 5,
    sort_order: 1,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Up to 5 Pages Responsive Website", is_free_badge: false },
          { text: "Free .com or .in Domain (1st Year)", is_free_badge: true },
          { text: "Free Fast SSD Cloud Hosting", is_free_badge: true },
          { text: "1 Business Email Account", is_free_badge: true },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "100% Mobile & Tablet App-Like View", is_free_badge: false },
          { text: "Click-to-Call & WhatsApp Chat", is_free_badge: false },
          { text: "Contact / Lead Form to Email", is_free_badge: false },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "Free SSL Certificate (HTTPS)", is_free_badge: true },
          { text: "Basic On-Page SEO Setup", is_free_badge: true },
          { text: "1 Year Technical Support", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-business-2",
    category_id: "business",
    category_slug: "business",
    name: "Classic Growth (Most Popular)",
    tagline: "Best value for growing companies looking to dominate their market and capture leads.",
    old_price: 24999,
    price: 14999,
    discount_percentage: 40,
    gst_percentage: 18,
    is_popular: true,
    renewal_price: 3999,
    delivery_days: 7,
    sort_order: 2,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Up to 15 Pages Responsive Website", is_free_badge: false },
          { text: "Free .com or .in Domain (1st Year)", is_free_badge: true },
          { text: "Free Super-Fast Cloud Hosting", is_free_badge: true },
          { text: "1 Business Email Account", is_free_badge: true },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Dedicated Admin Panel / Dashboard", is_free_badge: true },
          { text: "Google Authentication (OAuth Login)", is_free_badge: true },
          { text: "Interactive Micro-Animations", is_free_badge: false },
          { text: "Lead Capture Form + Instant Alerts", is_free_badge: false },
          { text: "Google Maps & Social Integrations", is_free_badge: false },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "Free Lifetime SSL Certificate", is_free_badge: true },
          { text: "Complete SEO Setup & Sitemap", is_free_badge: true },
          { text: "Priority Support & Minor Edits", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-business-3",
    category_id: "business",
    category_slug: "business",
    name: "Premium Corporate",
    tagline: "Complete custom solution with high-end animations, CMS blog, and priority support.",
    old_price: 39999,
    price: 24999,
    discount_percentage: 37,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 4999,
    delivery_days: 10,
    sort_order: 3,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Up to 15 Pages Bespoke Architecture", is_free_badge: false },
          { text: "Free Domain & Premium Server Hosting", is_free_badge: true },
          { text: "2 Business Email Accounts", is_free_badge: true },
          { text: "CMS Blog & Dynamic Content", is_free_badge: false },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "High-Valuable Custom Admin Panel & CMS", is_free_badge: true },
          { text: "Google Authentication & Role Access", is_free_badge: true },
          { text: "Apple-Grade 3D Glass Interactions", is_free_badge: false },
          { text: "Payment Gateway Integration", is_free_badge: true },
          { text: "Live Chat Integration & CRM Sync", is_free_badge: true },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "Advanced DDoS & Web Firewall", is_free_badge: true },
          { text: "Comprehensive Technical SEO Audit", is_free_badge: true },
          { text: "Dedicated Account Manager", is_free_badge: true },
        ],
      },
    ],
  },
  // E-Commerce Plans
  {
    id: "plan-ecom-1",
    category_id: "ecommerce",
    category_slug: "ecommerce",
    name: "E-Commerce Starter",
    tagline: "Launch your online store with up to 50 products and direct online UPI payments.",
    old_price: 29999,
    price: 18999,
    discount_percentage: 36,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 4999,
    delivery_days: 8,
    sort_order: 1,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Up to 50 Product Listings", is_free_badge: false },
          { text: "Free .com/.in Domain & Cloud Hosting", is_free_badge: true },
          { text: "Order Management Dashboard", is_free_badge: false },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Razorpay / UPI Payment Gateway", is_free_badge: true },
          { text: "Automated GST Invoices", is_free_badge: true },
          { text: "Discount Coupons & Promo Codes", is_free_badge: false },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "PCI-DSS Compliant Security", is_free_badge: true },
          { text: "Daily Cloud Database Backups", is_free_badge: true },
          { text: "Technical Support", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-ecom-2",
    category_id: "ecommerce",
    category_slug: "ecommerce",
    name: "E-Commerce Pro (Most Popular)",
    tagline: "Full-fledged online store with unlimited products, coupons, and inventory dashboard.",
    old_price: 49999,
    price: 29999,
    discount_percentage: 40,
    gst_percentage: 18,
    is_popular: true,
    renewal_price: 6999,
    delivery_days: 12,
    sort_order: 2,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Unlimited Product Listings & Categories", is_free_badge: false },
          { text: "Free High-Performance Cloud Server", is_free_badge: true },
          { text: "Inventory & Stock Tracking", is_free_badge: false },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Instant UPI Popups & Card EMI", is_free_badge: true },
          { text: "Automated Shipping API Integration", is_free_badge: true },
          { text: "Abandoned Cart Recovery Notifications", is_free_badge: false },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "High-Traffic DDoS Shield", is_free_badge: true },
          { text: "E-Commerce Product Schema SEO", is_free_badge: true },
          { text: "1 Year VIP Technical Maintenance", is_free_badge: true },
        ],
      },
    ],
  },
  {
    id: "plan-ecom-3",
    category_id: "ecommerce",
    category_slug: "ecommerce",
    name: "E-Commerce Enterprise",
    tagline: "Custom bespoke architecture, client portal, multi-vendor support, and dedicated manager.",
    old_price: 89999,
    price: 54999,
    discount_percentage: 39,
    gst_percentage: 18,
    is_popular: false,
    renewal_price: 9999,
    delivery_days: 20,
    sort_order: 3,
    feature_groups: [
      {
        name: "Plan Details",
        features: [
          { text: "Fully Custom Next.js Architecture", is_free_badge: false },
          { text: "Enterprise Dedicated Cloud Server", is_free_badge: true },
          { text: "Client Auth Portal & Order Tracking", is_free_badge: false },
        ],
      },
      {
        name: "Functionality",
        features: [
          { text: "Multi-Currency & International Gateways", is_free_badge: true },
          { text: "ERP & Custom CRM Sync", is_free_badge: true },
          { text: "Custom Checkout Logic", is_free_badge: false },
        ],
      },
      {
        name: "Website Security",
        features: [
          { text: "Enterprise Level 1 Security", is_free_badge: true },
          { text: "24/7 Dedicated Server Monitoring", is_free_badge: true },
          { text: "Dedicated Senior Solutions Architect", is_free_badge: true },
        ],
      },
    ],
  },
];

export const defaultPortfolio: PortfolioItem[] = [
  {
    id: "port-1",
    slug: "nexora-cloud-tech",
    title: "Nexora Cloud — Enterprise SaaS Platform",
    client_name: "Nexora Technologies Pvt Ltd",
    category_slug: "business",
    live_url: "https://example.com/nexora",
    thumbnail_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Client had a sluggish legacy site generating low conversions and weak mobile retention.",
    solution:
      "Engineered a Next.js 14 App Router site with Framer Motion pastel glassmorphism and instant lead capture.",
    results_stats: {
      "Conversion Rate": "+140%",
      "Page Speed": "0.8s",
      "Monthly Inquiries": "320+",
    },
    tech_tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
    is_featured: true,
  },
  {
    id: "port-2",
    slug: "aurora-luxury-jewels",
    title: "Aurora Jewels — D2C E-Commerce Brand",
    client_name: "Aurora Jewels India",
    category_slug: "ecommerce",
    live_url: "https://example.com/aurora",
    thumbnail_url:
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Needed an ultra-luxurious mobile shopping experience with fast 1-click Razorpay UPI checkout.",
    solution:
      "Built custom high-speed storefront with product filters, live stock indicators, and instant order tracking.",
    results_stats: {
      "Monthly Sales": "₹28 Lakhs",
      "Cart Dropoff": "-38%",
      "Mobile Orders": "86%",
    },
    tech_tags: ["Next.js", "Razorpay UPI", "Supabase", "Tailwind CSS"],
    is_featured: true,
  },
  {
    id: "port-3",
    slug: "apex-legal-associates",
    title: "Apex Legal Advisors — Corporate Law Firm",
    client_name: "Apex Law Associates",
    category_slug: "business",
    live_url: "https://example.com/apex",
    thumbnail_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Required an authoritative, bilingual corporate website with client consultation scheduling.",
    solution:
      "Crafted an elegant editorial layout with Playfair typography, consultation booking, and practice area showcases.",
    results_stats: {
      "Consultations": "+220%",
      "Bounce Rate": "24%",
      "Google Rank": "Top 3",
    },
    tech_tags: ["Next.js", "Tailwind CSS", "SEO Pro", "PostgreSQL"],
    is_featured: true,
  },
  {
    id: "port-4",
    slug: "zenica-health-portal",
    title: "Zenica Organics — Wellness & Nutrition Store",
    client_name: "Zenica Nutrition",
    category_slug: "ecommerce",
    live_url: "https://example.com/zenica",
    thumbnail_url:
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Slow loading catalog of 400+ organic supplements was causing cart abandonments.",
    solution:
      "Migrated to server-rendered Next.js with instant faceted search and automatic bundle discounts.",
    results_stats: {
      "Average Order Value": "+45%",
      "Repeat Rate": "58%",
      "Page Load": "0.7s",
    },
    tech_tags: ["Next.js", "Supabase", "Razorpay", "Tailwind"],
    is_featured: false,
  },
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    client_name: "Vikram Malhotra",
    business_name: "Founder, Nexora Cloud Tech",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    rating: 5,
    review_text:
      "Webspyra built our website in just 6 days! The mobile experience is ridiculously smooth and we saw an instant 2x jump in enquiry calls from day one.",
    is_verified: true,
  },
  {
    id: "test-2",
    client_name: "Ananya Sen",
    business_name: "CEO, Aurora Luxury Jewels",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 5,
    review_text:
      "The pastel glassmorphism aesthetic is Apple-level premium. Our customers regularly compliment the website look, and Razorpay UPI checkout works flawlessly.",
    is_verified: true,
  },
  {
    id: "test-3",
    client_name: "Rajesh Goyal",
    business_name: "Managing Partner, Apex Legal",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    rating: 5,
    review_text:
      "Outstanding team. No hidden charges, zero delays, and their customer support team answers within 5 minutes on WhatsApp. Best decision for our law firm.",
    is_verified: true,
  },
  {
    id: "test-4",
    client_name: "Pooja Sharma",
    business_name: "Director, Zenica Organics",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja",
    rating: 5,
    review_text:
      "We were skeptical about web agencies because of past bad experiences, but Webspyra delivered exactly what was promised. 100% recommended!",
    is_verified: true,
  },
];

export const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    category: "general",
    question: "How long does it take to build and launch my website?",
    answer:
      "Our standard Business Website packages are delivered in just 5 to 7 working days. For custom E-Commerce or complex web apps, delivery ranges between 10 to 18 working days depending on catalog size.",
  },
  {
    id: "faq-2",
    category: "general",
    question: "Do I get complete ownership of my domain and website?",
    answer:
      "Yes, 100%! The domain is registered in your name, and you own all rights to your content, code, and customer data. We never lock you into proprietary platforms.",
  },
  {
    id: "faq-3",
    category: "pricing",
    question: "Are there any hidden costs or surprise renewal fees?",
    answer:
      "Absolutely not. Every quote and plan clearly states the initial cost and future annual renewal (which covers domain, cloud server hosting, SSL, and technical support).",
  },
  {
    id: "faq-4",
    category: "technical",
    question: "Will my website be fast and mobile friendly?",
    answer:
      "Yes! All Webspyra websites are mobile-first, zero-zoom protected, and built on Next.js 14 for sub-second page loads. We routinely score 95+ on Google PageSpeed Insights.",
  },
  {
    id: "faq-5",
    category: "payments",
    question: "What payment options and plans do you support?",
    answer:
      "We accept all Indian and international payment methods through Razorpay: UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and EMI options.",
  },
];

// Helper Fetchers
export async function getHeroData(): Promise<HeroData> {
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase.from("hero_content").select("*").eq("is_active", true).limit(1).single();
    if (data) return { ...defaultHero, ...data };
  } catch {}
  return defaultHero;
}

export async function getHomeStats(): Promise<StatItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase.from("stats").select("*").eq("is_active", true).order("sort_order");
    if (data && data.length > 0) return data;
  } catch {}
  return defaultStats;
}

interface SupabaseFeature {
  text: string;
  is_free_badge: boolean;
}

interface SupabaseFeatureGroup {
  name: string;
  plan_features?: SupabaseFeature[];
}

interface SupabasePlan {
  id: string;
  category_id: string;
  name: string;
  tagline?: string;
  old_price: number;
  price: number;
  discount_percentage?: number;
  gst_percentage: number;
  deal_end_time?: string;
  is_popular: boolean;
  renewal_price: number;
  delivery_days: number;
  sort_order: number;
  plan_feature_groups?: SupabaseFeatureGroup[];
}

interface SupabasePortfolioProject {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  category_id?: string;
  portfolio_categories?: { slug: string } | null;
  live_url?: string;
  thumbnail_url: string;
  challenge?: string;
  solution?: string;
  results_stats?: Record<string, string>;
  tech_tags: string[];
  is_featured: boolean;
}

export async function getHomePlans(): Promise<PlanItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data: plansData } = await supabase.from("plans").select("*, plan_feature_groups(*, plan_features(*))").eq("is_active", true).order("sort_order");
    if (plansData && plansData.length > 0) {
      return (plansData as unknown as SupabasePlan[]).map((p) => ({
        ...p,
        category_slug:
          p.category_id === "20000000-0000-0000-0000-000000000002"
            ? "ecommerce"
            : (p.category_id === "portfolio" || (p as unknown as { category_slug?: string }).category_slug === "portfolio"
              ? "portfolio"
              : "business"),
        feature_groups: p.plan_feature_groups?.map((fg) => ({
          name: fg.name,
          features: fg.plan_features?.map((f) => ({
            text: f.text,
            is_free_badge: f.is_free_badge,
          })) || [],
        })),
      }));
    }
  } catch {}
  return defaultPlans;
}

export async function getHomePortfolio(): Promise<PortfolioItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase.from("portfolio_projects").select("*, portfolio_categories(slug)").eq("is_active", true).order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return (data as unknown as SupabasePortfolioProject[]).map((p) => ({
        ...p,
        category_slug: p.portfolio_categories?.slug || "business",
      }));
    }
  } catch {}
  return defaultPortfolio;
}

export async function getHomeTestimonials(): Promise<TestimonialItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false });
    if (data && data.length > 0) return data;
  } catch {}
  return defaultTestimonials;
}

export async function getHomeFaqs(): Promise<FaqItem[]> {
  try {
    const supabase = createBrowserClient();
    const { data } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
    if (data && data.length > 0) return data;
  } catch {}
  return defaultFaqs;
}
