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
const GET = async ({ request, url }) => {
  const auth = await validateRequest(request);
  if (auth instanceof Response) return auth;
  if (!auth.scopes.includes("read")) {
    return json({ success: false, error: "API key does not have read permission" }, { status: 403 });
  }
  const title = url.searchParams.get("title");
  const sourceUrl = url.searchParams.get("source_url");
  if (!title && !sourceUrl) {
    return json({ success: false, error: "Provide title or source_url parameter" }, { status: 400 });
  }
  let query = supabase.from("novels").select("*").eq("user_id", auth.userId);
  if (title) {
    query = query.ilike("title", `%${title}%`);
  }
  if (sourceUrl) {
    query = query.eq("source_url", sourceUrl);
  }
  const { data, error } = await query.limit(10);
  if (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
  return json({ success: true, data: data || [] });
};
export {
  GET
};
