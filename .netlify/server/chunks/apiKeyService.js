import { s as supabase } from "./supabase.js";
function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "mnl_";
  let key = prefix;
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
async function hashApiKey(key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
const apiKeyService = {
  async getAll() {
    const { data, error } = await supabase.from("api_keys").select("id, user_id, name, key_prefix, scopes, last_used_at, request_count, is_active, created_at, expires_at").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async create(name, scopes = ["read"]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const secret = generateApiKey();
    const keyHash = await hashApiKey(secret);
    const keyPrefix = secret.substring(0, 12);
    const { data, error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      scopes
    }).select("id, user_id, name, key_prefix, scopes, last_used_at, request_count, is_active, created_at, expires_at").single();
    if (error) throw error;
    return { ...data, secret };
  },
  async delete(id) {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) throw error;
  },
  async toggleActive(id, isActive) {
    const { error } = await supabase.from("api_keys").update({ is_active: isActive }).eq("id", id);
    if (error) throw error;
  },
  // Validate API key and return user_id if valid
  async validateKey(apiKey) {
    const keyHash = await hashApiKey(apiKey);
    const { data, error } = await supabase.from("api_keys").select("id, user_id, scopes, is_active, expires_at").eq("key_hash", keyHash).single();
    if (error || !data) return null;
    if (!data.is_active) return null;
    if (data.expires_at && new Date(data.expires_at) < /* @__PURE__ */ new Date()) return null;
    await supabase.from("api_keys").update({
      last_used_at: (/* @__PURE__ */ new Date()).toISOString(),
      request_count: data.request_count + 1
    }).eq("id", data.id);
    return { userId: data.user_id, scopes: data.scopes };
  }
};
export {
  apiKeyService as a
};
