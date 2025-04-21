<script>
    export let rsp;
    function getFaviconUrl(domain) {
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return `https://${cleanDomain}/favicon.ico`;
    }
    function splitLink(url) {
        let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
        const parts = cleanUrl.split(/\/|\?|\#/).filter(part => part.length > 0);

        return parts.join(' › ');
    }
</script>
<div style="display: flex; gap:12px; width: -webkit-fill-available; flex-wrap: wrap;">
    {#each rsp.results as r}
        <a class="modern results image div" key={r}>
            <img src="{r.src}" style="background-color: #000; border-radius:12px;">
            <p class="small" style="max-width: 200px; overflow:hidden;">{splitLink(r.source)}</p>
        </a>
    {/each}
</div>