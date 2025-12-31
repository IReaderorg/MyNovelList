import { c as create_ssr_component, a as subscribe, e as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/novels.js";
import { a as auth, i as isAuthenticated } from "../../../../chunks/auth.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $page.params.id;
  $$unsubscribe_page();
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-bdvhwc_START -->${$$result.title = `<title>${escape("Novel")} - MyNovelList</title>`, ""}<!-- HEAD_svelte-bdvhwc_END -->`, ""} ${$auth.loading ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-10c0vma"><p class="text-gray-400">Loading...</p></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-2xl mx-auto px-4 py-8"><a href="/library" class="text-primary-400 hover:text-primary-300 mb-4 inline-flex items-center gap-1" data-svelte-h="svelte-159znyt"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
			Back to Library</a> ${`<div class="text-center py-12 text-gray-400" data-svelte-h="svelte-1qtjbal">Loading...</div>`}</div>`}`}`;
});
export {
  Page as default
};
