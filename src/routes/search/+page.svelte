<script>
    import { onMount } from "svelte";

	let query = '';
	let rsp = {};
    let pages = 0;
	let page = 1;
	async function search(page=null) {
        const url = new URL(window.location);
        url.searchParams.set('q', query );
        
		history.replaceState({}, '', url);
		const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&p=${page}`);
		rsp = await res.json();
	}
    async function changePage(p) {
		page = p;
       
        const url = new URL(window.location);
        url.searchParams.set('p', String(page));
		history.replaceState({}, '', url);
		await search(p);
	}
    onMount(()=>{
        const params = new URLSearchParams(window.location.search);
		if (params.has('q')) {
			query = params.get('q');
            page = Number(params.get('p') || 1);
            changePage(page);
		}
        
    })
    
</script>
<div class="center-flex">
    <div class="search-top-bar"style="">
        <a href="/"><img src="/logo.png" style="width:150px;"></a>
        <div style="display:flex;">
            <input class="input-wbutton big norightborder" bind:value={query} placeholder="Search..." on:keydown={(e) => e.key === 'Enter' && search(1)} />
            <button class="input-wbutton noleftborder" on:click={changePage(1)}>Search</button>
        </div>
        
        <a href="/crawler">Index my website!</a>
        <a href="/about">About</a>
        <a href="https://github.com/SuikoAkari/Seekly">Github</a>
    </div>
   
    {#if rsp?.query?.length>0}
    <div>
        <button class="category-button">Links</button>
        <button class="category-button" disabled={true}>Images</button>
    </div>
    <div style="color: #888; margin:8px;margin-bottom:25px;">Seekly results <b>{rsp?.current.from}-{rsp?.current.to}</b> of about {rsp?.total} for <b>{rsp?.query}</b> took <b>{rsp?.durationMs/1000}</b> seconds</div>
    <div style="width: calc(100% - 20%); display: flex; gap:12px; flex-direction: column; padding-left:10%; padding-right:10%;">
        {#each rsp.results as r}
            <div style="display:flex; gap:12px;justify-content: space-between;">
                
                <div>
                    <a href={r.url} target="_blank">{r.title || r.url}</a>
                    <p class="small">{r.description || "No description for this page"}</p>
                    <p class="small green">{r.url}</p>
                </div>
                <!--<img style="width:100px;" src={r.image}>-->
            </div>
        {/each}
    </div>
    <nav class="pages-list">
        Pages
        {#each Array(rsp.pages) as _, i}
            <button class="button-page"
                on:click={() => changePage(i + 1)}
                disabled={page === i + 1}>
                {i + 1}
            </button>
        {/each}
    </nav>
    <p>Powered by SvelteKit @ Copyright SuikoAkari</p>
    {/if}
</div>

