'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
    const { user, userData, loading } = useAuth();
    console.log(userData);
    console.log(user)
    if (loading) return <div>Loading...</div>;
    if (!user || !userData) return <div>You must be logged in to view this page.</div>;
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Welcome, {userData.name}</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {userData.role}</p>

                <Link
                    href="/dashboard/profile"
                    className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard/profile" className="text-blue-500 hover:underline">
                                Update Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/users?role=${userData.role === 'student' ? 'professor' : 'student'}`}
                                className="text-blue-500 hover:underline"
                            >
                                {userData.role === 'student' ? 'Find Professors' : 'Find Students'}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-blue-500 hover:underline">
                                Research Opportunities
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <p className="text-gray-500">No recent activity</p>
                </div>
            </div>
        </div>
    );
}