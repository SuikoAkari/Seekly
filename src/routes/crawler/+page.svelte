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
    <div style="display:flex; align-items: center; gap:6px; margin-top:15px;">
        <img src="/logo.png" style="width:150px;">
        <input bind:value={url} placeholder="Link to crawl" on:keydown={(e) => e.key === 'Enter' && addQueue()} />
        <button on:click={addQueue()}>Add to queue</button>
        <a href="/">Go search!</a>
    </div>
    <hr style="width: calc(100% - 2px);">
    <h4>Queue, running and finished crawling process</h4>
{#each rsp?.results as process}
    <div class="crawler-process {process.status}">
        <p>{process.startUrl}</p>
        <p>Status: {process.status}</p>
        <p>Date: {process.date}</p>
    </div>
    
{/each}
</div>