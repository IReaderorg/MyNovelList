import { c as create_ssr_component, e as escape, d as add_attribute, b as each, f as createEventDispatcher, v as validate_component, a as subscribe } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { f as filterOptions, s as sortOptions, n as novels, a as filteredNovels } from "../../../chunks/novels.js";
import { a as auth, i as isAuthenticated } from "../../../chunks/auth.js";
/* empty css                                                  */
import { B as Button } from "../../../chunks/Button.js";
import { I as Input } from "../../../chunks/Input.js";
import { d as derived } from "../../../chunks/index.js";
import { M as Modal } from "../../../chunks/Modal.js";
import { S as Skeleton } from "../../../chunks/Skeleton.js";
const EmptyState = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { icon = "book" } = $$props;
  let { title } = $$props;
  let { description = "" } = $$props;
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  return `<div class="text-center py-12"><div class="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">${icon === "book" ? `<svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>` : `${icon === "list" ? `<svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>` : `${icon === "search" ? `<svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>` : `${icon === "key" ? `<svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>` : ``}`}`}`}</div> <h3 class="text-lg font-medium text-gray-300 mb-1">${escape(title)}</h3> ${description ? `<p class="text-gray-500 text-sm">${escape(description)}</p>` : ``} <div class="mt-4">${slots.default ? slots.default({}) : ``}</div></div>`;
});
const NovelCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { novel } = $$props;
  let chapterInput = novel.progress?.current_chapter ?? 0;
  const statusColors = {
    planning: "bg-gray-600",
    reading: "bg-blue-600",
    completed: "bg-green-600",
    on_hold: "bg-yellow-600",
    dropped: "bg-red-600"
  };
  const statusLabels = {
    planning: "Planning",
    reading: "Reading",
    completed: "Completed",
    on_hold: "On Hold",
    dropped: "Dropped"
  };
  function getProgressPercent() {
    if (!novel.total_chapters || novel.total_chapters === 0) return 0;
    return Math.min(100, (novel.progress?.current_chapter ?? 0) / novel.total_chapters * 100);
  }
  if ($$props.novel === void 0 && $$bindings.novel && novel !== void 0) $$bindings.novel(novel);
  chapterInput = novel.progress?.current_chapter ?? 0;
  return `<div class="card hover:border-gray-600 transition-colors group"><div class="flex gap-4"> <div class="flex-shrink-0 w-20 h-28 bg-gray-700 rounded-lg overflow-hidden relative">${novel.cover_url && true ? `<img${add_attribute("src", novel.cover_url, 0)}${add_attribute("alt", novel.title, 0)} class="w-full h-full object-cover" loading="lazy">` : `<div class="w-full h-full flex items-center justify-center text-gray-500" data-svelte-h="svelte-mbp1ee"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>`}</div>  <div class="flex-1 min-w-0"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><a href="${"/novel/" + escape(novel.id, true)}" class="block"><h3 class="font-semibold truncate hover:text-primary-400 transition-colors">${escape(novel.title)}</h3></a> ${novel.author ? `<p class="text-sm text-muted truncate">${escape(novel.author)}</p>` : ``}</div> ${novel.progress ? `<span class="${"flex-shrink-0 px-2 py-0.5 text-xs rounded-full text-white " + escape(statusColors[novel.progress.status], true)}">${escape(statusLabels[novel.progress.status])}</span>` : ``}</div>  ${novel.tags && novel.tags.length > 0 ? `<div class="mt-1 flex flex-wrap gap-1">${each(novel.tags.slice(0, 3), (tag) => {
    return `<span class="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">${escape(tag)}</span>`;
  })} ${novel.tags.length > 3 ? `<span class="text-xs text-gray-500">+${escape(novel.tags.length - 3)}</span>` : ``}</div>` : ``}  ${novel.progress ? `<div class="mt-2 flex items-center gap-2"><span class="text-sm text-gray-400" data-svelte-h="svelte-1jsjwyq">Ch.</span> <input type="number" min="0" class="w-16 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"${add_attribute("value", chapterInput, 0)}> ${novel.total_chapters ? `<span class="text-sm text-gray-400">/ ${escape(novel.total_chapters)}</span>` : ``}</div>  ${novel.total_chapters ? `<div class="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden"><div class="h-full bg-primary-500 transition-all duration-300" style="${"width: " + escape(getProgressPercent(), true) + "%"}"></div></div>` : ``}  ${novel.progress.score !== void 0 && novel.progress.score !== null ? `<div class="mt-2 flex items-center gap-1"><svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <span class="text-sm text-gray-300">${escape(novel.progress.score)}</span></div>` : ``}` : ``}</div></div></div>`;
});
const NovelGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { novel } = $$props;
  let chapterInput = novel.progress?.current_chapter ?? 0;
  const statusColors = {
    planning: "bg-gray-600",
    reading: "bg-blue-600",
    completed: "bg-green-600",
    on_hold: "bg-yellow-600",
    dropped: "bg-red-600"
  };
  if ($$props.novel === void 0 && $$bindings.novel && novel !== void 0) $$bindings.novel(novel);
  chapterInput = novel.progress?.current_chapter ?? 0;
  return `<div class="card hover:border-gray-600 transition-colors group relative"><a href="${"/novel/" + escape(novel.id, true)}" class="block"> <div class="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden mb-3">${novel.cover_url && true ? `<img${add_attribute("src", novel.cover_url, 0)}${add_attribute("alt", novel.title, 0)} class="w-full h-full object-cover" loading="lazy">` : `<div class="w-full h-full flex items-center justify-center text-gray-500 p-2 text-center" data-svelte-h="svelte-kfad7i"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>`}</div>  <h3 class="font-semibold text-sm truncate hover:text-primary-400 transition-colors">${escape(novel.title)}</h3></a>  ${novel.progress ? `<span class="${"absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full text-white " + escape(statusColors[novel.progress.status], true)}">${escape(novel.progress.status.replace("_", " "))}</span>` : ``}  ${novel.progress?.score !== void 0 && novel.progress?.score !== null ? `<div class="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5"><svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> <span class="text-xs text-white">${escape(novel.progress.score)}</span></div>` : ``}  ${novel.progress ? `<div class="mt-2 flex items-center gap-1" role="group" aria-label="Chapter progress"><span class="text-xs text-gray-400" data-svelte-h="svelte-1qpzfpr">Ch.</span> <input type="number" min="0" class="w-12 px-1 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"${add_attribute("value", chapterInput, 0)}> ${novel.total_chapters ? `<span class="text-xs text-gray-400">/ ${escape(novel.total_chapters)}</span>` : ``}</div>` : ``}</div>`;
});
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = "" } = $$props;
  let { label = "" } = $$props;
  let { id = "" } = $$props;
  let { options = [] } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  return `<div class="w-full">${label ? `<label${add_attribute("for", id, 0)} class="block text-sm font-medium text-gray-300 mb-1">${escape(label)}</label>` : ``} <select${add_attribute("id", id, 0)} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">${each(options, (opt) => {
    return `<option${add_attribute("value", opt.value, 0)}>${escape(opt.label)}</option>`;
  })}</select></div>`;
});
const NovelForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { novel = null } = $$props;
  let { loading = false } = $$props;
  let { mode = "add" } = $$props;
  createEventDispatcher();
  let title = novel?.title ?? "";
  let author = novel?.author ?? "";
  let cover_url = novel?.cover_url ?? "";
  let source_url = novel?.source_url ?? "";
  let total_chapters = novel?.total_chapters ?? void 0;
  let tags = novel?.tags?.join(", ") ?? "";
  let status = novel?.progress?.status ?? "planning";
  let current_chapter = novel?.progress?.current_chapter ?? 0;
  let score = novel?.progress?.score ?? void 0;
  let notes = novel?.progress?.notes ?? "";
  let started_at = novel?.progress?.started_at ?? "";
  let completed_at = novel?.progress?.completed_at ?? "";
  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "dropped", label: "Dropped" }
  ];
  if ($$props.novel === void 0 && $$bindings.novel && novel !== void 0) $$bindings.novel(novel);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0) $$bindings.loading(loading);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (status === "reading" && !started_at) {
        started_at = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }
    }
    {
      if (status === "completed" && !completed_at) {
        completed_at = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }
    }
    $$rendered = `<form class="space-y-4"> <div class="space-y-4"><h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide" data-svelte-h="svelte-1yzle9n">Novel Info</h3> ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "title",
        label: "Title *",
        placeholder: "Enter novel title",
        value: title
      },
      {
        value: ($$value) => {
          title = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "author",
        label: "Author",
        placeholder: "Author name",
        value: author
      },
      {
        value: ($$value) => {
          author = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="grid grid-cols-2 gap-4">${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "cover_url",
        label: "Cover URL",
        type: "url",
        placeholder: "https://...",
        value: cover_url
      },
      {
        value: ($$value) => {
          cover_url = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "source_url",
        label: "Source URL",
        type: "url",
        placeholder: "https://...",
        value: source_url
      },
      {
        value: ($$value) => {
          source_url = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="grid grid-cols-2 gap-4">${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "total_chapters",
        label: "Total Chapters",
        type: "number",
        min: 0,
        placeholder: "Optional",
        value: total_chapters
      },
      {
        value: ($$value) => {
          total_chapters = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "tags",
        label: "Tags (comma separated)",
        placeholder: "fantasy, isekai",
        value: tags
      },
      {
        value: ($$value) => {
          tags = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> <hr class="border-gray-700">  <div class="space-y-4"><h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide" data-svelte-h="svelte-au2nj5">Your Progress</h3> ${validate_component(Select, "Select").$$render(
      $$result,
      {
        id: "status",
        label: "Status",
        options: statusOptions,
        value: status
      },
      {
        value: ($$value) => {
          status = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="grid grid-cols-2 gap-4">${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "current_chapter",
        label: "Current Chapter",
        type: "number",
        min: 0,
        value: current_chapter
      },
      {
        value: ($$value) => {
          current_chapter = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "score",
        label: "Score (0-100)",
        type: "number",
        min: 0,
        max: 100,
        placeholder: "Optional",
        value: score
      },
      {
        value: ($$value) => {
          score = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="grid grid-cols-2 gap-4"><div><label for="started_at" class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-1dketpd">Started Date</label> <input id="started_at" type="date" class="input"${add_attribute("value", started_at, 0)}></div> <div><label for="completed_at" class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-f1qq55">Completed Date</label> <input id="completed_at" type="date" class="input"${add_attribute("value", completed_at, 0)}></div></div> <div><label for="notes" class="block text-sm font-medium text-gray-300 mb-1" data-svelte-h="svelte-1k1yhi1">Notes</label> <textarea id="notes" rows="3" class="input resize-none" placeholder="Personal notes (only visible to you)...">${escape(notes || "")}</textarea></div></div> <div class="flex justify-end gap-3 pt-2">${validate_component(Button, "Button").$$render($$result, { variant: "secondary" }, {}, {
      default: () => {
        return `Cancel`;
      }
    })} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        type: "submit",
        disabled: !title.trim() || loading
      },
      {},
      {
        default: () => {
          return `${escape(loading ? "Saving..." : mode === "edit" ? "Update" : "Add to Library")}`;
        }
      }
    )}</div></form>`;
  } while (!$$settled);
  return $$rendered;
});
const FilterBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $filterOptions, $$unsubscribe_filterOptions;
  let $sortOptions, $$unsubscribe_sortOptions;
  let $allTags, $$unsubscribe_allTags;
  $$unsubscribe_filterOptions = subscribe(filterOptions, (value) => $filterOptions = value);
  $$unsubscribe_sortOptions = subscribe(sortOptions, (value) => $sortOptions = value);
  let { viewMode = "list" } = $$props;
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "planning", label: "Planning" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "dropped", label: "Dropped" }
  ];
  const sortFieldOptions = [
    {
      value: "updated_at",
      label: "Last Updated"
    },
    { value: "created_at", label: "Date Added" },
    { value: "title", label: "Title" },
    { value: "score", label: "Score" },
    {
      value: "current_chapter",
      label: "Chapter"
    }
  ];
  const sortDirOptions = [{ value: "desc", label: "Descending" }, { value: "asc", label: "Ascending" }];
  const allTags = derived(novels, ($novels) => {
    const tags = /* @__PURE__ */ new Set();
    $novels.novels.forEach((n) => n.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  });
  $$unsubscribe_allTags = subscribe(allTags, (value) => $allTags = value);
  let searchValue = "";
  let selectedTags = [];
  if ($$props.viewMode === void 0 && $$bindings.viewMode && viewMode !== void 0) $$bindings.viewMode(viewMode);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="space-y-3"><div class="flex flex-wrap gap-3 items-end"><div class="flex-1 min-w-[200px]">${validate_component(Input, "Input").$$render(
      $$result,
      {
        placeholder: "Search novels...",
        value: searchValue
      },
      {
        value: ($$value) => {
          searchValue = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="w-36">${validate_component(Select, "Select").$$render(
      $$result,
      {
        options: statusOptions,
        value: $filterOptions.status
      },
      {
        value: ($$value) => {
          $filterOptions.status = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="w-36">${validate_component(Select, "Select").$$render(
      $$result,
      {
        options: sortFieldOptions,
        value: $sortOptions.field
      },
      {
        value: ($$value) => {
          $sortOptions.field = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="w-32">${validate_component(Select, "Select").$$render(
      $$result,
      {
        options: sortDirOptions,
        value: $sortOptions.direction
      },
      {
        value: ($$value) => {
          $sortOptions.direction = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>  ${$allTags.length > 0 ? `<button class="${"px-3 py-2 rounded-lg text-sm transition-colors " + escape(
      selectedTags.length > 0 ? "bg-primary-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600",
      true
    )}">Tags ${escape(selectedTags.length > 0 ? `(${selectedTags.length})` : "")}</button>` : ``}  <div class="flex rounded-lg overflow-hidden border border-gray-700"><button class="${"p-2 transition-colors " + escape(
      viewMode === "list" ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
      true
    )}" title="List view"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg></button> <button class="${"p-2 transition-colors " + escape(
      viewMode === "grid" ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
      true
    )}" title="Grid view"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button></div></div>  ${``}</div>`;
  } while (!$$settled);
  $$unsubscribe_filterOptions();
  $$unsubscribe_sortOptions();
  $$unsubscribe_allTags();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $novels, $$unsubscribe_novels;
  let $filteredNovels, $$unsubscribe_filteredNovels;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$unsubscribe_novels = subscribe(novels, (value) => $novels = value);
  $$unsubscribe_filteredNovels = subscribe(filteredNovels, (value) => $filteredNovels = value);
  let showAddModal = false;
  let addLoading = false;
  let viewMode = "list";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-r80vt4_START -->${$$result.title = `<title>Library - MyNovelList</title>`, ""}<!-- HEAD_svelte-r80vt4_END -->`, ""} ${$auth.loading ? `<div class="max-w-6xl mx-auto px-4 py-8"><div class="flex items-center justify-between mb-6">${validate_component(Skeleton, "Skeleton").$$render(
      $$result,
      {
        width: "150px",
        height: "2rem",
        rounded: "rounded-lg"
      },
      {},
      {}
    )} ${validate_component(Skeleton, "Skeleton").$$render(
      $$result,
      {
        width: "120px",
        height: "2.5rem",
        rounded: "rounded-lg"
      },
      {},
      {}
    )}</div> <div class="mb-6">${validate_component(Skeleton, "Skeleton").$$render($$result, { height: "2.5rem", rounded: "rounded-lg" }, {}, {})}</div> <div class="grid gap-4 md:grid-cols-2">${each(Array(4), (_) => {
      return `<div class="card"><div class="flex gap-4">${validate_component(Skeleton, "Skeleton").$$render(
        $$result,
        {
          width: "80px",
          height: "112px",
          rounded: "rounded-lg"
        },
        {},
        {}
      )} <div class="flex-1 space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "70%", height: "1.25rem" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "40%", height: "1rem" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "50%", height: "1rem" }, {}, {})} </div></div> </div>`;
    })}</div></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-6xl mx-auto px-4 py-8"><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold" data-svelte-h="svelte-1ifagcr">My Library</h1> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `<svg class="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
				Add Novel`;
      }
    })}</div> <div class="mb-6">${validate_component(FilterBar, "FilterBar").$$render(
      $$result,
      { viewMode },
      {
        viewMode: ($$value) => {
          viewMode = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${$novels.loading ? `<div class="${"grid gap-4 " + escape(
      viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "md:grid-cols-2",
      true
    )}">${each(Array(viewMode === "grid" ? 10 : 4), (_) => {
      return `${viewMode === "grid" ? `<div class="card">${validate_component(Skeleton, "Skeleton").$$render($$result, { height: "180px", rounded: "rounded-lg" }, {}, {})} <div class="mt-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "80%", height: "1rem" }, {}, {})}</div> </div>` : `<div class="card"><div class="flex gap-4">${validate_component(Skeleton, "Skeleton").$$render(
        $$result,
        {
          width: "80px",
          height: "112px",
          rounded: "rounded-lg"
        },
        {},
        {}
      )} <div class="flex-1 space-y-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "70%", height: "1.25rem" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "40%", height: "1rem" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "50%", height: "1rem" }, {}, {})} </div></div> </div>`}`;
    })}</div>` : `${$novels.error ? `${validate_component(EmptyState, "EmptyState").$$render(
      $$result,
      {
        icon: "book",
        title: "Failed to load library",
        description: $novels.error
      },
      {},
      {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Retry`;
            }
          })}`;
        }
      }
    )}` : `${$filteredNovels.length === 0 ? `${$novels.novels.length === 0 ? `${validate_component(EmptyState, "EmptyState").$$render(
      $$result,
      {
        icon: "book",
        title: "Your library is empty",
        description: "Add your first novel to start tracking your reading progress."
      },
      {},
      {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
            default: () => {
              return `Add Novel`;
            }
          })}`;
        }
      }
    )}` : `${validate_component(EmptyState, "EmptyState").$$render(
      $$result,
      {
        icon: "search",
        title: "No novels found",
        description: "Try adjusting your filters or search query."
      },
      {},
      {}
    )}`}` : `${viewMode === "grid" ? `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">${each($filteredNovels, (novel) => {
      return `${validate_component(NovelGrid, "NovelGrid").$$render($$result, { novel }, {}, {})}`;
    })}</div>` : `<div class="grid gap-4 md:grid-cols-2">${each($filteredNovels, (novel) => {
      return `${validate_component(NovelCard, "NovelCard").$$render($$result, { novel }, {}, {})}`;
    })}</div>`} <div class="mt-6 text-center text-sm text-muted">Showing ${escape($filteredNovels.length)} of ${escape($novels.novels.length)} novels</div>`}`}`}</div> ${validate_component(Modal, "Modal").$$render(
      $$result,
      { title: "Add Novel", open: showAddModal },
      {
        open: ($$value) => {
          showAddModal = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(NovelForm, "NovelForm").$$render($$result, { loading: addLoading }, {}, {})}`;
        }
      }
    )}`}`}`;
  } while (!$$settled);
  $$unsubscribe_auth();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_novels();
  $$unsubscribe_filteredNovels();
  return $$rendered;
});
export {
  Page as default
};
