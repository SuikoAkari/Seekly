<script>
    export let rsp;
    function getFaviconUrl(domain) {
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return `https://${cleanDomain}/favicon.ico`;
    }
    function splitLink(url) {
        let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
        var parts = cleanUrl.split(/\/|\?|\#/).filter(part => part.length > 0);
        if (parts.length > 6) {
            parts = parts.slice(0, 6);
        }
        const MAX_LENGTH = 50;

        parts = parts.map(part => {
            if (part.length > MAX_LENGTH) {
                return part.slice(0, MAX_LENGTH) + '…'; // oppure '...' se preferisci
            }
            return part;
        });
        return parts.join(' › ');
    }
    function highlight(text, query) {
        if (!query) return text;
        query=query.replace('"','');
        const words = query.trim().split(/\s+/).filter(Boolean);
        const pattern = new RegExp(`(${words.join("|")})`, "gi");
        
        return text.replace(pattern, '<b>$1</b>');
    }
</script>
<div style="display: flex; gap:12px; flex-direction: column; width: -webkit-fill-available; padding-right:10%;">
    {#each rsp.results as r}
        <div style="display:flex; gap:5px; flex-direction: column; ">
            <div style="display:flex; gap:8px;">
                <div class="modern url icon">
                    <img style="width: 28px; height:28px; border-radius:25px;" src={getFaviconUrl(r.url)}>
                </div>
                <div>
                    <p>{r.url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}</p>
                    <p class="small green">{splitLink(r.url)}</p>
                </div>
                
            </div>
            
           
            <div style="width: -webkit-fill-available; display:flex; flex-direction:column;">
                <a href="/redirect?uri={r.url}" target="_blank" class="modern url text">{r.title || r.url}</a>
                <p class="small lines-2" style="color: var(--paragraph-color);">{@html highlight(r.description || "No description for this page",rsp.query)}</p>
                
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