const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeData() {
    try {
        await fs.access(DATA_FILE);
        console.log('✅ Data file exists');
    } catch {
        console.log('🔧 Creating initial data file...');
        const initialData = {
            schools: [
                { id: "1", name: "Colegio San José" }
            ],
            users: [
                {
                    id: "1",
                    email: "profe@colegio.cl",
                    password: "123456",
                    name: "María González",
                    role: "teacher",
                    schoolId: "1"
                }
            ],
            courses: [
                { id: "1", name: "Matemáticas", grade: "5° Básico", schoolId: "1" },
                { id: "2", name: "Lenguaje", grade: "6° Básico", schoolId: "1" },
                { id: "3", name: "Ciencias", grade: "5° Básico", schoolId: "1" }
            ],
            sessions: []
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('✅ Data file created with initial data');
        console.log('\n📝 Login credentials:');
        console.log('   Email: profe@colegio.cl');
        console.log('   Password: 123456\n');
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Aulock Tracker API is running!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const sessionsRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

// Start server
async function main() {
    try {
        await initializeData();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

main();
