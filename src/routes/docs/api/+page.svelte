<script lang="ts">
	let selectedEndpoint = 'list';
	
	const endpoints = [
		{ id: 'list', name: 'List Novels', method: 'GET', path: '/api/v1/novels' },
		{ id: 'get', name: 'Get Novel', method: 'GET', path: '/api/v1/novels/:id' },
		{ id: 'search', name: 'Search Novels', method: 'GET', path: '/api/v1/novels/search' },
		{ id: 'create', name: 'Create Novel', method: 'POST', path: '/api/v1/novels' },
		{ id: 'update', name: 'Update Novel', method: 'PUT', path: '/api/v1/novels/:id' },
		{ id: 'progress', name: 'Update Progress', method: 'POST', path: '/api/v1/novels/:id/progress' },
		{ id: 'delete', name: 'Delete Novel', method: 'DELETE', path: '/api/v1/novels/:id' },
	];
	
	const methodColors: Record<string, string> = {
		GET: 'bg-green-600',
		POST: 'bg-blue-600',
		PUT: 'bg-yellow-600',
		PATCH: 'bg-yellow-600',
		DELETE: 'bg-red-600'
	};
</script>

<svelte:head>
	<title>API Documentation - MyNovelList</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-100 mb-2">API Documentation</h1>
		<p class="text-gray-400">
			Integrate MyNovelList with your novel reader app, extension, or service.
		</p>
	</div>
	
	<div class="grid md:grid-cols-4 gap-6">
		<!-- Sidebar -->
		<div class="md:col-span-1">
			<div class="card sticky top-4">
				<h3 class="font-semibold text-gray-100 mb-3">Endpoints</h3>
				<nav class="space-y-1">
					{#each endpoints as ep}
						<button
							on:click={() => selectedEndpoint = ep.id}
							class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {selectedEndpoint === ep.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700'}"
						>
							<span class="inline-block w-14 text-xs font-mono {methodColors[ep.method]} px-1.5 py-0.5 rounded mr-2">{ep.method}</span>
							{ep.name}
						</button>
					{/each}
				</nav>
			</div>
		</div>
		
		<!-- Content -->
		<div class="md:col-span-3 space-y-6">
			<!-- Authentication -->
			<div class="card">
				<h2 class="text-xl font-semibold text-gray-100 mb-4">Authentication</h2>
				<p class="text-gray-300 mb-4">
					All API requests require an API key. Include it in the Authorization header:
				</p>
				<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">Authorization: Bearer mnl_your_api_key_here</code></pre>
				<p class="text-sm text-gray-400 mt-4">
					Generate API keys in <a href="/settings/api" class="text-primary-400 hover:underline">Settings → API Keys</a>
				</p>
			</div>
			
			<!-- Base URL -->
			<div class="card">
				<h2 class="text-xl font-semibold text-gray-100 mb-4">Base URL</h2>
				<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">https://your-domain.com/api/v1</code></pre>
			</div>
			
			<!-- Endpoint Details -->
			{#if selectedEndpoint === 'list'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels</code>
					</div>
					<p class="text-gray-300 mb-4">List all novels in your library with pagination and filtering.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Query Parameters</h4>
					<div class="bg-gray-900 rounded-lg p-4 mb-4 text-sm">
						<div class="grid gap-2">
							<div><code class="text-primary-400">page</code> <span class="text-gray-500">integer</span> - Page number (default: 1)</div>
							<div><code class="text-primary-400">per_page</code> <span class="text-gray-500">integer</span> - Items per page (max: 100, default: 50)</div>
							<div><code class="text-primary-400">status</code> <span class="text-gray-500">string</span> - Filter by status (planning, reading, completed, on_hold, dropped)</div>
							<div><code class="text-primary-400">search</code> <span class="text-gray-500">string</span> - Search in title and author</div>
						</div>
					</div>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://your-domain.com/api/v1/novels?status=reading&page=1" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Response</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
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
}`}</code></pre>
				</div>
			{:else if selectedEndpoint === 'get'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels/:id</code>
					</div>
					<p class="text-gray-300 mb-4">Get a single novel by ID.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://your-domain.com/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
				</div>
			{:else if selectedEndpoint === 'search'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels/search</code>
					</div>
					<p class="text-gray-300 mb-4">Search for novels by title or source URL. Useful for checking if a novel exists before adding.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Query Parameters</h4>
					<div class="bg-gray-900 rounded-lg p-4 mb-4 text-sm">
						<div class="grid gap-2">
							<div><code class="text-primary-400">title</code> <span class="text-gray-500">string</span> - Search by title (partial match)</div>
							<div><code class="text-primary-400">source_url</code> <span class="text-gray-500">string</span> - Search by exact source URL</div>
						</div>
					</div>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://your-domain.com/api/v1/novels/search?title=solo" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
				</div>
			{:else if selectedEndpoint === 'create'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['POST']}">POST</span>
						<code class="text-gray-100">/api/v1/novels</code>
					</div>
					<p class="text-gray-300 mb-4">Add a new novel to your library. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "title": "Solo Leveling",        // required
  "author": "Chugong",             // optional
  "cover_url": "https://...",      // optional
  "source_url": "https://...",     // optional - URL where you're reading
  "status": "reading",             // optional - default: "planning"
  "current_chapter": 50,           // optional - default: 0
  "total_chapters": 270,           // optional
  "score": 95,                     // optional - 0-100
  "tags": ["action", "fantasy"],   // optional
  "notes": "Great story!"          // optional
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X POST "https://your-domain.com/api/v1/novels" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"title": "Solo Leveling", "status": "reading", "current_chapter": 50}`}'</code></pre>
				</div>
			{:else if selectedEndpoint === 'update'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['PUT']}">PUT</span>
						<code class="text-gray-100">/api/v1/novels/:id</code>
					</div>
					<p class="text-gray-300 mb-4">Update a novel. Requires <code class="text-primary-400">write</code> permission. Send only the fields you want to update.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X PUT "https://your-domain.com/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"current_chapter": 100, "score": 90}`}'</code></pre>
				</div>
			{:else if selectedEndpoint === 'progress'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['POST']}">POST</span>
						<code class="text-gray-100">/api/v1/novels/:id/progress</code>
					</div>
					<p class="text-gray-300 mb-4">Quick endpoint for updating reading progress. Perfect for reader apps. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "chapter": 100,      // Set chapter to specific number
  // OR
  "increment": 1,      // Increment chapter by N
  
  "status": "reading"  // Optional - update status too
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example: Increment Chapter</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X POST "https://your-domain.com/api/v1/novels/uuid-here/progress" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"increment": 1}`}'</code></pre>
					
					<p class="text-sm text-gray-400 mt-4">
						Note: If status is "planning" and chapter becomes > 0, status auto-updates to "reading".
					</p>
				</div>
			{:else if selectedEndpoint === 'delete'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['DELETE']}">DELETE</span>
						<code class="text-gray-100">/api/v1/novels/:id</code>
					</div>
					<p class="text-gray-300 mb-4">Delete a novel from your library. Requires <code class="text-primary-400">delete</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X DELETE "https://your-domain.com/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
				</div>
			{/if}
			
			<!-- Error Responses -->
			<div class="card">
				<h2 class="text-xl font-semibold text-gray-100 mb-4">Error Responses</h2>
				<p class="text-gray-300 mb-4">All errors follow this format:</p>
				<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "success": false,
  "error": "Error message here"
}`}</code></pre>
				
				<h4 class="font-medium text-gray-100 mt-4 mb-2">HTTP Status Codes</h4>
				<div class="bg-gray-900 rounded-lg p-4 text-sm">
					<div class="grid gap-2">
						<div><code class="text-green-400">200</code> - Success</div>
						<div><code class="text-green-400">201</code> - Created</div>
						<div><code class="text-yellow-400">400</code> - Bad request (invalid input)</div>
						<div><code class="text-yellow-400">401</code> - Unauthorized (invalid/missing API key)</div>
						<div><code class="text-yellow-400">403</code> - Forbidden (insufficient permissions)</div>
						<div><code class="text-yellow-400">404</code> - Not found</div>
						<div><code class="text-red-400">500</code> - Server error</div>
					</div>
				</div>
			</div>
			
			<!-- Rate Limits -->
			<div class="card">
				<h2 class="text-xl font-semibold text-gray-100 mb-4">Rate Limits</h2>
				<p class="text-gray-300">
					Currently no strict rate limits, but please be reasonable. Excessive requests may result in temporary blocks.
				</p>
			</div>
		</div>
	</div>
</div>
