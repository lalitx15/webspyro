-- =====================================================================
-- WEBSPYRA - SEED SAMPLE DATA
-- Initial production-grade data for settings, plans, portfolio, services, FAQs
-- =====================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (
  id,
  site_name,
  tagline,
  contact_email,
  contact_phone,
  whatsapp_number,
  whatsapp_default_message,
  address,
  working_hours,
  currency,
  gst_percentage,
  live_chat_enabled,
  social_links
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Webspyra',
  'Next-Gen Web Development Agency',
  'contact@webspyra.com',
  '+91 98765 43210',
  '+91 98765 43210',
  'Hi Webspyra, I am looking for a new website. How can we proceed further?',
  'Level 4, DLF Cyber City, Gurugram, Haryana 122002, India',
  'Mon - Sat: 9:00 AM - 7:00 PM',
  'INR',
  18,
  true,
  '{"instagram":"https://instagram.com/webspyra","facebook":"https://facebook.com/webspyra","x":"https://x.com/webspyra","linkedin":"https://linkedin.com/company/webspyra"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Global SEO Settings
INSERT INTO public.seo_settings (
  id,
  default_title,
  title_template,
  default_description,
  ga4_id,
  meta_pixel_id
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Webspyra | Premium Web Development & High-Converting Websites',
  '%s | Webspyra',
  'Award-winning web development agency creating fast, responsive, and animated business & e-commerce websites with zero setup hassles.',
  'G-WEBSPYRA123',
  'PIXEL-WEBSPYRA456'
) ON CONFLICT (id) DO NOTHING;

-- 3. Announcement Ticker Items
INSERT INTO public.announcement_items (text, link, is_active, sort_order) VALUES
  ('🔥 Limited Period Deal: Flat 30% OFF on all Website Packages with Free Domain & Cloud Hosting!', '/#pricing', true, 1),
  ('⚡ Lightning Fast Delivery: Complete Professional Website ready in 5 to 7 working days!', '/#pricing', true, 2),
  ('📱 100% Mobile & Tablet Optimized: App-like experience with zero lag guaranteed.', '/#services', true, 3);

-- 4. Hero Content
INSERT INTO public.hero_content (
  id,
  badge_text,
  title,
  highlighted_word,
  subtitle,
  chips,
  cta_primary_text,
  cta_secondary_text,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '100% Mobile Responsive • Guaranteed 99.9% Uptime',
  'Launch your professional website',
  'online',
  'High-speed, animated, conversion-focused websites engineered to turn visitors into paying customers. Everything is handled from design to deployment.',
  ARRAY['Free .com/.in Domain', 'Free Cloud Hosting', 'Free Business Emails', '24/7 Priority Support'],
  'Get Free Quote',
  'View Our Work',
  true
) ON CONFLICT (id) DO NOTHING;

-- 5. Trust Stats Row
INSERT INTO public.stats (label, value, suffix, prefix, sort_order) VALUES
  ('Happy Clients', 500, '+', null, 1),
  ('Google Rating', 4.9, '★', null, 2),
  ('Projects Delivered', 650, '+', null, 3),
  ('Years of Experience', 6, '+', null, 4);

-- 6. Services
INSERT INTO public.services (id, slug, title, short_description, full_content, icon_name, sort_order) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'business-websites',
    'Business Websites',
    'Custom tailored modern corporate & company websites that establish authority, generate qualified inbound leads, and build credibility.',
    '<p>We design and develop bespoke business websites engineered for credibility, seamless speed, and measurable conversion. Equipped with dynamic lead capture forms, WhatsApp integration, and responsive mobile architecture.</p>',
    'Building2',
    1
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'ecommerce-websites',
    'E-Commerce Online Stores',
    'High-converting, lightning-fast shopping experiences with Razorpay checkout, UPI, inventory management, and automated invoices.',
    '<p>Sell your products effortlessly across the country. Our e-commerce stores come with native payment gateway integration, instant UPI payment popups, discount coupon engine, and real-time order tracking.</p>',
    'ShoppingCart',
    2
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'web-applications',
    'Custom Web Apps & Portals',
    'Scalable, full-stack Next.js and Supabase web applications with authenticated client dashboards, billing workflows, and CRM capabilities.',
    '<p>Transform your business processes into intuitive web applications. Built with modern App Router architectures, robust PostgreSQL databases, and role-based permissions.</p>',
    'Code',
    3
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'seo-growth-marketing',
    'SEO & Digital Growth',
    'Technical search engine optimization, Local Business Google ranking, structured schema markup, and speed audits that drive organic buyers.',
    '<p>Get ranked on Google for the terms your customers are actively searching for. We implement semantic HTML5, fast core web vitals, JSON-LD structured data, and on-page keyword optimization.</p>',
    'TrendingUp',
    4
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'website-redesign',
    'Website Redesign & Speed Optimization',
    'Upgrade outdated websites into modern Apple-grade glassmorphic experiences with 95+ Google PageSpeed performance.',
    '<p>Give your brand the facelift it deserves. We transform sluggish, non-responsive legacy sites into sleek, modern, mobile-first web experiences.</p>',
    'Zap',
    5
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'annual-maintenance',
    'Website Maintenance & Security',
    'Hassle-free annual maintenance including cloud server management, SSL renewal, daily backups, uptime monitoring, and content updates.',
    '<p>Never worry about technical glitches, expired domains, or server downtime. Our maintenance plans ensure your digital storefront operates smoothly 24/7/365.</p>',
    'ShieldCheck',
    6
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Plan Categories
INSERT INTO public.plan_categories (id, slug, name, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000001', 'business', 'Business Website Plans', 1),
  ('20000000-0000-0000-0000-000000000002', 'ecommerce', 'E-Commerce Website Plans', 2)
ON CONFLICT (id) DO NOTHING;

-- 8. Business Website Plans
INSERT INTO public.plans (
  id, category_id, name, tagline, old_price, price, discount_percentage, gst_percentage, is_popular, renewal_price, delivery_days, sort_order
) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Starter Business',
    'Ideal for startups & local service providers seeking a clean professional presence.',
    14999, 8999, 40, 18, false, 2999, 5, 1
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Classic Growth (Most Popular)',
    'Best value for growing companies looking to dominate their market and capture leads.',
    24999, 14999, 40, 18, true, 3999, 7, 2
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    'Premium Corporate',
    'Complete custom solution with high-end animations, CMS blog, and priority support.',
    39999, 24999, 37, 18, false, 4999, 10, 3
  ),
  -- E-Commerce Plans
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002',
    'E-Commerce Starter',
    'Launch your online store with up to 50 products and direct online UPI payments.',
    29999, 18999, 36, 18, false, 4999, 7, 1
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000002',
    'E-Commerce Pro (Most Popular)',
    'Full-fledged online store with unlimited products, coupons, and inventory dashboard.',
    49999, 29999, 40, 18, true, 6999, 12, 2
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000002',
    'E-Commerce Enterprise',
    'Custom bespoke architecture, client portal, multi-vendor support, and dedicated manager.',
    89999, 54999, 39, 18, false, 9999, 20, 3
  )
