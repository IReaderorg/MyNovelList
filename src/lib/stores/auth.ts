import { writable, derived } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '$lib/services/supabase';
import { goto } from '$app/navigation';

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		loading: true
	});

	return {
		subscribe,
		setSession: (session: Session | null) => {
			update((state) => ({
				...state,
				session,
				user: session?.user ?? null,
				loading: false
			}));
		},
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, loading }));
		},
		signUp: async (email: string, password: string) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});
			if (error) throw error;
			return data;
		},
		signIn: async (email: string, password: string) => {
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
			goto('/');
		},
		init: async () => {
			const { data: { session } } = await supabase.auth.getSession();
			set({ user: session?.user ?? null, session, loading: false });

			supabase.auth.onAuthStateChange((_event, session) => {
				set({ user: session?.user ?? null, session, loading: false });
			});
		}
	};
}

export const auth = createAuthStore();
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
