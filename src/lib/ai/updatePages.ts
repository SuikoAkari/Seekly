import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import Page from '$lib/models/Page';
import { pipeline } from '@xenova/transformers';
//import { extractor } from '$lib/ai/embedding';
export async function updateEmbeddingAll(){
    await connectDB();

    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const pages = await Page.find({ embedding: { $exists: false } }).limit(5000);

    const operations = [];
    var index=0;
    for (const page of pages) {
	    const input = `${page.url || ''} ${page.title || ''} ${page.description || ''}`.trim();
	    if (input.length === 0) continue;

	    const output = await extractor(input, {
		    pooling: 'mean',
		    normalize: true
	    });

	    operations.push({
		    updateOne: {
		    	filter: { _id: page._id },
		    	update: { $set: { embedding: Array.from(output.data) } }
		    }
	    });
        index++;
        console.log("Progress:",index,"/",pages.length);
    }

    if (operations.length > 0) {
	    await Page.bulkWrite(operations);
	    console.log(`✅ Salvati ${operations.length} embedding con bulkWrite`);
    } else {
	    console.log('Nessun embedding da generare');
    }
}