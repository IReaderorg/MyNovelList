import { c as create_ssr_component, a as subscribe, v as validate_component, b as each, e as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/supabase.js";
import { i as isAuthenticated } from "../../../../chunks/auth.js";
import { S as Skeleton } from "../../../../chunks/Skeleton.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  let $page, $$unsubscribe_page;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.params.id;
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-acdt9m_START -->${$$result.title = `<title>${escape("Shared Tier List")} - MyNovelList</title>`, ""}${``}<!-- HEAD_svelte-acdt9m_END -->`, ""} <div class="max-w-4xl mx-auto px-4 py-8">${`${validate_component(Skeleton, "Skeleton").$$render(
    $$result,
    {
      width: "200px",
      height: "2rem",
      rounded: "rounded-lg"
    },
    {},
    {}
  )} <div class="mt-4 space-y-2">${each(Array(6), (_) => {
    return `<div class="flex">${validate_component(Skeleton, "Skeleton").$$render(
      $$result,
      {
        width: "64px",
        height: "80px",
        rounded: "rounded-l-lg"
      },
      {},
      {}
    )} ${validate_component(Skeleton, "Skeleton").$$render($$result, { height: "80px", rounded: "rounded-r-lg" }, {}, {})} </div>`;
  })}</div>`}</div>`;
});
export {
  Page as default
};
