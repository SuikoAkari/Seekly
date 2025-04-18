import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
    url: String,
	title: String,
	description: String,
    image: String
});

export default mongoose.models.Page || mongoose.model('Page', pageSchema);