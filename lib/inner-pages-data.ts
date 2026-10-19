export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  short_desc: string;
  overview: string;
  iconName: string;
  color: "blue" | "mint" | "peach" | "pink" | "purple";
  badge: string;
  delivery_time: string;
  starting_price: number;
  process_steps: Array<{ title: string; desc: string }>;
  features: string[];
  tech_stack: string[];
  faqs: Array<{ question: string; answer: string }>;
  related_plan_slug: string;
}

export interface PortfolioCaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  category_slug: "business" | "ecommerce" | "web-apps";
  live_url: string;
  thumbnail_url: string;
  gallery: string[];
  challenge: string;
  solution: string;
  results_stats: {
    stat1_label: string;
    stat1_value: string;
    stat2_label: string;
    stat2_value: string;
    stat3_label: string;
    stat3_value: string;
  };
  tech_tags: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: "growth" | "tech" | "design" | "ecommerce";
  category_label: string;
  excerpt: string;
  reading_time: string;
  published_at: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  cover_image: string;
  tags: string[];
  content_html: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "srv-business",
    slug: "business-websites",
    title: "High-Converting Business Websites",
    tagline: "Custom websites built for local stores, clinics, corporate firms, and modern service businesses.",
    short_desc: "Bespoke Next.js 14 websites engineered with soft pastel glassmorphic aesthetics, instant lead capture, and zero-zoom mobile protection.",
    overview:
      "A generic template hurts your credibility. We build custom-crafted, lightning-fast business websites tailored to your brand identity. Every site is optimized for Google Search Console, mobile responsiveness, and high conversion rates with built-in WhatsApp and lead forms.",
    iconName: "Globe",
    color: "blue",
    badge: "Most Requested",
    delivery_time: "5 - 7 Working Days",
    starting_price: 8999,
    process_steps: [
      { title: "Discovery & Strategy", desc: "We review your brand, competition, and customer pain points to chart a tailored structure." },
      { title: "Glassmorphic UI Design", desc: "Interactive wireframes and Apple Vision Pro aesthetic styling with custom color palettes." },
      { title: "Next.js 14 Development", desc: "Clean TypeScript code, zero-zoom touch navigation, and sub-second page transitions." },
      { title: "Testing & Launch", desc: "Free domain setup, SSL encryption, Google indexing, and final client signoff." },
    ],
    features: [
      "Zero-zoom mobile & tablet touch protection",
      "Free 1st-year .com or .in domain registration",
      "Free ultra-fast cloud server hosting & SSL",
      "Lead capture forms with instant WhatsApp sync",
      "Google Maps, reviews, and social media integrations",
      "Comprehensive technical SEO setup & XML sitemap",
    ],
    tech_stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
    faqs: [
      {
        question: "How long will it take to build my business website?",
        answer: "Standard business sites take just 5 to 7 working days once your content is confirmed.",
      },
      {
        question: "Do I get business email addresses?",
        answer: "Yes, our Classic and Premium packages include professional business emails (e.g. contact@yourcompany.com).",
      },
      {
        question: "Can I edit text and photos myself?",
        answer: "Yes, our websites are wired to a clean Supabase admin panel so you can update text, images, and reviews anytime.",
      },
    ],
    related_plan_slug: "classic",
  },
  {
    id: "srv-ecommerce",
    slug: "ecommerce-websites",
    title: "E-Commerce Online Stores",
    tagline: "Turn visitors into buyers with blazing-fast shopping carts and instant Razorpay UPI checkout.",
    short_desc: "Modern storefronts equipped with catalog management, UPI / Card payments, automated GST invoices, and coupon engines.",
    overview:
      "Sell products directly to customers across India and globally without paying hefty marketplace commissions. Our custom e-commerce stores deliver sub-second product page loads, one-click UPI checkout via Razorpay, coupon systems, and automated customer order notifications.",
    iconName: "ShoppingCart",
    color: "mint",
    badge: "High ROI",
    delivery_time: "8 - 12 Working Days",
    starting_price: 18999,
    process_steps: [
      { title: "Catalog Architecture", desc: "Structuring categories, product variants (size/color), and inventory tracking." },
      { title: "Payment & Logistics Setup", desc: "Integrating Razorpay for UPI/Cards/Netbanking and courier tracking links." },
      { title: "High-Speed Cart Optimization", desc: "Frictionless checkout flow with coupon discount validation and GST calculation." },
      { title: "Security & Testing", desc: "DDoS protection, automated database backups, and end-to-end payment test runs." },
    ],
    features: [
      "Up to 500+ product catalog with filtering & search",
      "Razorpay UPI (GPay, PhonePe, Paytm), cards & netbanking",
      "Automated GST invoice generation for customers",
      "Coupon code management with percentage & fixed discounts",
      "Admin order management dashboard & status tracker",
      "Mobile-first app feel for highest checkout conversion",
    ],
    tech_stack: ["Next.js 14", "Razorpay", "Supabase DB", "Tailwind CSS", "Zod"],
    faqs: [
      {
        question: "Which payment gateways do you integrate?",
        answer: "We primarily integrate Razorpay for seamless Indian UPI, Credit/Debit cards, Net Banking, and Wallets. Cash on Delivery is also supported.",
      },
      {
        question: "How do I add new products after launch?",
        answer: "Your secure admin dashboard allows you to add products, photos, prices, inventory counts, and discount offers in seconds.",
      },
    ],
    related_plan_slug: "ecommerce",
  },
  {
    id: "srv-webapps",
    slug: "web-applications",
    title: "Custom Full-Stack Web Applications",
    tagline: "Bespoke SaaS platforms, client portals, automated business workflows, and interactive dashboards.",
    short_desc: "Scalable web applications built with TypeScript, PostgreSQL database triggers, role-based access control, and real-time updates.",
    overview:
      "When off-the-shelf software doesn't fit your business model, Webspyra builds bespoke web applications. From client portals with project timelines to subscription dashboards and internal tooling, we architect scalable systems with enterprise security.",
    iconName: "Cpu",
    color: "purple",
    badge: "Enterprise",
    delivery_time: "14 - 24 Working Days",
    starting_price: 24999,
    process_steps: [
      { title: "System Architecture & Schema", desc: "Database modeling, PostgreSQL tables, indexes, and RLS security policies." },
      { title: "Role-Based Authentication", desc: "Secure multi-tenant customer and administrator access guards." },
      { title: "Real-Time UI & API Engine", desc: "Reactive dashboards with Recharts data visualization and Supabase Realtime." },
      { title: "CI/CD & Cloud Deployment", desc: "Automated test suites, Vercel edge deployment, and cloud backup systems." },
    ],
    features: [
      "Custom role-based access control (Admin, Staff, Customer)",
      "Real-time database updates via Supabase WebSockets",
      "Interactive data charts and analytics with Recharts",
      "REST & Edge API integrations with third-party systems",
      "Automated PDF document & receipt generation",
      "Granular audit trails and activity logs",
    ],
    tech_stack: ["Next.js App Router", "TypeScript", "PostgreSQL", "Supabase", "Recharts"],
    faqs: [
      {
        question: "Can our existing database be connected?",
        answer: "Yes, we can migrate your existing data to PostgreSQL / Supabase or build API connectors.",
      },
      {
        question: "Is source code provided?",
        answer: "Yes, you receive 100% full ownership of your source code and database.",
      },
    ],
    related_plan_slug: "premium",
  },
  {
    id: "srv-redesign",
    slug: "website-redesign",
    title: "Website Redesign & Speed Optimization",
    tagline: "Transform an outdated, slow website into an Apple-grade, sub-second conversion powerhouse.",
    short_desc: "Modernize design aesthetics, eliminate mobile lag, and boost Google PageSpeed scores to 95+.",
    overview:
      "Is your current WordPress or template site slow, buggy, or failing on mobile devices? We overhaul your existing site into a contemporary Next.js 14 web app while preserving all your established SEO URLs, backlinks, and search rankings.",
    iconName: "RefreshCw",
    color: "peach",
    badge: "Speed Upgrade",
    delivery_time: "4 - 7 Working Days",
    starting_price: 9999,
    process_steps: [
      { title: "SEO & Backlink Audit", desc: "Mapping all existing URLs to guarantee zero lost Google ranking positions." },
      { title: "Visual Re-imagining", desc: "Applying sleek pastel glassmorphism and modern typography." },
      { title: "Performance Engineering", desc: "Next/Image compression, code splitting, and zero layout shift tuning." },
      { title: "301 Redirects & Cutover", desc: "Seamless DNS transition with zero downtime for existing visitors." },
    ],
    features: [
      "Guaranteed 90+ PageSpeed score on mobile & desktop",
      "Preservation of existing Google SEO rankings & backlinks",
      "Replacement of clunky WordPress plugins with native code",
      "Conversion rate optimization and modern CTA placements",
      "Zero-zoom mobile protection on all forms & menus",
    ],
    tech_stack: ["Next.js 14", "Lighthouse", "Tailwind CSS", "Vercel Edge"],
    faqs: [
      {
        question: "Will my website go down during the redesign?",
        answer: "Never. We build the new version on a private staging link. Your live site stays active until you approve the new design.",
      },
    ],
    related_plan_slug: "classic",
  },
  {
    id: "srv-seo",
    slug: "seo-growth-marketing",
    title: "SEO & Digital Growth Marketing",
    tagline: "Rank on Google page 1 for keywords that drive actual paying customers to your business.",
    short_desc: "Comprehensive on-page, technical, and local SEO tailored for competitive Indian business niches.",
    overview:
      "Having a great website means nothing if nobody finds it. Our SEO engineers implement deep semantic markup, JSON-LD structured schemas, localized Google Business Profile synchronization, and speed enhancements that Google algorithms reward.",
    iconName: "Search",
    color: "blue",
    badge: "Traffic Boost",
    delivery_time: "Ongoing Monthly",
    starting_price: 7999,
    process_steps: [
      { title: "Keyword & Intent Research", desc: "Finding high-intent search terms your prospective buyers use." },
      { title: "Technical SEO Fixing", desc: "Eliminating crawl errors, fixing Core Web Vitals, and submitting sitemaps." },
      { title: "On-Page Semantic Optimization", desc: "Structuring H1/H2 tags, meta titles, descriptions, and OpenGraph tags." },
      { title: "Monthly Performance Analytics", desc: "Detailed tracking of clicks, impressions, ranking positions, and leads." },
    ],
    features: [
      "JSON-LD Schema (Organization, LocalBusiness, FAQPage)",
      "Google Search Console & Google Analytics 4 integration",
      "Local SEO optimization for 'near me' customer searches",
      "Speed & Core Web Vitals maintenance",
      "Keyword position tracking and competitor analysis",
    ],
    tech_stack: ["Google Search Console", "GA4", "JSON-LD", "Next.js Metadata API"],
    faqs: [
      {
        question: "How long until we see SEO results?",
        answer: "Technical and local SEO improvements typically show positive ranking momentum within 4 to 8 weeks.",
      },
    ],
    related_plan_slug: "classic",
  },
  {
    id: "srv-maintenance",
    slug: "maintenance-support",
    title: "Maintenance & 24/7 Security Support",
    tagline: "Worry-free website uptime, daily cloud backups, SSL renewals, and fast minor edits.",
    short_desc: "Keep your digital presence secure, updated, and running at peak performance all year round.",
    overview:
      "Focus on your core business while Webspyra protects your digital storefront. Our annual maintenance plans include proactive security monitoring, automatic SSL renewals, daily database backups, and rapid priority support whenever you need edits.",
    iconName: "ShieldCheck",
    color: "mint",
    badge: "24/7 Care",
    delivery_time: "Annual Plan",
    starting_price: 3999,
    process_steps: [
      { title: "24/7 Monitoring", desc: "Automated ping checks alerting our team within 60 seconds of any anomaly." },
      { title: "Daily Cloud Backups", desc: "Point-in-time database and asset restoration ready at any moment." },
      { title: "SSL & Security Audits", desc: "Automatic certificate renewals and firewall vulnerability patching." },
      { title: "Content Updates", desc: "Prompt edits to phone numbers, prices, banners, and product photos." },
    ],
    features: [
      "99.9% Uptime cloud server guarantee",
      "Free automated SSL certificate renewal",
      "Daily automated database and media backups",
      "Priority WhatsApp technical support with < 15 min response",
      "Free minor content updates and banner replacements",
    ],
    tech_stack: ["Supabase Cloud", "Cloudflare DNS", "Vercel", "Automated Cron"],
    faqs: [
      {
        question: "Is technical maintenance included in the first year?",
        answer: "Yes, all our new website packages include the first year of domain, server hosting, SSL, and maintenance completely free.",
      },
    ],
    related_plan_slug: "starter",
  },
];

