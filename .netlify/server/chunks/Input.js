import { c as create_ssr_component, d as add_attribute, e as escape } from "./ssr.js";
const inputClass = "w-full px-3 py-2 bg-gray-800 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = "" } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = "" } = $$props;
  let { label = "" } = $$props;
  let { error = "" } = $$props;
  let { id = "" } = $$props;
  let { min = void 0 } = $$props;
  let { max = void 0 } = $$props;
  let { disabled = false } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0) $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0) $$bindings.max(max);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  return `<div class="w-full">${label ? `<label${add_attribute("for", id, 0)} class="block text-sm font-medium text-gray-300 mb-1">${escape(label)}</label>` : ``} ${type === "number" ? `<input${add_attribute("id", id, 0)} type="number"${add_attribute("placeholder", placeholder, 0)}${add_attribute("min", min, 0)}${add_attribute("max", max, 0)} ${disabled ? "disabled" : ""} class="${escape(inputClass, true) + " " + escape(error ? "border-red-500" : "border-gray-700", true)}"${add_attribute("value", value, 0)}>` : `${type === "email" ? `<input${add_attribute("id", id, 0)} type="email"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} class="${escape(inputClass, true) + " " + escape(error ? "border-red-500" : "border-gray-700", true)}"${add_attribute("value", value, 0)}>` : `${type === "password" ? `<input${add_attribute("id", id, 0)} type="password"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} class="${escape(inputClass, true) + " " + escape(error ? "border-red-500" : "border-gray-700", true)}"${add_attribute("value", value, 0)}>` : `${type === "url" ? `<input${add_attribute("id", id, 0)} type="url"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} class="${escape(inputClass, true) + " " + escape(error ? "border-red-500" : "border-gray-700", true)}"${add_attribute("value", value, 0)}>` : `<input${add_attribute("id", id, 0)} type="text"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} class="${escape(inputClass, true) + " " + escape(error ? "border-red-500" : "border-gray-700", true)}"${add_attribute("value", value, 0)}>`}`}`}`} ${error ? `<p class="mt-1 text-sm text-red-400">${escape(error)}</p>` : ``}</div>`;
});
export {
  Input as I
};
