import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import Page from '$lib/models/Page';

export async function GET({ url }) {
	const start = Date.now();
	await connectDB();

	const q = url.searchParams.get('q') || '';
	if(q.length < 1){
		const total = await Page.countDocuments();
		return json({total});
	}
	const page = parseInt(url.searchParams.get('p') || '1');
	const limit = 20;
	const skip = 1+(page - 1) * limit;
	
	var skipNext = (page) * limit;
	
	const searchQuery = {
		$or: [
			{ description: { $regex: q, $options: 'i' } },
			{ title: { $regex: q, $options: 'i' } },
			{ url: { $regex: q, $options: 'i' } }
		]
	};

	const total = await Page.countDocuments(searchQuery);
	if(skipNext > total){
		skipNext=total;
	}
	const results = await Page.find(searchQuery)
		.sort({ pageRank: -1 })
		.skip(skip-1)
		.limit(limit)
		.lean();

	const end = Date.now();

	return json({
		results,
		total,
		current:{from:skip,to:skipNext},
		durationMs: end - start,
		query: q,
		page,
		pages: Math.ceil(total / limit)
	});
}