export const portfolioData: PortfolioCaseStudy[] = [
  {
    id: "proj-1",
    slug: "apex-legal-advisors",
    title: "Apex Legal Advisors — Corporate Law Firm",
    client_name: "Apex Legal Partners",
    industry: "Legal & Corporate Consulting",
    category_slug: "business",
    live_url: "https://example.com/apex-legal",
    thumbnail_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "Apex Legal had an outdated WordPress site taking 6+ seconds to load, with zero mobile responsiveness and broken contact forms losing high-value corporate retainers.",
    solution:
      "Webspyra engineered a bespoke Next.js 14 architecture with pastel frosted-glass service cards, zero-zoom mobile interactions, and instant WhatsApp booking integration.",
    results_stats: {
      stat1_label: "PageSpeed Score",
      stat1_value: "99/100",
      stat2_label: "Qualified Leads",
      stat2_value: "+340%",
      stat3_label: "Average Load Time",
      stat3_value: "0.6s",
    },
    tech_tags: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Supabase CRM"],
    testimonial: {
      quote:
        "Webspyra completely elevated our corporate presence. We closed 3 major retainer clients in the first month after our new site went live.",
      author: "Rajesh Goyal",
      role: "Managing Partner, Apex Legal",
    },
  },
  {
    id: "proj-2",
    slug: "aurora-luxury-jewels",
    title: "Aurora Luxury Jewels — D2C Fine Jewellery",
    client_name: "Aurora Jewels Ltd.",
    industry: "Luxury Retail & E-Commerce",
    category_slug: "ecommerce",
    live_url: "https://example.com/aurora-jewels",
    thumbnail_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "High cart abandonment rate on Shopify due to sluggish checkout transitions and lack of trusted Indian UPI payment integration.",
    solution:
      "Custom Next.js 14 e-commerce storefront with soft pastel glassmorphic design, instant Razorpay UPI one-click payment, and automated WhatsApp order alerts.",
    results_stats: {
      stat1_label: "Cart Conversion",
      stat1_value: "+185%",
      stat2_label: "Monthly Revenue",
      stat2_value: "₹18.4 Lakh",
      stat3_label: "Mobile Bounce Rate",
      stat3_value: "-45%",
    },
    tech_tags: ["Next.js", "Razorpay UPI", "Supabase DB", "Tailwind CSS"],
    testimonial: {
      quote:
        "The Apple Vision Pro style pastel glass aesthetic made our jewellery shine online. Our customers love how effortless the UPI checkout is.",
      author: "Ananya Sen",
      role: "Founder & Creative Director",
    },
  },
  {
    id: "proj-3",
    slug: "zenica-organics",
    title: "Zenica Organics — Ayurveda & Wellness",
    client_name: "Zenica Organics Pvt Ltd",
    industry: "Health, Beauty & Organic Care",
    category_slug: "ecommerce",
    live_url: "https://example.com/zenica",
    thumbnail_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608248597359-53697a7e8f55?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "Brand lacked credibility on mobile devices; previous store was plagued by layout shifts and slow image loading.",
    solution:
      "Designed a soothing mint-and-peach aesthetic storefront with Next/Image optimization and instant coupon validation at checkout.",
    results_stats: {
      stat1_label: "PageSpeed Mobile",
      stat1_value: "98/100",
      stat2_label: "Repeat Orders",
      stat2_value: "+42%",
      stat3_label: "Order Volume",
      stat3_value: "1,200+/mo",
    },
    tech_tags: ["Next.js", "Supabase", "Razorpay", "Tailwind CSS"],
    testimonial: {
      quote:
        "Webspyra delivered our complete store in 8 working days. Their customer support team is always available on WhatsApp.",
      author: "Pooja Sharma",
      role: "CEO, Zenica Organics",
    },
  },
  {
    id: "proj-4",
    slug: "buildcraft-infra",
    title: "BuildCraft Infra — Real Estate & Construction",
    client_name: "BuildCraft Group",
    industry: "Real Estate & Architecture",
    category_slug: "business",
    live_url: "https://example.com/buildcraft",
    thumbnail_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "Needed a prestigious portfolio to showcase ₹50Cr+ luxury residential projects with interactive floor plans and brochure downloads.",
    solution:
      "High-end presentation website featuring 3D tilt cards, interactive floor plan sliders, and instant lead capture modals.",
    results_stats: {
      stat1_label: "Site Visits to Enquiries",
      stat1_value: "14.2%",
      stat2_label: "Brochure Downloads",
      stat2_value: "4,500+",
      stat3_label: "Load Time",
      stat3_value: "0.55s",
    },
    tech_tags: ["Next.js 14", "Framer Motion", "Tailwind CSS", "Supabase"],
    testimonial: {
      quote:
        "The best investment we made for our brand image. Buyers compliment our website's modern look before every meeting.",
      author: "Karan Singhal",
      role: "Director of Marketing",
    },
  },
  {
    id: "proj-5",
    slug: "medicare-clinic",
    title: "MediCare SuperSpeciality — Healthcare & Clinic",
    client_name: "MediCare Hospital",
    industry: "Healthcare & Diagnostics",
    category_slug: "business",
    live_url: "https://example.com/medicare",
    thumbnail_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "Patients found it hard to navigate doctor specialties and book OPD slots on mobile phones.",
    solution:
      "Engineered an intuitive doctor directory with one-tap WhatsApp appointments and emergency quick-dial buttons.",
    results_stats: {
      stat1_label: "Online Bookings",
      stat1_value: "+210%",
      stat2_label: "Mobile Bounce Rate",
      stat2_value: "-38%",
      stat3_label: "Patient Inquiries",
      stat3_value: "800+/wk",
    },
    tech_tags: ["Next.js 14", "Tailwind CSS", "Supabase CRM"],
    testimonial: {
      quote:
        "Patient convenience increased tenfold. The site is clean, fast, and very easy for senior citizens to use.",
      author: "Dr. Alok Verma",
      role: "Medical Director",
    },
  },
  {
    id: "proj-6",
    slug: "cloudkitchen-quickbites",
    title: "QuickBites — Multi-Brand Cloud Kitchen SaaS",
    client_name: "QuickBites Hospitality",
    industry: "FoodTech & Cloud Kitchen",
    category_slug: "web-apps",
    live_url: "https://example.com/quickbites",
    thumbnail_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    ],
    challenge:
      "QuickBites needed an internal portal to track multi-location menu pricing, kitchen prep times, and franchise sales reports.",
    solution:
      "Built a secure full-stack web application with role guards, live kitchen order boards, and Recharts financial analytics.",
    results_stats: {
      stat1_label: "Locations Managed",
      stat1_value: "18 Outlets",
      stat2_label: "Daily Orders",
      stat2_value: "3,500+",
      stat3_label: "Admin Efficiency",
      stat3_value: "+65%",
    },
    tech_tags: ["Next.js App Router", "TypeScript", "PostgreSQL", "Recharts"],
    testimonial: {
      quote:
        "Our operations transformed completely. Webspyra built a custom system that outperforms expensive third-party platforms.",
      author: "Manish Chawla",
      role: "Chief Operating Officer",
    },
  },
];

