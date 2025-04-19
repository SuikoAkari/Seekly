<script>
    import { onMount } from "svelte";

	let url = '';
	let rsp = {};
    async function getCrawlProcess() {
       
		const res = await fetch(`/api/crawlerlist`);
		rsp = await res.json();
	}
    async function addQueue(){
        const res = await fetch(`/api/startcrawler?url=${url}`);
		rsp = await res.json();
    }
    onMount(()=>{
        getCrawlProcess();
    })
</script>
<div class="center-flex">
    <div class="search-top-bar"style="">
        <a href="/"><img src="/logo.png" style="width:150px;"></a>
        <div style="display:flex;">
            <input class="input-wbutton big norightborder" bind:value={url} placeholder="Link to crawl" on:keydown={(e) => e.key === 'Enter' && addQueue()} />
            <button class="input-wbutton noleftborder" on:click={addQueue()}>Add to queue</button>
        </div>
        
        <a href="/">Go search!</a>
        |
        <a href="/about">About</a>
        |
        <a href="https://github.com/SuikoAkari/Seekly">Github</a>
    </div>
    <h4>Queue, running and finished crawling process</h4>
    <p>
        This search engine is still in early development!<br>
        Note: Sitemaps aren't yet supported
    </p>
{#each rsp?.results as process}
    <div class="crawler-process {process.status}">
        <div style="text-overflow: ellipsis;
        overflow: hidden;">{process.startUrl}</div>
        <p>Status: {process.status}</p>
        <p>Date: {process.date}</p>
    </div>
    
{/each}
</div>