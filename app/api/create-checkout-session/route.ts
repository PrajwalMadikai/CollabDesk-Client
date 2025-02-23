import stripe from "@/lib/stripeInit";

export async function POST(req: Request) {
    try {
        const { planType, amount } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${planType === 'base' ? 'Base' : 'Premium'} Plan Subscription`,
                        },
                        unit_amount: amount * 100, 
                        recurring: {
                            interval: 'month',  
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',  
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
            metadata: {
                planType, 
            },
        });

        return new Response(JSON.stringify({ sessionUrl: session.url }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}