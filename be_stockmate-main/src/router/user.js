import express from 'express';
import { getUsers, getUser, updateSaldo, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/user atau /user (tergantung setup di index.js)
// Rute ini sekarang diproteksi oleh middleware verifyToken
router.get('/', verifyToken, getUsers);

// GET /user/:username - Mendapatkan data spesifik berdasarkan username
router.get('/:username', verifyToken, getUser);

// PUT /user/saldo/:id - Memperbarui saldo virtual pengguna berdasarkan ID
router.put('/saldo/:id', verifyToken, updateSaldo);

// PUT /user/profile/:id - Memperbarui profil pengguna
router.put('/profile/:id', verifyToken, updateProfile);

export default router;
