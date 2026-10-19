-- =====================================================================
-- WEBSPYRA - SUPABASE DATABASE SCHEMA MIGRATION
-- Production-grade schema with RLS, triggers, functions & storage buckets
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'won', 'lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('brief', 'design', 'development', 'review', 'live');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE chat_status AS ENUM ('open', 'closed', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. SEQUENCE FOR ORDERS (WSP-10001, etc.)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001;

-- 4. HELPER FUNCTION FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. TABLES

-- Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  gst_number TEXT,
  company TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Site Settings (Single-row or key-value global brand configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Webspyra' NOT NULL,
  tagline TEXT DEFAULT 'Next-Gen Web Development Agency',
  logo_url TEXT,
  logo_inverted_url TEXT,
  favicon_url TEXT,
  contact_email TEXT DEFAULT 'contact@webspyra.com' NOT NULL,
  contact_phone TEXT DEFAULT '+91 98765 43210' NOT NULL,
  whatsapp_number TEXT DEFAULT '+91 98765 43210' NOT NULL,
  whatsapp_default_message TEXT DEFAULT 'Hi Webspyra, I am looking for a new website. How can we proceed further?',
  address TEXT DEFAULT 'Cyber City, Gurugram, Haryana, India',
  map_embed_url TEXT,
  working_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 7:00 PM',
  currency TEXT DEFAULT 'INR' NOT NULL,
  gst_percentage NUMERIC DEFAULT 18 NOT NULL,
  live_chat_enabled BOOLEAN DEFAULT true NOT NULL,
  social_links JSONB DEFAULT '{"instagram":"","facebook":"","x":"","linkedin":"","youtube":""}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- SEO Global Settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_title TEXT DEFAULT 'Webspyra | Premium Web Development & Digital Solutions' NOT NULL,
  title_template TEXT DEFAULT '%s | Webspyra' NOT NULL,
  default_description TEXT DEFAULT 'Award-winning web development agency creating fast, responsive, and animated business websites.' NOT NULL,
  default_og_image TEXT,
  ga4_id TEXT,
  search_console_code TEXT,
  meta_pixel_id TEXT,
  robots_txt TEXT DEFAULT $$User-agent: *
Allow: /
Sitemap: https://webspyra.com/sitemap.xml$$,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Per-page SEO overrides
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  og_image TEXT,
  canonical_url TEXT,
  json_ld JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Top Announcement Ticker Items
CREATE TABLE IF NOT EXISTS announcement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  link TEXT,
  bg_color TEXT DEFAULT '#1F6FEB',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Hero Section Dynamic Content
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT DEFAULT '100% Mobile Friendly • Ultra Fast',
  title TEXT DEFAULT 'Launch your professional website' NOT NULL,
  highlighted_word TEXT DEFAULT 'online',
  subtitle TEXT DEFAULT 'High-speed, SEO-optimised, animated websites designed to generate high-paying clients and boost revenue.' NOT NULL,
  chips TEXT[] DEFAULT ARRAY['Free Domain', 'Free Cloud Hosting', 'Free Business Emails'],
  cta_primary_text TEXT DEFAULT 'Get Free Quote' NOT NULL,
  cta_secondary_text TEXT DEFAULT 'View Our Work' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trust Stats Row
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value NUMERIC NOT NULL,
  suffix TEXT DEFAULT '+',
  prefix TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_content TEXT,
  icon_name TEXT DEFAULT 'Globe',
  image_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Service FAQs
CREATE TABLE IF NOT EXISTS service_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Plan Categories (e.g. Business Websites, E-Commerce Websites)
CREATE TABLE IF NOT EXISTS plan_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Pricing Plans
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES plan_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  old_price NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  discount_percentage NUMERIC DEFAULT 0,
  gst_percentage NUMERIC DEFAULT 18 NOT NULL,
  deal_end_time TIMESTAMPTZ,
  is_popular BOOLEAN DEFAULT false NOT NULL,
  renewal_price NUMERIC NOT NULL,
  delivery_days INT DEFAULT 7 NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Plan Feature Groups (Plan Details, Functionality, Security)
CREATE TABLE IF NOT EXISTS plan_feature_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Plan Features within Groups
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES plan_feature_groups(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  is_free_badge BOOLEAN DEFAULT false NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Portfolio Categories
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Portfolio Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES portfolio_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  live_url TEXT,
  thumbnail_url TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  results_stats JSONB,
  tech_tags TEXT[] DEFAULT ARRAY[]::text[],
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Portfolio Gallery Images
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES portfolio_projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Testimonials & Reviews
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  avatar_url TEXT,
  rating NUMERIC DEFAULT 5 NOT NULL,
  review_text TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  reading_time_minutes INT DEFAULT 5 NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Global FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT DEFAULT 'general' NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Leads & Enquiries
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  business_type TEXT,
  service_interested TEXT,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  message TEXT,
  source TEXT DEFAULT 'website' NOT NULL,
  status lead_status DEFAULT 'new'::lead_status NOT NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Internal Notes for Leads
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lead Activity Log (Status changes, emails sent, calls made)
CREATE TABLE IF NOT EXISTS lead_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Live Chat Conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  status chat_status DEFAULT 'open'::chat_status NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Live Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL, -- 'visitor' or 'admin'
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Discount Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage' NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0 NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0 NOT NULL,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  gst_amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0 NOT NULL,
  total_amount NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  project_status project_status DEFAULT 'brief'::project_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Coupon Usages Record
CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order Timeline / Status History
CREATE TABLE IF NOT EXISTS order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Client Projects (Client Portal Tracking)
CREATE TABLE IF NOT EXISTS client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  current_stage project_status DEFAULT 'brief'::project_status NOT NULL,
  live_url TEXT,
  staging_url TEXT,
  repository_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Project Detailed Stages
CREATE TABLE IF NOT EXISTS project_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES client_projects(id) ON DELETE CASCADE NOT NULL,
  stage_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0 NOT NULL
);

-- Annual Hosting / Domain / Maintenance Renewals
CREATE TABLE IF NOT EXISTS renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES client_projects(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'hosting', 'domain', 'ssl', 'maintenance'
  renewal_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT false NOT NULL,
  paid_at TIMESTAMPTZ,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Client Saved Addresses / Invoicing Details
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India' NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Media Library Records
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type TEXT NOT NULL,
  bucket TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- General Contact Form Inquiries
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================================
-- 6. INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_plans_category_id ON plans(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(visitor_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_client_projects_user ON client_projects(user_id);

-- =====================================================================
-- 7. TRIGGERS & FUNCTIONS
-- =====================================================================

-- Auto-update updated_at on relevant tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON site_settings;
CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER set_seo_settings_updated_at
BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_services_updated_at ON services;
CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_plans_updated_at ON plans;
CREATE TRIGGER set_plans_updated_at
BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_portfolio_updated_at ON portfolio_projects;
CREATE TRIGGER set_portfolio_updated_at
BEFORE UPDATE ON portfolio_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_blog_updated_at ON blog_posts;
CREATE TRIGGER set_blog_updated_at
BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_leads_updated_at ON leads;
CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_client_projects_updated_at ON client_projects;
CREATE TRIGGER set_client_projects_updated_at
BEFORE UPDATE ON client_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate Order Number 'WSP-10001'
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'WSP-' || nextval('order_number_seq')::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'customer'::user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-log lead status activity
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.lead_activity (lead_id, action, old_status, new_status)
    VALUES (NEW.id, 'status_changed', OLD.status::text, NEW.status::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_lead_status_changed ON leads;
CREATE TRIGGER on_lead_status_changed
AFTER UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION log_lead_status_change();

-- Auto-increment coupon usages
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coupon_code IS NOT NULL AND NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    UPDATE public.coupons
    SET current_uses = current_uses + 1
    WHERE code = NEW.coupon_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_order_paid_coupon_usage ON orders;
CREATE TRIGGER on_order_paid_coupon_usage
AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();

-- =====================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_role user_role;
BEGIN
  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN current_role = 'admin'::user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_feature_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
CREATE POLICY "Admins have full access to profiles" ON profiles FOR ALL USING (is_admin());

-- 2. PUBLIC READ POLICIES (Published content)
DROP POLICY IF EXISTS "Anyone can view site_settings" ON site_settings;
CREATE POLICY "Anyone can view site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage site_settings" ON site_settings;
CREATE POLICY "Admins can manage site_settings" ON site_settings FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view seo_settings" ON seo_settings;
CREATE POLICY "Anyone can view seo_settings" ON seo_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage seo_settings" ON seo_settings;
CREATE POLICY "Admins can manage seo_settings" ON seo_settings FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view page_seo" ON page_seo;
CREATE POLICY "Anyone can view page_seo" ON page_seo FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage page_seo" ON page_seo;
CREATE POLICY "Admins can manage page_seo" ON page_seo FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active announcements" ON announcement_items;
CREATE POLICY "Anyone can view active announcements" ON announcement_items FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcement_items;
CREATE POLICY "Admins can manage announcements" ON announcement_items FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active hero_content" ON hero_content;
CREATE POLICY "Anyone can view active hero_content" ON hero_content FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage hero_content" ON hero_content;
CREATE POLICY "Admins can manage hero_content" ON hero_content FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active stats" ON stats;
CREATE POLICY "Anyone can view active stats" ON stats FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage stats" ON stats;
CREATE POLICY "Admins can manage stats" ON stats FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active services" ON services;
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view service_faqs" ON service_faqs;
CREATE POLICY "Anyone can view service_faqs" ON service_faqs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage service_faqs" ON service_faqs;
CREATE POLICY "Admins can manage service_faqs" ON service_faqs FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active plan_categories" ON plan_categories;
CREATE POLICY "Anyone can view active plan_categories" ON plan_categories FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage plan_categories" ON plan_categories;
CREATE POLICY "Admins can manage plan_categories" ON plan_categories FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active plans" ON plans;
CREATE POLICY "Anyone can view active plans" ON plans FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage plans" ON plans;
CREATE POLICY "Admins can manage plans" ON plans FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view plan_feature_groups" ON plan_feature_groups;
CREATE POLICY "Anyone can view plan_feature_groups" ON plan_feature_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage plan_feature_groups" ON plan_feature_groups;
CREATE POLICY "Admins can manage plan_feature_groups" ON plan_feature_groups FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view plan_features" ON plan_features;
CREATE POLICY "Anyone can view plan_features" ON plan_features FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage plan_features" ON plan_features;
CREATE POLICY "Admins can manage plan_features" ON plan_features FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view portfolio_categories" ON portfolio_categories;
CREATE POLICY "Anyone can view portfolio_categories" ON portfolio_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage portfolio_categories" ON portfolio_categories;
CREATE POLICY "Admins can manage portfolio_categories" ON portfolio_categories FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active portfolio_projects" ON portfolio_projects;
CREATE POLICY "Anyone can view active portfolio_projects" ON portfolio_projects FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage portfolio_projects" ON portfolio_projects;
CREATE POLICY "Admins can manage portfolio_projects" ON portfolio_projects FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view portfolio_images" ON portfolio_images;
CREATE POLICY "Anyone can view portfolio_images" ON portfolio_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage portfolio_images" ON portfolio_images;
CREATE POLICY "Admins can manage portfolio_images" ON portfolio_images FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON testimonials;
CREATE POLICY "Anyone can view approved testimonials" ON testimonials FOR SELECT USING (is_approved = true OR is_admin());
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON testimonials;
CREATE POLICY "Anyone can insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view blog_categories" ON blog_categories;
CREATE POLICY "Anyone can view blog_categories" ON blog_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage blog_categories" ON blog_categories;
CREATE POLICY "Admins can manage blog_categories" ON blog_categories FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view published blog_posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog_posts" ON blog_posts FOR SELECT USING (is_published = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage blog_posts" ON blog_posts;
CREATE POLICY "Admins can manage blog_posts" ON blog_posts FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view active faqs" ON faqs;
CREATE POLICY "Anyone can view active faqs" ON faqs FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
CREATE POLICY "Admins can manage faqs" ON faqs FOR ALL USING (is_admin());

-- 3. LEADS & CONTACT POLICIES
DROP POLICY IF EXISTS "Anyone can submit a lead" ON leads;
CREATE POLICY "Anyone can submit a lead" ON leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view and manage leads" ON leads;
CREATE POLICY "Admins can view and manage leads" ON leads FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can view and manage lead_notes" ON lead_notes;
CREATE POLICY "Admins can view and manage lead_notes" ON lead_notes FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Admins can view lead_activity" ON lead_activity;
CREATE POLICY "Admins can view lead_activity" ON lead_activity FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can submit contact_messages" ON contact_messages;
CREATE POLICY "Anyone can submit contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage contact_messages" ON contact_messages;
CREATE POLICY "Admins can manage contact_messages" ON contact_messages FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view subscribers" ON subscribers;
CREATE POLICY "Admins can view subscribers" ON subscribers FOR ALL USING (is_admin());

-- 4. LIVE CHAT POLICIES
DROP POLICY IF EXISTS "Visitors can create and view their chat conversations" ON chat_conversations;
CREATE POLICY "Visitors can create and view their chat conversations" ON chat_conversations
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Visitors can send and view messages in their conversations" ON chat_messages;
CREATE POLICY "Visitors can send and view messages in their conversations" ON chat_messages
  FOR ALL USING (true) WITH CHECK (true);

-- 5. ORDERS & COMMERCE POLICIES
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Anyone can create an order" ON orders;
CREATE POLICY "Anyone can create an order" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Users can view their order timeline" ON order_timeline;
CREATE POLICY "Users can view their order timeline" ON order_timeline FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_timeline.order_id AND (orders.user_id = auth.uid() OR is_admin())));
DROP POLICY IF EXISTS "Admins can manage order_timeline" ON order_timeline;
CREATE POLICY "Admins can manage order_timeline" ON order_timeline FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Anyone can validate active coupons" ON coupons;
CREATE POLICY "Anyone can validate active coupons" ON coupons FOR SELECT USING (is_active = true OR is_admin());
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can view coupon usages" ON coupon_usages;
CREATE POLICY "Admins can view coupon usages" ON coupon_usages FOR ALL USING (is_admin());

-- 6. CLIENT PORTAL POLICIES
DROP POLICY IF EXISTS "Users can view their client projects" ON client_projects;
CREATE POLICY "Users can view their client projects" ON client_projects FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Admins can manage client projects" ON client_projects;
CREATE POLICY "Admins can manage client projects" ON client_projects FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can view project stages" ON project_stages;
CREATE POLICY "Users can view project stages" ON project_stages FOR SELECT
  USING (EXISTS (SELECT 1 FROM client_projects WHERE client_projects.id = project_stages.project_id AND (client_projects.user_id = auth.uid() OR is_admin())));
DROP POLICY IF EXISTS "Admins can manage project stages" ON project_stages;
CREATE POLICY "Admins can manage project stages" ON project_stages FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can view and pay their renewals" ON renewals;
CREATE POLICY "Users can view and pay their renewals" ON renewals FOR SELECT USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "Admins can manage renewals" ON renewals;
CREATE POLICY "Admins can manage renewals" ON renewals FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can manage their saved addresses" ON addresses;
CREATE POLICY "Users can manage their saved addresses" ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view media" ON media;
CREATE POLICY "Anyone can view media" ON media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage media" ON media;
CREATE POLICY "Admins can manage media" ON media FOR ALL USING (is_admin());

-- =====================================================================
-- 9. SUPABASE STORAGE BUCKETS
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('brand-assets', 'brand-assets', true),
  ('portfolio-images', 'portfolio-images', true),
  ('blog-images', 'blog-images', true),
  ('media-library', 'media-library', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage Policies
DROP POLICY IF EXISTS "Public Read on brand-assets" ON storage.objects;
CREATE POLICY "Public Read on brand-assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');

DROP POLICY IF EXISTS "Public Read on portfolio-images" ON storage.objects;
CREATE POLICY "Public Read on portfolio-images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Public Read on blog-images" ON storage.objects;
CREATE POLICY "Public Read on blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Public Read on media-library" ON storage.objects;
CREATE POLICY "Public Read on media-library" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');

DROP POLICY IF EXISTS "Public Read on avatars" ON storage.objects;
CREATE POLICY "Public Read on avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Admins have full storage access" ON storage.objects;
CREATE POLICY "Admins have full storage access" ON storage.objects FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 10. ENABLE REALTIME
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
  EXCEPTION WHEN duplicate_object THEN null;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  EXCEPTION WHEN duplicate_object THEN null;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE leads;
  EXCEPTION WHEN duplicate_object THEN null;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION WHEN duplicate_object THEN null;
  END;
END $$;
