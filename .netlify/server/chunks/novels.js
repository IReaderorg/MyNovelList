import { d as derived, w as writable } from "./index.js";
import { s as supabase } from "./supabase.js";
const novelService = {
  async getAll() {
    const { data, error } = await supabase.from("novels").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getById(id) {
    const { data, error } = await supabase.from("novels").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },
  async create(input) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("novels").insert({
      user_id: user.id,
      title: input.title,
      author: input.author,
      cover_url: input.cover_url,
      source_url: input.source_url,
      status: input.status || "planning",
      current_chapter: input.current_chapter || 0,
      total_chapters: input.total_chapters,
      score: input.score,
      notes: input.notes,
      tags: input.tags || [],
      started_at: input.started_at,
      completed_at: input.completed_at
    }).select().single();
    if (error) throw error;
    return data;
  },
  async update(id, input) {
    const { data, error } = await supabase.from("novels").update({
      ...input,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id) {
    const { error } = await supabase.from("novels").delete().eq("id", id);
    if (error) throw error;
  }
};
function createNovelsStore() {
  const { subscribe, set, update } = writable({
    novels: [],
    loading: false,
    error: null
  });
  return {
    subscribe,
    load: async () => {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const novels2 = await novelService.getAll();
        set({ novels: novels2, loading: false, error: null });
      } catch (e) {
        set({ novels: [], loading: false, error: e.message });
      }
    },
    add: async (input) => {
      const novel = await novelService.create(input);
      update((s) => ({ ...s, novels: [...s.novels, novel] }));
      return novel;
    },
    update: async (id, input) => {
      const updated = await novelService.update(id, input);
      update((s) => ({
        ...s,
        novels: s.novels.map((n) => n.id === id ? updated : n)
      }));
    },
    delete: async (id) => {
      await novelService.delete(id);
      update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== id) }));
    },
    updateChapter: async (id, chapter) => {
      await novelService.update(id, { current_chapter: chapter });
      update((s) => ({
        ...s,
        novels: s.novels.map(
          (n) => n.id === id ? { ...n, current_chapter: chapter, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : n
        )
      }));
    }
  };
}
const novels = createNovelsStore();
const filterOptions = writable({ status: "all" });
const sortOptions = writable({ field: "updated_at", direction: "desc" });
const filteredNovels = derived(
  [novels, filterOptions, sortOptions],
  ([$novels, $filter, $sort]) => {
    let result = [...$novels.novels];
    if ($filter.status && $filter.status !== "all") {
      result = result.filter((n) => n.status === $filter.status);
    }
    if ($filter.scoreMin !== void 0) {
      result = result.filter((n) => (n.score ?? 0) >= $filter.scoreMin);
    }
    if ($filter.scoreMax !== void 0) {
      result = result.filter((n) => (n.score ?? 100) <= $filter.scoreMax);
    }
    if ($filter.tags && $filter.tags.length > 0) {
      result = result.filter((n) => $filter.tags.some((t) => n.tags.includes(t)));
    }
    if ($filter.search) {
      const search = $filter.search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(search) || n.author?.toLowerCase().includes(search)
      );
    }
    result.sort((a, b) => {
      let aVal = a[$sort.field] ?? "";
      let bVal = b[$sort.field] ?? "";
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return $sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return $sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }
);
export {
  filteredNovels as a,
  filterOptions as f,
  novels as n,
  sortOptions as s
};
