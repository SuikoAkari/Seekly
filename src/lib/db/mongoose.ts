import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
if (!MONGODB_URI) {
	throw new Error('❌ MONGODB_URI not defined in .env');
}

let isConnected = false;

export async function connectDB() {
	if (isConnected) return;

	try {
		if(!MONGODB_DB){
			await mongoose.connect(MONGODB_URI);
		}else{
			await mongoose.connect(MONGODB_URI,{dbName:MONGODB_DB});
		}
		
		isConnected = true;
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('Connection error:', err);
	}
}