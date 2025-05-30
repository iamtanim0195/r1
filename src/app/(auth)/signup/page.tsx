'use client';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'student' | 'professor'>('student');
    const [researchAreas, setResearchAreas] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const researchArray = researchAreas.split(',').map(area => area.trim());

        try {
            // Step 1: Create the user in your backend
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'signup',
                    email,
                    password,
                    name,
                    role,
                    research_areas: researchArray
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');

            // Step 2: Sign in with Firebase
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, email, password);

            toast.success('Account created and logged in!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="text-black min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />

                    <div className="flex gap-4">
                        <label><input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} /> Student</label>
                        <label><input type="radio" name="role" value="professor" checked={role === 'professor'} onChange={() => setRole('professor')} /> Professor</label>
                    </div>

                    <input
                        type="text"
                        placeholder="Research Areas (comma separated)"
                        value={researchAreas}
                        onChange={e => setResearchAreas(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
                </div>
            </div>
        </div>
    );
}
