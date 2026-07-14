type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

export async function loadRazorpaySdk(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Razorpay is only available in the browser.");
  }

  if (window.Razorpay) {
    return;
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay. Please try again."));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export async function createRazorpayCheckout(options: RazorpayCheckoutOptions) {
  await loadRazorpaySdk();
  if (!window.Razorpay) {
    throw new Error("Razorpay could not be initialized.");
  }

  return new window.Razorpay(options);
}
