import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import "../../../../chunks/supabase.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let email = "";
  let loading = false;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1di7pf9_START -->${$$result.title = `<title>Forgot Password - MyNovelList</title>`, ""}<!-- HEAD_svelte-1di7pf9_END -->`, ""} <div class="max-w-md mx-auto px-4 py-16"><div class="card"><h1 class="text-2xl font-bold text-gray-100 mb-2 text-center" data-svelte-h="svelte-i2pu6i">Forgot Password</h1> <p class="text-gray-400 text-center mb-6" data-svelte-h="svelte-19u5qwz">Enter your email and we&#39;ll send you a reset link.</p> ${`<form class="space-y-4">${validate_component(Input, "Input").$$render(
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
    )} ${``} ${validate_component(Button, "Button").$$render($$result, { type: "submit", disabled: loading }, {}, {
      default: () => {
        return `${escape("Send Reset Link")}`;
      }
    })}</form> <p class="mt-6 text-center text-sm text-gray-400" data-svelte-h="svelte-buf079">Remember your password? 
				<a href="/auth/login" class="text-primary-400 hover:text-primary-300">Sign in</a></p>`}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
