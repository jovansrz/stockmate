import YahooFinance from 'yahoo-finance2';

// Instantiate and set validation options (suppress error logs to avoid crashes on partial Yahoo data)
const yahooFinance = new YahooFinance();
yahooFinance._setOpts({ validation: { logErrors: false } });

const TOP_IDX_STOCKS = [
  'BBCA.JK', 'BBRI.JK', 'BMRI.JK', 'BBNI.JK', 'BRIS.JK', 'BBTN.JK', 'PNBN.JK', 'MEGA.JK', 'NISP.JK', 'BNGA.JK', // Banking
  'TLKM.JK', 'ASII.JK', 'GOTO.JK', 'ISAT.JK', 'EXCL.JK', 'TOWR.JK', 'TBIG.JK', 'MTEL.JK', // Telco, Conglomerate, Tech
  'AMMN.JK', 'BREN.JK', 'CUAN.JK', 'ADRO.JK', 'PTBA.JK', 'INCO.JK', 'BUMI.JK', 'MEDC.JK', 'MDKA.JK', 'ITMG.JK', 'PGAS.JK', 'HRUM.JK', 'INDY.JK', // Energy/Mining
  'ICBP.JK', 'INDF.JK', 'UNVR.JK', 'KLBF.JK', 'CPIN.JK', 'MYOR.JK', 'ACES.JK', 'SIDO.JK', 'JPFA.JK', 'CMRY.JK', 'AMRT.JK', // Consumer/Healthcare
  'PGEO.JK', 'UNTR.JK', 'CTRA.JK', 'ANTM.JK', 'SMGR.JK', 'TPIA.JK', 'BRPT.JK', 'INKP.JK', 'TKIM.JK', 'BSDE.JK', 'PWON.JK', 'SMRA.JK', 'AKRA.JK', 'SILO.JK', 'MIKA.JK' // Others & Real Estate
];

const US_STOCKS = [
  'AAPL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'GOOG', 'META', 'NFLX', 'AMD', 'COIN',
  'JPM', 'V', 'WMT', 'JNJ', 'MA', 'PG', 'AVGO', 'HD', 'CVX', 'MRK', 'PEP', 'COST',
  'KO', 'ABBV', 'MCD', 'CRM', 'CSCO', 'ACN', 'LIN', 'BAC', 'TMO', 'ADBE', 'DIS'
];

const GLOBAL_STOCKS = [
  '7203.T', '0700.HK', 'ASML.AS', 'NESN.SW', 'SAP.DE', '9988.HK',
  'TTE.PA', 'LVMH.PA', 'SIE.DE', 'NVO', 'TM', 'BABA', 'NVS', 'BHP', 'SONY'
];

const ALL_STOCKS = [...TOP_IDX_STOCKS, ...US_STOCKS, ...GLOBAL_STOCKS];

const STOCK_SECTOR_MAP = {
  // IDX
  'BBCA.JK': 'Perbankan', 'BBRI.JK': 'Perbankan', 'BMRI.JK': 'Perbankan', 'BBNI.JK': 'Perbankan',
  'TLKM.JK': 'Telekomunikasi', 'ASII.JK': 'Industri', 'GOTO.JK': 'Teknologi',
  'AMMN.JK': 'Energi', 'BREN.JK': 'Energi', 'CUAN.JK': 'Energi', 'ADRO.JK': 'Energi', 'PTBA.JK': 'Energi', 'INCO.JK': 'Energi',
  'ICBP.JK': 'Consumer Goods', 'INDF.JK': 'Consumer Goods', 'UNVR.JK': 'Consumer Goods', 'KLBF.JK': 'Kesehatan', 'CPIN.JK': 'Consumer Goods',
  'PGEO.JK': 'Energi', 'UNTR.JK': 'Industri', 'CTRA.JK': 'Properti', 'ANTM.JK': 'Energi', 'SMGR.JK': 'Industri',
  'BRIS.JK': 'Perbankan', 'BUMI.JK': 'Energi', 'MEDC.JK': 'Energi', 'MDKA.JK': 'Energi', 'ISAT.JK': 'Telekomunikasi',
  'MYOR.JK': 'Consumer Goods', 'TPIA.JK': 'Industri', 'EXCL.JK': 'Telekomunikasi', 'ACES.JK': 'Consumer Goods',

  // US
  'AAPL': 'Teknologi', 'MSFT': 'Teknologi', 'TSLA': 'Industri', 'NVDA': 'Teknologi', 'AMZN': 'Consumer Goods',
  'GOOG': 'Teknologi', 'META': 'Teknologi', 'NFLX': 'Telekomunikasi', 'AMD': 'Teknologi', 'COIN': 'Perbankan',

  // Global
  '7203.T': 'Industri', '0700.HK': 'Teknologi', 'ASML.AS': 'Teknologi', 'NESN.SW': 'Consumer Goods', 'SAP.DE': 'Teknologi', '9988.HK': 'Teknologi'
};