ON CONFLICT (id) DO NOTHING;

-- 9. Plan Feature Groups & Features (Classic Business Plan)
INSERT INTO public.plan_feature_groups (id, plan_id, name, sort_order) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Plan Details', 1),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Functionality & Design', 2),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'Website Security & Speed', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.plan_features (group_id, text, is_free_badge, sort_order) VALUES
  ('40000000-0000-0000-0000-000000000001', 'Up to 15 Pages Responsive Website', false, 1),
  ('40000000-0000-0000-0000-000000000001', 'Free .com or .in Domain (1st Year)', true, 2),
  ('40000000-0000-0000-0000-000000000001', 'Free Super-Fast Cloud Hosting', true, 3),
  ('40000000-0000-0000-0000-000000000001', '1 Business Email Account', true, 4),
  ('40000000-0000-0000-0000-000000000002', 'Dedicated Admin Panel & Dashboard', true, 1),
  ('40000000-0000-0000-0000-000000000002', 'Google Authentication (OAuth Login)', true, 2),
  ('40000000-0000-0000-0000-000000000002', '100% Mobile & Tablet App-Like Responsive', false, 3),
  ('40000000-0000-0000-0000-000000000002', 'Floating WhatsApp & Call Click-to-Chat', false, 4),
  ('40000000-0000-0000-0000-000000000002', 'Lead Generation Enquiry Form + Email Alerts', false, 5),
  ('40000000-0000-0000-0000-000000000002', 'Google Maps & Social Media Integration', false, 6),
  ('40000000-0000-0000-0000-000000000003', 'Free Lifetime SSL Certificate (HTTPS)', true, 1),
  ('40000000-0000-0000-0000-000000000003', 'DDoS Protection & Firewall Security', false, 2),
  ('40000000-0000-0000-0000-000000000003', 'On-Page SEO & Google Search Console Setup', true, 3),
  ('40000000-0000-0000-0000-000000000003', '1 Year Free Technical Support & Minor Edits', true, 4);

