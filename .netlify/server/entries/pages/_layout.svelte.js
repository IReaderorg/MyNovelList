import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, b as each } from "../../chunks/ssr.js";
import { i as isAuthenticated } from "../../chunks/auth.js";
import { w as writable } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { B as Button } from "../../chunks/Button.js";
/* empty css                                               */
function createThemeStore() {
  const defaultTheme = "dark";
  const initial = defaultTheme;
  const { subscribe: subscribe2, set } = writable(initial);
  return {
    subscribe: subscribe2,
    toggle: () => {
      const newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
      set(newTheme);
    },
    init: () => {
    }
  };
}
const theme = createThemeStore();
const ThemeToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $theme, $$unsubscribe_theme;
  $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
  $$unsubscribe_theme();
  return `<button class="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors" title="Toggle theme">${$theme === "dark" ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>` : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`}</button>`;
});
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let menuOpen = false;
  {
    $page.url.pathname, menuOpen = false;
  }
  $$unsubscribe_page();
  $$unsubscribe_isAuthenticated();
  return `<nav class="border-b bg-gray-800 border-gray-700 dark:bg-gray-800 dark:border-gray-700"><div class="max-w-6xl mx-auto px-4"><div class="flex items-center justify-between h-16"> <a href="/" class="flex items-center gap-2 text-xl font-bold text-primary-400" data-svelte-h="svelte-dqn5sw"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
				MyNovelList</a>  <div class="hidden md:flex items-center gap-6"><a href="/browse" class="${"transition-colors " + escape(
    $page.url.pathname === "/browse" ? "text-primary-400" : "text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white",
    true
  )}">Browse</a> ${$isAuthenticated ? `<a href="/library" class="${"transition-colors " + escape(
    $page.url.pathname === "/library" ? "text-primary-400" : "text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white",
    true
  )}">Library</a> <a href="/tier-lists" class="${"transition-colors " + escape(
    $page.url.pathname.startsWith("/tier-lists") ? "text-primary-400" : "text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white",
    true
  )}">Tier Lists</a> <a href="/stats" class="${"transition-colors " + escape(
    $page.url.pathname === "/stats" ? "text-primary-400" : "text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white",
    true
  )}">Stats</a> <a href="/settings" class="${"transition-colors " + escape(
    $page.url.pathname.startsWith("/settings") ? "text-primary-400" : "text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white",
    true
  )}">Settings</a> ${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})} ${validate_component(Button, "Button").$$render($$result, { variant: "ghost", size: "sm" }, {}, {
    default: () => {
      return `Sign Out`;
    }
  })}` : `${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})} <a href="/auth/login">${validate_component(Button, "Button").$$render($$result, { variant: "secondary", size: "sm" }, {}, {
    default: () => {
      return `Sign In`;
    }
  })}</a> <a href="/auth/signup">${validate_component(Button, "Button").$$render($$result, { variant: "primary", size: "sm" }, {}, {
    default: () => {
      return `Sign Up`;
    }
  })}</a>`}</div>  <button class="md:hidden text-gray-300 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${menuOpen ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>` : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`}</svg></button></div>  ${menuOpen ? `<div class="md:hidden py-4 border-t border-gray-700"><div class="flex flex-col gap-3"><a href="/browse" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-86mf6u">Browse</a> ${$isAuthenticated ? `<a href="/library" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-1w3rmay">Library</a> <a href="/tier-lists" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-1fvn8i7">Tier Lists</a> <a href="/stats" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-5hguha">Stats</a> <a href="/settings" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-1uli71y">Settings</a> <div class="py-2">${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})}</div> <button class="text-left text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-1ts4nj4">Sign Out</button>` : `<div class="py-2">${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})}</div> <a href="/auth/login" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-808w9g">Sign In</a> <a href="/auth/signup" class="text-gray-300 hover:text-white transition-colors py-2" data-svelte-h="svelte-1qiiiyf">Sign Up</a>`}</div></div>` : ``}</div></nav>`;
});
const css = {
  code: "@keyframes svelte-82v4d4-slide-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.animate-slide-in.svelte-82v4d4{animation:svelte-82v4d4-slide-in 0.2s ease-out}",
  map: '{"version":3,"file":"Toast.svelte","sources":["Toast.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">import { writable } from \\"svelte/store\\";\\nlet nextId = 0;\\nexport const toasts = writable([]);\\nexport function toast(message, type = \\"info\\") {\\n  const id = nextId++;\\n  toasts.update((t) => [...t, { id, message, type }]);\\n  setTimeout(() => {\\n    toasts.update((t) => t.filter((toast2) => toast2.id !== id));\\n  }, 3e3);\\n}\\n<\/script>\\r\\n\\r\\n<script lang=\\"ts\\">const typeStyles = {\\n  success: \\"bg-green-600 border-green-500\\",\\n  error: \\"bg-red-600 border-red-500\\",\\n  info: \\"bg-primary-600 border-primary-500\\"\\n};\\n<\/script>\\r\\n\\r\\n<div class=\\"fixed bottom-4 right-4 z-50 flex flex-col gap-2\\">\\r\\n\\t{#each $toasts as t (t.id)}\\r\\n\\t\\t<div \\r\\n\\t\\t\\tclass=\\"px-4 py-3 rounded-lg border text-white shadow-lg animate-slide-in {typeStyles[t.type]}\\"\\r\\n\\t\\t>\\r\\n\\t\\t\\t{t.message}\\r\\n\\t\\t</div>\\r\\n\\t{/each}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\t@keyframes slide-in {\\r\\n\\t\\tfrom {\\r\\n\\t\\t\\ttransform: translateX(100%);\\r\\n\\t\\t\\topacity: 0;\\r\\n\\t\\t}\\r\\n\\t\\tto {\\r\\n\\t\\t\\ttransform: translateX(0);\\r\\n\\t\\t\\topacity: 1;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n\\t.animate-slide-in {\\r\\n\\t\\tanimation: slide-in 0.2s ease-out;\\r\\n\\t}\\r\\n</style>\\r\\n"],"names":[],"mappings":"AA8BC,WAAW,sBAAS,CACnB,IAAK,CACJ,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,WAAW,CAAC,CAAC,CACxB,OAAO,CAAE,CACV,CACD,CACA,+BAAkB,CACjB,SAAS,CAAE,sBAAQ,CAAC,IAAI,CAAC,QAC1B"}'
};
const toasts = writable([]);
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  $$unsubscribe_toasts = subscribe(toasts, (value) => $toasts = value);
  const typeStyles = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
    info: "bg-primary-600 border-primary-500"
  };
  $$result.css.add(css);
  $$unsubscribe_toasts();
  return `<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">${each($toasts, (t) => {
    return `<div class="${"px-4 py-3 rounded-lg border text-white shadow-lg animate-slide-in " + escape(typeStyles[t.type], true) + " svelte-82v4d4"}">${escape(t.message)} </div>`;
  })} </div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="min-h-screen flex flex-col">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})} <main class="flex-1">${slots.default ? slots.default({}) : ``}</main> <footer class="py-4 text-center text-sm text-gray-500 border-t border-gray-800" data-svelte-h="svelte-25bdvb">MyNovelList - Track any novel, anywhere</footer></div> ${validate_component(Toast, "Toast").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
