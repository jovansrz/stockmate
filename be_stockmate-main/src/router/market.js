import express from 'express';
import { getMarketOverview, getQuote, getChart, getScreener, getSearch } from '../controllers/marketController.js';

const router = express.Router();

router.get('/overview', getMarketOverview);
router.get('/quote/:symbol', getQuote);
router.get('/chart/:symbol', getChart);
router.get('/screener', getScreener);
router.get('/search', getSearch);

export default router;
