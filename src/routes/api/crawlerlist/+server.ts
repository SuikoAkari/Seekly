import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import CrawlProcess from '$lib/models/CrawlProcess.js';

export async function GET({ url }) {
	const start = Date.now();
	await connectDB();

	
	const results = await CrawlProcess.find({})
		.sort({ date: -1 }).limit(25)
		.lean();

	const end = Date.now();

	return json({
		results,
	});
}