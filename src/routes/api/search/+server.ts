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
		const searchQuery = { $text: { $search: q } };
		await Page.collection.getIndexes().then(console.log);
		const total = await Page.countDocuments(searchQuery, { score: { $meta: "textScore" } });
		if(skipNext > total){
			skipNext=total;
		}
		const results = await Page.find(searchQuery, { score: { $meta: "textScore" } })
			.sort({ finalScore: -1 })
			//.sort({ score: { $meta: "textScore" },finalScore: -1 })
			.skip(skip-1)
			.limit(limit)
			.select("url categories title description image date pageRank clicks impressions relevanceScore finalScore score")
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
		
		const keywords = q.split(/\s+/).map(keyword => keyword.toLowerCase()).join(' ');
		tfidf.tfidfs(keywords, (i, tfidfScore) => {
    		const relevanceScore = Math.min(tfidfScore / 10, 1);
    		const ctr = results[i].impressions > 0 ? results[i].clicks / results[i].impressions : 0;
    		const httpsBoost = results[i].url.startsWith('https://') ? 0.05 : 0;
    		const textScore = results[i].score ?? 0;

    		// BONUS: Boost per la corrispondenza esatta del teosto
    		const matchBoost = results[i].url.toLowerCase().includes(q) ? 0.3 : 0;

    		// BONUS: Boost per il titolo, verifica che la parola chiave sia presente
    		const titleBoost = results[i].title?.toLowerCase().includes(keywords) ? 0.2 : 0;

    		// BONUS: Boost per URL, verifica che la parola chiave sia presente nell'URL
    		const urlBoost = results[i].url?.toLowerCase().includes(keywords) ? 0.1 : 0;


    		// Calcolo finale del punteggio
    		const finalScore = (
        		textScore * 0.35 +           // Peso per il punteggio di textScore
        		relevanceScore * 0.2 +       // Peso per il punteggio di rilevanza (TF-IDF)
        		(results[i].pageRank || 0) * 0.2 +  // Peso per il pageRank
        		ctr * 0.1 +                  // Peso per il CTR (Click-Through Rate)
        		httpsBoost +                 // Boost per l'URL che inizia con 'https://'
        		titleBoost +                 // Boost per la corrispondenza nel titolo
        		urlBoost +                   // Boost per la corrispondenza nell'URL
        		matchBoost               // Boost per il match della query 
    		);

    		// Aggiornamento dei punteggi
    		results[i].relevanceScore = relevanceScore;
    		results[i].finalScore = finalScore;
			results[i].scores=[
				{
					name:"Text Score",value:textScore* 0.35
				},
				{
					name:"Page Rank",value:results[i].pageRank
				},
				{
					name:"Relevance Score",value:relevanceScore* 0.2
				},
				{
					name:"URL Boost",value:urlBoost
				},
				{
					name:"Match Boost",value:matchBoost 
				}
			]
		});
			
		results.sort((a, b) => b.finalScore - a.finalScore);
		const bulkOps = results.map(res => ({
			updateOne: {
				filter: { url: res.url },
				update: {
					$set: {
						relevanceScore: res.relevanceScore,
						finalScore: res.finalScore
					},
					$inc: { impressions: 1 }
				}
			}
		}));
		await Page.bulkWrite(bulkOps);
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
		/*const searchQuery = {
			$or: [
				{ src: regex },
				{ alt: regex },
				{ title: regex },
				{ class: regex },
				{ keywords: regex }
			]
		};*/
		const searchQuery = { $text: { $search: q } };
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