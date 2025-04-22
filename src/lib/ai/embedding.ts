// src/lib/ai/embedding.ts
import { pipeline } from '@xenova/transformers';

// Load pipeline per l'embedding (feature-extraction)
export let extractor: any;

export async function getLocalEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const output = await extractor(text, {
    pooling: 'mean',     // media del vettore (ottenere un singolo vettore 1D)
    normalize: true      // normalizza il vettore (meglio per cosine similarity)
  });

  return output.data; // restituisce array tipo [0.123, 0.456, ...]
}