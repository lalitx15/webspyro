import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

// Input validation schemas
const startConversationSchema = z.object({
  action: z.literal("start_conversation"),
  visitor_session_id: z.string().min(5),
  visitor_name: z.string().optional().nullable(),
  visitor_email: z.string().email().optional().nullable(),
  visitor_phone: z.string().optional().nullable(),
});

const sendMessageSchema = z.object({
  action: z.literal("send_message"),
  conversation_id: z.string().uuid(),
  sender_type: z.enum(["visitor", "admin", "system"]),
  sender_id: z.string().uuid().optional().nullable(),
  content: z.string().min(1).max(2000),
});

const markReadSchema = z.object({
  action: z.literal("mark_read"),
  conversation_id: z.string().uuid(),
  sender_type: z.enum(["visitor", "admin"]),
});

const updateStatusSchema = z.object({
  action: z.literal("update_status"),
  conversation_id: z.string().uuid(),
  status: z.enum(["open", "closed", "resolved"]),
});

interface ConversationRecord {
  id: string;
  visitor_session_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: "open" | "closed" | "resolved";
  last_message_at: string;
  created_at: string;
  chat_messages?: Array<{
    content: string;
    created_at: string;
    is_read: boolean;
    sender_type: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const conversationId = searchParams.get("conversationId");

    const supabase = createAdminClient();

    if (conversationId) {
      // Fetch specific conversation & its messages
      const { data: conversation, error: convError } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      const { data: messages, error: msgError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }

      return NextResponse.json({
        conversation,
        messages: messages || [],
      });
    }

    if (sessionId) {
      // Find latest conversation for this visitor session
      const { data: conversations, error: convError } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("visitor_session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (convError) {
        console.warn("Chat session query notice:", convError.message);
        return NextResponse.json({ conversation: null, messages: [] });
      }

      const conversation = conversations?.[0] || null;

      if (!conversation) {
        return NextResponse.json({ conversation: null, messages: [] });
      }

      const { data: messages, error: msgError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      if (msgError) {
        console.warn("Chat messages query notice:", msgError.message);
        return NextResponse.json({ conversation, messages: [] });
      }

      return NextResponse.json({
        conversation,
        messages: messages || [],
      });
    }

    // If no parameters, return list of recent conversations (for admin inbox)
    const { data: allConversations, error: listError } = await supabase
      .from("chat_conversations")
      .select("*, chat_messages(content, created_at, is_read, sender_type)")
      .order("last_message_at", { ascending: false })
      .limit(50);

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    // Format list with unread count and preview
    const rawList = (allConversations || []) as unknown as ConversationRecord[];
    const formatted = rawList.map((conv) => {
      const msgs = conv.chat_messages || [];
      const unreadVisitorMsgs = msgs.filter(
        (m) => m.sender_type === "visitor" && !m.is_read
      ).length;
      const lastMsg = msgs[msgs.length - 1];

      return {
        id: conv.id,
        visitor_session_id: conv.visitor_session_id,
        visitor_name: conv.visitor_name,
        visitor_email: conv.visitor_email,
        visitor_phone: conv.visitor_phone,
        status: conv.status,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        unread_count: unreadVisitorMsgs,
        last_message: lastMsg?.content || "",
      };
    });

    return NextResponse.json({ conversations: formatted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch chat data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    // 1. Action: start_conversation
    if (body.action === "start_conversation") {
      const validated = startConversationSchema.parse(body);

      // Check if open conversation already exists for this visitor session
      const { data: existing } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("visitor_session_id", validated.visitor_session_id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        // If visitor provided updated contact info, update it
        if (validated.visitor_name || validated.visitor_phone || validated.visitor_email) {
          const { data: updated } = await supabase
            .from("chat_conversations")
            .update({
              visitor_name: validated.visitor_name || existing.visitor_name,
              visitor_email: validated.visitor_email || existing.visitor_email,
              visitor_phone: validated.visitor_phone || existing.visitor_phone,
            })
            .eq("id", existing.id)
            .select()
            .single();

          return NextResponse.json({ conversation: updated || existing });
        }

        return NextResponse.json({ conversation: existing });
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from("chat_conversations")
        .insert({
          visitor_session_id: validated.visitor_session_id,
          visitor_name: validated.visitor_name || null,
          visitor_email: validated.visitor_email || null,
          visitor_phone: validated.visitor_phone || null,
          status: "open",
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json({ conversation: newConv });
    }

    // 2. Action: send_message
    if (body.action === "send_message") {
      const validated = sendMessageSchema.parse(body);

      // Insert message
      const { data: message, error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: validated.conversation_id,
          sender_type: validated.sender_type,
          sender_id: validated.sender_id || null,
          content: validated.content.trim(),
          is_read: false,
        })
        .select()
        .single();

      if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }

      // Update conversation's last_message_at
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", validated.conversation_id);

      // Check if this was visitor's first message to send automated welcome note
      if (validated.sender_type === "visitor") {
        const { count } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", validated.conversation_id)
          .eq("sender_type", "visitor");

        if (count === 1) {
          // Send automatic instant greeting from Webspyra team
          setTimeout(async () => {
            try {
              await supabase.from("chat_messages").insert({
                conversation_id: validated.conversation_id,
                sender_type: "system",
                content:
                  "👋 Hello! Thank you for connecting with Webspyra. A senior web architect has been alerted and will reply momentarily. If your inquiry is urgent, you can also reach us directly on WhatsApp via the green button below.",
                is_read: false,
              });
            } catch (e) {
              console.error("Auto welcome message error", e);
            }
          }, 600);
        }
      }

      return NextResponse.json({ message });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 422 }
      );
    }
    const message = err instanceof Error ? err.message : "Failed to process chat request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    if (body.action === "mark_read") {
      const validated = markReadSchema.parse(body);

      // If visitor is reading, mark admin/system messages as read
      // If admin is reading, mark visitor messages as read
      const targetSender = validated.sender_type === "visitor" ? ["admin", "system"] : ["visitor"];

      const { error } = await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("conversation_id", validated.conversation_id)
        .in("sender_type", targetSender);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === "update_status") {
      const validated = updateStatusSchema.parse(body);

      const { data, error } = await supabase
        .from("chat_conversations")
        .update({ status: validated.status })
        .eq("id", validated.conversation_id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ conversation: data });
    }

    return NextResponse.json({ error: "Invalid patch action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update chat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
