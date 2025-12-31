import { c as create_ssr_component, b as each, e as escape } from "../../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedEndpoint = "list";
  const endpoints = [
    {
      id: "list",
      name: "List Novels",
      method: "GET",
      path: "/api/v1/novels"
    },
    {
      id: "get",
      name: "Get Novel",
      method: "GET",
      path: "/api/v1/novels/:id"
    },
    {
      id: "search",
      name: "Search Novels",
      method: "GET",
      path: "/api/v1/novels/search"
    },
    {
      id: "create",
      name: "Create Novel",
      method: "POST",
      path: "/api/v1/novels"
    },
    {
      id: "update",
      name: "Update Novel",
      method: "PUT",
      path: "/api/v1/novels/:id"
    },
    {
      id: "progress",
      name: "Update Progress",
      method: "POST",
      path: "/api/v1/novels/:id/progress"
    },
    {
      id: "delete",
      name: "Delete Novel",
      method: "DELETE",
      path: "/api/v1/novels/:id"
    }
  ];
  const methodColors = {
    GET: "bg-green-600",
    POST: "bg-blue-600",
    PUT: "bg-yellow-600",
    PATCH: "bg-yellow-600",
    DELETE: "bg-red-600"
  };
  return `${$$result.head += `<!-- HEAD_svelte-16vu6cr_START -->${$$result.title = `<title>API Documentation - MyNovelList</title>`, ""}<!-- HEAD_svelte-16vu6cr_END -->`, ""} <div class="max-w-6xl mx-auto px-4 py-8"><div class="mb-8" data-svelte-h="svelte-1tdr9hn"><h1 class="text-3xl font-bold text-gray-100 mb-2">API Documentation</h1> <p class="text-gray-400">Integrate MyNovelList with your novel reader app, extension, or service.</p></div> <div class="grid md:grid-cols-4 gap-6"> <div class="md:col-span-1"><div class="card sticky top-4"><h3 class="font-semibold text-gray-100 mb-3" data-svelte-h="svelte-me9gnm">Endpoints</h3> <nav class="space-y-1">${each(endpoints, (ep) => {
    return `<button class="${"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors " + escape(
      selectedEndpoint === ep.id ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-700",
      true
    )}"><span class="${"inline-block w-14 text-xs font-mono " + escape(methodColors[ep.method], true) + " px-1.5 py-0.5 rounded mr-2"}">${escape(ep.method)}</span> ${escape(ep.name)} </button>`;
  })}</nav></div></div>  <div class="md:col-span-3 space-y-6"> <div class="card" data-svelte-h="svelte-akjs9n"><h2 class="text-xl font-semibold text-gray-100 mb-4">Authentication</h2> <p class="text-gray-300 mb-4">All API requests require an API key. Include it in the Authorization header:</p> <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">Authorization: Bearer mnl_your_api_key_here</code></pre> <p class="text-sm text-gray-400 mt-4">Generate API keys in <a href="/settings/api" class="text-primary-400 hover:underline">Settings → API Keys</a></p></div>  <div class="card" data-svelte-h="svelte-1qpgb9o"><h2 class="text-xl font-semibold text-gray-100 mb-4">Base URL</h2> <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">https://your-domain.com/api/v1</code></pre></div>  ${`<div class="card"><div class="flex items-center gap-3 mb-4"><span class="${"px-2 py-1 text-xs font-mono rounded " + escape(methodColors["GET"], true)}">GET</span> <code class="text-gray-100" data-svelte-h="svelte-cenpup">/api/v1/novels</code></div> <p class="text-gray-300 mb-4" data-svelte-h="svelte-1ud5wxe">List all novels in your library with pagination and filtering.</p> <h4 class="font-medium text-gray-100 mb-2" data-svelte-h="svelte-qu4mb9">Query Parameters</h4> <div class="bg-gray-900 rounded-lg p-4 mb-4 text-sm" data-svelte-h="svelte-d9b0gb"><div class="grid gap-2"><div><code class="text-primary-400">page</code> <span class="text-gray-500">integer</span> - Page number (default: 1)</div> <div><code class="text-primary-400">per_page</code> <span class="text-gray-500">integer</span> - Items per page (max: 100, default: 50)</div> <div><code class="text-primary-400">status</code> <span class="text-gray-500">string</span> - Filter by status (planning, reading, completed, on_hold, dropped)</div> <div><code class="text-primary-400">search</code> <span class="text-gray-500">string</span> - Search in title and author</div></div></div> <h4 class="font-medium text-gray-100 mb-2" data-svelte-h="svelte-1rqs5py">Example Request</h4> <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm" data-svelte-h="svelte-vzdwzm"><code class="text-gray-300">curl -X GET &quot;https://your-domain.com/api/v1/novels?status=reading&amp;page=1&quot; \\
  -H &quot;Authorization: Bearer mnl_your_api_key&quot;</code></pre> <h4 class="font-medium text-gray-100 mt-4 mb-2" data-svelte-h="svelte-83c8gy">Response</h4> <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">${escape(`{
  "success": true,
  "data": {
    "novels": [
      {
        "id": "uuid",
        "title": "Solo Leveling",
        "author": "Chugong",
        "status": "reading",
        "current_chapter": 150,
        "total_chapters": 270,
        "score": 95,
        "cover_url": "https://...",
        "source_url": "https://...",
        "tags": ["action", "fantasy"],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "per_page": 50
  }
}`)}</code></pre></div>`}  <div class="card"><h2 class="text-xl font-semibold text-gray-100 mb-4" data-svelte-h="svelte-bygwgx">Error Responses</h2> <p class="text-gray-300 mb-4" data-svelte-h="svelte-1ld88gq">All errors follow this format:</p> <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">${escape(`{
  "success": false,
  "error": "Error message here"
}`)}</code></pre> <h4 class="font-medium text-gray-100 mt-4 mb-2" data-svelte-h="svelte-1bsjfpl">HTTP Status Codes</h4> <div class="bg-gray-900 rounded-lg p-4 text-sm" data-svelte-h="svelte-1tivqoh"><div class="grid gap-2"><div><code class="text-green-400">200</code> - Success</div> <div><code class="text-green-400">201</code> - Created</div> <div><code class="text-yellow-400">400</code> - Bad request (invalid input)</div> <div><code class="text-yellow-400">401</code> - Unauthorized (invalid/missing API key)</div> <div><code class="text-yellow-400">403</code> - Forbidden (insufficient permissions)</div> <div><code class="text-yellow-400">404</code> - Not found</div> <div><code class="text-red-400">500</code> - Server error</div></div></div></div>  <div class="card" data-svelte-h="svelte-tpkx1t"><h2 class="text-xl font-semibold text-gray-100 mb-4">Rate Limits</h2> <p class="text-gray-300">Currently no strict rate limits, but please be reasonable. Excessive requests may result in temporary blocks.</p></div></div></div></div>`;
});
export {
  Page as default
};
