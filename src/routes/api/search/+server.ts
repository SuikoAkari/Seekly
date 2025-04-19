import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import Page from '$lib/models/Page';
import Image from '$lib/models/Image';
import natural from 'natural';
export async function GET({ url }) {
	const start = Date.now();
	await connectDB();

	const q = url.searchParams.get('q') || '';
	const type = url.searchParams.get('t') || 'urls';
	if(q.length < 1){
		const total = await Page.countDocuments();
		const totalImages = await Image.countDocuments();
		return json({total,totalImages});
	}
	const page = parseInt(url.searchParams.get('p') || '1');
	const limit = 20;
	const skip = 1+(page - 1) * limit;
	
	var skipNext = (page) * limit;
	if(type=="urls"){
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
			.select("url title description image date pageRank clicks impressions relevanceScore finalScore")
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
			type,
			results,
			total,
			current:{from:skip,to:skipNext},
			durationMs: end - start,
			query: q,
			page,
			pages: Math.ceil(total / limit)
		});
	}else if(type=="images"){
		const regex = new RegExp(q, 'i');
		const searchQuery = {
			$or: [
				{ src: regex },
				{ alt: regex },
				{ title: regex },
				{ class: regex },
				{ keywords: regex }
			]
		};
		
		const total = await Image.countDocuments(searchQuery);
		if(skipNext > total){
			skipNext=total;
		}
		
		const results = await Image.find(searchQuery)
			.sort({ finalScore: -1 })
			.skip(skip-1)
			.limit(limit)
			.select("src alt source title timestamp")
			.lean();

		const end = Date.now();
		return json({
			type,
			results,
			total,
			current:{from:skip,to:skipNext},
			durationMs: end - start,
			query: q,
			page,
			pages: Math.ceil(total / limit)
		});
	}
	
}