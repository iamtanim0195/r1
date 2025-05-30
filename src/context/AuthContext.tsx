'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import axios from 'axios';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUserData = async () => {
        if (!user?.uid) return;
        try {
            const res = await axios.get(`/api/user/${user.uid}`);
            setUserData(res.data);
        } catch (err) {
            console.error('Error refreshing user data:', err);
        }
    };

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const res = await axios.get(`/api/user/${firebaseUser.uid}`);
                    setUserData(res.data);
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    setUserData(null);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
