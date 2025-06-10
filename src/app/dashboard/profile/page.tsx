'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
    const { user, userData, refreshUserData } = useAuth();
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            console.log("userData:", userData);
            setFormData({
                name: userData.name || '',
                role: userData.role || 'student',
                country: userData.country || '',
                department: userData.department || '',
                studentData: userData.studentData || {
                    research_areas: [],
                    ielts_score: '',
                    gre: '',
                },
                professorData: userData.professorData || {
                    university: '',
                    isAccepting: false,
                    research_areas: [],
                    ielts_requirement: '',
                    gre_requirement: '',
                    google_scholar: '',
                },
            });
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value,
                },
            }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleResearchAreaChange = (index: number, value: string, type: 'student' | 'professor') => {
        setFormData((prev: any) => {
            const newAreas = [...prev[`${type}Data`].research_areas];
            newAreas[index] = value;
            return {
                ...prev,
                [`${type}Data`]: {
                    ...prev[`${type}Data`],
                    research_areas: newAreas,
                },
            };
        });
    };

    const addResearchArea = (type: 'student' | 'professor') => {
        setFormData((prev: any) => ({
            ...prev,
            [`${type}Data`]: {
                ...prev[`${type}Data`],
                research_areas: [...prev[`${type}Data`].research_areas, ''],
            },
        }));
    };

    const removeResearchArea = (index: number, type: 'student' | 'professor') => {
        setFormData((prev: any) => {
            const newAreas = [...prev[`${type}Data`].research_areas];
            newAreas.splice(index, 1);
            return {
                ...prev,
                [`${type}Data`]: {
                    ...prev[`${type}Data`],
                    research_areas: newAreas,
                },
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        setLoading(true);

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user?.uid,
                    ...formData,
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            await refreshUserData();
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Role Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role || 'student'}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="student">Student</option>
                                <option value="professor">Professor</option>
                            </select>
                        </div>

                        {/* Country Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Department Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>


                {formData.role === 'student' && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Student Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS Score</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    name="studentData.ielts_score"
                                    value={formData.studentData?.ielts_score || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GRE Score</label>
                                <input
                                    type="text"
                                    name="studentData.gre"
                                    value={formData.studentData?.gre || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Research Areas</label>
                            {formData.studentData?.research_areas?.map((area: string, index: number) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        value={area}
                                        onChange={(e) => handleResearchAreaChange(index, e.target.value, 'student')}
                                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeResearchArea(index, 'student')}
                                        className="ml-2 bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addResearchArea('student')}
                                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-600"
                            >
                                Add Research Area
                            </button>
                        </div>
                    </div>
                )}

                {formData.role === 'professor' && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Professor Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                <input
                                    type="text"
                                    name="professorData.university"
                                    value={formData.professorData?.university || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isAccepting"
                                    name="professorData.isAccepting"
                                    checked={formData.professorData?.isAccepting || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isAccepting" className="ml-2 block text-sm text-gray-700">
                                    Currently accepting students
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS Requirement</label>
                                <input
                                    type="text"
                                    name="professorData.ielts_requirement"
                                    value={formData.professorData?.ielts_requirement || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GRE Requirement</label>
                                <input
                                    type="text"
                                    name="professorData.gre_requirement"
                                    value={formData.professorData?.gre_requirement || ''}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar URL</label>
                            <input
                                type="url"
                                name="professorData.google_scholar"
                                value={formData.professorData?.google_scholar || ''}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Research Areas</label>
                            {formData.professorData?.research_areas?.map((area: string, index: number) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        value={area}
                                        onChange={(e) => handleResearchAreaChange(index, e.target.value, 'professor')}
                                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeResearchArea(index, 'professor')}
                                        className="ml-2 bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addResearchArea('professor')}
                                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-600"
                            >
                                Add Research Area
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}