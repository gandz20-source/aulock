import { createClient } from '@supabase/supabase-js';

// Configuration (Hardcoded for this test script only)
const SUPABASE_URL = 'https://cnolsezokdhpkkvjjwkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2xzZXpva2RocGtrdmpqd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQxODMsImV4cCI6MjA4MjQ0MDE4M30.7jZ9o403A9G-zBUhbB_oA49dc-MMzC72gyfenKrADko';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyBackend() {
    console.log('🧪 Starting Gemini V2 Backend Verification...');

    // 1. Get a valid user (admin)
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'contacto@aulock.cl') // Using admin for test
        .single();

    if (profileError || !profiles) {
        console.error('❌ Could not find test user "contacto@aulock.cl".');
        return;
    }

    const userId = profiles.id;
    console.log(`👤 Using Test User ID: ${userId}`);

    // 2. Test XP Update RPC
    console.log('🔄 Testing RPC: update_human_core_xp...');
    const testUpdate = { "creativity": 10, "logic": 5, "resilience": 20 };

    const { error: rpcError } = await supabase.rpc('update_human_core_xp', {
        user_id: userId,
        xp_updates: testUpdate
    });

    if (rpcError) {
        console.error('❌ RPC Failed:', rpcError.message);
    } else {
        console.log('✅ RPC Execution Successful.');
        // Verify stats update
        const { data: updatedProfile } = await supabase.from('profiles').select('stats').eq('id', userId).single();
        console.log('📊 Current Stats:', updatedProfile.stats);
    }

    // 3. Test Mental Health Alert Insert
    console.log('🛡️ Testing Alert System...');
    const { error: alertError } = await supabase
        .from('mental_health_alerts')
        .insert({
            user_id: userId,
            flag: 'TEST_ANXIETY_FLAG',
            context: '{"trigger": "unit_test"}'
        });

    if (alertError) {
        console.error('❌ Alert Insertion Failed:', alertError.message);
    } else {
        console.log('✅ Alert Inserted Successfully.');
    }
}

verifyBackend();
