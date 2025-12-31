import { d as derived, w as writable } from "./index.js";
import { s as supabase } from "./supabase.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    session: null,
    loading: true
  });
  return {
    subscribe,
    setSession: (session) => {
      update((state) => ({
        ...state,
        session,
        user: session?.user ?? null,
        loading: false
      }));
    },
    setLoading: (loading) => {
      update((state) => ({ ...state, loading }));
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      return data;
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      set({ user: data.user, session: data.session, loading: false });
      return data;
    },
    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
      goto();
    },
    init: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, session, loading: false });
      supabase.auth.onAuthStateChange((_event, session2) => {
        set({ user: session2?.user ?? null, session: session2, loading: false });
      });
    }
  };
}
const auth = createAuthStore();
const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
export {
  auth as a,
  isAuthenticated as i
};
