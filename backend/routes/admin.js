const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

async function readData() {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/admin/schools - List all schools
router.get('/schools', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.schools);
    } catch (error) {
        console.error('Get schools error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/schools - Create school
router.post('/schools', async (req, res) => {
    try {
        const { name } = req.body;
        const data = await readData();

        const newSchool = {
            id: Date.now().toString(),
            name
        };

        data.schools.push(newSchool);
        await writeData(data);

        res.json(newSchool);
    } catch (error) {
        console.error('Create school error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/schools/:id - Update school
router.put('/schools/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const data = await readData();

        const school = data.schools.find(s => s.id === id);
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        school.name = name;
        await writeData(data);

        res.json(school);
    } catch (error) {
        console.error('Update school error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/schools/:id - Delete school
router.delete('/schools/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();

        data.schools = data.schools.filter(s => s.id !== id);
        // Also remove related users, courses, and sessions
        data.users = data.users.filter(u => u.schoolId !== id);
        data.courses = data.courses.filter(c => c.schoolId !== id);

        await writeData(data);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete school error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/admin/teachers - List all teachers
router.get('/teachers', async (req, res) => {
    try {
        const data = await readData();
        const teachers = data.users
            .filter(u => u.role === 'teacher')
            .map(t => ({
                ...t,
                school: data.schools.find(s => s.id === t.schoolId)
            }));
        res.json(teachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/teachers - Create teacher
router.post('/teachers', async (req, res) => {
    try {
        const { name, email, password, schoolId } = req.body;
        const data = await readData();

        const newTeacher = {
            id: Date.now().toString(),
            email,
            password,
            name,
            role: 'teacher',
            schoolId
        };

        data.users.push(newTeacher);
        await writeData(data);

        const school = data.schools.find(s => s.id === schoolId);
        res.json({ ...newTeacher, school });
    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/teachers/:id - Delete teacher
router.delete('/teachers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();

        data.users = data.users.filter(u => u.id !== id);
        // Also remove teacher's sessions
        data.sessions = data.sessions.filter(s => s.teacherId !== id);

        await writeData(data);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/courses - Create course
router.post('/courses', async (req, res) => {
    try {
        const { name, grade, schoolId } = req.body;
        const data = await readData();

        const newCourse = {
            id: Date.now().toString(),
            name,
            grade,
            schoolId
        };

        data.courses.push(newCourse);
        await writeData(data);

        res.json(newCourse);
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
