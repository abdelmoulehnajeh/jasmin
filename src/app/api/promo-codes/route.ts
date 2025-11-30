import { NextRequest, NextResponse } from 'next/server';

interface PromoCodeRequest {
  code: string;
  discount: number;
  userEmail: string;
  userName: string;
  userPhone: string;
}

// In-memory storage for promo codes (in production, use a database)
const promoCodes: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: PromoCodeRequest = await request.json();

    // Validate required fields
    if (!body.code || !body.discount || !body.userEmail || !body.userName || !body.userPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the promo code with user information
    const promoData = {
      code: body.code,
      discount: body.discount,
      userEmail: body.userEmail,
      userName: body.userName,
      userPhone: body.userPhone,
      createdAt: new Date().toISOString(),
      used: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    promoCodes.set(body.code, promoData);

    return NextResponse.json(
      {
        success: true,
        message: 'Promo code saved successfully',
        promoCode: promoData
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving promo code:', error);
    return NextResponse.json(
      { error: 'Failed to save promo code' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    const promoData = promoCodes.get(code);

    if (!promoData) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Check if promo code is expired
    const isExpired = new Date(promoData.expiresAt) < new Date();

    if (isExpired) {
      return NextResponse.json(
        { error: 'Promo code has expired' },
        { status: 410 }
      );
    }

    // Check if already used
    if (promoData.used) {
      return NextResponse.json(
        { error: 'Promo code has already been used' },
        { status: 410 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        promoCode: promoData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving promo code:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve promo code' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, used } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    const promoData = promoCodes.get(code);

    if (!promoData) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Update the promo code
    promoData.used = used;
    promoData.usedAt = new Date().toISOString();
    promoCodes.set(code, promoData);

    return NextResponse.json(
      {
        success: true,
        message: 'Promo code updated successfully',
        promoCode: promoData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}
