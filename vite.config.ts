import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fal } from '@fal-ai/client';

const STYLE_PROMPTS: Record<string, string> = {
  'clean-white': 'Professional e-commerce product studio photograph, 100% pure white backdrop, Amazon product catalog compliant, crisp product label and shadow details',
  'light-neutral': 'Luxury D2C product studio photograph, elegant warm light neutral marble pedestal, soft diffuse studio lighting, high-end commercial display',
  'soft-studio': 'Soft studio catalog product photograph, subtle ambient background shadows, balanced commercial studio lighting',
  'minimal-premium': 'Modern sleek product photograph, minimalist dark geometric podium, subtle accent lighting, modern e-commerce visual presentation',
};

const ASPECT_RATIO_MAP: Record<string, string> = {
  '1:1': '1:1',
  '4:5': '4:5',
  '16:9': '16:9',
};

function falApiDevPlugin() {
  return {
    name: 'fal-api-dev-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/generate-product-image', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          return next();
        }

        let bodyStr = '';
        req.on('data', (chunk: any) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            const { originalImageUrl, selectedStyle, aspectRatio } = body;

            // Load environment variables from local .env files during vite dev
            const env = loadEnv('development', process.cwd(), '');
            const falKey = env.FAL_KEY || process.env.FAL_KEY || env.FAL_API_KEY || process.env.FAL_API_KEY;

            if (!falKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Server Configuration Missing: FAL_KEY is not configured in local .env file.',
                })
              );
              return;
            }

            if (!originalImageUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Missing required product image parameter. Please upload a product photo.',
                })
              );
              return;
            }

            fal.config({ credentials: falKey });
            const promptText = STYLE_PROMPTS[selectedStyle] || STYLE_PROMPTS['clean-white'];
            const targetAspectRatio = ASPECT_RATIO_MAP[aspectRatio] || '1:1';

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

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                imageUrl: generatedImageUrl,
                requestId: result?.requestId || `fal_${Date.now()}`,
              })
            );
          } catch (err: any) {
            const rawError = err?.message || '';
            let safeMessage = 'Failed to generate product image via fal.ai.';
            if (rawError.includes('quota') || rawError.includes('credit') || rawError.includes('balance')) {
              safeMessage = 'fal.ai account credits exceeded or insufficient balance.';
            } else if (rawError.includes('Key') || rawError.includes('Unauthorized') || rawError.includes('auth')) {
              safeMessage = 'Authentication failed with fal.ai API. Please verify FAL_KEY in server environment.';
            }

            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: safeMessage,
              })
            );
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), falApiDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
});
