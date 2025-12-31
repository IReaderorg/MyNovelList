import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function createThemeStore() {
	const defaultTheme: Theme = 'dark';
	
	// Get initial theme from localStorage or default
	const initial = browser 
		? (localStorage.getItem('theme') as Theme) || defaultTheme
		: defaultTheme;
	
	const { subscribe, set } = writable<Theme>(initial);
	
	return {
		subscribe,
		toggle: () => {
			const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
			document.documentElement.classList.remove('dark', 'light');
			document.documentElement.classList.add(newTheme);
			localStorage.setItem('theme', newTheme);
			set(newTheme);
		},
		init: () => {
			if (browser) {
				const saved = localStorage.getItem('theme') as Theme;
				const theme = saved || defaultTheme;
				document.documentElement.classList.remove('dark', 'light');
				document.documentElement.classList.add(theme);
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();
