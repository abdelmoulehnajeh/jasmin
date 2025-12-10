import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface PromoCodeRequest {
  code: string;
  discount: number;
  userEmail: string;
  userName: string;
  userPhone: string;
}

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

    // Check if promo code already exists
    const existingCode = await query(
      'SELECT code FROM promo_codes WHERE code = $1',
      [body.code]
    );

    if (existingCode.rows.length > 0) {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 409 }
      );
    }

    // Insert promo code into database
    const result = await query(
      `INSERT INTO promo_codes (code, discount, user_email, user_name, user_phone, used, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.code,
        body.discount,
        body.userEmail,
        body.userName,
        body.userPhone,
        false,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      ]
    );

    const promoData = result.rows[0];

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

    // Get promo code from database
    const result = await query(
      'SELECT * FROM promo_codes WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    const promoData = result.rows[0];

    // Check if promo code is expired
    const isExpired = promoData.expires_at && new Date(promoData.expires_at) < new Date();

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

    // Check if promo code exists
    const checkResult = await query(
      'SELECT * FROM promo_codes WHERE code = $1',
      [code]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Update the promo code in database
    const result = await query(
      `UPDATE promo_codes
       SET used = $1, used_at = CURRENT_TIMESTAMP
       WHERE code = $2
       RETURNING *`,
      [used, code]
    );

    const promoData = result.rows[0];

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
