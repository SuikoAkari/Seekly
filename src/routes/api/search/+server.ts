import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import Page from '$lib/models/Page';
import natural from 'natural';
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
		.sort({ finalScore: -1 })
		.skip(skip-1)
		.limit(limit)
		.lean();

	const tfidf = new natural.TfIdf();
	results.forEach(p => {
		const content = `${p.title || ''} ${p.description || ''}`;
		tfidf.addDocument(content);
		if(!p.impressions){
			p.impressions=0;
		}
		if(!p.clicks){
			p.clicks=0;
		}
		console.log(p.impressions);
		p.impressions+=1;
	});
	
	const keywords = q.split(/\s+/).join(' ');
	tfidf.tfidfs(keywords, (i, score) => {
		const relevanceScore = Math.min(score / 10, 1);
		const ctr = results[i].impressions > 0 ? results[i].clicks / results[i].impressions : 0;
		const httpsBoost = results[i].url.startsWith('https://') ? 0.05 : 0;
		
		const finalScore = (
			relevanceScore * 0.5 +
			(results[i].pageRank || 0) * 0.3 +
			ctr * 0.15 +
			httpsBoost
		);
		
		results[i].relevanceScore = relevanceScore;
		results[i].finalScore = finalScore;
	});
		
	results.sort((a, b) => b.finalScore - a.finalScore);
	await Promise.all(results.map(res => {
		return Page.updateOne(
			{ url: res.url },
			{
				relevanceScore: res.relevanceScore,
				finalScore: res.finalScore,
				impressions: res.impressions
			}
		);
	}));
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