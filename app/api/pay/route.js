import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const transactionId = body.transactionId || `tx_${Math.random().toString(36).substring(2, 12)}`;

    // Random number between 0 and 1
    const rand = Math.random();

    // 15% chance of timeout (after 8 seconds)
    // 0.85 to 1.00
    if (rand > 0.85) {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return NextResponse.json(
        { 
          status: 'timeout', 
          message: 'The gateway connection timed out. Please try again.',
          transactionId
        },
        { status: 408 }
      );
    }

    // 25% chance of failure
    // 0.60 to 0.85
    if (rand > 0.60) {
      // Small simulated network delay for failed response
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const failureReasons = [
        'Insufficient funds',
        'Card declined by issuer',
        'Invalid CVV',
        'Fraud prevention triggered'
      ];
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      return NextResponse.json(
        { 
          status: 'failed', 
          message: 'Payment failed.', 
          reason: randomReason,
          transactionId
        },
        { status: 400 }
      );
    }

    // 60% chance of success
    // 0.00 to 0.60
    // Small simulated network delay for success response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Payment processed successfully.',
        transactionId: transactionId,
        amount: body.amount,
        currency: body.currency,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request format.' },
      { status: 400 }
    );
  }
}
