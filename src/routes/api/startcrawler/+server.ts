import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import CrawlProcess from '$lib/models/CrawlProcess.js';
export async function GET({ url }) {
	await connectDB();

	let uri = url.searchParams.get('url');
	if (!uri) return json({ error: 'Missing URL' });
	
	const existing = await CrawlProcess.findOne({
		startUrl: uri,
		status: { $in: ['queue', 'running'] }
	});

	if (existing) {
		return json({ msg: 'URL already in queue or running' });
	}
	const queue = new CrawlProcess({
		status: 'queue',
		startUrl: uri,
		date: new Date()
	});
	await queue.save();

	return json({ msg: 'Added to queue' });
}