import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db/mongoose';
import Page from '$lib/models/Page';

export async function GET({ url }) {
    const uri = url.searchParams.get('uri') || '';

    await Page.updateOne(
        { url: uri },
        { $inc: { clicks: 1 } }
    );

    return new Response(null, {
        status: 302,
        headers: {
            Location: uri
        }
    });
}