<script>
    import ImageList from "$lib/models/ImageList.svelte";
    import UrLsList from "$lib/models/URLsList.svelte";
    import { onMount } from "svelte";

	let query = '';
	let rsp = {};
    let pages = 0;
	let page = 1;
    let curTab = "urls";
    let tabs = [
        {
            value:"urls",
            name: "URLs"
        },
        {
            value:"images",
            name: "Images"
        }
    ]
    function getVisiblePages() {
        const visiblePages = [];
        const maxVisible = 10;
        const halfRange = Math.floor(maxVisible / 2);
        let totalPages = rsp?.pages || 0;
        let start = Math.max(1, page - halfRange);  // Inizia 5 pagine prima della pagina attuale
        let end = Math.min(totalPages, page + halfRange);  // Termina 5 pagine dopo la pagina attuale

         // Se ci sono meno di 10 pagine intorno alla pagina attuale, aggiusta i limiti
        if (end - start < maxVisible) {
            if (start === 1) {
                end = Math.min(totalPages, start + maxVisible - 1);
            } else if (end === totalPages) {
                start = Math.max(1, end - maxVisible + 1);
            }
        }

        // Aggiungi tutte le pagine visibili all'array
        for (let i = start; i <= end; i++) {
            visiblePages.push(i);
        }

        return visiblePages;
    }
	async function search(page=null) {
        const url = new URL(window.location);
        url.searchParams.set('q', query );
        
		history.replaceState({}, '', url);
		const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&p=${page}&t=${curTab}`);
		rsp = await res.json();
	}
    async function changePage(p) {
		page = p;
       
        const url = new URL(window.location);
        url.searchParams.set('p', String(page));
		history.replaceState({}, '', url);
		await search(p);
	}
    async function switchTab(tab){
        curTab=tab;
        const url = new URL(window.location);
        url.searchParams.set('t', curTab);
		history.replaceState({}, '', url);
		await changePage(1);;
    }
    onMount(()=>{
        const params = new URLSearchParams(window.location.search);
		if (params.has('q')) {
			query = params.get('q');
            page = Number(params.get('p') || 1);
            curTab = params.get('t') || "urls";
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
        |
        <a href="/about">About</a>
        |
        <a href="https://github.com/SuikoAkari/Seekly">Github</a>
    </div>
    <div class="category-and-query">
        <div class="search-categories">
            {#each tabs as tab}
            <button class="category-button {curTab==tab.value ? "selected" : ""}" disabled={false} on:click={switchTab(tab.value)}>{tab.name}</button>
            {/each}
        </div>
        <div class="center-flex">
            {#if rsp?.query?.length>0}
   
            <div style="color: #888; margin:8px;margin-bottom:25px;">Seekly results <b>{rsp?.current.from}-{rsp?.current.to}</b> of about {rsp?.total} for <b>{rsp?.query}</b> took <b>{rsp?.durationMs/1000}</b> seconds</div>
            {#if rsp?.type=="urls"}
            <UrLsList rsp={rsp}></UrLsList>
            {:else}
            <ImageList rsp={rsp}></ImageList>
            {/if}
           
            <nav class="pages-list">
                Pages
                <button class="button-page" on:click={() => changePage(1)}>First</button>
                {#each getVisiblePages() as pageNum}
                    <button class="button-page"
                        on:click={() => changePage(pageNum)}
                        disabled={page === pageNum}>
                        {pageNum}
                    </button>
                {/each}
                <button class="button-page" on:click={() => changePage(rsp?.pages)}>Last</button>
            </nav>
            {/if}
        </div>
    </div>
    
    <p>Powered by SvelteKit @ Copyright SuikoAkari</p>
   
</div>

