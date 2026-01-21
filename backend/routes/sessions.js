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

// GET /api/sessions?teacherId=xxx
router.get('/', async (req, res) => {
    const { teacherId } = req.query;

    try {
        const data = await readData();

        const sessions = data.sessions
            .filter(s => s.teacherId === teacherId)
            .map(s => ({
                ...s,
                course: data.courses.find(c => c.id === s.courseId)
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        res.json(sessions);
    } catch (error) {
        console.error('Sessions GET error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/sessions
router.post('/', async (req, res) => {
    const { date, duration, studentsCount, courseId, teacherId, notes } = req.body;

    try {
        const data = await readData();

        const newSession = {
            id: Date.now().toString(),
            date,
            duration,
            studentsCount,
            courseId,
            teacherId,
            notes,
            createdAt: new Date().toISOString()
        };

        data.sessions.push(newSession);
        await writeData(data);

        const course = data.courses.find(c => c.id === courseId);
        res.json({ ...newSession, course });
    } catch (error) {
        console.error('Sessions POST error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
