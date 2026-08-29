import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Configuration ──────────────────────────────────────────────────────
// Gemini model name centralized here for easy changes.
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// ── Lumi System Prompt ──────────────────────────────────────────────────
const LUMI_SYSTEM_PROMPT = `You are Lumi, a warm, gentle AI emotional-support companion represented as a black cat. You are a friend who knows how to listen — not a therapist, doctor, or medical professional.

PERSONALITY:
- Warm, empathetic, calm, and non-judgmental
- Conversational and natural — never robotic or clinical
- Emotionally aware: meet people where they are
- Slightly playful but never dismissive
- Concise when appropriate, more detailed when someone needs support
- Never preachy, sarcastic, or toxically positive

HOW YOU SPEAK:
- Use natural conversational language
- Avoid robotic phrases like "I understand your concern," "I am here to assist you," "How may I help you today," or "It sounds like you are experiencing..."
- Instead of "I understand that you are feeling overwhelmed," say something like "Yeah... that sounds like a lot to carry at once."
- Validate feelings before offering perspective
- Use emojis very sparingly and only when it fits naturally

WHAT YOU DO:
- Listen and reflect back what someone is feeling
- Validate their emotions without minimizing them
- Help organize tangled thoughts
- Suggest gentle, realistic coping strategies
- Encourage small healthy habits (water, rest, a walk, reaching out to someone)
- Remember the context of the current conversation and refer back to it naturally

SAFETY (NON-NEGOTIABLE):
- You are NOT a therapist or medical professional. Never claim to be.
- Never diagnose mental illnesses or tell someone they have a condition
- Never prescribe or recommend medication
- Never provide medical treatment instructions
- Never encourage self-harm, suicide, violence, eating-disorder behaviors, substance abuse, or any dangerous behavior
- If someone appears to be in crisis or immediate danger, prioritize real-world support. Gently encourage them to contact a crisis line or emergency services in their location. Do not pretend you can replace that support.
- You provide emotional support and general information — not a substitute for professional mental-health care.

Always respond as Lumi, the warm black-cat companion.`;

interface ChatRequest {
  conversation_id: string;
  message: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function logError(label: string, error: unknown) {
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { value: String(error) };
  console.error(`[lumi-chat] ${label}`, JSON.stringify(detail));
}

function friendlyError(status: number): string {
  if (status === 401 || status === 403) {
    return "Lumi can't reach her thoughts right now. Please try again in a moment.";
  }
  if (status === 404) {
    return "Lumi can't reach her thoughts right now. Please try again in a moment.";
  }
  if (status === 429) {
    return "Lumi's taking a little breath right now — she's had a lot to think about. Please try again in a moment.";
  }
  if (status >= 500) {
    return "Lumi can't reach her thoughts right now. Please try again in a moment.";
  }
  return "Lumi can't reach her thoughts right now. Please try again in a moment.";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // ── Validate Gemini configuration ──────────────────────────────────
    if (!GEMINI_API_KEY) {
      logError("missing_api_key", new Error("GEMINI_API_KEY env var is not set"));
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Authenticate the user via the Supabase JWT ──────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      logError("auth_failure", userError ?? "no user");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Parse & validate request body ──────────────────────────────────
    let body: ChatRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { conversation_id, message } = body;

    if (!conversation_id || typeof conversation_id !== "string") {
      return new Response(JSON.stringify({ error: "A conversation is needed." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Please type something first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Guard against excessively long messages
    const MAX_MESSAGE_LENGTH = 8000;
    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: "That's a lot to take in at once — could you share a shorter piece so Lumi can stay with you?" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Verify the conversation belongs to this user ────────────────────
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id, user_id, title")
      .eq("id", conversation_id)
      .maybeSingle();

    if (convError) {
      logError("conversation_lookup", convError);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!conversation || conversation.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Conversation not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Save the user's message ─────────────────────────────────────────
    const { error: insertUserMsgError } = await supabase
      .from("messages")
      .insert({ conversation_id, role: "user", content: message.trim() });

    if (insertUserMsgError) {
      logError("insert_user_message", insertUserMsgError);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Fetch conversation history for context ─────────────────────────
    const { data: history, error: historyError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true })
      .limit(30);

    if (historyError) {
      logError("fetch_history", historyError);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Fetch user settings ────────────────────────────────────────────
    const { data: settings } = await supabase
      .from("user_settings")
      .select("response_style, use_emojis")
      .eq("user_id", user.id)
      .maybeSingle();

    const responseStyle = settings?.response_style ?? "balanced";
    const useEmojis = settings?.use_emojis ?? true;

    // ── Build the Gemini request ───────────────────────────────────────
    const styleInstruction =
      responseStyle === "concise"
        ? "Keep your responses short and to the point — a few sentences."
        : responseStyle === "detailed"
          ? "Take your time and be a bit more detailed and thoughtful when helpful."
          : "Balance brevity and warmth — be as detailed as the moment needs.";

    const emojiInstruction = useEmojis
      ? "You may use an occasional emoji when it fits naturally, but very sparingly."
      : "Do not use emojis in your responses.";

    const fullSystem = `${LUMI_SYSTEM_PROMPT}\n\n${styleInstruction}\n${emojiInstruction}`;

    // Gemini "contents" format: alternating user/model turns
    const contents = (history ?? []).map((m: ChatMessage) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    let geminiResponse: Response;
    try {
      geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: fullSystem }] },
          contents,
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
    } catch (networkErr) {
      logError("gemini_network_failure", networkErr);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!geminiResponse.ok) {
      let geminiDetail: unknown;
      try {
        geminiDetail = await geminiResponse.json();
      } catch {
        geminiDetail = await geminiResponse.text();
      }
      logError(`gemini_api_error_${geminiResponse.status}`, geminiDetail);
      return new Response(
        JSON.stringify({ error: friendlyError(geminiResponse.status) }),
        { status: geminiResponse.status >= 400 && geminiResponse.status < 500 ? 502 : 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let geminiData: {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };
    try {
      geminiData = await geminiResponse.json();
    } catch (parseErr) {
      logError("gemini_parse_error", parseErr);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lumiText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!lumiText) {
      logError("gemini_empty_response", geminiData);
      return new Response(
        JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Save Lumi's response ────────────────────────────────────────────
    const { error: insertAssistantError } = await supabase
      .from("messages")
      .insert({ conversation_id, role: "assistant", content: lumiText });

    if (insertAssistantError) {
      logError("insert_assistant_message", insertAssistantError);
      // We still return the response to the user even if DB save fails
    }

    // ── Auto-title the conversation from the first exchange ─────────────
    const messageCount = history?.length ?? 0;
    if (messageCount <= 1 && conversation.title === "New conversation") {
      const title = message.slice(0, 60).trim() || "New conversation";
      await supabase
        .from("conversations")
        .update({ title: title.length < message.length ? `${title}…` : title })
        .eq("id", conversation_id);
    }

    // Touch updated_at
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation_id);

    return new Response(JSON.stringify({ response: lumiText }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("unhandled", err);
    return new Response(
      JSON.stringify({ error: "Lumi can't reach her thoughts right now. Please try again in a moment." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
