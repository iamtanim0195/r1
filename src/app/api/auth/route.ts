import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import dbConnect from '@/lib/mongodb/connect';
import User from '@/lib/models/User';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            email,
            password,
            action,
            name,
            role,
        } = body;

        await dbConnect();

        if (action === 'signup') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const existingUser = await User.findOne({ uid: firebaseUser.uid });
            if (!existingUser) {
                const newUserData: any = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name,
                    role,
                    
                };

                // Add role-specific fields
                if (role === 'student') {
                    newUserData.studentData = {
                        research_areas: body.research_areas || [],
                        ielts_score: body.ielts_score || undefined,
                        gre: body.gre || undefined,
                    };
                } else if (role === 'professor') {
                    newUserData.professorData = {
                        university: body.university || '',
                        isAccepting: body.isAccepting || false,
                        research_areas: body.research_areas || [],
                        ielts_requirement: body.ielts_requirement || '',
                        gre_requirement: body.gre_requirement || '',
                        google_scholar: body.google_scholar || '',
                    };
                }

                const newUser = new User(newUserData);
                await newUser.save();
            }

            return NextResponse.json({ user: firebaseUser });
        }

        if (action === 'login') {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return NextResponse.json({ user: userCredential.user });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
