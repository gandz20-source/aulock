import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cnolsezokdhpkkvjjwkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2xzZXpva2RocGtrdmpqd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQxODMsImV4cCI6MjA4MjQ0MDE4M30.7jZ9o403A9G-zBUhbB_oA49dc-MMzC72gyfenKrADko';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testStatsLogic() {
    console.log('📊 Testing Dashboard V2 Stats Logic...');

    // Simulate fetchClassStats
    const { data: students, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, stats')
        .eq('role', 'alumno'); // Or whatever role we used for testing, maybe 'superadmin' has stats too from previous test

    if (error) {
        console.error('❌ Error fetching profiles:', error);
        return;
    }

    console.log(`✅ Fetched ${students.length} profiles.`);
    students.forEach(s => console.log(`   - ${s.full_name}:`, s.stats));

    // Aggregation Logic
    const totals = { Logic: 0, Creativity: 0, Resilience: 0, Communication: 0, Empathy: 0, Ethics: 0 };
    let count = 0;

    students.forEach(s => {
        if (s.stats) {
            count++;
            totals.Logic += s.stats.logic || 0;
            totals.Creativity += s.stats.creativity || 0;
            totals.Resilience += s.stats.resilience || 0;
            totals.Communication += s.stats.communication || 0;
            totals.Empathy += s.stats.empathy || 0;
            totals.Ethics += s.stats.ethics || 0;
        }
    });

    if (count > 0) {
        const averages = Object.keys(totals).map(key => ({
            subject: key,
            A: Math.round(totals[key] / count),
            fullMark: 100
        }));
        console.log('\n📈 Calculated Class Averages (Radar Data):');
        console.table(averages);
    } else {
        console.warn('⚠️ No students with stats found. Radar will be empty.');
    }
}

testStatsLogic();
