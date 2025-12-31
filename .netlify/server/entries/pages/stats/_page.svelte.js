import { c as create_ssr_component, a as subscribe, v as validate_component, b as each, e as escape } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { d as derived } from "../../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { n as novels } from "../../../chunks/novels.js";
import { a as auth, i as isAuthenticated } from "../../../chunks/auth.js";
import { S as Skeleton } from "../../../chunks/Skeleton.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $auth, $$unsubscribe_auth;
  let $novels, $$unsubscribe_novels;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $stats, $$unsubscribe_stats;
  $$unsubscribe_auth = subscribe(auth, (value) => $auth = value);
  $$unsubscribe_novels = subscribe(novels, (value) => $novels = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  const stats = derived(novels, ($novels2) => {
    const all = $novels2.novels;
    const byStatus = {
      planning: all.filter((n) => n.status === "planning").length,
      reading: all.filter((n) => n.status === "reading").length,
      completed: all.filter((n) => n.status === "completed").length,
      on_hold: all.filter((n) => n.status === "on_hold").length,
      dropped: all.filter((n) => n.status === "dropped").length
    };
    const totalChapters = all.reduce((sum, n) => sum + (n.current_chapter || 0), 0);
    const scored = all.filter((n) => n.score !== null && n.score !== void 0);
    const avgScore = scored.length > 0 ? Math.round(scored.reduce((sum, n) => sum + (n.score || 0), 0) / scored.length) : 0;
    const completionRate = all.length > 0 ? Math.round(byStatus.completed / all.length * 100) : 0;
    const tagCounts = {};
    all.forEach((n) => {
      n.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const scoreRanges = [
      {
        label: "90-100",
        min: 90,
        max: 100,
        count: 0
      },
      {
        label: "80-89",
        min: 80,
        max: 89,
        count: 0
      },
      {
        label: "70-79",
        min: 70,
        max: 79,
        count: 0
      },
      {
        label: "60-69",
        min: 60,
        max: 69,
        count: 0
      },
      {
        label: "50-59",
        min: 50,
        max: 59,
        count: 0
      },
      { label: "<50", min: 0, max: 49, count: 0 }
    ];
    scored.forEach((n) => {
      const score = n.score || 0;
      const range = scoreRanges.find((r) => score >= r.min && score <= r.max);
      if (range) range.count++;
    });
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyActive = all.filter((n) => new Date(n.updated_at) > thirtyDaysAgo).length;
    return {
      total: all.length,
      byStatus,
      totalChapters,
      avgScore,
      completionRate,
      topTags,
      scoreRanges,
      recentlyActive,
      scored: scored.length
    };
  });
  $$unsubscribe_stats = subscribe(stats, (value) => $stats = value);
  const statusColors = {
    planning: "bg-gray-500",
    reading: "bg-blue-500",
    completed: "bg-green-500",
    on_hold: "bg-yellow-500",
    dropped: "bg-red-500"
  };
  const statusLabels = {
    planning: "Planning",
    reading: "Reading",
    completed: "Completed",
    on_hold: "On Hold",
    dropped: "Dropped"
  };
  $$unsubscribe_auth();
  $$unsubscribe_novels();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_stats();
  return `${$$result.head += `<!-- HEAD_svelte-f99nx0_START -->${$$result.title = `<title>Statistics - MyNovelList</title>`, ""}<!-- HEAD_svelte-f99nx0_END -->`, ""} ${$auth.loading || $novels.loading ? `<div class="max-w-4xl mx-auto px-4 py-8">${validate_component(Skeleton, "Skeleton").$$render(
    $$result,
    {
      width: "200px",
      height: "2rem",
      rounded: "rounded-lg"
    },
    {},
    {}
  )} <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">${each(Array(4), (_) => {
    return `<div class="card">${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "60%", height: "1rem" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { width: "40%", height: "2rem" }, {}, {})} </div>`;
  })}</div></div>` : `${!$isAuthenticated ? `<div class="flex items-center justify-center min-h-[50vh]" data-svelte-h="svelte-f3sbu8"><p class="text-gray-400">Redirecting to login...</p></div>` : `<div class="max-w-4xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold mb-6" data-svelte-h="svelte-qhs5dt">Statistics</h1>  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div class="card text-center"><p class="text-gray-400 text-sm" data-svelte-h="svelte-155u64o">Total Novels</p> <p class="text-3xl font-bold text-gray-100">${escape($stats.total)}</p></div> <div class="card text-center"><p class="text-gray-400 text-sm" data-svelte-h="svelte-kcfxap">Chapters Read</p> <p class="text-3xl font-bold text-gray-100">${escape($stats.totalChapters.toLocaleString())}</p></div> <div class="card text-center"><p class="text-gray-400 text-sm" data-svelte-h="svelte-3ksxsy">Average Score</p> <p class="text-3xl font-bold text-primary-400">${escape($stats.avgScore)}</p></div> <div class="card text-center"><p class="text-gray-400 text-sm" data-svelte-h="svelte-a8cqrz">Completion Rate</p> <p class="text-3xl font-bold text-green-400">${escape($stats.completionRate)}%</p></div></div> <div class="grid md:grid-cols-2 gap-6"> <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-6e97db">By Status</h2> <div class="space-y-3">${each(Object.entries($stats.byStatus), ([status, count]) => {
    return `<div><div class="flex justify-between text-sm mb-1"><span class="text-gray-300">${escape(statusLabels[status])}</span> <span class="text-gray-400">${escape(count)}</span></div> <div class="h-2 bg-gray-700 rounded-full overflow-hidden"><div class="${"h-full " + escape(statusColors[status], true) + " transition-all duration-500"}" style="${"width: " + escape($stats.total > 0 ? count / $stats.total * 100 : 0, true) + "%"}"></div></div> </div>`;
  })}</div></div>  <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-cu5isa">Score Distribution</h2> ${$stats.scored === 0 ? `<p class="text-gray-500 text-sm" data-svelte-h="svelte-ebqzby">No scored novels yet</p>` : `<div class="space-y-3">${each($stats.scoreRanges, (range) => {
    return `<div><div class="flex justify-between text-sm mb-1"><span class="text-gray-300">${escape(range.label)}</span> <span class="text-gray-400">${escape(range.count)}</span></div> <div class="h-2 bg-gray-700 rounded-full overflow-hidden"><div class="h-full bg-primary-500 transition-all duration-500" style="${"width: " + escape(
      $stats.scored > 0 ? range.count / $stats.scored * 100 : 0,
      true
    ) + "%"}"></div></div> </div>`;
  })}</div>`}</div>  <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-1r1fkwi">Top Tags</h2> ${$stats.topTags.length === 0 ? `<p class="text-gray-500 text-sm" data-svelte-h="svelte-1ybe2kw">No tags yet</p>` : `<div class="flex flex-wrap gap-2">${each($stats.topTags, ([tag, count]) => {
    return `<span class="px-3 py-1 bg-gray-700 rounded-full text-sm"><span class="text-gray-300">${escape(tag)}</span> <span class="text-gray-500 ml-1">(${escape(count)})</span> </span>`;
  })}</div>`}</div>  <div class="card"><h2 class="text-lg font-semibold text-gray-100 mb-4" data-svelte-h="svelte-134ari9">Activity</h2> <div class="space-y-4"><div class="flex items-center justify-between"><span class="text-gray-300" data-svelte-h="svelte-aelhxp">Active in last 30 days</span> <span class="text-2xl font-bold text-primary-400">${escape($stats.recentlyActive)}</span></div> <div class="flex items-center justify-between"><span class="text-gray-300" data-svelte-h="svelte-2gtrtg">Novels with scores</span> <span class="text-2xl font-bold text-gray-100">${escape($stats.scored)}</span></div> <div class="flex items-center justify-between"><span class="text-gray-300" data-svelte-h="svelte-1o7zqcy">Currently reading</span> <span class="text-2xl font-bold text-blue-400">${escape($stats.byStatus.reading)}</span></div></div></div></div></div>`}`}`;
});
export {
  Page as default
};
