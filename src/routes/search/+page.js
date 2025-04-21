// +page.js
export async function load({ fetch, url }) {
	const query = url.searchParams.get('q') || '';
	const page = url.searchParams.get('p') || '1';
	const curTab = url.searchParams.get('t') || 'urls';

	const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&p=${page}&t=${curTab}`);
	const rsp = await res.json();

	return {
		query,
        curQuery:query,
		page: Number(page),
		curTab,
		rsp: rsp
	};
}