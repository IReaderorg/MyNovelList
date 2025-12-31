<script lang="ts">
	let selectedEndpoint = 'list';
	
	const endpoints = [
		{ id: 'list', name: 'List Library', method: 'GET', path: '/api/v1/novels' },
		{ id: 'get', name: 'Get Novel', method: 'GET', path: '/api/v1/novels/:id' },
		{ id: 'search', name: 'Search Novels', method: 'GET', path: '/api/v1/novels/search' },
		{ id: 'create', name: 'Create Novel', method: 'POST', path: '/api/v1/novels' },
		{ id: 'update', name: 'Update Novel', method: 'PUT', path: '/api/v1/novels/:id' },
		{ id: 'progress-get', name: 'Get Progress', method: 'GET', path: '/api/v1/novels/:id/progress' },
		{ id: 'progress-add', name: 'Add to Library', method: 'POST', path: '/api/v1/novels/:id/progress' },
		{ id: 'progress-update', name: 'Update Progress', method: 'PUT', path: '/api/v1/novels/:id/progress' },
		{ id: 'delete', name: 'Remove from Library', method: 'DELETE', path: '/api/v1/novels/:id' },
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
	
	<!-- Architecture Overview -->
	<div class="card mb-6">
		<h2 class="text-xl font-semibold text-gray-100 mb-4">📚 Data Architecture</h2>
		<div class="text-gray-300 space-y-2">
			<p><strong class="text-primary-400">Novels</strong> are shared/public - anyone can search and view novel metadata.</p>
			<p><strong class="text-primary-400">Progress</strong> is private - your reading status, chapter, score, and notes are only visible to you.</p>
			<p>When you add a novel to your library, you're creating a personal progress entry linked to the shared novel.</p>
		</div>
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
				<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">https://mynoveltracker.netlify.app/api/v1</code></pre>
			</div>
			
			<!-- Endpoint Details -->
			{#if selectedEndpoint === 'list'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels</code>
					</div>
					<p class="text-gray-300 mb-4">List all novels in your library with your progress data.</p>
					
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
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://mynoveltracker.netlify.app/api/v1/novels?status=reading&page=1" \
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
        "cover_url": "https://...",
        "source_url": "https://...",
        "total_chapters": 270,
        "tags": ["action", "fantasy"],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z",
        "progress": {
          "id": "progress-uuid",
          "status": "reading",
          "current_chapter": 150,
          "score": 95,
          "notes": "Great story!",
          "started_at": "2024-01-01",
          "completed_at": null
        }
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
					<p class="text-gray-300 mb-4">Get a single novel by ID with your progress (if in library).</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Response</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Solo Leveling",
    "author": "Chugong",
    "total_chapters": 270,
    "progress": {
      "status": "reading",
      "current_chapter": 150,
      "score": 95
    }
  }
}`}</code></pre>
				</div>
			{:else if selectedEndpoint === 'search'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels/search</code>
					</div>
					<p class="text-gray-300 mb-4">Search the public novels database. Returns whether each novel is in your library.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Query Parameters</h4>
					<div class="bg-gray-900 rounded-lg p-4 mb-4 text-sm">
						<div class="grid gap-2">
							<div><code class="text-primary-400">q</code> <span class="text-gray-500">string</span> - Search query (title or author)</div>
							<div><code class="text-primary-400">title</code> <span class="text-gray-500">string</span> - Search by title (alias for q)</div>
							<div><code class="text-primary-400">source_url</code> <span class="text-gray-500">string</span> - Search by exact source URL</div>
							<div><code class="text-primary-400">limit</code> <span class="text-gray-500">integer</span> - Max results (default: 20, max: 50)</div>
						</div>
					</div>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://mynoveltracker.netlify.app/api/v1/novels/search?q=solo%20leveling" \
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
        "total_chapters": 270,
        "in_library": true,
        "progress": { "status": "reading", "current_chapter": 150 }
      }
    ]
  }
}`}</code></pre>
				</div>
			{:else if selectedEndpoint === 'create'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['POST']}">POST</span>
						<code class="text-gray-100">/api/v1/novels</code>
					</div>
					<p class="text-gray-300 mb-4">Create a new novel (or find existing) and add to your library. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  // Novel metadata (shared)
  "title": "Solo Leveling",        // required
  "author": "Chugong",             // optional
  "cover_url": "https://...",      // optional
  "source_url": "https://...",     // optional - URL where you're reading
  "total_chapters": 270,           // optional
  "tags": ["action", "fantasy"],   // optional
  
  // Your progress (private)
  "status": "reading",             // optional - default: "planning"
  "current_chapter": 50,           // optional - default: 0
  "score": 95,                     // optional - 0-100
  "notes": "Great story!",         // optional
  "started_at": "2024-01-01",      // optional
  "completed_at": null,            // optional
  
  "add_to_library": true           // optional - default: true
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X POST "https://mynoveltracker.netlify.app/api/v1/novels" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"title": "Solo Leveling", "status": "reading", "current_chapter": 50}`}'</code></pre>
					
					<p class="text-sm text-gray-400 mt-4">
						Note: If a novel with the same source_url or title already exists, it will be reused instead of creating a duplicate.
					</p>
				</div>
			{:else if selectedEndpoint === 'update'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['PUT']}">PUT</span>
						<code class="text-gray-100">/api/v1/novels/:id</code>
					</div>
					<p class="text-gray-300 mb-4">Update novel metadata. Only the original creator can update. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "title": "Updated Title",
  "author": "Author Name",
  "cover_url": "https://...",
  "total_chapters": 300,
  "tags": ["action", "fantasy"]
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X PUT "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"total_chapters": 300}`}'</code></pre>
				</div>
			{:else if selectedEndpoint === 'progress-get'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['GET']}">GET</span>
						<code class="text-gray-100">/api/v1/novels/:id/progress</code>
					</div>
					<p class="text-gray-300 mb-4">Get your progress on a specific novel.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X GET "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here/progress" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Response</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "success": true,
  "data": {
    "id": "progress-uuid",
    "novel_id": "novel-uuid",
    "status": "reading",
    "current_chapter": 150,
    "score": 95,
    "notes": "Great story!",
    "started_at": "2024-01-01",
    "completed_at": null
  }
}`}</code></pre>
				</div>
			{:else if selectedEndpoint === 'progress-add'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['POST']}">POST</span>
						<code class="text-gray-100">/api/v1/novels/:id/progress</code>
					</div>
					<p class="text-gray-300 mb-4">Add an existing novel to your library. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "status": "planning",      // optional - default: "planning"
  "current_chapter": 0,      // optional - default: 0
  "score": null,             // optional
  "notes": "",               // optional
  "started_at": null,        // optional
  "completed_at": null       // optional
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X POST "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here/progress" \
  -H "Authorization: Bearer mnl_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{`{"status": "reading", "current_chapter": 10}`}'</code></pre>
				</div>
			{:else if selectedEndpoint === 'progress-update'}
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<span class="px-2 py-1 text-xs font-mono rounded {methodColors['PUT']}">PUT</span>
						<code class="text-gray-100">/api/v1/novels/:id/progress</code>
					</div>
					<p class="text-gray-300 mb-4">Update your reading progress. Perfect for reader apps. Requires <code class="text-primary-400">write</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Request Body</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "current_chapter": 100,    // Set chapter to specific number
  // OR
  "chapter": 100,            // Alias for current_chapter
  // OR
  "increment": 1,            // Increment chapter by N
  
  "status": "reading",       // Optional
  "score": 95,               // Optional - 0-100
  "notes": "Updated notes",  // Optional
  "started_at": "2024-01-01",// Optional
  "completed_at": null       // Optional
}`}</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Example: Increment Chapter</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X PUT "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here/progress" \
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
					<p class="text-gray-300 mb-4">Remove a novel from your library (deletes your progress, not the novel itself). Requires <code class="text-primary-400">delete</code> permission.</p>
					
					<h4 class="font-medium text-gray-100 mb-2">Example Request</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">curl -X DELETE "https://mynoveltracker.netlify.app/api/v1/novels/uuid-here" \
  -H "Authorization: Bearer mnl_your_api_key"</code></pre>
					
					<h4 class="font-medium text-gray-100 mt-4 mb-2">Response</h4>
					<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm"><code class="text-gray-300">{`{
  "success": true,
  "data": { "removed": true }
}`}</code></pre>
				</div>
			{/if}
			
			<!-- IReader Integration -->
			<div class="card">
				<h2 class="text-xl font-semibold text-gray-100 mb-4">📱 IReader Integration</h2>
				<p class="text-gray-300 mb-4">
					MyNovelList can be used as a tracker in IReader. To set it up:
				</p>
				<ol class="list-decimal list-inside text-gray-300 space-y-2">
					<li>Generate an API key with <code class="text-primary-400">read</code>, <code class="text-primary-400">write</code>, and <code class="text-primary-400">delete</code> permissions</li>
					<li>In IReader, go to Settings → Tracking → MyNovelList</li>
					<li>Enter your API key</li>
					<li>Start tracking your novels!</li>
				</ol>
			</div>
			
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
						<div><code class="text-yellow-400">409</code> - Conflict (e.g., novel already in library)</div>
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
