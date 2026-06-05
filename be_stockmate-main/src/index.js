import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router/index.js';
import user from './router/user.js';
import auth from './router/auth.js';
import course from './router/course.js';
import market from './router/market.js';
import chat from './router/chat.js';

// Initialize DB connection
import './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main Router
app.use('/auth', auth);
app.use('/user', user);
app.use('/course', course);
app.use('/market', market);
app.use('/chat', chat);
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
