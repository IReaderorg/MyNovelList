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
import { I as Input } from "../../../chunks/Input.js";
/* empty css                                                  */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let importing = false;
  let exporting = false;
  let savingProfile = false;
  let displayName = "";
  let publicNovelCount = 0;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $auth.user ? `${typeof window !== "undefined" ? window.location.origin : ""}/user/${$auth.user.id}` : "";
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1scnskm_START -->${$$result.title = `<title>Settings - MyNovelList</title>`, ""}<!-- HEAD_svelte-1scnskm_END -->`, ""} ${$auth.loading ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-10c0vma"><p class="text-gray-400">Loading...</p></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-2xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold mb-6" data-svelte-h="svelte-19ti8ej">Settings</h1>  <div class="card mb-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-usfp25">Public Profile</h2> <div class="space-y-4">${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "displayName",
        label: "Display Name",
        placeholder: "Your public display name",
        value: displayName
      },
      {
        value: ($$value) => {
          displayName = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="flex gap-3">${validate_component(Button, "Button").$$render($$result, { disabled: savingProfile }, {}, {
      default: () => {
        return `${escape("Save Profile")}`;
      }
    })}</div> <hr class="border-gray-700"> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-xtwlr">Your Public Profile</h3> <p class="text-sm text-muted mb-3">You have ${escape(publicNovelCount)} public novel${escape("s")}. 
						Share your profile link with others to show your reading list.</p> <div class="flex gap-2"><a href="${"/user/" + escape($auth.user?.id, true)}" class="flex-1">${validate_component(Button, "Button").$$render($$result, { variant: "secondary", class: "w-full" }, {}, {
      default: () => {
        return `View Profile`;
      }
    })}</a> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Copy Link`;
      }
    })}</div></div></div></div>  <div class="card mb-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-14occ0e">Data Management</h2> <div class="space-y-4"><div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-1gf9deg">Export Data</h3> <p class="text-sm text-muted mb-3" data-svelte-h="svelte-4xxgm9">Download all your novels and tier lists as a JSON file for backup.</p> ${validate_component(Button, "Button").$$render($$result, { disabled: exporting }, {}, {
      default: () => {
        return `${escape("Export JSON")}`;
      }
    })}</div> <hr class="border-gray-700"> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-1uya4xh">Import Data</h3> <p class="text-sm text-muted mb-3" data-svelte-h="svelte-e1cgca">Import novels from a previously exported JSON file. Data will be merged with existing.</p> <input type="file" accept=".json" class="hidden"> ${validate_component(Button, "Button").$$render(
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
    )}</div></div></div>  <div class="card mb-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-1ogzyaj">API Access</h2> <p class="text-sm text-muted mb-4" data-svelte-h="svelte-17kly8p">Connect your novel reader app or build integrations with the MyNovelList API.</p> <div class="flex gap-3"><a href="/settings/api">${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Manage API Keys`;
      }
    })}</a> <a href="/docs/api">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
      default: () => {
        return `View API Docs`;
      }
    })}</a></div></div>  <div class="card"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-19ypzg6">Account</h2> <p class="text-sm text-muted mb-4">Signed in as <span class="font-medium">${escape($auth.user?.email)}</span></p> ${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
      default: () => {
        return `Sign Out`;
      }
    })}</div></div>`}`}`;
  } while (!$$settled);
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  return $$rendered;
});
export {
  Page as default
};
