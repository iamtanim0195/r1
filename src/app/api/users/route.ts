//src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import User from '@/lib/models/User';

// GET: Fetch all users or a specific user by uid
export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    try {
        if (uid) {
            const user = await User.findOne({ uid });
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json(user);
        } else {
            const users = await User.find({});
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('Error fetching user(s):', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST: Create a new user
export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const newUser = new User(body);
        await newUser.save();
        return NextResponse.json(newUser);
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// PUT: Update an existing user by uid
export async function PUT(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { uid, ...updateData } = body;

        const updatedUser = await User.findOneAndUpdate(
            { uid },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Utility function (optional)
export const getUserData = async (uid: string) => {
    await dbConnect();
    const user = await User.findOne({ uid });
    return user ? user.toObject() : null;
};
