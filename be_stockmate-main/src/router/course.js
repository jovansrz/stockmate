import express from 'express';
import { getCourses, completeCourse } from '../controllers/courseController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /course - Mendapatkan semua course beserta detail json agg
router.get('/', verifyToken, getCourses);

// POST /course/complete - Menambahkan XP course ke user
router.post('/complete', verifyToken, completeCourse);

export default router;
