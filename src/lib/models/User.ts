import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
    uid: string;
    email: string;
    role: 'student' | 'professor';
    name: string;
    studentData?: {
        research_areas: string[];
        ielts_score?: number;
        gre?: string;
    };
    professorData?: {
        university?: string;
        isAccepting: boolean;
        research_areas: string[];
        ielts_requirement?: string;
        gre_requirement?: string;
        google_scholar?: string;
    };
}

const UserSchema = new Schema<IUser>({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'professor'], required: true },
    name: { type: String, required: true },
    studentData: {
        research_areas: { type: [String], default: [] },
        ielts_score: Number,
        gre: String,
    },
    professorData: {
        university: String,
        isAccepting: { type: Boolean, default: false },
        research_areas: { type: [String], default: [] },
        ielts_requirement: String,
        gre_requirement: String,
        google_scholar: String,
    },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
