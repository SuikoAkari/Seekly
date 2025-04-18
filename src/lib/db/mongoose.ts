import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('❌ MONGODB_URI not defined in .env');
}

let isConnected = false;

export async function connectDB() {
	if (isConnected) return;

	try {
		await mongoose.connect(MONGODB_URI);
		isConnected = true;
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('Connection error:', err);
	}
}