-- 10. Portfolio Categories & Projects
INSERT INTO public.portfolio_categories (id, slug, name, sort_order) VALUES
  ('50000000-0000-0000-0000-000000000001', 'business', 'Business Websites', 1),
  ('50000000-0000-0000-0000-000000000002', 'ecommerce', 'E-Commerce', 2),
  ('50000000-0000-0000-0000-000000000003', 'web-apps', 'Web Apps', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_projects (
  id, category_id, slug, title, client_name, live_url, thumbnail_url, challenge, solution, results_stats, tech_tags, is_featured
) VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    'nexora-cloud-tech',
    'Nexora Cloud — Enterprise SaaS Platform',
    'Nexora Technologies Pvt Ltd',
    'https://example.com/nexora',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'Client had a slow legacy WordPress site generating low conversion rates and poor mobile scores.',
    'Engineered a Next.js 14 App Router site with Framer Motion pastel glassmorphism and instant lead capture.',
    '{"conversion_rate":"+140%","page_load":"0.8s","leads_monthly":"320+"}'::jsonb,
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    true
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '50000000-0000-0000-0000-000000000002',
    'aurora-luxury-jewels',
    'Aurora Jewels — D2C E-Commerce Brand',
    'Aurora Jewels India',
    'https://example.com/aurora',
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1200&q=80',
    'Needed an ultra-luxurious mobile shopping experience with fast 1-click Razorpay UPI checkout.',
    'Built custom high-speed storefront with product filters, live stock indicators, and instant order tracking.',
    '{"monthly_revenue":"₹28 Lakhs","cart_dropoff":"-38%","mobile_traffic":"86%"}'::jsonb,
    ARRAY['Next.js', 'Razorpay', 'Supabase', 'Tailwind CSS'],
    true
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    '50000000-0000-0000-0000-000000000001',
    'apex-law-associates',
    'Apex Legal Advisors — Corporate Law Firm',
    'Apex Law Associates',
    'https://example.com/apex',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'Required an authoritative, bilingual corporate website with client consultation scheduling.',
    'Crafted an elegant editorial layout with Playfair typography, consultation booking, and practice area showcases.',
    '{"consultations":"+220%","bounce_rate":"24%","google_rank":"Top 3"}'::jsonb,
    ARRAY['Next.js', 'Tailwind CSS', 'SEO Pro', 'Cal.com API'],
    false
  )
ON CONFLICT (id) DO NOTHING;

-- 11. Testimonials
INSERT INTO public.testimonials (client_name, business_name, avatar_url, rating, review_text, is_verified, is_approved) VALUES
  (
    'Vikram Malhotra',
    'Founder, Nexora Cloud',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    5,
    'Webspyra built our website in just 6 days! The mobile experience is ridiculously smooth and we saw an instant 2x jump in enquiry calls from day one.',
    true,
    true
  ),
  (
    'Ananya Sen',
    'CEO, Aurora Jewels',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    5,
    'The pastel glassmorphism aesthetic is Apple-level premium. Our customers regularly compliment the website look, and Razorpay UPI checkout works flawlessly.',
    true,
    true
  ),
  (
    'Rajesh Goyal',
    'Managing Partner, Apex Legal',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    5,
    'Outstanding team. No hidden charges, zero delays, and their customer support team answers within 5 minutes on WhatsApp. Best decision for our law firm.',
    true,
    true
  ),
  (
    'Pooja Sharma',
    'Director, Zenica Organic Health',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
    5,
    'We were skeptical about web agencies because of past bad experiences, but Webspyra delivered exactly what was promised. 100% recommended!',
    true,
    true
  );

-- 12. Global FAQs
INSERT INTO public.faqs (category, question, answer, sort_order) VALUES
  (
    'general',
    'How long does it take to build and launch my website?',
    'Our standard Business Website packages are delivered in just 5 to 7 working days. For custom E-Commerce or complex web apps, delivery ranges between 10 to 18 working days depending on catalog size.',
    1
  ),
  (
    'general',
    'Do I get complete ownership of my domain and website?',
    'Yes, 100%! The domain is registered in your name, and you own all rights to your content, code, and customer data. We never lock you into proprietary platforms.',
    2
  ),
  (
    'pricing',
    'Are there any hidden costs or surprise renewal fees?',
    'Absolutely not. Every quote and plan clearly states the initial cost and future annual renewal (which covers domain, cloud server hosting, SSL, and technical support).',
    3
  ),
  (
    'technical',
    'Will my website be fast and mobile friendly?',
    'Yes! All Webspyra websites are mobile-first, zero-zoom protected, and built on Next.js 14 for sub-second page loads. We routinely score 95+ on Google PageSpeed Insights.',
    4
  ),
  (
    'payments',
    'What payment options and plans do you support?',
    'We accept all Indian and international payment methods through Razorpay: UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and EMI options.',
    5
  );

-- 13. Discount Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, is_active) VALUES
  ('LAUNCH20', 'percentage', 20, 5000, true),
  ('FLAT2000', 'fixed', 2000, 10000, true);
