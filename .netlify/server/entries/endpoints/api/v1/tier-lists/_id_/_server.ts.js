import { json } from "@sveltejs/kit";
import { s as supabase } from "../../../../../../chunks/supabase.js";
import { a as apiKeyService } from "../../../../../../chunks/apiKeyService.js";
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
const GET = async ({ request, params }) => {
  const auth = await validateRequest(request);
  if (auth instanceof Response) return auth;
  if (!auth.scopes.includes("read")) {
    return json({ success: false, error: "API key does not have read permission" }, { status: 403 });
  }
  const { data: tierList, error: tlError } = await supabase.from("tier_lists").select("*").eq("id", params.id).eq("user_id", auth.userId).single();
  if (tlError || !tierList) {
    return json({ success: false, error: "Tier list not found" }, { status: 404 });
  }
  const { data: items, error: itemsError } = await supabase.from("tier_list_items").select("*, novel:novels(id, title, cover_url, author)").eq("tier_list_id", params.id).order("position");
  if (itemsError) {
    return json({ success: false, error: itemsError.message }, { status: 500 });
  }
  return json({ success: true, data: { ...tierList, items: items || [] } });
};
const PUT = async ({ request, params }) => {
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
  const { data, error } = await supabase.from("tier_lists").update({
    ...body,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", params.id).eq("user_id", auth.userId).select().single();
  if (error) {
    return json({ success: false, error: "Tier list not found or update failed" }, { status: 404 });
  }
  return json({ success: true, data });
};
const DELETE = async ({ request, params }) => {
  const auth = await validateRequest(request);
  if (auth instanceof Response) return auth;
  if (!auth.scopes.includes("delete")) {
    return json({ success: false, error: "API key does not have delete permission" }, { status: 403 });
  }
  const { error } = await supabase.from("tier_lists").delete().eq("id", params.id).eq("user_id", auth.userId);
  if (error) {
    return json({ success: false, error: "Tier list not found or delete failed" }, { status: 404 });
  }
  return json({ success: true, data: { deleted: true } });
};
export {
  DELETE,
  GET,
  PUT
};
