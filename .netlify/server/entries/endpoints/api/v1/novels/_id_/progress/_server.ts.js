import { json } from "@sveltejs/kit";
import { s as supabase } from "../../../../../../../chunks/supabase.js";
import { a as apiKeyService } from "../../../../../../../chunks/apiKeyService.js";
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
const POST = async ({ request, params }) => {
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
  const { data: novel, error: fetchError } = await supabase.from("novels").select("current_chapter, status").eq("id", params.id).eq("user_id", auth.userId).single();
  if (fetchError || !novel) {
    return json({ success: false, error: "Novel not found" }, { status: 404 });
  }
  let newChapter = novel.current_chapter;
  if (body.chapter !== void 0) {
    newChapter = body.chapter;
  } else if (body.increment !== void 0) {
    newChapter = novel.current_chapter + body.increment;
  }
  const updates = {
    current_chapter: Math.max(0, newChapter),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (body.status) {
    updates.status = body.status;
  }
  if (novel.status === "planning" && newChapter > 0 && !body.status) {
    updates.status = "reading";
  }
  const { data, error } = await supabase.from("novels").update(updates).eq("id", params.id).eq("user_id", auth.userId).select().single();
  if (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
  return json({ success: true, data });
};
export {
  POST
};
