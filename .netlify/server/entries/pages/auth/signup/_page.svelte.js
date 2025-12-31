import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let email = "";
  let password = "";
  let confirmPassword = "";
  let loading = false;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1juwxqj_START -->${$$result.title = `<title>Sign Up - MyNovelList</title>`, ""}<!-- HEAD_svelte-1juwxqj_END -->`, ""} <div class="max-w-md mx-auto px-4 py-16"><div class="card"><h1 class="text-2xl font-bold text-gray-100 mb-6 text-center" data-svelte-h="svelte-11gcrr">Create Account</h1> <form class="space-y-4">${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "you@example.com",
        value: email
      },
      {
        value: ($$value) => {
          email = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "password",
        type: "password",
        label: "Password",
        placeholder: "••••••••",
        value: password
      },
      {
        value: ($$value) => {
          password = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        placeholder: "••••••••",
        value: confirmPassword
      },
      {
        value: ($$value) => {
          confirmPassword = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${``} ${validate_component(Button, "Button").$$render($$result, { type: "submit", disabled: loading }, {}, {
      default: () => {
        return `${escape("Sign Up")}`;
      }
    })}</form> <p class="mt-6 text-center text-sm text-gray-400" data-svelte-h="svelte-10jrubt">Already have an account? 
			<a href="/auth/login" class="text-primary-400 hover:text-primary-300">Sign in</a></p></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
