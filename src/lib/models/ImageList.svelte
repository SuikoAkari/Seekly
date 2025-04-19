<script>
    export let rsp;
</script>
<div style="display: flex; gap:12px; width: -webkit-fill-available; padding-right:10%;     flex-wrap: wrap;">
    {#each rsp.results as r}
        <div style="display:flex;" key={r}>
            <img src="{r.src}" height="120px" style="background-color: #222;">
        </div>
    {/each}
</div>