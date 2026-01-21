const { createClient } = require('@supabase/supabase-js');

// Hardcoded for robustness
const supabaseUrl = 'https://cnolsezokdhpkkvjjwkd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2xzZXpva2RocGtrdmpqd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjQxODMsImV4cCI6MjA4MjQ0MDE4M30.7jZ9o403A9G-zBUhbB_oA49dc-MMzC72gyfenKrADko';

const supabase = createClient(supabaseUrl, supabaseKey);

const STUDENT_ID = '32751c81-48b4-4373-8608-92b2cb329d3c';

async function seedSquad() {
    console.log('🌱 Seeding Demo Squad...');

    // 1. Create Squad
    const SQUAD_ID = '00000000-0000-0000-0000-000000000001';

    const { data: squad, error: squadError } = await supabase
        .from('squads')
        .upsert({
            id: SQUAD_ID,
            name: 'Squad Alpha (Demo)',
            subject: 'Programación Avanzada'
        })
        .select()
        .single();

    if (squadError) {
        console.error('Error seeding squad:', squadError);
        return;
    }

    console.log('✅ Squad created:', squad.name);

    // 2. Add Member
    const { error: memberError } = await supabase
        .from('squad_members')
        .upsert({
            squad_id: SQUAD_ID,
            student_id: STUDENT_ID,
            role: 'Líder'
        });

    if (memberError) {
        console.error('Error adding member:', memberError);
    } else {
        console.log('✅ Student added to Squad!');
    }

    // 3. Add Message
    await supabase.from('squad_messages').insert([
        { squad_id: SQUAD_ID, sender_id: STUDENT_ID, content: '¡Hola equipo! Probando el chat S.O.S.' }
    ]);

    console.log('✅ Demo messages added.');
}

seedSquad();
