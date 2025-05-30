// src/app/api/user/[uid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import User from '@/lib/models/User';

// GET /api/user/:uid
export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
    try {
        const { uid } = params;

        await dbConnect();
        const user = await User.findOne({ uid });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/user/[uid]:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
