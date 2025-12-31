import { d as derived, w as writable } from "./index.js";
import { s as supabase } from "./supabase.js";
const novelService = {
  // Get all novels (public database)
  async getAll() {
    const { data, error } = await supabase.from("novels").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  // Get novels with user's progress (for library view)
  async getMyLibrary() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: progressData, error: progressError } = await supabase.from("novel_progress").select("*, novel:novels(*)").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (progressError) throw progressError;
    return (progressData || []).map((p) => ({
      ...p.novel,
      progress: {
        id: p.id,
        user_id: p.user_id,
        novel_id: p.novel_id,
        status: p.status,
        current_chapter: p.current_chapter,
        score: p.score,
        notes: p.notes,
        started_at: p.started_at,
        completed_at: p.completed_at,
        created_at: p.created_at,
        updated_at: p.updated_at
      }
    }));
  },
  // Search novels in the public database
  async search(query) {
    const { data, error } = await supabase.from("novels").select("*").or(`title.ilike.%${query}%,author.ilike.%${query}%`).order("title").limit(20);
    if (error) throw error;
    return data || [];
  },
  async getById(id) {
    const { data, error } = await supabase.from("novels").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  },
  // Get novel with user's progress
  async getByIdWithProgress(id) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: novel, error } = await supabase.from("novels").select("*").eq("id", id).single();
    if (error || !novel) return null;
    let progress;
    if (user) {
      const { data: progressData } = await supabase.from("novel_progress").select("*").eq("novel_id", id).eq("user_id", user.id).single();
      if (progressData) progress = progressData;
    }
    return { ...novel, progress };
  },
  // Add a new novel to the database
  async create(input) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("novels").insert({
      user_id: user.id,
      title: input.title,
      author: input.author,
      cover_url: input.cover_url,
      source_url: input.source_url,
      total_chapters: input.total_chapters,
      tags: input.tags || []
    }).select().single();
    if (error) throw error;
    return data;
  },
  // Update novel metadata (only creator can do this)
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
  },
  // === Progress Management (private per user) ===
  // Add novel to user's library with initial progress
  async addToLibrary(novelId, progress) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("novel_progress").insert({
      user_id: user.id,
      novel_id: novelId,
      status: progress?.status || "planning",
      current_chapter: progress?.current_chapter || 0,
      score: progress?.score,
      notes: progress?.notes,
      started_at: progress?.started_at,
      completed_at: progress?.completed_at
    }).select().single();
    if (error) throw error;
    return data;
  },
  // Update user's progress on a novel
  async updateProgress(novelId, input) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase.from("novel_progress").update({
      ...input,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("novel_id", novelId).eq("user_id", user.id).select().single();
    if (error) throw error;
    return data;
  },
  // Remove novel from user's library
  async removeFromLibrary(novelId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("novel_progress").delete().eq("novel_id", novelId).eq("user_id", user.id);
    if (error) throw error;
  },
  // Check if novel is in user's library
  async isInLibrary(novelId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from("novel_progress").select("id").eq("novel_id", novelId).eq("user_id", user.id).single();
    return !!data;
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
    // Load user's library (novels they're tracking)
    load: async () => {
      update((s) => ({ ...s, loading: true, error: null }));
      try {
        const novels2 = await novelService.getMyLibrary();
        set({ novels: novels2, loading: false, error: null });
      } catch (e) {
        set({ novels: [], loading: false, error: e.message });
      }
    },
    // Add a new novel to the database AND to user's library
    add: async (input, progress) => {
      const novel = await novelService.create(input);
      const progressData = await novelService.addToLibrary(novel.id, progress);
      const novelWithProgress = {
        ...novel,
        progress: progressData
      };
      update((s) => ({ ...s, novels: [novelWithProgress, ...s.novels] }));
      return novelWithProgress;
    },
    // Add existing novel to user's library
    addToLibrary: async (novelId, progress) => {
      const progressData = await novelService.addToLibrary(novelId, progress);
      const novel = await novelService.getById(novelId);
      if (novel) {
        const novelWithProgress = {
          ...novel,
          progress: progressData
        };
        update((s) => ({ ...s, novels: [novelWithProgress, ...s.novels] }));
        return novelWithProgress;
      }
    },
    // Update novel metadata (title, author, etc)
    updateNovel: async (id, input) => {
      const updated = await novelService.update(id, input);
      update((s) => ({
        ...s,
        novels: s.novels.map((n) => n.id === id ? { ...n, ...updated } : n)
      }));
    },
    // Update user's progress on a novel
    updateProgress: async (novelId, input) => {
      const progress = await novelService.updateProgress(novelId, input);
      update((s) => ({
        ...s,
        novels: s.novels.map(
          (n) => n.id === novelId ? { ...n, progress } : n
        )
      }));
    },
    // Quick chapter update
    updateChapter: async (novelId, chapter) => {
      await novelService.updateProgress(novelId, { current_chapter: chapter });
      update((s) => ({
        ...s,
        novels: s.novels.map(
          (n) => n.id === novelId && n.progress ? { ...n, progress: { ...n.progress, current_chapter: chapter, updated_at: (/* @__PURE__ */ new Date()).toISOString() } } : n
        )
      }));
    },
    // Remove from user's library (doesn't delete the novel)
    removeFromLibrary: async (novelId) => {
      await novelService.removeFromLibrary(novelId);
      update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== novelId) }));
    },
    // Delete novel from database (only if you created it)
    delete: async (id) => {
      await novelService.delete(id);
      update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== id) }));
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
      result = result.filter((n) => n.progress?.status === $filter.status);
    }
    if ($filter.scoreMin !== void 0) {
      result = result.filter((n) => (n.progress?.score ?? 0) >= $filter.scoreMin);
    }
    if ($filter.scoreMax !== void 0) {
      result = result.filter((n) => (n.progress?.score ?? 100) <= $filter.scoreMax);
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
      let aVal;
      let bVal;
      if ($sort.field === "current_chapter") {
        aVal = a.progress?.current_chapter ?? 0;
        bVal = b.progress?.current_chapter ?? 0;
      } else if ($sort.field === "score") {
        aVal = a.progress?.score ?? 0;
        bVal = b.progress?.score ?? 0;
      } else if ($sort.field === "updated_at") {
        aVal = a.progress?.updated_at ?? a.updated_at;
        bVal = b.progress?.updated_at ?? b.updated_at;
      } else {
        aVal = a[$sort.field] ?? "";
        bVal = b[$sort.field] ?? "";
      }
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
