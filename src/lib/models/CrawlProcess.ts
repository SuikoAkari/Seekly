import mongoose from 'mongoose';

const crawlProcess = new mongoose.Schema({
	url: {type: [String], default:[]},
	startUrl: String,
	date: Date,
	status: String,
});

export default mongoose.models.CrawlProcess || mongoose.model('CrawlProcess', crawlProcess);