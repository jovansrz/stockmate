import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
yahooFinance._setOpts({ validation: { logErrors: false } });

// Fetch live quotes for a list of tickers
const fetchLiveQuotes = async (tickers) => {
  if (!tickers || tickers.length === 0) return [];
  try {
    // Normalize tickers – append .JK for IDX stocks that don't have a suffix
    const US_STOCKS = ['AAPL','MSFT','TSLA','NVDA','AMZN','GOOG','META','NFLX','AMD','COIN'];
    const symbols = tickers.map(t => {
      if (t.includes('.') || t.startsWith('^') || US_STOCKS.includes(t)) return t;
      return `${t}.JK`;
    });

    const rawQuotes = await yahooFinance.quote(symbols, {}, { validateResult: false });
    const quotesArray = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];

    return quotesArray
      .filter(q => q && q.regularMarketPrice != null)
      .map(q => ({
        ticker: q.symbol,
        name: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        peRatio: q.trailingPE || q.forwardPE || null,
        pbv: q.priceToBook || null,
        marketCap: q.marketCap || null,
        currency: q.currency || 'IDR',
      }));
  } catch (err) {
    console.error('Failed to fetch live quotes for chat context:', err?.message);
    return [];
  }
};

// Build a rich context string from user data + live market data
const buildUserContext = async (userContext) => {
  if (!userContext) return '';

  const parts = [];

  // --- User Profile ---
  if (userContext.username) {
    parts.push(`USER NAME: ${userContext.username}`);
  }
  if (userContext.balance !== undefined) {
    parts.push(`VIRTUAL BALANCE: Rp ${Number(userContext.balance).toLocaleString('id-ID')}`);
  }
  if (userContext.xp !== undefined && userContext.level !== undefined) {
    parts.push(`EXPERIENCE: Level ${userContext.level}, ${userContext.xp} XP`);
  }
  if (userContext.streak !== undefined) {
    parts.push(`LEARNING STREAK: ${userContext.streak} days`);
  }

  // --- Investment Profile ---
  if (userContext.profile) {
    const p = userContext.profile;
    const profileParts = [];
    if (p.riskTolerance) profileParts.push(`Risk Tolerance: ${p.riskTolerance}`);
    if (p.investmentHorizon) profileParts.push(`Investment Horizon: ${p.investmentHorizon}`);
    if (p.investmentGoal) profileParts.push(`Investment Goal: ${p.investmentGoal}`);
    if (p.preferredSectors && p.preferredSectors.length > 0) profileParts.push(`Preferred Sectors: ${p.preferredSectors.join(', ')}`);
    if (profileParts.length > 0) {
      parts.push(`INVESTMENT PROFILE:\n${profileParts.join('\n')}`);
    }
  }

  // --- Portfolio ---
  if (userContext.portfolio && Object.keys(userContext.portfolio).length > 0) {
    const portfolioTickers = Object.keys(userContext.portfolio);
    const livePortfolio = await fetchLiveQuotes(portfolioTickers);

    const portfolioLines = portfolioTickers.map(ticker => {
      const lots = userContext.portfolio[ticker];
      const shares = lots * 100;
      const liveData = livePortfolio.find(q => q.ticker === ticker || q.ticker === `${ticker}.JK`);
      if (liveData) {
        const value = liveData.price * shares;
        return `  - ${ticker}: ${lots} lot(s) (${shares} shares), Current Price: ${liveData.currency} ${liveData.price.toLocaleString()}, Value: ~${liveData.currency} ${value.toLocaleString()}, Today: ${liveData.changePercent >= 0 ? '+' : ''}${liveData.changePercent.toFixed(2)}%, P/E: ${liveData.peRatio ?? 'N/A'}`;
      }
      return `  - ${ticker}: ${lots} lot(s) (${shares} shares)`;
    });
    parts.push(`USER PORTFOLIO (current holdings):\n${portfolioLines.join('\n')}`);
  } else {
    parts.push(`USER PORTFOLIO: Empty (no stocks held yet)`);
  }

  // --- Watchlist ---
  if (userContext.watchlist && userContext.watchlist.length > 0) {
    const liveWatchlist = await fetchLiveQuotes(userContext.watchlist);

    const watchlistLines = userContext.watchlist.map(ticker => {
      const liveData = liveWatchlist.find(q => q.ticker === ticker || q.ticker === `${ticker}.JK`);
      if (liveData) {
        return `  - ${ticker}: Price ${liveData.currency} ${liveData.price.toLocaleString()}, Today: ${liveData.changePercent >= 0 ? '+' : ''}${liveData.changePercent.toFixed(2)}%, P/E: ${liveData.peRatio ?? 'N/A'}`;
      }
      return `  - ${ticker}`;
    });
    parts.push(`WATCHLIST (stocks user is interested in):\n${watchlistLines.join('\n')}`);
  }

  return parts.join('\n\n');
};

export const handleChat = async (req, res) => {
  try {
    const { message, history, userContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Build personalized context from user data + live market data
    const contextString = await buildUserContext(userContext);

    // System prompt with full user context injected
    const systemPrompt = {
      role: 'system',
      content: `You are StockMate AI, a professional financial advisor and stock market expert built into the StockMate learning platform.

YOUR CAPABILITIES:
- Analyze stocks with real market data
- Give personalized investment recommendations based on the user's portfolio, risk profile, and goals
- Explain financial concepts (P/E ratio, PBV, ROE, dividend yield, etc.)
- Suggest buy/sell/hold actions with clear reasoning
- Warn about risks and diversification

RULES:
1. You must ONLY answer questions related to stocks, investing, finance, and economics.
2. If a user asks about unrelated topics (cooking, coding, weather, etc.), politely decline and remind them you are a stock assistant.
3. Always provide a disclaimer that your advice is for educational purposes and not actual financial advice.
4. When recommending stocks, explain WHY (fundamentals, technicals, sector outlook).
5. Consider the user's risk tolerance and investment goals when giving advice.
6. Use the live market data provided below to give accurate, up-to-date answers.
7. If the user asks about their portfolio, reference their actual holdings.
8. Format your responses clearly with headers, bullet points, and tables when appropriate.
9. When the user speaks in Indonesian (Bahasa), reply in Indonesian. When they speak in English, reply in English.

--- USER CONTEXT (LIVE DATA) ---
${contextString || 'No user context available.'}
--- END USER CONTEXT ---`
    };

    // Format previous history into OpenRouter format if provided
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })) : [];

    const messages = [
      systemPrompt,
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'StockMate', 
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to communicate with AI provider' });
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'Invalid response from AI provider' });
    }

    const aiMessage = data.choices[0].message.content;
    
    res.json({ reply: aiMessage });

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
