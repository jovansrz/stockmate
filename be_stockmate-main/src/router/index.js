import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Welcome to StockMate API' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
