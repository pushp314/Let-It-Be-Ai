"use client";
import { useToast } from '../ui/use-toast';
import { checkoutCredits } from '../../lib/actions/transaction.action';
import { Button } from '../ui/button';

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };
    const response = await checkoutCredits(transaction);
    const { order } = response;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Imaginify',
      description: 'Test Transaction',
      order_id: order.id,
      handler: async function (response: any) {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        const result = await fetch('/api/webhooks/razorpay/verify', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });
        const res = await result.json();
        if (res.status === 'success') {
          toast({
            title: 'Payment successful!',
            description: 'Your credits have been updated.',
            duration: 5000,
            className: 'success-toast'
          });
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onCheckout(); }} method="POST">
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;