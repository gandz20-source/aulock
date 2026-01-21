import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, schools(name)')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password (for teachers and admins)
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // Sign in with QR token (for students)
    const signInWithToken = async (token) => {
        try {
            // First, verify the token exists and is active
            const { data: tokenData, error: tokenError } = await supabase
                .from('qr_tokens')
                .select('user_id, is_active, expires_at')
                .eq('token', token)
                .single();

            if (tokenError) throw new Error('Token inválido');
            if (!tokenData.is_active) throw new Error('Token desactivado');
            if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
                throw new Error('Token expirado');
            }

            // Get the user's email from their profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', tokenData.user_id)
                .single();

            if (profileError) throw new Error('Usuario no encontrado');

            // Create a magic link session for the user
            // Note: This requires setting up a custom auth flow in Supabase
            // For now, we'll use a temporary password approach
            // In production, you'd want to implement a custom token-based auth

            return {
                data: { userId: tokenData.user_id },
                error: null,
                requiresSetup: true // Flag to indicate we need to complete setup
            };
        } catch (error) {
            return { data: null, error };
        }
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            setProfile(null);
        }
        return { error };
    };

    // Sign up (for creating new users)
    const signUp = async (email, password, userData) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData, // This will be used by the trigger to create profile
                },
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const value = {
        user,
        profile,
        loading,
        signIn,
        signInWithToken,
        signOut,
        signUp,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
