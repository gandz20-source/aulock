import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cnolsezokdhpkkvjjwkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2xzZXpva2RocGtrdmpqd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQxODMsImV4cCI6MjA4MjQ0MDE4M30.7jZ9o403A9G-zBUhbB_oA49dc-MMzC72gyfenKrADko';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAdmin() {
    console.log('🔍 Checking Admin Status for contacto@aulock.cl...');

    // 1. Check Profiles table for the email
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'contacto@aulock.cl');

    if (profileError) {
        console.error('❌ Error fetching profile:', profileError.message);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('❌ User "contacto@aulock.cl" not found in "profiles" table.');
    } else {
        const user = profiles[0];
        console.log('✅ User found in profiles:', user);
        console.log(`- Role: ${user.role}`);
        console.log(`- School ID: ${user.school_id}`);

        if (user.role === 'superadmin' && user.school_id) {
            console.log('🎉 Status: READY. User is correctly set up.');
        } else {
            console.log('⚠️ Status: INCOMPLETE. User exists but role or school might be wrong.');
        }
    }
}

checkAdmin();
