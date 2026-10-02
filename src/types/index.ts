export type BackgroundStyle = 'clean-white' | 'light-neutral' | 'soft-studio' | 'minimal-premium';
export type AspectRatio = '1:1' | '4:5' | '16:9';
export type QualityMode = 'standard' | 'high';
export type GenerationStatus = 'idle' | 'uploading' | 'processing' | 'ai-generating' | 'finalizing' | 'completed' | 'failed';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  available_credits: number;
  total_used: number;
  updated_at: string;
}

export interface GenerationRecord {
  id: string;
  user_id: string;
  original_image_url: string;
  generated_image_url?: string;
  selected_style: BackgroundStyle;
  aspect_ratio: AspectRatio;
  quality: QualityMode;
  status: GenerationStatus;
  prompt_summary?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  razorpay_payment_id?: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  plan: string;
  credits_added: number;
  status: 'created' | 'paid' | 'failed';
  created_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  razorpay_subscription_id?: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
}

export interface StyleOption {
  id: BackgroundStyle;
  name: string;
  description: string;
  tag: string;
  previewGradient: string;
  recommendedFor: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceINR: number;
  credits: number;
  badge?: string;
  features: string[];
  recommended?: boolean;
}
