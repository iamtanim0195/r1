'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface User {
    uid: string;
    name: string;
    email: string;
    role: 'student' | 'professor';
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

export default function UsersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role') as 'student' | 'professor' | null;

    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState({
        researchAreas: '',
        ielts: '',
        gre: '',
    });

    // Toggle role between student and professor
    const toggleRole = () => {
        const newRole = roleParam === 'student' ? 'professor' : 'student';
        router.push(`/users?role=${newRole}`);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/users');
                const data = await res.json();

                const oppositeRole = roleParam === 'student' ? 'professor' : 'student';
                const filteredByRole = data.filter((u: User) => u.role === oppositeRole);
                setUsers(filteredByRole);
                setFiltered(filteredByRole);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        if (roleParam === 'student' || roleParam === 'professor') {
            fetchUsers();
        }
    }, [roleParam]);

    const handleSearch = () => {
        const researchAreas = search.researchAreas
            .split(',')
            .map(area => area.trim().toLowerCase())
            .filter(Boolean);

        const ieltsValue = parseFloat(search.ielts);
        const greValue = search.gre.trim().toLowerCase();

        const result = users.filter((user: User) => {
            const data = user.role === 'student' ? user.studentData : user.professorData;
            const userResearch = (data?.research_areas || []).map(r => r.toLowerCase());

            const researchMatch =
                researchAreas.length === 0 || researchAreas.some(area => userResearch.includes(area));

            const ieltsMatch = !ieltsValue
                ? true
                : roleParam === 'student'
                    ? parseFloat(data?.ielts_requirement || '0') <= ieltsValue
                    : parseFloat(data?.ielts_score || '0') >= ieltsValue;

            const greMatch = !greValue
                ? true
                : roleParam === 'student'
                    ? (data?.gre_requirement || '').toLowerCase() === greValue
                    : (data?.gre || '').toLowerCase() === greValue;

            return researchMatch && ieltsMatch && greMatch;
        });

        setFiltered(result);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    Explore {roleParam === 'student' ? 'Professors' : 'Students'}
                </h1>
                {roleParam && (
                    <button
                        onClick={toggleRole}
                        className="text-blue-600 underline text-sm"
                    >
                        {roleParam === 'student' ? 'Find Students' : 'Find Professors'}
                    </button>
                )}
            </div>

            {/* Search Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Research areas (comma separated)"
                    className="border p-2 w-full"
                    value={search.researchAreas}
                    onChange={(e) => setSearch({ ...search, researchAreas: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="IELTS score"
                    className="border p-2 w-full"
                    value={search.ielts}
                    onChange={(e) => setSearch({ ...search, ielts: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="GRE (e.g. Taken, Not Taken)"
                    className="border p-2 w-full"
                    value={search.gre}
                    onChange={(e) => setSearch({ ...search, gre: e.target.value })}
                />
                <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Search
                </button>
            </div>

            {/* Cards */}
            {loading ? (
                <p>Loading...</p>
            ) : filtered.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filtered.map((user) => (
                        <div key={user.uid} className="text-black border p-4 rounded shadow-sm bg-white">
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="mt-2 text-sm">
                                <p><strong>Role:</strong> {user.role}</p>
                                {user.role === 'student' && (
                                    <>
                                        <p><strong>Research:</strong> {user.studentData?.research_areas?.join(', ')}</p>
                                        <p><strong>IELTS:</strong> {user.studentData?.ielts_score || 'N/A'}</p>
                                        <p><strong>GRE:</strong> {user.studentData?.gre || 'N/A'}</p>
                                    </>
                                )}
                                {user.role === 'professor' && (
                                    <>
                                        <p><strong>University:</strong> {user.professorData?.university || 'N/A'}</p>
                                        <p><strong>Research:</strong> {user.professorData?.research_areas?.join(', ')}</p>
                                        <p><strong>IELTS Requirement:</strong> {user.professorData?.ielts_requirement || 'N/A'}</p>
                                        <p><strong>GRE Requirement:</strong> {user.professorData?.gre_requirement || 'N/A'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
