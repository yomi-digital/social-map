import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Log dell'ambiente
    console.log('Build Environment:', {
      nodeEnv: process.env.NODE_ENV,
      hasToken: !!process.env.VITE_GITHUB_TOKEN,
      vercelEnv: process.env.VERCEL_ENV
    });

    response.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Build Error:', error);
    response.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 