<script>
    import { onMount } from "svelte";

	let query = '';
	let rsp = {};
	async function search() {
        const url = new URL(window.location.origin + '/search');

        url.searchParams.set('q', query);
        window.location.href = url.toString(); 
    }
    async function totalPages(){
        const res = await fetch(`/api/search`);
		rsp = await res.json();
    }
    onMount(()=>{
        totalPages();
    })
</script>
<svelte:head>
    <title>Seekly</title>
</svelte:head>
<div class="center-flex" style="height: 100%; justify-content: center;">
    <img src="/logo.png" style="width:250px;">
    <p>Search for what you want on a total of <b>{rsp?.total}</b> urls</p>
    <div style="display:flex;">
        <input class="input-wbutton big norightborder" bind:value={query} placeholder="Search..." on:keydown={(e) => e.key === 'Enter' && search()} />
        <button class="input-wbutton noleftborder" on:click={search}>Search</button>
    </div>
    <div >
        
       
        
        <a href="/crawler">Index my website!</a>
        <a href="/about">About</a>
        <a href="/Github">Github</a>
    </div>
</div>

