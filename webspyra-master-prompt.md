# WEBSPYRA — Master Prompt for Google Antigravity
> Is poore prompt ko Antigravity me paste karo. Pehle "PHASE 0" se shuru karo, aur har phase complete hone ke baad hi next phase ka message bhejo (Section 12 me har phase ka ready-made message diya hai).

---

## THE PROMPT (copy from here)

```
You are a senior full-stack engineer and award-winning UI/UX designer. Build "WEBSPYRA" — a production-grade, fully functional website for a WEB DEVELOPMENT COMPANY (services: business websites, e-commerce websites, web apps, SEO, digital marketing, maintenance). The site must be animated, premium, and 100% usable on mobile, tablet and desktop.

Tech stack (strict): Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase (Auth + Database + Storage), Razorpay (payments), Recharts (admin charts), TipTap (rich text), Lucide icons. Must deploy to Vercel with zero config issues.

This is NOT a template or mockup. Every feature must be wired to Supabase and fully working. No "// TODO" or placeholder comments — every function fully written. Work phase by phase (Section 12), verify each phase builds without errors (npm run build) before moving on.

=====================================================================
SECTION 1 — DEVICE & APP-LIKE BEHAVIOUR (NON-NEGOTIABLE)
=====================================================================
The site must behave like a native app on phones and tablets.

1. NO ZOOM ON MOBILE/TABLET. Implement ALL of these together (browsers ignore any single one):
   - In app/layout.tsx export `viewport`: { width: 'device-width', initialScale: 1, maximumScale: 1, minimumScale: 1, userScalable: false, viewportFit: 'cover', themeColor: '#EEF2F7' }.
   - Global CSS: `html, body { touch-action: manipulation; -webkit-text-size-adjust: 100%; overscroll-behavior: none; }` and `* { -webkit-tap-highlight-color: transparent; }`.
   - A client component <NoZoom /> mounted once in the root layout that: (a) calls preventDefault on `gesturestart`, `gesturechange`, `gestureend`; (b) on `touchmove` with `e.touches.length > 1` and `{ passive: false }` calls preventDefault; (c) blocks double-tap zoom by preventing a second `touchend` within 300ms; (d) blocks Ctrl+wheel and Ctrl/Cmd + (+ / - / 0) zoom on desktop.
   - All input/textarea/select font-size must be >= 16px (prevents iOS auto-zoom on focus).
   - Exception: the portfolio image lightbox may use its own controlled zoom (button based), never browser zoom.
2. PWA / app feel: add app/manifest.ts (name "Webspyra", display: "standalone", orientation "portrait", background_color + theme_color from palette, icons 192/512/maskable), apple-touch-icon, `appleWebApp` metadata (capable: true, statusBarStyle: 'default'). Add a lightweight service worker for offline fallback page and asset caching.
3. Use `100dvh` (not 100vh), `env(safe-area-inset-*)` padding for notch devices, `user-select: none` on UI chrome (buttons, nav) but keep text selectable in articles/forms.
4. Mobile: sticky bottom action bar (glass pill) with 4 icons — Call, WhatsApp, Get Quote, Menu — with safe-area padding. Hide it on desktop.
5. Breakpoints & testing: design mobile-first and verify at 360, 375, 414 (phones), 768, 834, 1024 (tablets), 1280, 1440+ (desktop). No horizontal scroll at any width. Touch targets >= 44x44px. Tablet gets its own 2-column layouts, not stretched mobile or squeezed desktop.
6. Respect `prefers-reduced-motion` (reduce to simple fades) and keep 60fps: animate only transform/opacity.

=====================================================================
SECTION 2 — UI DESIGN SYSTEM (HIGHEST PRIORITY)
=====================================================================
Visual style: SOFT PASTEL GLASSMORPHISM + neumorphic depth — like a futuristic Apple Vision Pro product page. Frosted-glass cards floating over a soft pastel gradient, big rounded corners, glowing pill buttons, pastel gradient "hero art" panels, generous whitespace. Think Apple Vision Pro site, Aesop-level typography, Linear/Vercel polish.

### Color Palette (extracted from the reference design — use exactly)
CSS variables in :root and mirrored in tailwind.config.ts:
- --bg-base:        #EEF2F7  (cool off-white)
- --bg-gradient:    linear-gradient(135deg, #E3EEEA 0%, #E9EDF5 45%, #DCE3F2 100%)  (mint → mist → periwinkle page background)
- --bg-warm-glow:   #FFF6DC  (soft cream light-streak, used as a diagonal light beam in hero background)
- --surface:        rgba(255,255,255,0.72) with backdrop-filter: blur(24px) saturate(160%)  (glass cards)
- --surface-solid:  #FFFFFF
- --border-glass:   1px solid rgba(255,255,255,0.8)  (+ outer ring rgba(15,23,42,0.05))
- --text-primary:   #0F172A   --text-secondary: #64748B   --text-muted: #94A3B8
- --accent:         #1F6FEB  (primary blue — pill CTAs, links, active states)
- --accent-grad:    linear-gradient(90deg, #1F6FEB, #5B8CFF)
- --pink:           #F4A9BE   --rose:  #F2657F  (the coral dot/orb)
- --peach:          #F8CFA6   --mint:  #A9E3DD   --sky: #8FD3F0
- --periwinkle:     #6C7CF0   --lavender: #C9B8F0
- --hero-art-grad:  linear-gradient(160deg, #F9B8C8 0%, #F8D9B0 28%, #BFD7F5 62%, #E7A8D8 85%, #4F7BFF 100%)  (big pastel art panel)
- Semantic: success #16A34A, warning #F59E0B, danger/sale #DC2626.
- Card shadow (soft neumorphic): 0 1px 2px rgba(15,23,42,0.04), 0 12px 40px rgba(99,115,160,0.14), inset 0 1px 0 rgba(255,255,255,0.9)
- Glow shadow for primary buttons: 0 8px 24px rgba(31,111,235,0.35)
- Dark mode is NOT required; keep light only (but admin may use #F8FAFC content bg).
- Add large blurred floating gradient orbs (pink, sky, lavender, peach — 300–500px, blur 80px, 40% opacity) behind sections, slowly drifting via Framer Motion.

### Typography
- Headings & body: "Inter" (variable) for body, and "Plus Jakarta Sans" or "DM Sans" for display headings (clean, bold, tight tracking -0.02em). Optional italic serif accent word (Playfair Display italic) inside headings for emphasis, e.g. "Launch your business *online*".
- Sizes (fluid with clamp): Hero 40–72px, Section H2 28–44px, Card titles 18–22px, Body 15–16px, Labels/captions 12–13px uppercase letter-spacing 0.1em.
- Line-height 1.15–1.2 for headings, 1.6 for body.

### Shape, Spacing, Layout
- 8px grid: all spacing multiples of 8.
- Radii: cards 28–32px, big panels 40px, buttons fully pill (999px), inputs 16px.
- Max content width 1280px centered; page padding 20px mobile, 32px tablet, 64px desktop. Section padding 64px mobile / 96–120px desktop.
- Buttons: pill, 48–56px high. Primary = blue gradient + glow. Secondary = white glass with soft shadow. Tertiary = pastel (peach / mint / pink tint) pill. Each has icon slot.
- Small floating "chips/badges" with pastel backgrounds and tiny glowing dot.

### Micro-Interactions & Animations (Framer Motion — everything must feel alive)
Use <motion.*> for all animated UI (CSS transitions allowed only for color/background). Implement ALL:
1. Page transitions: AnimatePresence + template.tsx; fade + slide up (opacity 0→1, y 24→0, 0.45s, ease [0.25,0.1,0.25,1]).
2. Animated hero: headline reveals word-by-word (stagger 0.06s, y 30→0, blur 8px→0); gradient art panel floats (y ±12px loop, 6s) with subtle parallax on mouse move (desktop) / device tilt or scroll (mobile); floating glass mini-cards (traffic, leads, sales stats) orbit/bob around it.
3. Scroll reveals: every section/card uses whileInView (once: true, margin -80px) fade-up y 30→0, 0.6s; grid children stagger 0.08s.
4. Buttons: whileTap scale 0.96, whileHover scale 1.03; primary buttons have shimmer sweep (gradient background-position animation) and glow pulse; ripple on click.
5. Cards: hover lift (y -6, shadow deepen), tilt-3D effect on desktop (rotateX/Y from mouse), glass shine sweep on hover.
6. Count-up numbers (clients, projects, rating) triggered when in view.
7. Infinite marquee: top announcement ticker (offers/delivery promise) and trust-badge/tech-stack logo strip (pause on hover).
8. Plan cards: horizontal swipe carousel on mobile with snap + dot indicators and "swipe to compare plans" hint animation; "Most Popular" badge pulses; deal countdown timer (HH:MM:SS) ticking.
9. Portfolio: filter tabs (All / Business / E-commerce / Web App) with layout animation (layoutId); card opens a live-preview modal (scale 0.95→1 + blur backdrop) with device switcher (mobile/tablet/desktop frame); if the site refuses embedding, show screenshot + "Open in new tab" button.
10. Navigation: sticky glass header shrinks 80→60px on scroll with blur and bottom hairline fade-in; mobile full-screen overlay menu with staggered links; active-section highlight via IntersectionObserver; animated underline.
11. Floating widgets: WhatsApp button (pulse ring), Live Chat bubble (opens glass chat panel, messages saved to Supabase, admin can reply), "Back to top" with progress ring.
12. Scroll progress bar at top (accent gradient). Cursor glow follower on desktop only.
13. Skeleton shimmer loaders for every dynamic block (no layout shift). Toasts: top-right (top-center on mobile), slide + fade, 3s auto-dismiss with shrinking progress bar.
14. Form micro-interactions: floating labels, animated validation (shake on error, checkmark draw on success), submit button morphs into spinner → success tick.
15. SVG path-draw animations for success checkmarks, process-step connector lines, and icon reveals. Lottie is NOT needed.
16. Section dividers: soft curved gradient waves that parallax on scroll.

### Component Quality Rules
- next/image everywhere with aspect ratios, blur placeholders, priority for above-fold; next/font for fonts.
- Visible focus-visible rings (2px offset, accent). Full keyboard support, aria labels, semantic HTML, WCAG AA contrast.
- Empty states with illustration + helpful CTA. Custom 404 and error pages (animated).
- Bundle: first-load JS under 200KB for landing page (dynamic import charts, TipTap, chat panel, preview modal).

=====================================================================
SECTION 3 — PUBLIC WEBSITE PAGES & FEATURES (modelled on https://lp.webzo.in — same functions, original Webspyra design & copy)
=====================================================================
All text, plans, prices, contact info, logos, projects, testimonials, FAQs come from Supabase (editable in admin). Seed sample data clearly marked as sample.

### Global elements
- Top announcement ticker (infinite marquee, admin-editable): e.g. offer, "100% mobile friendly", "Delivery in X working days", "Contact us today".
- Header: Webspyra logo (dynamic from admin), nav: Home, Services, Pricing, Our Portfolio, Reviews, Blog, Contact Us; right side: Call Now (tel: link with phone), "Get Free Quote" primary pill. Smooth-scroll anchors on home + real routes for inner pages.
- Floating WhatsApp button (prefilled message "Hi Webspyra, I'm looking for a new website. How can we proceed further?"), Live Chat bubble, mobile bottom action bar (Section 1).
- Footer: logo, short about, Quick Links (Home, How It Works, About Us, Latest Work, Website Plans, E-Commerce Plans, Testimonials, Blog, Our Services, Contact Us), contact info, social icons, newsletter signup, legal links (Privacy, Terms, Sitemap), copyright.

### Home page sections (in this order)
1. HERO — "Launch your professional website" headline (admin-editable), subtext (fast, secure, SEO-friendly), chips: Free Domain • Free Hosting • Free Business Emails (editable), CTAs: "Get Free Quote" (opens quote modal) + "View Our Work" (scroll to portfolio). Trust row: 200+ reviews, 4.9★ rating, 200+ clients, 5+ years (count-up). Right side: big pastel gradient art panel containing an animated mini "Business Growth" dashboard glass card (Traffic, Leads, Sales with animated progress bars + upward trend line draw) and feature mini-cards (High Performance, Business Growth, Secure & Reliable, 100+ Projects Delivered).
2. WEBSITE FEATURES — grid of glass cards with animated icons: Live Chat, Responsive Design, Payment Gateway, Light-Speed Server, Social Media Integrations, Technical Support.
3. PRICING — two tabs with animated sliding indicator: "Business Website Plans" and "E-Commerce Website Plans". Each shows 3 plan cards (Starter / Classic (Most Popular) / Premium): strike-through old price, % OFF badge, new price, "+GST" note, deal countdown, "Best Value Deal" ribbon, feature list grouped in 3 groups (Plan Details, Functionality, Website Security) with check icons and FREE badges, annual renewal price line, buttons: "Get Free Quote" (quote modal) + "Chat on WhatsApp", mini trust line (500+ businesses trust Webspyra, 4.9/5 Google rated). Also a "Buy Now / Pay Advance" button that goes to checkout (Razorpay) — Section 6. Mobile = swipe carousel, desktop = 3-column grid. All plans, features and prices fully CRUD from admin.
4. WITH vs WITHOUT WEBSITE — split comparison: left card "Without Website" (pain-points list, fake Google search showing "No website found"), right card "With a Professional Website" (benefit list + animated browser-mockup of a sample business site with stats), CTA "Get Your Business Website" (tel link). Row of badges: Modern & Responsive, SEO Ready, Fast & Secure, Ongoing Support.
5. LATEST WORK (Portfolio) — tabs Business / E-commerce / All, horizontal slider with prev/next arrows + drag/swipe, project cards (screenshot, title, category, tags). Click → live preview modal (device switcher, "Open in new tab"). Trust strip: 4.9/5 Google reviews, 500+ happy clients, satisfaction guaranteed, 6+ years.
6. HOW IT WORKS — 4 animated steps with connector line drawing on scroll: 1 Message us, 2 Share your content, 3 We build your site, 4 Review & go live.
7. TESTIMONIALS — auto-sliding glass cards (avatar, name, business, stars, text, verified badge) with pause on hover/touch; "Add your review" is admin-moderated.
8. FAQ — animated accordion (admin CRUD).
9. CONTACT / ENQUIRY (#enquire) — lead form: name, phone, email, business type (select), service/plan interested (select), message, with floating labels, validation, honeypot spam protection, rate-limit; saves to Supabase `leads`, sends email notification to admin, shows success animation, and offers "Continue on WhatsApp". Side card: phone, email, address, map embed, working hours, social links.
10. FINAL CTA banner — "Let's grow your business together!" + Get Started button.

### Other pages
- /services (list) and /services/[slug] (detail: overview, process, tech used, related plans, FAQ, CTA).
- /portfolio (grid with filters, search) and /portfolio/[slug] (case study: challenge, solution, result stats, screenshots gallery, tech stack, live link).
- /pricing (full comparison table with sticky header, horizontal scroll on mobile).
- /blog (grid, categories, search, pagination) and /blog/[slug] (TipTap HTML rendering, reading time, share buttons, related posts, JSON-LD Article).
- /about (story, team cards, values, stats), /contact, /faq, /privacy-policy, /terms, /refund-policy, /sitemap (HTML), custom 404.
- /get-quote — full-page version of the quote modal (multi-step: project type → budget → features → contact; progress bar).
- Search modal (header icon): debounced search across services, portfolio, blog; keyboard navigation; recent searches in localStorage.

### Quote Modal ("Get Free Quote — takes 30 seconds, we'll call you back")
Glass modal (scale 0.95→1): name, phone (with +91 default), email (optional), plan interested, short message. Saves to `leads` with source = page/plan. Success animation. Opens from every "Get Free Quote" button.

### Client Portal (Supabase Auth — email+password + Google OAuth)
- Sign in / Sign up with smooth tab transition.
- Dashboard: welcome, my projects with animated status timeline (Brief received → Design → Development → Review → Live), my orders/invoices (download printable invoice), support tickets, profile (avatar upload to Supabase Storage), saved addresses/GST details.
- Renewal reminders (hosting / email / SSL / support) with "Renew now" via Razorpay.

=====================================================================
SECTION 4 — ADMIN PANEL (/admin)
=====================================================================
Separate layout (no public header/footer), protected by Supabase Auth + role = 'admin' in profiles; non-admins redirected. Admin UI: white glass sidebar (collapsible, Lucide icons), content bg #F8FAFC, same pastel accents; sortable/searchable/paginated tables (20/page), validated forms with inline errors, confirmation modal for every destructive action, toasts on all CRUD, Recharts in design-system colors.

Modules:
1. Dashboard — animated KPI cards (Revenue, New Leads, Orders, Active Projects, Conversion %) with % change vs previous period; leads/revenue area chart (7d/30d/90d/1y); recent leads; recent orders; top plans/services; upcoming renewals.
2. Leads / Enquiries — table (name, phone, email, source, plan, status: New/Contacted/Qualified/Won/Lost, assigned to, date), filters, search, status change, internal notes, activity timeline, one-click Call/WhatsApp/Email, CSV export, kanban view toggle (drag between statuses).
3. Live Chat inbox — real-time (Supabase Realtime) conversations, reply, mark resolved, unread badge.
4. Plans & Pricing — CRUD plan categories (Business / E-commerce), plans (name, tagline, old price, price, discount %, GST %, deal end time, is_popular, feature groups with items, renewal price, delivery timeline, sort order, active).
5. Services — CRUD (title, slug, icon, short/long description (TipTap), image, FAQ, SEO).
6. Portfolio — CRUD projects (title, slug, category, client, live URL, screenshot/gallery uploads (drag-drop, reorder), tech tags, case-study fields, featured, active).
7. Testimonials — CRUD + approve/reject.
8. Blog — CRUD posts with TipTap, cover image, categories, tags, SEO fields, draft/publish, schedule.
9. Orders & Payments — list/detail (client info, plan, amount, GST, Razorpay payment id, status Pending/Paid/Failed/Refunded, project status), timeline with notes, invoice print/PDF view, CSV export.
10. Clients (Customers) — list/detail: profile, orders, projects, renewals, notes, lifetime value.
11. Projects tracker — assign status stages to a client project; client sees it in portal.
12. Coupons — CRUD (code, percentage/fixed, min amount, usage limit, per-user limit, validity, applicable plans, active) + usage tracking.
13. FAQ, Hero & Banners — CRUD FAQs; hero content, ticker/announcement bar (toggle, text, link, color); promo banners with start/end; stats numbers (clients, years, rating).
14. Brand & Site Settings — upload logo (primary + inverted) and favicon (dynamic everywhere incl. emails/invoices/PWA icons), site name, tagline, contact email/phone/WhatsApp number/address/map link/working hours, social links (Instagram, Facebook, X, LinkedIn, YouTube, TikTok), currency, tax/GST settings, WhatsApp prefilled message, live-chat on/off, email SMTP/Resend settings.
15. SEO — global title template "{Page} | Webspyra", default description, GA4 ID, Search Console verification, Meta Pixel ID, default OG image, per-page SEO (home, about, contact, services, pricing, policies), auto /sitemap.xml (all pages, services, portfolio, blog), editable /robots.txt, JSON-LD (Organization + LocalBusiness on home, Service on service pages, Article on blog, FAQPage on FAQ, BreadcrumbList everywhere).
16. Media Library — grid of Storage files, drag-drop upload, delete (warn if in use), copy URL.
17. Analytics — leads over time, revenue, orders, top plans, top services, lead sources, conversion funnel (Supabase aggregation queries).
18. Users & Roles — list users, promote/demote admin.

=====================================================================
SECTION 5 — SUPABASE SCHEMA (provide full SQL migration + seed file)
=====================================================================
Tables (uuid PKs, created_at/updated_at, indexes on slugs/status/foreign keys):
profiles (id FK auth.users, email, full_name, phone, avatar_url, gst_number, company, role enum 'customer'|'admin'), site_settings, seo_settings, page_seo, announcement_items, hero_content, stats, services, service_faqs, plan_categories, plans, plan_feature_groups, plan_features, portfolio_categories, portfolio_projects, portfolio_images, testimonials, blog_categories, blog_posts, faqs, leads, lead_notes, lead_activity, chat_conversations, chat_messages, orders (order_number auto 'WSP-10001', user_id, plan_id, amounts, gst, discount, coupon_code, payment_status, razorpay_order_id, razorpay_payment_id, project_status, notes), order_timeline, client_projects, project_stages, renewals, coupons, coupon_usages, subscribers, addresses, media, contact_messages.
RLS: public read for published content; customers read/update only own profile, orders, projects, addresses, tickets; leads/chat insert allowed for anon with rate-limit via edge/API; only admins write content, settings, orders, coupons, leads management.
Storage buckets: "brand-assets", "portfolio-images", "blog-images", "media-library" (public read, admin write), "avatars" (authenticated own folder).
Triggers/functions: updated_at auto-update; order_number generation; coupon usage increment; auto-create profile on signup; lead activity log on status change; Realtime enabled for chat tables.

=====================================================================
SECTION 6 — PAYMENTS (Razorpay)
=====================================================================
- Server API route creates Razorpay order (amount in paise, receipt = order_number), verifies signature on success (/api/razorpay/verify), webhook at /api/webhooks/razorpay (payment.captured / payment.failed / refund.processed) with signature verification → updates orders.
- Use Razorpay Checkout (checkout.js) themed with accent #1F6FEB; support UPI, cards, netbanking, wallets; Test Mode supported; GST calculation shown in summary; coupon validation against `coupons`.
- Checkout flow (multi-step with animated progress): Details → Review (plan, GST, coupon) → Pay → Success page (animated tick, order number, next steps, invoice download).
- Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_WEBHOOK_SECRET, RESEND_API_KEY (or SMTP), NEXT_PUBLIC_SITE_URL. Provide .env.example.

=====================================================================
SECTION 7 — TECHNICAL REQUIREMENTS
=====================================================================
Structure: app/(site)/..., app/(admin)/admin/..., app/api/..., components/{ui,site,admin}, lib/{supabase,razorpay,utils,seo}, hooks (useDebounce, useCountdown, useMediaQuery, useInView), types, public.
State: React Context for auth, UI (modals/toasts) and chat; no Redux/Zustand.
Performance: ISR (revalidate 60) for public pages, dynamic imports for heavy components, Lighthouse targets: Performance 90+ mobile, Accessibility 95+, SEO 100, Best Practices 95+.
Security: server-side validation (zod) for all forms/APIs, honeypot + rate limiting on public forms, sanitize TipTap HTML, never expose service-role key to client, secure headers in next.config.
Include README.md with full setup (Supabase project, run migrations, buckets, env vars, Razorpay keys & webhook, Google OAuth, deploy to Vercel) and a seed script.

=====================================================================
SECTION 8 — REFERENCE FEEL
=====================================================================
Blend: Apple Vision Pro product page (glass, pastel gradients, whitespace) + Aesop typography + Linear/Vercel dashboard clarity for admin. If unsure, choose the more minimal, spacious, refined option. Keep brand name spelled exactly "Webspyra".

=====================================================================
SECTION 9 — DEFINITION OF DONE
=====================================================================
- npm run build passes with zero TypeScript/ESLint errors.
- Pinch-zoom, double-tap zoom and Ctrl+wheel zoom are blocked on phones/tablets/desktop (except the controlled lightbox).
- Every button, form, filter, modal and admin CRUD works against Supabase.
- Verified at 360 / 768 / 1024 / 1440 widths with no horizontal scroll.
- All animations from Section 2 implemented and smooth; reduced-motion respected.
- Admin can change logo, contact info, plans, prices, portfolio, testimonials, SEO from the panel and the public site updates.

=====================================================================
SECTION 10 — HOW TO WORK
=====================================================================
Follow the phases in Section 12 strictly, one at a time. At the end of each phase: summarize files created, run the build, fix errors, and wait for my "next phase" message. Do not skip ahead and do not leave stubs.
```

