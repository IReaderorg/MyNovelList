import { c as create_ssr_component, e as escape } from "./ssr.js";
const Skeleton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = "100%" } = $$props;
  let { height = "1rem" } = $$props;
  let { rounded = "rounded" } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0) $$bindings.rounded(rounded);
  return `<div class="${"animate-pulse bg-gray-700 " + escape(rounded, true)}" style="${"width: " + escape(width, true) + "; height: " + escape(height, true) + ";"}"></div>`;
});
export {
  Skeleton as S
};
