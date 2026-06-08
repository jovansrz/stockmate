import jwt from 'jsonwebtoken';
import { findUserByCredentials, getUserByUsername, createUser } from '../models/userModel.js';
import { getTotalCourseXp } from '../models/courseModel.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const user = await findUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' } // Token expires in 1 day
    );

    const totalCourseXp = await getTotalCourseXp();
    const minxp = totalCourseXp - user.totalxp;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user.id,
        username: user.username,
        Xp: user.totalxp + '%',
        saldo_virtual: user.saldo_virtual !== undefined ? Number(user.saldo_virtual) : 0,
        minxp: minxp
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ success: false, message: 'Name, username, dan password wajib diisi' });
  }

  try {
    // Mengecek apakah username sudah ada
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username sudah digunakan' });
    }

    // Menyimpan user baru (dengan nama ke kolom 'name')
    const newUser = await createUser(name, username, password);

    const totalCourseXp = await getTotalCourseXp();
    const minxp = totalCourseXp - newUser.totalxp;

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      data: {
        id: newUser.id,
        nama: newUser.name,
        username: newUser.username,
        Xp: newUser.totalxp + '%', // Menyamakan dengan format Xp login Anda
        saldo_virtual: newUser.saldo_virtual !== undefined ? Number(newUser.saldo_virtual) : 0,
        minxp: minxp
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
