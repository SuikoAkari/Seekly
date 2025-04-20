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
    <div style="display:flex;">
        <img src="/logo.png" style="width:250px;">
        <p>Beta</p>
    </div>
    
    <p>Search for what you want on a total of <b>{rsp?.total}</b> urls and <b>{rsp?.totalImages}</b> images</p>
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
    <div style="margin-top:10px; display:flex; gap:10px;">
        <a href="/crawler" class="modern button">Index a Website</a>
        <a href="/about" class="modern button">About</a>
        <a href="https://github.com/SuikoAkari/Seekly" class="modern button">Github</a>
    </div>
</div>

