// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MONGO_URI = process.env.MONGODB_URI || 'your_mongo_connection_string';

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

const FixtureSchema = new mongoose.Schema({
  _id: String,
  //fixture_mid: String,
  season: Number,
  competition_name: String,
  fixture_datetime: Date,
  fixture_round: Number,
  home_team: String,
  away_team: String,
});
if (mongoose.models.Fixture) {
  delete mongoose.models.Fixture;
}
const Fixture = mongoose.models.Fixture || mongoose.model('Fixture', FixtureSchema);
export async function POST(req: NextRequest) {
    const filePath = '/tmp/upload.csv';
  
    try {
      const buffer = await req.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
  
      await connect();
  
      const results: any[] = [];
  
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            // Transform the data to use mid as _id
            const { fixture_mid, ...rest } = data;
            const transformedData = {
              _id: data.fixture_mid,
              ...rest
            };
            results.push(transformedData);
          })
          .on('end', async () => {
            try {
              const operations = results.map(doc => ({
                updateOne: {
                  filter: { _id: doc._id },
                  update: { $set: doc },
                  upsert: true
                }
              }));
              await Fixture.bulkWrite(operations);
              fs.unlinkSync(filePath);
              resolve(NextResponse.json({ message: 'Upload successful', count: results.length }));
            } catch (dbError) {
              console.log('Database error:', dbError);
              fs.unlinkSync(filePath);
              reject(NextResponse.json({ error: 'Database insert failed', details: dbError }, { status: 500 }));
            }
          })
          .on('error', (parseError) => {
            fs.unlinkSync(filePath);
            reject(NextResponse.json({ error: 'CSV parsing failed', details: parseError }, { status: 400 }));
          });
      });
  
    } catch (err) {
      return NextResponse.json({ error: 'File upload failed', details: err }, { status: 400 });
    }
  }