export const getMarketOverview = async (req, res) => {
  try {
    // 1. Fetch IHSG
    const ihsg = await yahooFinance.quote('^JKSE', {}, { validateResult: false });

    // 2. Fetch all top IDX stocks in one batch
    const rawQuotes = await yahooFinance.quote(TOP_IDX_STOCKS, {}, { validateResult: false });
    const quotesArray = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];

    const processedQuotes = quotesArray
      .filter(q => q && q.regularMarketPrice != null)
      .map(q => ({
        ticker: (q.symbol || '').replace('.JK', ''),
        name: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0
      }));

    // Sort ascending by changePercent to derive gainers and losers
    const sorted = [...processedQuotes].sort((a, b) => b.changePercent - a.changePercent);

    const topGainers = sorted.slice(0, 5);
    const topLosers  = sorted.slice(-5).reverse();

    // Market Mood from advance/decline ratio
    let advances = 0, declines = 0;
    processedQuotes.forEach(q => {
      if (q.changePercent > 0) advances++;
      else if (q.changePercent < 0) declines++;
    });

    let marketMood = 'Neutral';
    if (advances > declines * 1.5)      marketMood = 'Sangat Positif';
    else if (advances > declines)        marketMood = 'Positif';
    else if (declines > advances * 1.5)  marketMood = 'Sangat Negatif';
    else if (declines > advances)        marketMood = 'Negatif';

    // Calculate active sector dynamically based on highest average changePercent
    const sectorChanges = {};
    const sectorCounts = {};
    processedQuotes.forEach(q => {
      const fullSymbol = q.ticker + '.JK';
      const sector = STOCK_SECTOR_MAP[fullSymbol] || 'Lainnya';
      sectorChanges[sector] = (sectorChanges[sector] || 0) + q.changePercent;
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    let activeSector = 'Beragam';
    let maxAvgChange = -Infinity;
    Object.keys(sectorChanges).forEach(sec => {
      const avg = sectorChanges[sec] / sectorCounts[sec];
      if (avg > maxAvgChange && avg > 0) {
        maxAvgChange = avg;
        activeSector = sec;
      }
    });

    const ihsgChange = ihsg?.regularMarketChangePercent ?? 0;
    const aiInsight = ihsgChange >= 0
      ? {
          id: `IHSG menguat ${ihsgChange.toFixed(2)}%. Sentimen pasar cenderung positif, momentum baik untuk hold atau trading jangka pendek.`,
          en: `IHSG is up ${ihsgChange.toFixed(2)}%. Market sentiment is positive, good momentum for holding or short-term trading.`
        }
      : {
          id: `IHSG terkoreksi ${Math.abs(ihsgChange).toFixed(2)}%. Pertimbangkan untuk buy on weakness pada saham berfundamental kuat.`,
          en: `IHSG corrected by ${Math.abs(ihsgChange).toFixed(2)}%. Consider buy on weakness for stocks with strong fundamentals.`
        };

    res.status(200).json({
      success: true,
      data: {
        ihsg: ihsg?.regularMarketPrice ?? 0,
        ihsgChange,
        topGainers,
        topLosers,
        marketMood,
        activeSector,
        aiInsight
      }
    });
  } catch (error) {
    console.error('Error fetching market overview:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to fetch market data', error: error?.message });
  }
};

