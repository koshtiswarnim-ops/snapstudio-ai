declare global {
  interface Window {
    Razorpay: any;
  }
}

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SnapStudioMockKey';

export interface RazorpayOptions {
  amountINR: number;
  planName: string;
  credits: number;
  userEmail: string;
  userName: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (errorMsg: string) => void;
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  const { amountINR, planName, credits, userEmail, userName, onSuccess, onFailure } = options;

  // Amount in paise (1 INR = 100 Paise)
  const amountPaise = amountINR * 100;
  const mockOrderId = `order_${Math.random().toString(36).substring(2, 10)}`;

  if (typeof window.Razorpay === 'undefined') {
    // If Razorpay SDK failed to load or in offline environment, trigger simulated payment confirmation
    console.warn('Razorpay SDK not loaded. Triggering simulated payment dialog.');
    const confirmed = window.confirm(
      `[SIMULATION MODE]\nComplete payment of ₹${amountINR} for ${planName} (${credits} Credits)?\n\nClick OK to simulate successful Razorpay payment.`
    );
    if (confirmed) {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      onSuccess(mockPaymentId, mockOrderId);
    } else {
      onFailure('Payment was cancelled by user.');
    }
    return;
  }

  const razorpayConfig = {
    key: razorpayKeyId,
    amount: amountPaise,
    currency: 'INR',
    name: 'SnapStudio AI',
    description: `${credits} Generation Credits — ${planName}`,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    order_id: '', // Generated via backend/n8n in real production flow
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: '#4FD8E8',
      backdrop_color: '#06070A',
    },
    handler: function (response: any) {
      if (response.razorpay_payment_id) {
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id || mockOrderId);
      } else {
        onFailure('Razorpay response missing payment token');
      }
    },
    modal: {
      ondismiss: function () {
        onFailure('Payment window closed by user.');
      },
    },
  };

  try {
    const rzp = new window.Razorpay(razorpayConfig);
    rzp.open();
  } catch (err: any) {
    onFailure(err?.message || 'Failed to open Razorpay payment modal');
  }
}
