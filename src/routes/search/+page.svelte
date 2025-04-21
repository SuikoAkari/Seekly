<script>
    import ImageList from "$lib/models/ImageList.svelte";
    import UrLsList from "$lib/models/URLsList.svelte";
    import { goto } from '$app/navigation';
    import { onMount } from "svelte";

    let tabs = [
        {
            value:"urls",
            name: "Web Pages",
            icon: `
            <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"/>
            </svg> `
        },
        {
            value:"images",
            name: "Images",
            icon: `
                <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.50153 9C5.32995 9 6.00153 8.32843 6.00153 7.5C6.00153 6.67157 5.32995 6 4.50153 6C3.6731 6 3.00153 6.67157 3.00153 7.5C3.00153 8.32843 3.6731 9 4.50153 9Z" />
                <path d="M14.0015 13C14.0015 14.1046 13.1061 15 12.0015 15H2.00153C0.896956 15 0.00152588 14.1046 0.00152588 13V5C0.00152588 3.89594 0.896124 3.00083 1.99998 3C1.99998 1.89543 2.89542 1 3.99998 1H14C15.1046 1 16 1.89543 16 3V11C16 12.1041 15.1054 12.9992 14.0015 13ZM14 2H3.99998C3.4477 2 2.99998 2.44772 2.99998 3L12.0015 3C13.1061 3 14.0015 3.89543 14.0015 5V12C14.5531 11.9992 15 11.5518 15 11V3C15 2.44772 14.5523 2 14 2ZM2.00153 4C1.44924 4 1.00153 4.44772 1.00153 5V13L3.64797 10.6465C3.8165 10.4779 4.08056 10.4518 4.27888 10.584L6.93782 12.3566L10.648 8.64646C10.8002 8.49428 11.0326 8.45655 11.2251 8.5528L13.0015 10.5V5C13.0015 4.44772 12.5538 4 12.0015 4H2.00153Z" />
                </svg>`
        },
        {
            value:"news",
            name: "News",
            icon: `
                <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 2.5C0 1.67157 0.671573 1 1.5 1H12.5C13.3284 1 14 1.67157 14 2.5V13.0279C14 13.3272 13.9498 13.6825 13.7624 14H14.5C14.7761 14 15 13.7761 15 13.5V4.5C15 4.22386 15.2239 4 15.5 4C15.7761 4 16 4.22386 16 4.5V13.5C16 14.3284 15.3284 15 14.5 15H1.49657C0.665904 15 0 14.3262 0 13.5V2.5ZM12 14C12.3693 14 12.6538 13.7885 12.8531 13.5587C12.9448 13.453 13 13.28 13 13.0279V2.5C13 2.22386 12.7761 2 12.5 2H1.5C1.22386 2 1 2.22386 1 2.5V13.5C1 13.7784 1.22266 14 1.49657 14H12Z" />
                <path d="M2 3H12V5H2V3Z" />
                <path d="M2 6H6V9H2V6Z" />
                <path d="M2 10H6V11H2V10Z" />
                <path d="M2 12H6V13H2V12Z" />
                <path d="M7 6H9V7H7V6Z" />
                <path d="M10 6H12V7H10V6Z" />
                <path d="M7 8H9V9H7V8Z"/>
                <path d="M10 8H12V9H10V8Z"/>
                <path d="M7 10H9V11H7V10Z" />
                <path d="M10 10H12V11H10V10Z" />
                <path d="M7 12H9V13H7V12Z" />
                <path d="M10 12H12V13H10V12Z" />
                </svg>`,
            disabled: true,
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
    function search(){
        const params = new URLSearchParams();
	    params.set('t', "urls");
	    params.set('p', "1");
	    params.set('q', curQuery);

	    goto(`?${params.toString()}`);
    }
    function switchTab(t){
        const params = new URLSearchParams();
	    params.set('t', t);
	    params.set('p', page);
	    params.set('q', query);
        curQuery=query;
	    goto(`?${params.toString()}`);
    }
    function changePage(pp) {
	    const params = new URLSearchParams();
	    params.set('t', curTab);
	    params.set('p', pp);
	    params.set('q', query);
        curQuery=query;
	    goto(`?${params.toString()}`);
    }
    export let data;
    var {curQuery} = data;
	$: ({ rsp, query, page, curTab } = data);

    let scrolled = false;
    const scrollThreshold = 35;
  
    onMount(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;
    
        const update = () => {
            scrolled = lastScrollY > scrollThreshold;
            ticking = false;
        };
    
        const handleScroll = () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>
<svelte:head>
    <title>{query} - Search with Seekly (Beta!)</title>
</svelte:head>
<div class="modern navbar empty-replacement">

</div>
<div class="modern navbar{scrolled ? " scrolled":""}">
    <div class="modern navbar row special">
        <div style="display:flex; align-items:center; gap:8px;">
            <a href="/"><img src="/logo.png" style="width:150px;"></a>
    
            <div class="modern input searchbar">
                <div class="modern input searchbar divider">
        
                </div>
                <input class="modern input searchbar textbox" bind:value={curQuery} placeholder="Search" on:keydown={(e) => e.key === 'Enter' && search(1)} />
                {#if curQuery.length>0}
                <button class="modern input searchbar button" style="width:46px;" on:click={curQuery=""}>
                    <svg width="35" height="35" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.64645 4.64645C4.84171 4.45118 5.15829 4.45118 5.35355 4.64645L8 7.29289L10.6464 4.64645C10.8417 4.45118 11.1583 4.45118 11.3536 4.64645C11.5488 4.84171 11.5488 5.15829 11.3536 5.35355L8.70711 8L11.3536 10.6464C11.5488 10.8417 11.5488 11.1583 11.3536 11.3536C11.1583 11.5488 10.8417 11.5488 10.6464 11.3536L8 8.70711L5.35355 11.3536C5.15829 11.5488 4.84171 11.5488 4.64645 11.3536C4.45118 11.1583 4.45118 10.8417 4.64645 10.6464L7.29289 8L4.64645 5.35355C4.45118 5.15829 4.45118 4.84171 4.64645 4.64645Z"/>
                    </svg>
                </button>
                <div class="modern-divisor">
    
                </div>
                {/if}
                <button class="modern input searchbar button" style="width:46px;" on:click={search}>
                    <svg width="20" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"/>
                    </svg> 
                </button>
                <div class="modern input searchbar divider">
        
                </div>
            </div>
        </div>
        
        <div class="modern navbar buttons">
            <a href="/crawler" class="modern button">Index a Website</a>
            <a href="/about" class="modern button">About</a>
            <a href="https://github.com/SuikoAkari/Seekly" class="modern button">Github</a>
        </div>

    </div>
    
</div>
<div class="modern navbar row" style="margin-left:160px; margin-top:20px;">
    {#each tabs as tab}
        <button class="modern button{curTab==tab.value ? " selected" : ""}" disabled={tab?.disabled} on:click={()=>switchTab(tab.value)}>
            {#if tab.icon}
            {@html tab.icon}
            {/if}
            {tab.name}
        </button>
    {/each}
    <button class="modern button" disabled={true} on:click={()=>{}}>
        <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5C1.5 1.22386 1.72386 1 2 1H14C14.2761 1 14.5 1.22386 14.5 1.5V3.5C14.5 3.62352 14.4543 3.74267 14.3716 3.83448L10 8.69187V13.5C10 13.7152 9.86228 13.9063 9.65811 13.9743L6.65811 14.9743C6.50564 15.0252 6.33803 14.9996 6.20764 14.9056C6.07726 14.8116 6 14.6607 6 14.5V8.69187L1.62835 3.83448C1.54572 3.74267 1.5 3.62352 1.5 3.5V1.5ZM2.5 2V3.30813L6.87165 8.16552C6.95428 8.25733 7 8.37648 7 8.5V13.8063L9 13.1396V8.5C9 8.37648 9.04572 8.25733 9.12835 8.16552L13.5 3.30813V2H2.5Z" />
         </svg>  
        Filters
    </button>
</div>
<div class="modern page">
    <div class="modern results list" style="{rsp?.type =="images" ? "width: -webkit-fill-available;":""}">
        <div style="color: #888;">Seekly results <b>{rsp?.current?.from}-{rsp?.current?.to}</b> of about {rsp?.total} for <b>{rsp?.query}</b> took <b>{rsp?.durationMs/1000}</b> seconds</div>
        {#if rsp?.type=="urls"}
        <UrLsList rsp={rsp} ></UrLsList>
        {:else}
        <ImageList rsp={rsp}></ImageList>
        {/if}

        <nav class="pages-list">
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
    {#if rsp?.type=="urls"}
    <div style="display: flex; gap:8px; flex-direction: column; margin-bottom:10px; ">
        <div class="modern panel">
            <p>Related searches</p>
            <a>
                Coming soon
            </a>
        </div>
    </div>
    {/if}
</div>