export const blogPostsData: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "fast-pagespeed-ranking-factor",
    title: "Why Fast PageSpeed is the #1 Ranking Factor for Indian Businesses in 2026",
    category: "tech",
    category_label: "Performance & SEO",
    excerpt:
      "A 1-second delay in mobile load time can drop conversions by up to 20%. Here is why modern Next.js architecture dominates search rankings.",
    reading_time: "5 min read",
    published_at: "October 14, 2026",
    author: {
      name: "Siddharth Nair",
      role: "Lead Systems Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth",
    },
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["PageSpeed", "SEO", "Next.js", "Mobile UX"],
    content_html: `
      <h2>The 3-Second Rule on Mobile Networks</h2>
      <p>Over 78% of internet traffic in India originates from mobile smartphones across 4G and 5G connections. When a prospective buyer clicks your Google Ad or organic search result, every millisecond counts.</p>
      <p>Google's Core Web Vitals algorithms penalize sluggish websites with heavy layout shifts and delayed Largest Contentful Paint (LCP). If your site takes longer than 2.5 seconds to load, more than half your visitors bounce before seeing your products.</p>
      
      <h2>Why WordPress Templates Struggle</h2>
      <p>Traditional WordPress and builder websites run dozens of unoptimized plugins, external fonts, and heavy CSS files that block the browser rendering engine. In contrast, modern Next.js 14 architecture delivers server-side pre-rendered HTML with optimized image pipelines that achieve sub-second load speeds.</p>

      <h2>Key Steps to Achieve a 95+ PageSpeed Score</h2>
      <ul>
        <li><strong>Automatic WebP/AVIF compression:</strong> Deliver modern visual formats without loss of visual sharpness.</li>
        <li><strong>Zero layout shift (CLS < 0.1):</strong> Reserve image dimensions before load to stop jarring content jumps.</li>
        <li><strong>Server Edge Caching:</strong> Serve pages from CDN nodes closest to your customer in Mumbai, Delhi, or Bengaluru.</li>
      </ul>
      <p>At Webspyra, every website we deliver is guaranteed to score 90+ on mobile devices, ensuring you never lose a customer to impatience.</p>
    `,
  },
  {
    id: "post-2",
    slug: "ecommerce-launch-checklist",
    title: "The Ultimate Checklist Before Launching Your E-Commerce Store in India",
    category: "ecommerce",
    category_label: "E-Commerce Growth",
    excerpt:
      "From seamless Razorpay UPI integration to automated GST invoices and shipping sync, ensure your online store is set up for profitability.",
    reading_time: "6 min read",
    published_at: "October 10, 2026",
    author: {
      name: "Rhea Sen",
      role: "E-Commerce Solutions Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rhea",
    },
    cover_image: "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80",
    tags: ["E-Commerce", "Razorpay", "GST", "Online Store"],
    content_html: `
      <h2>1. Frictionless Checkout with Instant UPI</h2>
      <p>In India, UPI accounts for more than 75% of digital retail transactions. If your checkout forces users to fill out 4 pages of addresses before showing payment options, you will experience massive cart abandonment.</p>
      <p>Your store must support direct intent triggers for Google Pay, PhonePe, and Paytm along with card and netbanking alternatives.</p>

      <h2>2. Transparent GST Invoicing</h2>
      <p>B2B and retail customers expect accurate tax breakdowns on product pages and automated PDF invoices sent to their email or WhatsApp immediately upon payment confirmation.</p>

      <h2>3. Fast Mobile Touch Navigation</h2>
      <p>Over 85% of shoppers complete purchases on smartphones. Your product cards, image zooms, and size selectors must be finger-friendly with zero accidental zooming or viewport distortion.</p>
    `,
  },
  {
    id: "post-3",
    slug: "website-cost-breakdown-india",
    title: "How Much Should a Business Website Cost in 2026? (No Hidden Fees)",
    category: "growth",
    category_label: "Pricing Guide",
    excerpt:
      "A transparent breakdown of domain costs, cloud hosting, design, custom development, and future annual renewals in the Indian market.",
    reading_time: "4 min read",
    published_at: "October 05, 2026",
    author: {
      name: "Vikram Malhotra",
      role: "Client Advisory Director",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    },
    cover_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Website Cost", "Transparent Pricing", "Agency Guide"],
    content_html: `
      <h2>Why Web Agency Quotes Vary Wildly</h2>
      <p>Business owners often receive quotes ranging from ₹3,000 from local freelancers to ₹1,50,000+ from large digital agencies for what looks like the same project. Why the massive difference?</p>
      
      <h2>Cheap Templates vs Custom Engineering</h2>
      <p>Cheap ₹3,000 websites almost always use cracked, unmaintained WordPress themes laden with hidden security vulnerabilities and zero mobile optimization. After 6 months, owners face surprise renewal bills or broken plugins.</p>
      <p>A professional custom Next.js 14 website from Webspyra starts at just ₹8,999 with 1st-year domain, high-speed hosting, and SSL included. Annual renewals are fixed and transparent with zero surprise costs.</p>
    `,
  },
  {
    id: "post-4",
    slug: "nextjs-vs-wordpress-guide",
    title: "Next.js 14 vs WordPress: Why Modern Indian Brands are Switching",
    category: "design",
    category_label: "Technology Trends",
    excerpt:
      "Compare security, maintenance overhead, mobile speed, and visual aesthetics between traditional CMS platforms and modern headless web apps.",
    reading_time: "5 min read",
    published_at: "September 28, 2026",
    author: {
      name: "Siddharth Nair",
      role: "Lead Systems Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth",
    },
    cover_image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    tags: ["Next.js", "WordPress", "Web Trends", "Security"],
    content_html: `
      <h2>The Security Dilemma</h2>
      <p>WordPress powers millions of websites, making it the primary target for automated malware scanners and brute-force SQL attacks. Next.js produces static and edge-rendered code without exposing database credentials to public browsers.</p>
      
      <h2>Apple Vision Pro Aesthetics</h2>
      <p>Modern consumers recognize and reward premium design. Soft pastel glassmorphism, fluid micro-interactions, and 60fps animations require modern frameworks like Tailwind CSS and Framer Motion that legacy builders simply cannot deliver.</p>
    `,
  },
];

export async function getServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
  return servicesData.find((s) => s.slug === slug);
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioCaseStudy | undefined> {
  return portfolioData.find((p) => p.slug === slug);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | undefined> {
  return blogPostsData.find((b) => b.slug === slug);
}
