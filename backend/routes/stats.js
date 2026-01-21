const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

async function readData() {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// GET /api/stats/global - Global statistics
router.get('/global', async (req, res) => {
    try {
        const data = await readData();

        const totalSchools = data.schools.length;
        const totalTeachers = data.users.filter(u => u.role === 'teacher').length;
        const totalSessions = data.sessions.length;
        const totalMinutes = data.sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalStudents = data.sessions.reduce((sum, s) => sum + s.studentsCount, 0);

        // Stats by school
        const bySchool = data.schools.map(school => {
            const schoolSessions = data.sessions.filter(s => {
                const course = data.courses.find(c => c.id === s.courseId);
                return course && course.schoolId === school.id;
            });

            return {
                schoolId: school.id,
                schoolName: school.name,
                sessions: schoolSessions.length,
                minutes: schoolSessions.reduce((sum, s) => sum + s.duration, 0),
                students: schoolSessions.reduce((sum, s) => sum + s.studentsCount, 0),
                teachers: data.users.filter(u => u.schoolId === school.id && u.role === 'teacher').length
            };
        });

        res.json({
            totalSchools,
            totalTeachers,
            totalSessions,
            totalMinutes,
            totalStudents,
            averageMinutes: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
            bySchool
        });
    } catch (error) {
        console.error('Global stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
