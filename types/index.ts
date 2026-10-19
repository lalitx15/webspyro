export type Role = "customer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  gst_number?: string | null;
  company?: string | null;
  role: Role;
  created_at: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url?: string | null;
  logo_inverted_url?: string | null;
  favicon_url?: string | null;
  contact_email: string;
  secondary_email?: string;
  contact_phone: string;
  whatsapp_number: string;
  whatsapp_default_message?: string;
  address?: string;
  map_embed_url?: string;
  working_hours?: string;
  currency: string;
  gst_percentage: number;
  live_chat_enabled: boolean;
  social_links?: {
    instagram?: string;
    facebook?: string;
    x?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  category: "business" | "ecommerce";
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
  is_active: boolean;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id?: string | null;
  author_name?: string;
  note: string;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  actor_id?: string | null;
  actor_name?: string;
  action: string;
  old_status?: string | null;
  new_status?: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  business_type?: string;
  company?: string;
  service_interested?: string;
  plan_id?: string | null;
  message?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  notes?: string;
  budget?: string;
  assigned_to?: string | null;
  lead_notes?: LeadNote[];
  lead_activity?: LeadActivity[];
  created_at: string;
  updated_at?: string;
}

export type ChatStatus = "open" | "closed" | "resolved";
export type ChatSenderType = "visitor" | "admin" | "system";

export interface ChatConversation {
  id: string;
  visitor_session_id: string;
  visitor_name?: string | null;
  visitor_email?: string | null;
  visitor_phone?: string | null;
  status: ChatStatus;
  last_message_at: string;
  created_at: string;
  unread_count?: number;
  last_message?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: ChatSenderType;
  sender_id?: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ProjectStatus = "brief" | "design" | "development" | "review" | "live";

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  plan_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subtotal: number;
  gst_amount: number;
  discount_amount: number;
  total_amount: number;
  coupon_code?: string | null;
  payment_status: PaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  project_status: ProjectStatus;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
  plan?: Plan;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses?: number | null;
  current_uses: number;
  valid_until?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ClientProject {
  id: string;
  order_id?: string;
  client_id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_name: string;
  service_type: string;
  staging_url?: string;
  current_stage: ProjectStatus;
  progress_percentage: number;
  assigned_architect: string;
  start_date: string;
  target_launch_date: string;
  notes?: string;
  created_at: string;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: string;
  note?: string | null;
  created_at: string;
}

export interface SeoSettings {
  id: string;
  default_title: string;
  title_template: string;
  default_description: string;
  default_og_image?: string | null;
  ga4_id?: string | null;
  search_console_code?: string | null;
  meta_pixel_id?: string | null;
  robots_txt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PageSeo {
  id: string;
  page_path: string;
  title: string;
  description: string;
  og_image?: string | null;
  canonical_url?: string | null;
  json_ld?: any;
  updated_at?: string;
}

