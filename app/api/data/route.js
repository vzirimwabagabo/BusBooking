import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'app', 'data', 'bookings.json');

function readData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Initialize with empty schema if missing
      const defaultData = { bookings: [], takenSeats: {} };
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = fileContent.trim() ? JSON.parse(fileContent) : {};
    const bookings = parsed.bookings || [];
    
    const derivedTaken = {};
    bookings.forEach(b => {
      if (b.status === "confirmed") {
        const tripKey = `${b.tripId}_${b.date}_${b.time}`;
        if (!derivedTaken[tripKey]) derivedTaken[tripKey] = [];
        derivedTaken[tripKey].push(...b.seats);
      }
    });

    return {
      bookings,
      takenSeats: derivedTaken
    };
  } catch (err) {
    console.error('Failed to read bookings.json', err);
    return { bookings: [], takenSeats: {} };
  }
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(request) {
  try {
    const body = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to write bookings.json', err);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
