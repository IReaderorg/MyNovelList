import { c as create_ssr_component, f as createEventDispatcher, e as escape } from "./ssr.js";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let { title = "" } = $$props;
  createEventDispatcher();
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  return ` ${open ? `<div class="fixed inset-0 z-50 overflow-y-auto"><div class="flex min-h-full items-center justify-center p-4"> <div class="fixed inset-0 bg-black/70 transition-opacity" role="button" tabindex="-1"></div>  <div class="relative bg-gray-800 rounded-xl border border-gray-700 shadow-xl w-full max-w-lg p-6">${title ? `<div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold text-gray-100">${escape(title)}</h2> <button class="text-gray-400 hover:text-gray-200 transition-colors" data-svelte-h="svelte-1it5j9v"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>` : ``} ${slots.default ? slots.default({}) : ``}</div></div></div>` : ``}`;
});
export {
  Modal as M
};
