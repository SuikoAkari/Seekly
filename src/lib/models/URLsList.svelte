<script>
    export let rsp;
</script>
<div style="display: flex; gap:12px; flex-direction: column; width: -webkit-fill-available; padding-right:10%;">
    {#each rsp.results as r}
        <div style="display:flex; gap:12px;justify-content: space-between;" key={r}>
            
            <div>
                <a href="/redirect?uri={r.url}" target="_blank">{r.title || r.url}</a>
                <p class="small lines-2">{r.description || "No description for this page"}</p>
                <p class="small green">{r.url}</p>
            </div>
            <!--<img style="width:100px;" src={r.image}>-->
        </div>
    {/each}
</div>