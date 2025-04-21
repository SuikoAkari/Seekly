<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    
	let curQuery = '';
	let rsp = {};
	async function search() {
        const params = new URLSearchParams();

        params.set('q', curQuery);
        goto(`/search?${params.toString()}`);
    }
    async function totalPages(){
        const res = await fetch(`/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({
            })
        });
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
    <!--<p>Search for what you want on a total of <b>{rsp?.total}</b> urls and <b>{rsp?.totalImages}</b> images</p>-->
    <div class="modern input searchbar">
        <div class="modern input searchbar divider">

        </div>
        <input class="modern input searchbar textbox" bind:value={curQuery} placeholder="Search..." on:keydown={(e) => e.key === 'Enter' && search()} />
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
    <a href="https://github.com/SuikoAkari/Seekly" class="modern home ad">
        <p>Check now the latest updates of Seekly on GitHub!</p>
    </a>
    <div style="margin-top:10px; display:flex; gap:10px;">
        <a href="/crawler" class="modern button">Index a Website</a>
        <a href="/about" class="modern button">About</a>
        <a href="https://github.com/SuikoAkari/Seekly" class="modern button">Github</a>
    </div>
</div>

