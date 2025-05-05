export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongoose';
import { Fixture } from '@/models/fixture';

export async function GET(req: NextRequest) {
  await connect();

  const query = req.nextUrl.searchParams.get('q') || '';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = 30; 
  
  const skip = (page - 1) * limit;
  
  try {
    const results = await Fixture.find({
      $or: [
        { home_team: { $regex: query, $options: 'i' } },
        { away_team: { $regex: query, $options: 'i' } },
      ],
    })
      .skip(skip)
      .limit(30)
      .lean();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching fixtures:', error);
    return NextResponse.json({ error: 'Failed to search fixtures' }, { status: 500 });
  }
}