---

## SECTION 12 — STEP-BY-STEP PHASE MESSAGES (ek-ek karke Antigravity me bhejo)

**PHASE 0 — Setup**
```
Phase 0: Initialize Next.js 14 (App Router, TypeScript, Tailwind), install framer-motion, @supabase/supabase-js, @supabase/ssr, razorpay, recharts, lucide-react, zod, @tiptap/react, @tiptap/starter-kit. Configure tailwind.config.ts with the Webspyra palette, fonts (next/font), radii, shadows, and global CSS variables. Implement the <NoZoom /> component, viewport config, manifest and PWA basics exactly as in Section 1. Show me the folder structure.
```

**PHASE 1 — Database**
```
Phase 1: Write the complete Supabase SQL migration (tables, enums, indexes, RLS policies, storage buckets, triggers, functions) and a seed.sql with sample Webspyra data (plans, services, portfolio, testimonials, FAQs, settings). Also set up Supabase clients (browser/server/middleware) and an AuthProvider with Google OAuth.
```

**PHASE 2 — Design system**
```
Phase 2: Build the design-system components with all animations from Section 2: Button (primary/secondary/pastel), GlassCard, Input/Textarea/Select with floating labels, Modal, Drawer, Toast, Skeleton, Badge/Chip, Accordion, Tabs with sliding indicator, Marquee, CountUp, Countdown, Orbs background, Section reveal wrappers. Create a /design-system demo page to verify them.
```

