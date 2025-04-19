import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
	src: { type: String, unique: true },
	source: String,
	alt: String,
	title: String,
	class: String,
	keywords: [String],
	timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);