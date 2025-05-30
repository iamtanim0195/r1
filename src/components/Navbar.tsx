'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navbar() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    if (loading) return null;

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Ola Research
                </Link>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:underline">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/profile" className="hover:underline">
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">
                                Login
                            </Link>
                            <Link href="/signup" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}