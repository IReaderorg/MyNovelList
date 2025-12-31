import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as auth, i as isAuthenticated } from "../../../chunks/auth.js";
import "../../../chunks/novels.js";
import "../../../chunks/supabase.js";
import { B as Button } from "../../../chunks/Button.js";
/* empty css                                                  */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let importing = false;
  let exporting = false;
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-1scnskm_START -->${$$result.title = `<title>Settings - MyNovelList</title>`, ""}<!-- HEAD_svelte-1scnskm_END -->`, ""} ${$auth.loading ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-10c0vma"><p class="text-gray-400">Loading...</p></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-2xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold text-gray-100 mb-6" data-svelte-h="svelte-1xlo9zu">Settings</h1>  <div class="card mb-6"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-1vxeci5">Data Management</h2> <div class="space-y-4"><div><h3 class="text-sm font-medium text-gray-300 mb-2" data-svelte-h="svelte-m7ok6l">Export Data</h3> <p class="text-sm text-gray-400 mb-3" data-svelte-h="svelte-mcsn3y">Download all your novels and tier lists as a JSON file for backup.</p> ${validate_component(Button, "Button").$$render($$result, { disabled: exporting }, {}, {
    default: () => {
      return `${escape("Export JSON")}`;
    }
  })}</div> <hr class="border-gray-700"> <div><h3 class="text-sm font-medium text-gray-300 mb-2" data-svelte-h="svelte-dalcgc">Import Data</h3> <p class="text-sm text-gray-400 mb-3" data-svelte-h="svelte-35vvj3">Import novels from a previously exported JSON file. Data will be merged with existing.</p> <input type="file" accept=".json" class="hidden"> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "secondary",
      disabled: importing
    },
    {},
    {
      default: () => {
        return `${escape("Import JSON")}`;
      }
    }
  )}</div></div></div>  <div class="card mb-6"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-7gbmf4">API Access</h2> <p class="text-sm text-gray-400 mb-4" data-svelte-h="svelte-t68j12">Connect your novel reader app or build integrations with the MyNovelList API.</p> <div class="flex gap-3"><a href="/settings/api">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Manage API Keys`;
    }
  })}</a> <a href="/docs/api">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `View API Docs`;
    }
  })}</a></div></div>  <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-1h2ht4l">Account</h2> <p class="text-sm text-gray-400 mb-4">Signed in as <span class="text-gray-200">${escape($auth.user?.email)}</span></p> ${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
    default: () => {
      return `Sign Out`;
    }
  })}</div></div>`}`}`;
});
export {
  Page as default
};
