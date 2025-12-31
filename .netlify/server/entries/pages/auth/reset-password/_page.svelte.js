import { c as create_ssr_component } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/supabase.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-4i949z_START -->${$$result.title = `<title>Reset Password - MyNovelList</title>`, ""}<!-- HEAD_svelte-4i949z_END -->`, ""} <div class="max-w-md mx-auto px-4 py-16"><div class="card"><h1 class="text-2xl font-bold text-gray-100 mb-6 text-center" data-svelte-h="svelte-13pbu1w">Reset Password</h1> ${`${`<p class="text-gray-400 text-center" data-svelte-h="svelte-1kb16x2">Verifying reset link...</p>`}`}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
