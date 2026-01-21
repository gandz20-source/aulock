const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDatabase() {
    try {
        console.log('🔧 Setting up database...');

        // Check if data already exists
        const existingSchool = await prisma.school.findFirst();

        if (existingSchool) {
            console.log('✅ Database already initialized');
            return;
        }

        console.log('🌱 Seeding database with initial data...');

        // Create school
        const school = await prisma.school.create({
            data: { name: "Colegio San José" }
        });
        console.log('✅ Created school:', school.name);

        // Create teacher
        const teacher = await prisma.user.create({
            data: {
                email: "profe@colegio.cl",
                password: "123456",
                name: "María González",
                role: "teacher",
                schoolId: school.id
            }
        });
        console.log('✅ Created teacher:', teacher.name);

        // Create courses
        await prisma.course.createMany({
            data: [
                { name: "Matemáticas", grade: "5° Básico", schoolId: school.id },
                { name: "Lenguaje", grade: "6° Básico", schoolId: school.id },
                { name: "Ciencias", grade: "5° Básico", schoolId: school.id }
            ]
        });
        console.log('✅ Created 3 courses');

        console.log('\n🎉 Database setup complete!');
        console.log('\n📝 Login credentials:');
        console.log('   Email: profe@colegio.cl');
        console.log('   Password: 123456\n');

    } catch (error) {
        console.error('❌ Setup error:', error.message);
        throw error;
    }
}

module.exports = { setupDatabase };