**PHASE 3 — Layout shell**
```
Phase 3: Build the public layout: announcement ticker, sticky shrinking glass Header (dynamic logo/contact from Supabase), full-screen mobile menu, mobile bottom action bar, floating WhatsApp + Live Chat bubble (UI only for now), Footer, scroll progress bar, page transitions, 404 page.
```

**PHASE 4 — Home page**
```
Phase 4: Build the complete Home page, all 10 sections in order from Section 3 (Hero with animated growth dashboard, Features, Pricing tabs + swipe carousel + countdown, With/Without comparison, Portfolio slider + live-preview modal, How It Works, Testimonials, FAQ, Enquiry form, Final CTA). Everything data-driven from Supabase with skeleton loaders.
```

**PHASE 5 — Lead system & Quote modal**
```
Phase 5: Implement the Quote modal, enquiry form, /get-quote multi-step page, zod validation, honeypot + rate limiting, saving to `leads`, admin email notification, and WhatsApp continue button.
```

**PHASE 6 — Inner pages**
```
Phase 6: Build /services, /services/[slug], /portfolio, /portfolio/[slug], /pricing, /blog, /blog/[slug], /about, /contact, /faq, policy pages, HTML sitemap, and the search modal.
```

**PHASE 7 — Live chat**
```
Phase 7: Implement Live Chat end-to-end with Supabase Realtime (visitor panel + admin inbox hook), persistence, unread counts, and typing indicator.
```

