import { c as create_ssr_component, d as add_attribute, e as escape } from "./ssr.js";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { variant = "primary" } = $$props;
  let { size = "md" } = $$props;
  let { disabled = false } = $$props;
  let { type = "button" } = $$props;
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-700 text-gray-300 focus:ring-gray-500"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0) $$bindings.variant(variant);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  return `<button${add_attribute("type", type, 0)} ${disabled ? "disabled" : ""} class="${"rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed " + escape(variants[variant], true) + " " + escape(sizes[size], true)}">${slots.default ? slots.default({}) : ``}</button>`;
});
export {
  Button as B
};
