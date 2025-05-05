import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongoose';
import { Fixture } from '@/models/fixture'

export async function GET(req: NextRequest) {
  await connect();
  const query = req.nextUrl.searchParams.get('q') || '';
  const results = await Fixture.find({
    $or: [
      { home_team: { $regex: query, $options: 'i' } },
      { away_team: { $regex: query, $options: 'i' } },
    ],
  }).limit(10);

  return NextResponse.json(results);
}
