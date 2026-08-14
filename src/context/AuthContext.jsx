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

// Default Demo Fallback Profile
const DEFAULT_DEMO_PROFILE = {
    id: 'demo-user-123',
    email: 'contacto@aulock.cl',
    role: 'alumno',
    full_name: 'Juan Carlos Pérez',
    stats: {
        logic: 94,
        communication: 90,
        naturalSciences: 50,
        humanities: 72,
        creativity: 88,
        resilience: 80
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('aulock_demo_user');
        return saved ? JSON.parse(saved) : { id: DEFAULT_DEMO_PROFILE.id, email: DEFAULT_DEMO_PROFILE.email };
    });

    const [profile, setProfileState] = useState(() => {
        const saved = localStorage.getItem('aulock_demo_profile');
        return saved ? JSON.parse(saved) : DEFAULT_DEMO_PROFILE;
    });

    const [loading, setLoading] = useState(false);

    const setProfile = (newProfile) => {
        if (typeof newProfile === 'function') {
            setProfileState(prev => {
                const updated = newProfile(prev);
                localStorage.setItem('aulock_demo_profile', JSON.stringify(updated));
                return updated;
            });
        } else {
            setProfileState(newProfile);
            localStorage.setItem('aulock_demo_profile', JSON.stringify(newProfile));
        }
    };

    const setDemoUser = (newUser) => {
        setUser(newUser);
        localStorage.setItem('aulock_demo_user', JSON.stringify(newUser));
    };

    useEffect(() => {
        // Try getting real session from Supabase if connected
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setDemoUser(session.user);
                fetchProfile(session.user.id);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setDemoUser(session.user);
                fetchProfile(session.user.id);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, schools(name)')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
            }
        } catch (error) {
            console.warn('Using local fallback profile:', error);
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!error && data?.user) {
                setDemoUser(data.user);
                return { data, error: null };
            }
        } catch (error) {
            console.warn('Supabase signin error, using local fallback');
        }

        // Local fallback authentication
        const role = email.includes('profesor') ? 'profesor' : email.includes('colegio') || email.includes('admin') ? 'superadmin' : 'alumno';
        const name = email.includes('profesor') ? 'Prof. María González' : email.includes('colegio') || email.includes('admin') ? 'Dirección Colegio San Agustín' : 'Juan Carlos Pérez';
        
        const localUser = { id: 'local-' + Date.now(), email };
        const localProfile = { id: localUser.id, email, role, full_name: name, stats: DEFAULT_DEMO_PROFILE.stats };
        
        setDemoUser(localUser);
        setProfile(localProfile);
        
        return { data: { user: localUser }, error: null };
    };

    const signInWithToken = async (token) => {
        return { data: { userId: DEFAULT_DEMO_PROFILE.id }, error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setDemoUser({ id: DEFAULT_DEMO_PROFILE.id, email: DEFAULT_DEMO_PROFILE.email });
        setProfile(DEFAULT_DEMO_PROFILE);
        return { error: null };
    };

    const signUp = async (email, password, userData) => {
        return { data: { user: { id: 'new-user', email } }, error: null };
    };

    const value = {
        user,
        profile,
        loading,
        setProfile,
        setUser: setDemoUser,
        signIn,
        signInWithToken,
        signOut,
        signUp,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
