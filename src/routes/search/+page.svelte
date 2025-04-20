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
<div class="modern navbar">
    <div class="modern navbar row">
        <a href="/"><img src="/logo.png" style="width:150px;"></a>
    
        <div class="modern input searchbar">
            <div class="modern input searchbar divider">
    
            </div>
            <input class="modern input searchbar textbox" bind:value={query} placeholder="Search..." on:keydown={(e) => e.key === 'Enter' && search(1)} />
            <button class="modern input searchbar button" style="width:46px;" on:click={changePage(1)}>
                <svg width="25" height="25" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"/>
                </svg> 
            </button>
        </div>
        <a href="/crawler" class="modern button">Index a Website</a>
        <a href="/about" class="modern button">About</a>
        <a href="https://github.com/SuikoAkari/Seekly" class="modern button">Github</a>
    </div>
    <div class="modern navbar row" style="margin-left:160px; margin-top:20px;">
        {#each tabs as tab}
            <button class="modern button{curTab==tab.value ? " selected" : ""}" disabled={false} on:click={switchTab(tab.value)}>{tab.name}</button>
        {/each}
    </div>
</div>
<div class="modern page">
    <div class="modern results list">
        <div style="color: #888;">Seekly results <b>{rsp?.current?.from}-{rsp?.current?.to}</b> of about {rsp?.total} for <b>{rsp?.query}</b> took <b>{rsp?.durationMs/1000}</b> seconds</div>
        {#if rsp?.type=="urls"}
        <UrLsList rsp={rsp} ></UrLsList>
        {:else}
        <ImageList rsp={rsp}></ImageList>
        {/if}

        <nav class="pages-list">
            Pages
            <button class="modern button" on:click={() => changePage(1)}>First</button>
            {#each getVisiblePages() as pageNum}
                <button class="modern button"
                    on:click={() => changePage(pageNum)}
                    disabled={page === pageNum}>
                    {pageNum}
                </button>
            {/each}
            <button class="modern button" on:click={() => changePage(rsp?.pages)}>Last</button>
        </nav>
    </div>
    
</div>

