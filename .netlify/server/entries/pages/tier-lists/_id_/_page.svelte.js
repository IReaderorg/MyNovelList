import { c as create_ssr_component, a as subscribe, v as validate_component, b as each, e as escape, d as add_attribute } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/supabase.js";
import { n as novels } from "../../../../chunks/novels.js";
import { a as auth, i as isAuthenticated } from "../../../../chunks/auth.js";
import { B as Button } from "../../../../chunks/Button.js";
import { M as Modal } from "../../../../chunks/Modal.js";
import { I as Input } from "../../../../chunks/Input.js";
import { S as Skeleton } from "../../../../chunks/Skeleton.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $novels, $$unsubscribe_novels;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$unsubscribe_novels = subscribe(novels, (value) => $novels = value);
  let showAddModal = false;
  let showEditTiersModal = false;
  let addTitle = "";
  let addCoverUrl = "";
  let selectedTier = "S";
  let editTiers = [];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $page.params.id;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1haaxt2_START -->${$$result.title = `<title>${escape("Tier List")} - MyNovelList</title>`, ""}<!-- HEAD_svelte-1haaxt2_END -->`, ""} ${$auth.loading ? `<div class="max-w-4xl mx-auto px-4 py-8">${validate_component(Skeleton, "Skeleton").$$render(
      $$result,
      {
        width: "150px",
        height: "1rem",
        rounded: "rounded"
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
    })}</div></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-4xl mx-auto px-4 py-8"><a href="/tier-lists" class="text-primary-400 hover:text-primary-300 mb-4 inline-flex items-center gap-1" data-svelte-h="svelte-1gzvx4i"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
			Back to Tier Lists</a> ${`<div class="mt-4 space-y-2">${each(Array(6), (_) => {
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
    })}</div>`}</div>  ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: "Add to Tier List",
        open: showAddModal
      },
      {
        open: ($$value) => {
          showAddModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-1rqsdzn">Select Tier</label> <div class="flex flex-wrap gap-2">${each([], (tier) => {
            return `<button type="button" class="${"w-10 h-10 rounded font-bold text-gray-900 transition-transform " + escape(
              selectedTier === tier.name ? "ring-2 ring-white scale-110" : "",
              true
            )}" style="${"background-color: " + escape(tier.color, true)}">${escape(tier.name)} </button>`;
          })}</div></div> ${$novels.novels.length > 0 ? `<div><label for="novel" class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-1rxi2sg">From Library</label> <select id="novel" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"><option value="" data-svelte-h="svelte-sgto1d">-- Select from library --</option>${each($novels.novels, (novel) => {
            return `<option${add_attribute("value", novel.id, 0)}>${escape(novel.title)}</option>`;
          })}</select></div> <div class="text-center text-gray-500 text-sm" data-svelte-h="svelte-1dv8xiy">or add manually</div>` : ``} ${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "title",
              label: "Title",
              placeholder: "Novel title",
              disabled: false,
              value: addTitle
            },
            {
              value: ($$value) => {
                addTitle = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "cover",
              label: "Cover URL (optional)",
              type: "url",
              placeholder: "https://...",
              disabled: false,
              value: addCoverUrl
            },
            {
              value: ($$value) => {
                addCoverUrl = $$value;
                $$settled = false;
              }
            },
            {}
          )} <div class="flex justify-end gap-3 pt-2">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
            default: () => {
              return `Cancel`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              type: "submit",
              disabled: !addTitle.trim()
            },
            {},
            {
              default: () => {
                return `Add`;
              }
            }
          )}</div></form>`;
        }
      }
    )}  ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: "Edit Tiers",
        open: showEditTiersModal
      },
      {
        open: ($$value) => {
          showEditTiersModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="space-y-4"><p class="text-sm text-gray-400" data-svelte-h="svelte-uq509n">Customize your tier labels and colors</p> <div class="space-y-2">${each(editTiers, (tier, i) => {
            return `<div class="flex items-center gap-2"><input type="color" class="w-10 h-10 rounded cursor-pointer bg-transparent"${add_attribute("value", tier.color, 0)}> <input type="text" maxlength="3" class="w-16 px-2 py-2 bg-gray-800 border border-gray-700 rounded text-center text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"${add_attribute("value", tier.name, 0)}> <button class="p-2 text-gray-500 hover:text-red-400 transition-colors" ${editTiers.length <= 1 ? "disabled" : ""}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button> </div>`;
          })}</div> <button class="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-colors" data-svelte-h="svelte-6juiv">+ Add Tier</button> <div class="flex justify-end gap-3 pt-2">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
            default: () => {
              return `Cancel`;
            }
          })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Save`;
            }
          })}</div></div>`;
        }
      }
    )}`}`}`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_novels();
  return $$rendered;
});
export {
  Page as default
};
