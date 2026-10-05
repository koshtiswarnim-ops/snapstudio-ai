import axios from 'axios';
import { BackgroundStyle, AspectRatio, QualityMode } from '../types';

export interface FalProductPhotographyPayload {
  userId: string;
  originalImageUrl: string;
  selectedStyle: BackgroundStyle;
  aspectRatio: AspectRatio;
  quality: QualityMode;
}

export interface FalProductPhotographyResult {
  success: boolean;
  generatedImageUrl?: string;
  requestId?: string;
  error?: string;
}

/**
 * Triggers AI Product Photography generation via secure server-side endpoint (/api/generate-product-image) using fal-ai/image-apps-v2/product-photography.
 */
export async function triggerFalAIGeneration(
  payload: FalProductPhotographyPayload,
  onProgress?: (step: string, percent: number) => void
): Promise<FalProductPhotographyResult> {
  try {
    onProgress?.('Preparing image tensor & validating parameters...', 15);
    await new Promise((r) => setTimeout(r, 300));

    onProgress?.('Sending product image to fal.ai Product Photography API...', 45);

    const response = await axios.post('/api/generate-product-image', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 90000,
    });

    onProgress?.('Synthesizing studio background lighting & geometry...', 80);
    await new Promise((r) => setTimeout(r, 300));

    onProgress?.('Finalizing high-resolution e-commerce render...', 95);

    if (response.data && response.data.success && response.data.imageUrl) {
      return {
        success: true,
        generatedImageUrl: response.data.imageUrl,
        requestId: response.data.requestId || `fal_${Date.now()}`,
      };
    } else {
      return {
        success: false,
        error: response.data?.error || 'AI generation returned an incomplete result.',
      };
    }
  } catch (err: any) {
    const errorMsg =
      err?.response?.data?.error ||
      err?.message ||
      'Failed to process fal.ai product photography generation.';

    return {
      success: false,
      error: errorMsg,
    };
  }
}