export const getQuote = async (req, res) => {
  try {
    let { symbol } = req.params;
    // Append .JK for IDX stocks that don't already have a suffix or special prefix
    if (!symbol.includes('.') && !symbol.startsWith('^') && !US_STOCKS.includes(symbol)) {
      symbol = `${symbol}.JK`;
    }

    const quote = await yahooFinance.quote(symbol, {}, { validateResult: false });

    if (!quote || quote.regularMarketPrice == null) {
      return res.status(404).json({ success: false, message: `No data found for symbol: ${symbol}` });
    }

    // Fetch deep fundamentals
    const summary = await yahooFinance.quoteSummary(symbol, { modules: ['financialData', 'defaultKeyStatistics', 'summaryDetail'] }).catch(() => null);
    
    if (summary) {
      quote.returnOnEquity = summary.financialData?.returnOnEquity;
      if (!quote.priceToBook) quote.priceToBook = summary.defaultKeyStatistics?.priceToBook;
      if (!quote.trailingPE) quote.trailingPE = summary.summaryDetail?.trailingPE || summary.defaultKeyStatistics?.forwardPE;
      if (!quote.trailingAnnualDividendYield) quote.trailingAnnualDividendYield = summary.summaryDetail?.trailingAnnualDividendYield;
      if (!quote.dividendYield) quote.dividendYield = summary.summaryDetail?.dividendYield;
    }

    if (symbol.endsWith('.JK') && quote.priceToBook > 100) {
      quote.priceToBook = quote.priceToBook / 15800;
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error(`Error fetching quote for ${req.params.symbol}:`, error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to fetch quote', error: error?.message });
  }
};

export const getChart = async (req, res) => {
  try {
    let { symbol } = req.params;
    if (!symbol.includes('.') && !symbol.startsWith('^') && !US_STOCKS.includes(symbol)) {
      symbol = `${symbol}.JK`;
    }

    const { period1, period2, interval = '1d' } = req.query;

    const to   = period2 ? new Date(parseInt(period2) * 1000) : new Date();
    const from = period1 ? new Date(parseInt(period1) * 1000) : new Date(to.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Use chart() directly (historical() is deprecated)
    const result = await yahooFinance.chart(symbol, {
      period1: from,
      period2: to,
      interval,
    }, { validateResult: false });

    // chart() returns { quotes: [...] }
    const rawQuotes = result?.quotes ?? [];

    // Filter out candles with missing close prices (can happen for the current incomplete day)
    const cleanQuotes = rawQuotes
      .filter(c => c.close != null)
      .map(c => ({
        date: c.date,
        open: c.open ?? 0,
        high: c.high ?? 0,
        low: c.low ?? 0,
        close: c.close,
        volume: c.volume ?? 0,
      }));

    res.status(200).json({ success: true, data: cleanQuotes });
  } catch (error) {
    console.error(`Error fetching chart for ${req.params.symbol}:`, error?.message || error);
    // Return empty data gracefully so the frontend can fall back to mock chart
    res.status(200).json({ success: true, data: [] });
  }
};

export const getScreener = async (req, res) => {
  try {
    const rawQuotes = await yahooFinance.quote(ALL_STOCKS, {}, { validateResult: false });
    const quotesArray = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];

    const processedQuotes = quotesArray
      .filter(q => q && q.regularMarketPrice != null)
      .map((q) => {
        let ticker = q.symbol || '';
        let market = 'IDX';
        
        if (US_STOCKS.includes(ticker)) {
          market = 'US';
        } else if (GLOBAL_STOCKS.includes(ticker)) {
          market = 'Global';
        } else {
          ticker = ticker.replace('.JK', '');
        }

        let currency = q.currency;
        if (!currency) {
          if (q.symbol.endsWith('.JK')) currency = 'IDR';
          else if (q.symbol.endsWith('.T')) currency = 'JPY';
          else if (q.symbol.endsWith('.HK')) currency = 'HKD';
          else if (q.symbol.endsWith('.AS')) currency = 'EUR';
          else if (q.symbol.endsWith('.SW')) currency = 'CHF';
          else if (q.symbol.endsWith('.DE')) currency = 'EUR';
          else if (US_STOCKS.includes(q.symbol)) currency = 'USD';
          else currency = 'USD';
        }

        let pbv = q.priceToBook || 0;
        if (q.symbol.endsWith('.JK') && pbv > 100) {
          pbv = pbv / 15800;
        }

        return {
          ticker,
          name: q.shortName || q.longName || q.symbol,
          price: q.regularMarketPrice,
          changePercent: q.regularMarketChangePercent ?? 0,
          volume: q.regularMarketVolume ?? 0,
          peRatio: q.trailingPE || q.forwardPE || 0,
          pbv: pbv,
          dividendYield: q.trailingAnnualDividendYield ? q.trailingAnnualDividendYield * 100 : (q.dividendYield ? q.dividendYield : 0),
          roe: q.returnOnEquity ? q.returnOnEquity * 100 : null,
          market,
          currency,
          sector: STOCK_SECTOR_MAP[q.symbol] || 'Lainnya'
        };
      });

    res.status(200).json({ success: true, data: processedQuotes });
  } catch (error) {
    console.error('Error fetching screener data:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to fetch screener data', error: error?.message });
  }
};

export const getSearch = async (req, res) => {
  try {
    let { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Missing query' });

    // Try a simple search
    const searchResult = await yahooFinance.search(q, { newsCount: 0, quotesCount: 15 }, { validateResult: false });
    if (!searchResult || !searchResult.quotes) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Filter to EQUITY, ETF
    const equities = searchResult.quotes.filter(i => i.quoteType === 'EQUITY' || i.quoteType === 'ETF');
    if (equities.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Get the symbols and fetch real quotes
    const symbols = equities.map(e => e.symbol);
    const rawQuotes = await yahooFinance.quote(symbols, {}, { validateResult: false }).catch(() => []);
    const quotesArray = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];

    const processedQuotes = quotesArray
      .filter(q => q && q.regularMarketPrice != null)
      .map((q) => {
        let ticker = q.symbol || '';
        let market = 'IDX';
        
        if (ticker.endsWith('.JK')) {
          market = 'IDX';
          ticker = ticker.replace('.JK', '');
        } else if (US_STOCKS.includes(ticker) || !ticker.includes('.')) {
          market = 'US';
        } else {
          market = 'Global';
        }

        let currency = q.currency || 'USD';
        if (q.symbol.endsWith('.JK')) currency = 'IDR';

        let pbv = q.priceToBook || 0;
        if (q.symbol.endsWith('.JK') && pbv > 100) {
          pbv = pbv / 15800;
        }

        return {
          ticker,
          name: q.shortName || q.longName || q.symbol,
          price: q.regularMarketPrice,
          changePercent: q.regularMarketChangePercent ?? 0,
          volume: q.regularMarketVolume ?? 0,
          peRatio: q.trailingPE || q.forwardPE || 0,
          pbv: pbv,
          dividendYield: q.trailingAnnualDividendYield ? q.trailingAnnualDividendYield * 100 : (q.dividendYield ? q.dividendYield : 0),
          roe: q.returnOnEquity ? q.returnOnEquity * 100 : null,
          market,
          currency,
          sector: STOCK_SECTOR_MAP[q.symbol] || 'Lainnya'
        };
      });

    res.status(200).json({ success: true, data: processedQuotes });
  } catch (error) {
    console.error('Error in search:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to search', error: error?.message });
  }
};
