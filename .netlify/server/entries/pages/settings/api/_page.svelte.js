import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { a as auth, i as isAuthenticated } from "../../../../chunks/auth.js";
import "../../../../chunks/supabase.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { M as Modal } from "../../../../chunks/Modal.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let showCreateModal = false;
  let showSecretModal = false;
  let newKeyName = "";
  let newKeyScopes = ["read"];
  let creating = false;
  let newKeySecret = "";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-16qtzdf_START -->${$$result.title = `<title>API Keys - MyNovelList</title>`, ""}<!-- HEAD_svelte-16qtzdf_END -->`, ""} ${$auth.loading ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-10c0vma"><p class="text-gray-400">Loading...</p></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-4xl mx-auto px-4 py-8"><div class="flex items-center gap-4 mb-6" data-svelte-h="svelte-qpf9ay"><a href="/settings" class="text-primary-400 hover:text-primary-300"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></a> <h1 class="text-2xl font-bold text-gray-100">API Keys</h1></div> <div class="card mb-6"><div class="flex items-center justify-between mb-4"><div data-svelte-h="svelte-1qv4e73"><h2 class="text-lg font-semibold text-gray-100">Your API Keys</h2> <p class="text-sm text-gray-400">Use these keys to integrate MyNovelList with your apps</p></div> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `Create Key`;
      }
    })}</div> ${`<p class="text-gray-400 py-4" data-svelte-h="svelte-bja12d">Loading...</p>`}</div> <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-2" data-svelte-h="svelte-1d78ehq">API Documentation</h2> <p class="text-sm text-gray-400 mb-4" data-svelte-h="svelte-j21fz9">View the full API documentation to integrate MyNovelList with your app.</p> <a href="/docs/api">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
      default: () => {
        return `View API Docs`;
      }
    })}</a></div></div>  ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: "Create API Key",
        open: showCreateModal
      },
      {
        open: ($$value) => {
          showCreateModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<form class="space-y-4">${validate_component(Input, "Input").$$render(
            $$result,
            {
              id: "name",
              label: "Key Name",
              placeholder: "My App",
              value: newKeyName
            },
            {
              value: ($$value) => {
                newKeyName = $$value;
                $$settled = false;
              }
            },
            {}
          )} <div><label class="block text-sm font-medium text-gray-300 mb-2" data-svelte-h="svelte-1ysqkj2">Permissions</label> <div class="flex flex-wrap gap-2"><button type="button" class="${"px-3 py-1.5 rounded-lg text-sm transition-colors " + escape(
            newKeyScopes.includes("read") ? "bg-primary-600 text-white" : "bg-gray-700 text-gray-300",
            true
          )}">Read</button> <button type="button" class="${"px-3 py-1.5 rounded-lg text-sm transition-colors " + escape(
            newKeyScopes.includes("write") ? "bg-primary-600 text-white" : "bg-gray-700 text-gray-300",
            true
          )}">Write</button> <button type="button" class="${"px-3 py-1.5 rounded-lg text-sm transition-colors " + escape(
            newKeyScopes.includes("delete") ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300",
            true
          )}">Delete</button></div> <p class="text-xs text-gray-500 mt-1" data-svelte-h="svelte-efnifa">Read: View novels · Write: Create/update · Delete: Remove novels</p></div> <div class="flex justify-end gap-3 pt-2">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
            default: () => {
              return `Cancel`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              type: "submit",
              disabled: !newKeyName.trim() || creating
            },
            {},
            {
              default: () => {
                return `${escape("Create")}`;
              }
            }
          )}</div></form>`;
        }
      }
    )}  ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        title: "API Key Created",
        open: showSecretModal
      },
      {
        open: ($$value) => {
          showSecretModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="space-y-4"><div class="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3" data-svelte-h="svelte-6tb9vh"><p class="text-yellow-200 text-sm">Copy this key now. You won&#39;t be able to see it again!</p></div> <div class="bg-gray-700 rounded-lg p-3"><code class="text-sm text-gray-100 break-all font-mono">${escape(newKeySecret)}</code></div> <div class="flex justify-end gap-3">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
            default: () => {
              return `Copy`;
            }
          })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Done`;
            }
          })}</div></div>`;
        }
      }
    )}`}`}`;
  } while (!$$settled);
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  return $$rendered;
});
export {
  Page as default
};
