
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cnolsezokdhpkkvjjwkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2xzZXpva2RocGtrdmpqd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQxODMsImV4cCI6MjA4MjQ0MDE4M30.7jZ9o403A9G-zBUhbB_oA49dc-MMzC72gyfenKrADko';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnose() {
    console.log('🔍 Starting Deep Diagnosis...');

    // 1. Check Schools
    const { data: schools, error: schoolError } = await supabase.from('schools').select('*').limit(1);
    if (schoolError) {
        console.error('❌ Table "schools" check failed:', schoolError.message);
    } else {
        console.log('✅ Table "schools" exists.');
    }

    // 2. Check Profiles
    const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').limit(1);
    if (profileError) {
        console.error('❌ Table "profiles" check failed:', profileError.message);
    } else {
        console.log('✅ Table "profiles" exists.');
    }

    // 3. Attempt Insert (Trigger Test)
    const randomEmail = `test_${Date.now()}@test.com`;
    console.log(`\n👤 Attempting to create user: ${randomEmail}`);
    const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: 'Password123!',
        options: {
            data: { full_name: 'Test', role: 'alumno' }
        }
    });

    if (error) {
        console.error('❌ Creation failed:', error.message);
        console.log('\n💡 SUGGESTION: The "handle_new_user" trigger might be broken or referencing a missing column.');
    } else {
        console.log('✅ User created successfully!');
    }
}

diagnose();
