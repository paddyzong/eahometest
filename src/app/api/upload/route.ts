// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import csv from 'csv-parser';
import { connect } from '@/lib/mongoose';
import { Fixture } from '@/models/fixture'
import type { Fixture as FixtureType } from '@/types/fixture';

export async function POST(req: NextRequest) : Promise<Response>{
    const filePath = '/tmp/upload.csv';
  
    try {
      const buffer = await req.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
  
      await connect();
      
      const results: FixtureType[] = [];      

      return new Promise<Response>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            console.log('CSV data:', data);
            const { fixture_mid, ...rest } = data;
            const transformedData = {
              _id: fixture_mid,
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
              console.log('Bulk write successful');
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
            reject(NextResponse.json({ error: 'CSV parsing failed', details: parseError }, { status: 500 }));
          });
      });
  
    } catch (err) {
      return NextResponse.json({ error: 'File upload failed', details: err }, { status: 500 });
    }
  }
