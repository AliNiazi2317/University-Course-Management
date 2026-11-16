
const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');
const authorizeAdmin = require('../middleware/admin');

const router = express.Router();

// VIEW ALL COURSES - AUTHENTICATED USERS
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [courses] = await db.execute(
            'SELECT * FROM courses ORDER BY id DESC'
        );

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ADD COURSE - ADMIN ONLY
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { course_name, course_code, description, instructor, credit_hours } = req.body;

        if (!course_name || !course_code ||
            !instructor || !Number.isInteger(credit_hours) ||
            credit_hours < 1 || credit_hours > 6) {
            return res.status(400).json({
                message: 'Valid course details are required'
            });
        }

        await db.execute(
            `INSERT INTO courses
            (course_name, course_code, description, instructor, credit_hours)
            VALUES (?, ?, ?, ?, ?)`,
            [course_name, course_code, description || '', instructor, credit_hours]
        );

        res.status(201).json({
            message: 'Course added successfully'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Course code already exists'
            });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE COURSE - ADMIN ONLY
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { course_name, course_code, description, instructor, credit_hours } = req.body;

        if (!course_name || !course_code || !instructor ||
            !Number.isInteger(credit_hours) ||
            credit_hours < 1 || credit_hours > 6) {
            return res.status(400).json({
                message: 'Valid course details are required'
            });
        }

        const [result] = await db.execute(
            `UPDATE courses SET course_name=?, course_code=?,
            description=?, instructor=?, credit_hours=? WHERE id=?`,
            [course_name, course_code, description || '', instructor, credit_hours, req.params.id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Course code already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE COURSE - ADMIN ONLY
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM courses WHERE id = ?',
            [req.params.id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
