const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

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
    const course1 = await prisma.course.create({
        data: {
            name: "Matemáticas",
            grade: "5° Básico",
            schoolId: school.id
        }
    });
    console.log('✅ Created course:', course1.name);

    const course2 = await prisma.course.create({
        data: {
            name: "Lenguaje",
            grade: "6° Básico",
            schoolId: school.id
        }
    });
    console.log('✅ Created course:', course2.name);

    const course3 = await prisma.course.create({
        data: {
            name: "Ciencias",
            grade: "5° Básico",
            schoolId: school.id
        }
    });
    console.log('✅ Created course:', course3.name);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: profe@colegio.cl');
    console.log('   Password: 123456');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
