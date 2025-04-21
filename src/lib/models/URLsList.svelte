<script>
    export let rsp;
    function getFaviconUrl(domain) {
        // Rimuovi protocollo e path se presente
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return `https://${cleanDomain}/favicon.ico`;
    }
</script>
<div style="display: flex; gap:12px; flex-direction: column; width: -webkit-fill-available; padding-right:10%;">
    {#each rsp.results as r}
        <div style="display:flex; gap:12px;justify-content: space-between;" key={r}>
            <div class="modern url icon">
                <img style="width: 28px; height:28px; border-radius:25px;" src={getFaviconUrl(r.url)}>
            </div>
           
            <div style="width: -webkit-fill-available; ">
                <a href="/redirect?uri={r.url}" target="_blank">{r.title || r.url}</a>
                <p class="small lines-2">{r.description || "No description for this page"}</p>
                <p class="small green">{r.url}</p>
                {#if r?.categories?.length>0}
                <div class="modern url-div categories">
                    {#each r.categories as c}
                    
                    <div class="modern url-div category">
                        <a href="/redirect?uri={c.url}" target="_blank">{c.name || "?"}</a>
                    </div>
                        
                    {/each}
                </div>
                {/if}
            </div>
            <!--<img style="width:100px;" src={r.image}>-->
        </div>
    {/each}
</div>