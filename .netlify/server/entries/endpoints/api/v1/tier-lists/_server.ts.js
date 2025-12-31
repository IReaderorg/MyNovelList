import { json } from "@sveltejs/kit";
import { s as supabase } from "../../../../../chunks/supabase.js";
import { a as apiKeyService } from "../../../../../chunks/apiKeyService.js";
async function validateRequest(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ success: false, error: "Missing or invalid Authorization header" }, { status: 401 });
  }
  const apiKey = authHeader.substring(7);
  const validation = await apiKeyService.validateKey(apiKey);
  if (!validation) {
    return json({ success: false, error: "Invalid or expired API key" }, { status: 401 });
  }
  return validation;
}
const GET = async ({ request }) => {
  const auth = await validateRequest(request);
  if (auth instanceof Response) return auth;
  if (!auth.scopes.includes("read")) {
    return json({ success: false, error: "API key does not have read permission" }, { status: 403 });
  }
  const { data, error } = await supabase.from("tier_lists").select("*").eq("user_id", auth.userId).order("updated_at", { ascending: false });
  if (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
  return json({ success: true, data: data || [] });
};
const POST = async ({ request }) => {
  const auth = await validateRequest(request);
  if (auth instanceof Response) return auth;
  if (!auth.scopes.includes("write")) {
    return json({ success: false, error: "API key does not have write permission" }, { status: 403 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.title || typeof body.title !== "string") {
    return json({ success: false, error: "Title is required" }, { status: 400 });
  }
  const { data, error } = await supabase.from("tier_lists").insert({
    user_id: auth.userId,
    title: body.title,
    description: body.description,
    is_public: body.is_public || false
  }).select().single();
  if (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
  return json({ success: true, data }, { status: 201 });
};
export {
  GET,
  POST
};
