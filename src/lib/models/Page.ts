import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
	url: { type: String, unique: true },
	title: String,
	description: String,
	image: String,
	date: { type: Date, default: Date.now },
	links: [String],
	pageRank: { type: Number, default: 1.0 },
	clicks: { type: Number, default: 0 },
	impressions: { type: Number, default: 0 },
	relevanceScore: { type: Number, default: 0 },
	finalScore: { type: Number, default: 0 } 
});

export default mongoose.models.Page || mongoose.model('Page', pageSchema);