import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fal } from '@fal-ai/client';

// Style prompt mapping for fal-ai product-photography model
const STYLE_PROMPTS: Record<string, string> = {
  'clean-white': 'Professional e-commerce product studio photograph, 100% pure white backdrop, Amazon product catalog compliant, crisp product label and shadow details',
  'light-neutral': 'Luxury D2C product studio photograph, elegant warm light neutral marble pedestal, soft diffuse studio lighting, high-end commercial display',
  'soft-studio': 'Soft studio catalog product photograph, subtle ambient background shadows, balanced commercial studio lighting',
  'minimal-premium': 'Modern sleek product photograph, minimalist dark geometric podium, subtle accent lighting, modern e-commerce visual presentation',
};

// Aspect ratio mapping to ensure compatibility with fal.ai supported aspect ratios
const ASPECT_RATIO_MAP: Record<string, string> = {
  '1:1': '1:1',
  '4:5': '4:5',
  '16:9': '16:9',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Header check
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { originalImageUrl, selectedStyle, aspectRatio } = req.body || {};

    if (!originalImageUrl || typeof originalImageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing required product image parameter. Please upload a product photo.',
      });
    }

    // Read FAL_KEY from server-side environment variables strictly
    const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY;

    if (!falKey) {
      return res.status(500).json({
        success: false,
        error: 'Server Configuration Missing: FAL_KEY is not configured in server environment variables.',
      });
    }

    // Configure fal.ai credentials on server side
    fal.config({ credentials: falKey });

    const promptText = STYLE_PROMPTS[selectedStyle] || STYLE_PROMPTS['clean-white'];
    const targetAspectRatio = ASPECT_RATIO_MAP[aspectRatio] || '1:1';

    // Call fal.ai Product Photography API securely
    const result: any = await fal.subscribe('fal-ai/image-apps-v2/product-photography', {
      input: {
        image_url: originalImageUrl,
        prompt: promptText,
        aspect_ratio: targetAspectRatio,
        output_format: 'jpeg',
      },
    });

    const generatedImageUrl =
      result?.data?.images?.[0]?.url ||
      result?.data?.image?.url ||
      result?.images?.[0]?.url;

    if (!generatedImageUrl) {
      return res.status(502).json({
        success: false,
        error: 'fal.ai generation completed but did not return a valid image URL.',
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      requestId: result?.requestId || `fal_${Date.now()}`,
    });
  } catch (err: any) {
    const rawError = err?.message || 'Unexpected fal.ai API error during generation.';
    
    // Sanitize error message to ensure no API key or sensitive data is leaked
    let safeMessage = 'Failed to generate product image via fal.ai.';
    if (rawError.includes('quota') || rawError.includes('credit') || rawError.includes('balance')) {
      safeMessage = 'fal.ai account credits exceeded or insufficient balance.';
    } else if (rawError.includes('Key') || rawError.includes('Unauthorized') || rawError.includes('auth')) {
      safeMessage = 'Authentication failed with fal.ai API. Please verify FAL_KEY in server environment.';
    } else if (rawError.includes('timeout')) {
      safeMessage = 'AI image processing timed out. Please try again.';
    } else if (rawError.includes('image')) {
      safeMessage = 'Invalid input product image format or inaccessible URL.';
    }

    return res.status(500).json({
      success: false,
      error: safeMessage,
    });
  }
}
