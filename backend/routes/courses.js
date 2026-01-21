const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

async function readData() {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// GET /api/courses?schoolId=xxx
router.get('/', async (req, res) => {
    const { schoolId } = req.query;

    try {
        const data = await readData();
        const courses = data.courses.filter(c => c.schoolId === schoolId);
        res.json(courses);
    } catch (error) {
        console.error('Courses error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
