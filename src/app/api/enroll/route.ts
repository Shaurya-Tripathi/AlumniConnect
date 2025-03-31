import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { enrollmentNumber } = body;

    if (!enrollmentNumber || isNaN(Number(enrollmentNumber))) {
      return NextResponse.json(
        { success: false, error: 'Invalid enrollment number' },
        { status: 400 }
      );
    }

    // MongoDB connection
    const uri = process.env.ENROLL_URL;
    if (!uri) {
      return NextResponse.json(
        { success: false, error: 'Database connection string is missing' },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('Alumni_InterConnect'); // Ensure correct DB name
    const collection = database.collection('verifications');

    // Find enrollment number in the database
    const verification = await collection.findOne(
      { enrollment: Number(enrollmentNumber) },
      { projection: { _id: 0, username: 1, email: 1, branchInfo: 1 } } // Return only required fields
    );

    await client.close();

    if (verification) {
      return NextResponse.json({
        success: true,
        message: 'Enrollment number verified successfully',
        data: verification,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Enrollment number not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