**PHASE 8 — Checkout & Razorpay**
```
Phase 8: Build checkout (multi-step), coupon validation, GST calculation, Razorpay order creation, signature verification, webhook, success page, invoice view, and order emails.
```

**PHASE 9 — Client portal**
```
Phase 9: Build auth pages and the client portal: dashboard, projects with animated status timeline, orders/invoices, renewals with Razorpay, profile with avatar upload.
```

**PHASE 10 — Admin core**
```
Phase 10: Build the admin layout (sidebar, role guard), dashboard with KPI count-ups and Recharts, reusable DataTable (sort/search/paginate/bulk actions), confirmation modals, and the Leads module (table + kanban + notes + export).
```

**PHASE 11 — Admin content**
```
Phase 11: Build admin modules: Plans & Pricing, Services, Portfolio, Testimonials, Blog (TipTap), FAQs, Hero/Ticker/Banners, Media Library, with drag-drop uploads and reorder.
```

**PHASE 12 — Admin business**
```
Phase 12: Build admin modules: Orders & Payments, Clients, Projects tracker, Coupons, Live Chat inbox, Analytics, Users & Roles.
```

**PHASE 13 — Settings & SEO**
```
Phase 13: Build Brand & Site Settings (dynamic logo/favicon/contact/social), SEO module (global + per-page, sitemap.xml, robots.txt editor, JSON-LD, GA4/Pixel injection).
```

**PHASE 14 — Polish & QA**
```
Phase 14: Final polish: loading/error/empty states, reduced-motion, accessibility audit, Lighthouse optimization, bundle-size check, test at 360/768/1024/1440, verify no zoom on touch devices, write README + .env.example, and prepare Vercel deployment steps. Report any remaining issues.
```

---

## Tips
- Agar Antigravity kisi phase me atak jaye, to wahi phase dobara bhejo aur likho: "Fix the errors and continue this phase only."
- Logo, phone number, WhatsApp number, prices — sab admin panel se badal sakte ho, code me hard-code nahi hai.
- Reference image jaisa look chahiye to Phase 2 me image bhi attach kar do aur likho: "Match this visual style."
