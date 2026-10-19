# WEBSPYRA — Next-Gen Web Development Agency Platform

> Production-grade, high-performance website and client platform for a modern web development company. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase (Auth, Database, Storage & Realtime), and Razorpay payments.

---

## 🌟 Key Features

### 1. Public Marketing Experience & UI Design System
- **Soft Pastel Glassmorphism**: Frosted-glass cards, pastel gradient orbs, and neumorphic depth inspired by modern design standards.
- **Device & App-Like Feel**:
  - **Zero Unwanted Zoom**: Integrated `<NoZoom />` component preventing multi-touch pinch, gesture zooming, double-tap zoom (<300ms), and Ctrl/Cmd-wheel zoom.
  - **PWA Ready**: Web App Manifest, offline fallback route (`/offline`), and lightweight Service Worker.
  - **Mobile Sticky Bottom Action Bar**: Quick access to Call, WhatsApp, Get Quote, and Menu.
- **Dynamic Content Sections**:
  - Word-by-word animated hero with growth dashboard preview
  - Interactive pricing matrix with billing cycle, coupon deductions & deal countdown
  - Filterable portfolio showcase with live device preview modal (desktop/tablet/mobile)
  - Process timeline, interactive testimonials, and FAQ accordion
  - High-converting multi-step lead capture (`/get-quote`) with honeypot & rate limiting
  - Realtime Live Chat widget with typing indicators and unread badges

### 2. E-Commerce & Checkout Engine
- Multi-step checkout (`/checkout`) with automatic GST calculation (18%) and coupon validation
- Secure Razorpay payment gateway integration with cryptographic signature verification
- Webhook listener (`/api/webhooks/razorpay`) with idempotency protection
- Instant post-purchase order confirmation & printable GST tax invoice (`/checkout/invoice/[orderNumber]`)

### 3. Client Portal (`/portal`)
- **Dashboard**: High-level overview of active projects, recent orders, and support tickets
- **Project Tracker**: 5-stage milestone tracker (Brief, Design, Development, Review, Live) with progress bar and staging preview links
- **Order History & Invoices**: Direct PDF/print invoice download
- **Service Renewals**: Annual hosting and AMC renewal checkout powered by Razorpay
- **Profile Management**: Profile details, corporate GSTIN, and avatar upload

### 4. Admin Management Suite (`/admin`)
- **Executive Dashboard**: Real-time KPI counters (Revenue, Active Projects, Conversion Rates) and Recharts analytics
- **Leads & CRM**: Kanban pipeline, tabular ledger, note attachments, and CSV export
- **Orders & Payments**: Full payment ledger with Razorpay transaction IDs, status updater, and tax invoices
- **Client Directory**: Customer LTV tracker, order history, and direct WhatsApp/Phone/Email actions
- **Content CMS**:
  - Plans & Pricing manager
  - Services manager with slug generator
  - Portfolio CMS with multi-image gallery & project tags
  - Blog Article Editor powered by TipTap rich text
  - Testimonials with client avatars & ratings
  - FAQs & top announcement ticker editor
- **Media Library**: Supabase Storage file browser with drag-and-drop uploader
- **Live Chat Desk**: Multi-conversation admin inbox with real-time visitor threads
- **Brand & Site Settings**: Dynamic logo, dark logo, favicon, phone, email, and social links
- **SEO & Analytics Engine**: Global meta tags, SERP simulator, per-page overrides, robots.txt editor, and dynamic XML sitemap (`/sitemap.xml`)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Dynamic Metadata)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS + Custom CSS Variables + Neumorphic Shadows
- **Animations**: Framer Motion 11
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Storage Buckets, Realtime Channels)
- **Payments**: Razorpay Node.js SDK & Checkout JS
- **Charts & Data Viz**: Recharts
- **Rich Text Editing**: TipTap v3 + StarterKit
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- A Supabase project account ([supabase.com](https://supabase.com))
- A Razorpay test account ([razorpay.com](https://razorpay.com))

### 2. Clone & Install
```bash
git clone https://github.com/your-username/webspyra.git
cd webspyra
npm install
```

### 3. Database Migration & Seed Data
Execute the SQL migration scripts in your Supabase SQL Editor in the following order:
1. `supabase/migrations/20240101000000_init_schema.sql` (Creates all tables, enums, RLS policies, and triggers)
2. `supabase/seed.sql` (Seeds default services, plans, portfolio items, FAQs, and site settings)

Ensure the following Supabase Storage buckets exist and are set to **Public**:
- `media-library`
- `portfolio-images`
- `blog-images`
- `brand-assets`
- `avatars`

### 4. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live website.

---

## 🔒 Admin Access & RBAC

1. Create a user account via `/login`.
2. In Supabase Dashboard > `Table Editor` > `profiles`, set `role` to `'admin'`.
3. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to access the full control center.

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com/new).
3. In the **Environment Variables** tab, paste all variables from `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://webspyra.com`).
5. Click **Deploy**. Next.js App Router will generate all 58 routes with zero configuration issues.

---

## 📄 License
MIT License © 2026 Webspyra. All rights reserved.
