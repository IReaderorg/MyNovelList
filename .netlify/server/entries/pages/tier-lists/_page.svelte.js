import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, b as each } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { w as writable } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabase.js";
import { a as auth, i as isAuthenticated } from "../../../chunks/auth.js";
import { B as Button } from "../../../chunks/Button.js";
import { M as Modal } from "../../../chunks/Modal.js";
import { I as Input } from "../../../chunks/Input.js";
/* empty css                                                  */
const DEFAULT_TIERS = [
  { name: "S", color: "#ff7f7f" },
  { name: "A", color: "#ffbf7f" },
  { name: "B", color: "#ffff7f" },
  { name: "C", color: "#7fff7f" },
  { name: "D", color: "#7fbfff" },
  { name: "F", color: "#bf7fff" }
];
const tierListService = {
  async getAll() {
    const { data, error } = await supabase.from("tier_lists").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getById(id) {
    const { data: tierList, error: tlError } = await supabase.from("tier_lists").select("*").eq("id", id).single();
    if (tlError) throw tlError;
    if (!tierList) return null;
    const { data: items, error: itemsError } = await supabase.from("tier_list_items").select("*, novel:novels(*)").eq("tier_list_id", id).order("position");
    if (itemsError) throw itemsError;
    return { ...tierList, items: items || [] };
  },
  async getPublicById(id) {
    const { data: tierList, error: tlError } = await supabase.from("tier_lists").select("*").eq("id", id).eq("is_public", true).single();
    if (tlError) throw tlError;
    if (!tierList) return null;
    const { data: items, error: itemsError } = await supabase.from("tier_list_items").select("*, novel:novels(id, title, cover_url, author)").eq("tier_list_id", id).order("position");
    if (itemsError) throw itemsError;
    return { ...tierList, items: items || [] };
  },
  async create(title, description) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("tier_lists").insert({
      user_id: user.id,
      title,
      description,
      tiers: DEFAULT_TIERS,
      is_public: false
    }).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, updates) {
    const { data, error } = await supabase.from("tier_lists").update({
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id) {
    const { error } = await supabase.from("tier_lists").delete().eq("id", id);
    if (error) throw error;
  },
  async addItem(tierListId, tierName, novelId, title, coverUrl) {
    const { data: existing } = await supabase.from("tier_list_items").select("position").eq("tier_list_id", tierListId).eq("tier_name", tierName).order("position", { ascending: false }).limit(1);
    const position = existing && existing.length > 0 ? existing[0].position + 1 : 0;
    const { data, error } = await supabase.from("tier_list_items").insert({
      tier_list_id: tierListId,
      tier_name: tierName,
      novel_id: novelId,
      title: novelId ? null : title,
      cover_url: novelId ? null : coverUrl,
      position
    }).select().single();
    if (error) throw error;
    return data;
  },
  async updateItem(itemId, tierName, position) {
    const { error } = await supabase.from("tier_list_items").update({ tier_name: tierName, position }).eq("id", itemId);
    if (error) throw error;
  },
  async removeItem(itemId) {
    const { error } = await supabase.from("tier_list_items").delete().eq("id", itemId);
    if (error) throw error;
  },
  async clone(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const original = await this.getById(id);
    if (!original) throw new Error("Tier list not found");
    const { data: newTierList, error: createError } = await supabase.from("tier_lists").insert({
      user_id: user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      tiers: original.tiers,
      is_public: false
    }).select().single();
    if (createError) throw createError;
    if (original.items.length > 0) {
      const newItems = original.items.map((item) => ({
        tier_list_id: newTierList.id,
        tier_name: item.tier_name,
        novel_id: item.novel_id,
        title: item.title,
        cover_url: item.cover_url,
        position: item.position
      }));
      const { error: itemsError } = await supabase.from("tier_list_items").insert(newItems);
      if (itemsError) throw itemsError;
    }
    return newTierList;
  }
};
function createTierListsStore() {
  const { subscribe: subscribe2, set, update } = writable({
    tierLists: [],
    loading: false,
    error: null
  });
  return {
    subscribe: subscribe2,
    load: async () => {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const tierLists2 = await tierListService.getAll();
        set({ tierLists: tierLists2, loading: false, error: null });
      } catch (e) {
        set({ tierLists: [], loading: false, error: e.message });
      }
    },
    create: async (title, description) => {
      const tierList = await tierListService.create(title, description);
      update((s) => ({ ...s, tierLists: [...s.tierLists, tierList] }));
      return tierList;
    },
    update: async (id, updates) => {
      const updated = await tierListService.update(id, updates);
      update((s) => ({
        ...s,
        tierLists: s.tierLists.map((t) => t.id === id ? updated : t)
      }));
      return updated;
    },
    delete: async (id) => {
      await tierListService.delete(id);
      update((s) => ({ ...s, tierLists: s.tierLists.filter((t) => t.id !== id) }));
    },
    clone: async (id) => {
      const cloned = await tierListService.clone(id);
      update((s) => ({ ...s, tierLists: [cloned, ...s.tierLists] }));
      return cloned;
    }
  };
}
const tierLists = createTierListsStore();
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $tierLists, $$unsubscribe_tierLists;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$unsubscribe_tierLists = subscribe(tierLists, (value) => $tierLists = value);
  let showCreateModal = false;
  let newTitle = "";
  let creating = false;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1i453y6_START -->${$$result.title = `<title>Tier Lists - MyNovelList</title>`, ""}<!-- HEAD_svelte-1i453y6_END -->`, ""} ${$auth.loading ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-10c0vma"><p class="text-gray-400">Loading...</p></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-4xl mx-auto px-4 py-8"><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold" data-svelte-h="svelte-26us4f">Tier Lists</h1> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `<svg class="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
				New Tier List`;
      }
    })}</div> ${$tierLists.loading ? `<div class="text-center py-12 text-gray-400" data-svelte-h="svelte-1qtjbal">Loading...</div>` : `${$tierLists.error ? `<div class="text-center py-12"><p class="text-red-400 mb-4">${escape($tierLists.error)}</p> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Retry`;
      }
    })}</div>` : `${$tierLists.tierLists.length === 0 ? `<div class="text-center py-12"><p class="text-gray-400 mb-4" data-svelte-h="svelte-1o67jux">No tier lists yet. Create one to rank your novels!</p> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Create Tier List`;
      }
    })}</div>` : `<div class="grid gap-4 md:grid-cols-2">${each($tierLists.tierLists, (tierList) => {
      return `<div class="card hover:border-gray-600 transition-colors"><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><a href="${"/tier-lists/" + escape(tierList.id, true)}" class="block"><h3 class="font-semibold truncate hover:text-primary-400 transition-colors">${escape(tierList.title)} </h3></a> ${tierList.description ? `<p class="text-sm text-gray-400 mt-1 line-clamp-2">${escape(tierList.description)}</p>` : ``}</div> <div class="flex items-center gap-2 ml-4">${tierList.is_public ? `<span class="px-2 py-0.5 text-xs rounded-full bg-green-600 text-white" data-svelte-h="svelte-24nd63">Public</span>` : ``} <button class="text-gray-500 hover:text-primary-400 transition-colors" title="Clone tier list" data-svelte-h="svelte-owhj8h"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button> <button class="text-gray-500 hover:text-red-400 transition-colors" title="Delete tier list" data-svelte-h="svelte-1f25niv"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button> </div></div>  <div class="flex gap-1 mt-3">${each(tierList.tiers, (tier) => {
        return `<div class="w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-gray-900" style="${"background-color: " + escape(tier.color, true)}">${escape(tier.name)} </div>`;
      })}</div> </div>`;
    })}</div>`}`}`}</div> ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: "Create Tier List",
        open: showCreateModal
      },
      {
        open: ($$value) => {
          showCreateModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<form class="space-y-4">${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "title",
              label: "Title",
              placeholder: "My Novel Rankings",
              value: newTitle
            },
            {
              value: ($$value) => {
                newTitle = $$value;
                $$settled = false;
              }
            },
            {}
          )} <div><label for="description" class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-x9c0fq">Description (optional)</label> <textarea id="description" rows="2" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" placeholder="What's this tier list about?">${escape("")}</textarea></div> <div class="flex justify-end gap-3 pt-2">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
            default: () => {
              return `Cancel`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              type: "submit",
              disabled: !newTitle.trim() || creating
            },
            {},
            {
              default: () => {
                return `${escape("Create")}`;
              }
            }
          )}</div></form>`;
        }
      }
    )}`}`}`;
  } while (!$$settled);
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_tierLists();
  return $$rendered;
});
export {
  Page as default
};
