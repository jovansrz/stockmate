export const marketData = {
  ihsg: 7250.45,
  change: 1.2,
  mood: "Bullish",
  topGainers: [
    { ticker: "BBCA", change: 2.5, price: 9800 },
    { ticker: "BMRI", change: 3.1, price: 6500 },
  ],
  topLosers: [
    { ticker: "GOTO", change: -1.5, price: 65 },
    { ticker: "BREN", change: -2.0, price: 5400 },
  ],
  dailyInsight: {
    id: "IHSG menghijau hari ini didorong oleh sektor perbankan dan energi. Tetap waspada terhadap rilis data inflasi besok.",
    en: "IHSG is in the green today driven by banking and energy sectors. Stay alert for tomorrow's inflation data release."
  }
};

export const stocksData = [
  {
    ticker: "BBCA",
    name: "Bank Central Asia Tbk",
    sector: "Perbankan",
    price: 9800,
    trend: "up",
    roe: 20.5,
    roa: 3.2,
    npm: 45.1,
    der: 0.2,
    peRatio: 25.4,
    pbv: 5.2,
    matchScore: 95,
    dividendYield: 2.5,
    changePercent: 1.2,
    volume: 50000000,
    avgVolume: 45000000,
    rsi: 65,
    ma50: 9500,
    ma200: 9200,
    isSharia: false,
    board: "Utama",
    healthScore: 95,
    fundamentalSummary: {
      id: "Fundamental sangat kuat, rutin bagi dividen, cocok untuk investasi jangka panjang.",
      en: "Very strong fundamentals, regular dividends, suitable for long-term investment."
    },
    description: {
      id: "BBCA adalah bank swasta terbesar di Indonesia dengan fundamental yang sangat stabil.",
      en: "BBCA is the largest private bank in Indonesia with very stable fundamentals."
    }
  },
  {
    ticker: "BMRI",
    name: "Bank Mandiri (Persero) Tbk",
    sector: "Perbankan",
    price: 6500,
    trend: "up",
    roe: 22.1,
    roa: 3.5,
    npm: 40.2,
    der: 0.3,
    peRatio: 11.2,
    pbv: 2.1,
    matchScore: 92,
    dividendYield: 4.5,
    changePercent: 2.1,
    volume: 80000000,
    avgVolume: 60000000,
    rsi: 72,
    ma50: 6200,
    ma200: 5800,
    isSharia: false,
    board: "Utama",
    healthScore: 92,
    fundamentalSummary: {
      id: "Bank BUMN dengan pertumbuhan kredit sangat baik dan valuasi atraktif.",
      en: "State-owned bank with excellent credit growth and attractive valuation."
    },
    description: {
      id: "BMRI merupakan salah satu bank BUMN terbesar dengan fokus pada kredit korporasi dan ritel.",
      en: "BMRI is one of the largest state-owned banks focusing on corporate and retail credit."
    }
  },
  {
    ticker: "UNVR",
    name: "Unilever Indonesia Tbk",
    sector: "Consumer",
    price: 2800,
    trend: "down",
    roe: 85.0,
    roa: 25.0,
    npm: 12.0,
    der: 2.5,
    peRatio: 22.0,
    pbv: 18.0,
    matchScore: 75,
    dividendYield: 3.2,
    changePercent: -1.5,
    volume: 20000000,
    avgVolume: 25000000,
    rsi: 28,
    ma50: 3000,
    ma200: 3500,
    isSharia: true,
    board: "Utama",
    healthScore: 70,
    fundamentalSummary: {
      id: "Raksasa consumer goods, namun sedang menghadapi tantangan pertumbuhan laba.",
      en: "Consumer goods giant, but currently facing profit growth challenges."
    },
    description: {
      id: "UNVR adalah perusahaan FMCG terkemuka di Indonesia yang memproduksi barang kebutuhan sehari-hari.",
      en: "UNVR is a leading FMCG company in Indonesia that produces daily necessities."
    }
  },
  {
    ticker: "ICBP",
    name: "Indofood CBP Sukses Makmur Tbk",
    sector: "Consumer",
    price: 11200,
    trend: "up",
    roe: 21.0,
    roa: 7.5,
    npm: 15.2,
    der: 0.6,
    peRatio: 14.5,
    pbv: 3.2,
    matchScore: 85,
    dividendYield: 2.8,
    changePercent: 0.5,
    volume: 15000000,
    avgVolume: 12000000,
    rsi: 55,
    ma50: 11000,
    ma200: 10500,
    isSharia: true,
    board: "Utama",
    healthScore: 85,
    fundamentalSummary: {
      id: "Pemimpin pasar mie instan dengan margin keuntungan yang solid.",
      en: "Instant noodle market leader with solid profit margins."
    },
    description: {
      id: "ICBP adalah produsen produk konsumen bermerek terkemuka, terutama dikenal dengan merek Indomie.",
      en: "ICBP is a leading branded consumer products manufacturer, best known for its Indomie brand."
    }
  },
  {
    ticker: "ADRO",
    name: "Adaro Energy Indonesia Tbk",
    sector: "Energi",
    price: 2600,
    trend: "down",
    roe: 25.4,
    roa: 12.1,
    npm: 18.5,
    der: 0.4,
    peRatio: 4.2,
    pbv: 1.1,
    matchScore: 82,
    dividendYield: 15.4,
    changePercent: -2.3,
    volume: 120000000,
    avgVolume: 100000000,
    rsi: 45,
    ma50: 2700,
    ma200: 2500,
    isSharia: true,
    board: "Utama",
    healthScore: 80,
    fundamentalSummary: {
      id: "Valuasi sangat murah dan dividen besar, namun terpengaruh harga komoditas global.",
      en: "Very cheap valuation and high dividend, but affected by global commodity prices."
    },
    description: {
      id: "ADRO adalah perusahaan pertambangan batu bara terbesar di Indonesia dengan operasi terintegrasi.",
      en: "ADRO is the largest coal mining company in Indonesia with integrated operations."
    }
  },
  {
    ticker: "TLKM",
    name: "Telkom Indonesia (Persero) Tbk",
    sector: "Telekomunikasi",
    price: 3200,
    trend: "down",
    roe: 18.2,
    roa: 8.5,
    npm: 16.4,
    der: 0.8,
    peRatio: 14.5,
    pbv: 2.6,
    matchScore: 88,
    dividendYield: 5.5,
    changePercent: -0.8,
    volume: 90000000,
    avgVolume: 110000000,
    rsi: 40,
    ma50: 3300,
    ma200: 3800,
    isSharia: true,
    board: "Utama",
    healthScore: 88,
    fundamentalSummary: {
      id: "Pemimpin pasar telekomunikasi, valuasi sedang murah (undervalued).",
      en: "Telecommunication market leader, currently undervalued."
    },
    description: {
      id: "TLKM merupakan BUMN telekomunikasi dengan jaringan terluas di Indonesia.",
      en: "TLKM is a state-owned telecommunications enterprise with the widest network in Indonesia."
    }
  },
  {
    ticker: "GOTO",
    name: "GoTo Gojek Tokopedia Tbk",
    sector: "Teknologi",
    price: 65,
    trend: "up",
    roe: -15.5,
    roa: -10.2,
    npm: -25.0,
    der: 0.1,
    peRatio: -5.0,
    pbv: 1.5,
    matchScore: 60,
    dividendYield: 0,
    changePercent: 5.0,
    volume: 500000000,
    avgVolume: 400000000,
    rsi: 60,
    ma50: 60,
    ma200: 80,
    isSharia: false,
    board: "Utama",
    healthScore: 45,
    fundamentalSummary: {
      id: "Fokus pada efisiensi dan profitabilitas, risiko tinggi namun potensi return besar.",
      en: "Focusing on efficiency and profitability, high risk but huge return potential."
    },
    description: {
      id: "GOTO adalah ekosistem digital terbesar di Indonesia yang menggabungkan layanan on-demand, e-commerce, dan fintech.",
      en: "GOTO is the largest digital ecosystem in Indonesia combining on-demand services, e-commerce, and fintech."
    }
  },
  {
    ticker: "KLBF",
    name: "Kalbe Farma Tbk",
    sector: "Kesehatan",
    price: 1500,
    trend: "up",
    roe: 16.5,
    roa: 12.8,
    npm: 11.2,
    der: 0.2,
    peRatio: 22.5,
    pbv: 3.8,
    matchScore: 86,
    dividendYield: 2.1,
    changePercent: 0.2,
    volume: 10000000,
    avgVolume: 15000000,
    rsi: 50,
    ma50: 1480,
    ma200: 1450,
    isSharia: true,
    board: "Utama",
    healthScore: 86,
    fundamentalSummary: {
      id: "Perusahaan farmasi terbesar dengan fundamental stabil dan defensif.",
      en: "The largest pharmaceutical company with stable and defensive fundamentals."
    },
    description: {
      id: "KLBF bergerak di bidang farmasi, suplemen kesehatan, nutrisi, dan layanan kesehatan.",
      en: "KLBF operates in pharmaceuticals, health supplements, nutrition, and health services."
    }
  },
  {
    ticker: "CTRA",
    name: "Ciputra Development Tbk",
    sector: "Properti",
    price: 1200,
    trend: "up",
    roe: 10.5,
    roa: 5.2,
    npm: 18.5,
    der: 0.8,
    peRatio: 12.5,
    pbv: 1.3,
    matchScore: 78,
    dividendYield: 1.5,
    changePercent: 1.8,
    volume: 25000000,
    avgVolume: 20000000,
    rsi: 68,
    ma50: 1150,
    ma200: 1050,
    isSharia: false,
    board: "Utama",
    healthScore: 78,
    fundamentalSummary: {
      id: "Pengembang properti terkemuka dengan prospek baik jika suku bunga turun.",
      en: "Leading property developer with good prospects if interest rates fall."
    },
    description: {
      id: "CTRA adalah salah satu pengembang properti terbesar di Indonesia dengan proyek tersebar di banyak kota.",
      en: "CTRA is one of the largest property developers in Indonesia with projects spread across many cities."
    }
  },
  {
    ticker: "ASII",
    name: "Astra International Tbk",
    sector: "Industri",
    price: 5200,
    trend: "down",
    roe: 15.5,
    roa: 7.2,
    npm: 10.5,
    der: 0.9,
    peRatio: 8.5,
    pbv: 1.2,
    matchScore: 90,
    dividendYield: 6.5,
    changePercent: -3.5,
    volume: 45000000,
    avgVolume: 30000000,
    rsi: 25,
    ma50: 5500,
    ma200: 6000,
    isSharia: false,
    board: "Utama",
    healthScore: 82,
    fundamentalSummary: {
      id: "Konglomerasi terdiversifikasi dengan valuasi sangat menarik.",
      en: "Diversified conglomerate with very attractive valuation."
    },
    description: {
      id: "ASII adalah perusahaan otomotif terdepan yang juga memiliki lini bisnis alat berat dan finansial.",
      en: "ASII is a leading automotive company that also has heavy equipment and financial business lines."
    }
  },
  {
    ticker: "ANTM",
    name: "Aneka Tambang Tbk",
    sector: "Lainnya",
    price: 1550,
    trend: "up",
    roe: 14.2,
    roa: 9.5,
    npm: 11.0,
    der: 0.3,
    peRatio: 12.5,
    pbv: 1.8,
    matchScore: 82,
    dividendYield: 4.2,
    changePercent: 1.5,
    volume: 50000000,
    avgVolume: 45000000,
    rsi: 58,
    ma50: 1500,
    ma200: 1450,
    isSharia: true,
    board: "Utama",
    healthScore: 82,
    fundamentalSummary: {
      id: "Perusahaan pertambangan logam terdiversifikasi dengan kesehatan keuangan yang prima.",
      en: "Diversified metal mining company with excellent financial health."
    },
    description: {
      id: "ANTM adalah anggota dari BUMN Holding Industri Pertambangan MIND ID yang bergerak di bidang pertambangan berbagai jenis bahan mineral.",
      en: "ANTM is a member of State-Owned Mining Industry Holding MIND ID, operating in various mineral resource mining."
    }
  },
  {
    ticker: "SMGR",
    name: "Semen Indonesia (Persero) Tbk",
    sector: "Lainnya",
    price: 3900,
    trend: "down",
    roe: 6.2,
    roa: 3.5,
    npm: 5.8,
    der: 0.7,
    peRatio: 15.1,
    pbv: 0.9,
    matchScore: 78,
    dividendYield: 3.5,
    changePercent: -1.2,
    volume: 12000000,
    avgVolume: 15000000,
    rsi: 38,
    ma50: 4100,
    ma200: 4500,
    isSharia: true,
    board: "Utama",
    healthScore: 78,
    fundamentalSummary: {
      id: "Raksasa produsen semen regional dengan valuasi murah di bawah nilai buku.",
      en: "Regional cement manufacturing giant with cheap valuation below its book value."
    },
    description: {
      id: "SMGR merupakan produsen semen terbesar di Indonesia dengan pangsa pasar dominan dan jaringan distribusi yang luas.",
      en: "SMGR is the largest cement producer in Indonesia with dominant market share and wide distribution network."
    }
  },
  // --- ADDITIONAL IDX STOCKS ---
  {
    ticker: "BRIS",
    name: "Bank Syariah Indonesia Tbk",
    sector: "Perbankan",
    price: 2500,
    trend: "up",
    roe: 16.8,
    roa: 2.1,
    npm: 22.4,
    der: 0.1,
    peRatio: 18.5,
    pbv: 2.4,
    matchScore: 88,
    dividendYield: 1.8,
    changePercent: 0.8,
    volume: 35000000,
    avgVolume: 30000000,
    rsi: 58,
    ma50: 2400,
    ma200: 2100,
    isSharia: true,
    board: "Utama",
    healthScore: 88,
    fundamentalSummary: {
      id: "Bank syariah terbesar di Indonesia dengan pertumbuhan laba yang sangat progresif.",
      en: "The largest sharia bank in Indonesia with highly progressive profit growth."
    },
    description: {
      id: "BRIS adalah bank syariah hasil merger tiga bank BUMN syariah yang menguasai pasar syariah nasional.",
      en: "BRIS is a sharia bank formed by the merger of three state-owned sharia banks dominating the national sharia market."
    }
  },
  {
    ticker: "BUMI",
    name: "Bumi Resources Tbk",
    sector: "Energi",
    price: 110,
    trend: "down",
    roe: 8.5,
    roa: 3.2,
    npm: 6.5,
    der: 1.2,
    peRatio: 12.0,
    pbv: 0.9,
    matchScore: 65,
    dividendYield: 0.0,
    changePercent: -1.2,
    volume: 600000000,
    avgVolume: 500000000,
    rsi: 42,
    ma50: 115,
    ma200: 105,
    isSharia: true,
    board: "Utama",
    healthScore: 60,
    fundamentalSummary: {
      id: "Produsen batu bara dengan volume ekspor besar, namun historis utang dan volatilitas tinggi.",
      en: "Coal producer with high export volumes, but historically high debt and volatility."
    },
    description: {
      id: "BUMI merupakan salah satu produsen batubara terbesar di Indonesia, bagian dari Grup Bakrie.",
      en: "BUMI is one of the largest coal producers in Indonesia, part of the Bakrie Group."
    }
  },
  {
    ticker: "MEDC",
    name: "Medco Energi Internasional Tbk",
    sector: "Energi",
    price: 1350,
    trend: "up",
    roe: 18.2,
    roa: 5.4,
    npm: 12.8,
    der: 1.8,
    peRatio: 7.2,
    pbv: 1.1,
    matchScore: 83,
    dividendYield: 3.4,
    changePercent: 2.3,
    volume: 45000000,
    avgVolume: 40000000,
    rsi: 61,
    ma50: 1300,
    ma200: 1200,
    isSharia: true,
    board: "Utama",
    healthScore: 82,
    fundamentalSummary: {
      id: "Perusahaan migas swasta terbesar, valuasi murah dan diuntungkan oleh kenaikan harga minyak.",
      en: "The largest private oil and gas company, cheap valuation and benefits from rising oil prices."
    },
    description: {
      id: "MEDC beroperasi dalam eksplorasi dan produksi minyak bumi, gas alam, serta pembangkit listrik bersih.",
      en: "MEDC operates in oil and gas exploration, production, and clean power generation."
    }
  },
  {
    ticker: "MDKA",
    name: "Merdeka Copper Gold Tbk",
    sector: "Energi",
    price: 2800,
    trend: "up",
    roe: 6.5,
    roa: 2.2,
    npm: 4.8,
    der: 0.9,
    peRatio: 45.0,
    pbv: 3.5,
    matchScore: 78,
    dividendYield: 0.0,
    changePercent: 1.5,
    volume: 25000000,
    avgVolume: 20000000,
    rsi: 54,
    ma50: 2750,
    ma200: 2900,
    isSharia: true,
    board: "Utama",
    healthScore: 75,
    fundamentalSummary: {
      id: "Tambang emas dan tembaga terkemuka, prospek cerah seiring proyek baru nikel & tembaga.",
      en: "Leading gold and copper miner, bright prospects with new nickel & copper projects."
    },
    description: {
      id: "MDKA adalah perusahaan induk pertambangan logam terkemuka di Indonesia dengan aset utama Tambang Emas Tujuh Bukit.",
      en: "MDKA is a leading metal mining holding company in Indonesia with primary asset Tujuh Bukit Gold Mine."
    }
  },
  {
    ticker: "ISAT",
    name: "Indosat Ooredoo Hutchison Tbk",
    sector: "Telekomunikasi",
    price: 10200,
    trend: "up",
    roe: 15.4,
    roa: 4.8,
    npm: 13.5,
    der: 1.5,
    peRatio: 16.2,
    pbv: 2.6,
    matchScore: 86,
    dividendYield: 2.8,
    changePercent: 3.2,
    volume: 18000000,
    avgVolume: 15000000,
    rsi: 65,
    ma50: 9800,
    ma200: 9200,
    isSharia: true,
    board: "Utama",
    healthScore: 85,
    fundamentalSummary: {
      id: "Pertumbuhan laba mengesankan pasca-merger, efisiensi operasional sangat membaik.",
      en: "Impressive profit growth post-merger, operational efficiency greatly improved."
    },
    description: {
      id: "ISAT menyediakan jaringan telekomunikasi seluler dan solusi data digital untuk korporasi maupun ritel.",
      en: "ISAT provides mobile telecommunication networks and digital data solutions for corporations and retail."
    }
  },
  {
    ticker: "MYOR",
    name: "Mayora Indah Tbk",
    sector: "Consumer",
    price: 2450,
    trend: "up",
    roe: 22.5,
    roa: 12.4,
    npm: 9.8,
    der: 0.5,
    peRatio: 18.2,
    pbv: 3.8,
    matchScore: 88,
    dividendYield: 1.5,
    changePercent: -0.5,
    volume: 12000000,
    avgVolume: 10000000,
    rsi: 48,
    ma50: 2500,
    ma200: 2400,
    isSharia: true,
    board: "Utama",
    healthScore: 90,
    fundamentalSummary: {
      id: "Raksasa makanan olahan dengan pangsa pasar ekspor kuat di Asia Tenggara.",
      en: "Processed food giant with a strong export market share in Southeast Asia."
    },
    description: {
      id: "MYOR memproduksi makanan kemasan terkenal seperti Kopiko, Beng-Beng, Torabika, dan Roma.",
      en: "MYOR manufactures famous packaged consumer foods such as Kopiko, Beng-Beng, Torabika, and Roma."
    }
  },
  {
    ticker: "TPIA",
    name: "Chandra Asri Pacific Tbk",
    sector: "Industri",
    price: 8800,
    trend: "up",
    roe: 2.5,
    roa: 0.8,
    npm: 1.5,
    der: 1.1,
    peRatio: 250.0,
    pbv: 12.4,
    matchScore: 70,
    dividendYield: 0.0,
    changePercent: 4.1,
    volume: 10000000,
    avgVolume: 8000000,
    rsi: 72,
    ma50: 8200,
    ma200: 6500,
    isSharia: true,
    board: "Utama",
    healthScore: 68,
    fundamentalSummary: {
      id: "Valuasi premium yang didorong spekulasi akuisisi infrastruktur dan ekspansi petrokimia.",
      en: "Premium valuation driven by speculation on infrastructure acquisitions and petrochemical expansion."
    },
    description: {
      id: "TPIA merupakan produsen petrokimia terintegrasi terbesar di Indonesia yang memasok bahan baku industri nasional.",
      en: "TPIA is the largest integrated petrochemical producer in Indonesia, supplying industrial raw materials nationally."
    }
  },
  {
    ticker: "EXCL",
    name: "XL Axiata Tbk",
    sector: "Telekomunikasi",
    price: 2200,
    trend: "down",
    roe: 9.8,
    roa: 2.2,
    npm: 5.4,
    der: 1.9,
    peRatio: 22.0,
    pbv: 1.1,
    matchScore: 80,
    dividendYield: 2.1,
    changePercent: -1.8,
    volume: 22000000,
    avgVolume: 25000000,
    rsi: 38,
    ma50: 2300,
    ma200: 2150,
    isSharia: true,
    board: "Utama",
    healthScore: 80,
    fundamentalSummary: {
      id: "Pemain telekomunikasi terbesar ketiga, berupaya meningkatkan ARPU melalui integrasi FMC.",
      en: "Third largest telecom player, working to increase ARPU via Fixed-Mobile Convergence integration."
    },
    description: {
      id: "EXCL adalah penyedia jaringan telekomunikasi dengan fokus pada integrasi broadband seluler dan fiber.",
      en: "EXCL is a telecommunications provider focusing on integrated mobile and fiber broadband services."
    }
  },
  {
    ticker: "ACES",
    name: "Aspirasi Hidup Indonesia Tbk",
    sector: "Consumer",
    price: 820,
    trend: "up",
    roe: 15.2,
    roa: 11.2,
    npm: 10.5,
    der: 0.1,
    peRatio: 16.4,
    pbv: 2.2,
    matchScore: 87,
    dividendYield: 3.2,
    changePercent: 1.2,
    volume: 40000000,
    avgVolume: 35000000,
    rsi: 55,
    ma50: 800,
    ma200: 760,
    isSharia: true,
    board: "Utama",
    healthScore: 92,
    fundamentalSummary: {
      id: "Arus kas sangat sehat, ekspansi gerai agresif dan tidak memiliki utang jangka panjang.",
      en: "Extremely healthy cash flow, aggressive store expansion, and zero long-term debt."
    },
    description: {
      id: "ACES (sebelumnya Ace Hardware Indonesia) adalah peritel perkakas rumah tangga dan gaya hidup terkemuka.",
      en: "ACES (formerly Ace Hardware Indonesia) is a leading household improvement and lifestyle retailer."
    }
  },

  // --- UNITED STATES (US) STOCKS ---
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Teknologi",
    price: 180,
    trend: "up",
    roe: 150.0,
    roa: 28.5,
    npm: 25.8,
    der: 1.4,
    peRatio: 28.5,
    pbv: 35.0,
    matchScore: 94,
    dividendYield: 0.5,
    changePercent: 1.1,
    volume: 55000000,
    avgVolume: 52000000,
    rsi: 62,
    ma50: 175,
    ma200: 170,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 95,
    fundamentalSummary: {
      id: "Ekosistem premium, loyalitas pelanggan luar biasa, pembagian dividen & buyback jumbo.",
      en: "Premium ecosystem, unmatched customer loyalty, high dividends & buybacks."
    },
    description: {
      id: "Apple merancang dan memproduksi perangkat elektronik konsumen terkemuka seperti iPhone, iPad, Mac, dan Apple Watch.",
      en: "Apple designs and manufactures premium consumer electronics such as the iPhone, iPad, Mac, and Apple Watch."
    }
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    sector: "Teknologi",
    price: 420,
    trend: "up",
    roe: 38.5,
    roa: 19.2,
    npm: 34.2,
    der: 0.4,
    peRatio: 36.4,
    pbv: 12.5,
    matchScore: 96,
    dividendYield: 0.7,
    changePercent: 1.5,
    volume: 22000000,
    avgVolume: 20000000,
    rsi: 66,
    ma50: 405,
    ma200: 380,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 98,
    fundamentalSummary: {
      id: "Pemimpin revolusi AI melalui investasi di OpenAI dan dominasi layanan cloud Azure.",
      en: "Leader of the AI revolution through investments in OpenAI and dominance in Azure cloud services."
    },
    description: {
      id: "Microsoft adalah perusahaan perangkat lunak terbesar dengan produk unggulan sistem operasi Windows, Office, dan Azure Cloud.",
      en: "Microsoft is the world's largest software company, famous for Windows OS, Office suite, and Azure Cloud."
    }
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "Industri",
    price: 175,
    trend: "down",
    roe: 18.4,
    roa: 10.5,
    npm: 12.1,
    der: 0.1,
    peRatio: 45.0,
    pbv: 8.5,
    matchScore: 78,
    dividendYield: 0.0,
    changePercent: -2.8,
    volume: 85000000,
    avgVolume: 90000000,
    rsi: 35,
    ma50: 190,
    ma200: 210,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 82,
    fundamentalSummary: {
      id: "Pelopor kendaraan listrik global, menghadapi ketatnya persaingan dari Tiongkok.",
      en: "Pioneer in global electric vehicles, facing intense market competition from China."
    },
    description: {
      id: "Tesla memproduksi kendaraan listrik murni, solusi baterai penyimpanan energi rumah tangga, dan panel surya.",
      en: "Tesla manufactures pure electric vehicles, battery energy storage solutions, and solar panels."
    }
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Teknologi",
    price: 900,
    trend: "up",
    roe: 92.5,
    roa: 45.8,
    npm: 48.8,
    der: 0.2,
    peRatio: 75.0,
    pbv: 42.0,
    matchScore: 95,
    dividendYield: 0.02,
    changePercent: 4.8,
    volume: 48000000,
    avgVolume: 42000000,
    rsi: 74,
    ma50: 820,
    ma200: 650,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 94,
    fundamentalSummary: {
      id: "Monopoli chip GPU AI global, pertumbuhan pendapatan tiga digit yang sangat spektakuler.",
      en: "Monopoly in global AI GPU chips, boasting spectacular triple-digit revenue growth."
    },
    description: {
      id: "NVIDIA memproduksi GPU tingkat lanjut yang menggerakkan superkomputer AI, pusat data, dan konsol game di seluruh dunia.",
      en: "NVIDIA designs advanced graphics processing units that power AI supercomputers, data centers, and gaming."
    }
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    sector: "Consumer",
    price: 180,
    trend: "up",
    roe: 20.2,
    roa: 7.8,
    npm: 6.4,
    der: 0.6,
    peRatio: 40.5,
    pbv: 8.2,
    matchScore: 88,
    dividendYield: 0.0,
    changePercent: 0.8,
    volume: 38000000,
    avgVolume: 40000000,
    rsi: 58,
    ma50: 175,
    ma200: 160,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 88,
    fundamentalSummary: {
      id: "Raksasa e-commerce global didorong efisiensi AWS Cloud dan layanan berlangganan Prime.",
      en: "Global e-commerce leader propelled by high-margin AWS Cloud and Prime services."
    },
    description: {
      id: "Amazon adalah platform belanja online terbesar, penyedia komputasi awan AWS, dan produsen perangkat pintar.",
      en: "Amazon is the largest online marketplace, provider of AWS cloud computing, and developer of smart devices."
    }
  },
  {
    ticker: "GOOG",
    name: "Alphabet Inc.",
    sector: "Teknologi",
    price: 150,
    trend: "up",
    roe: 26.5,
    roa: 15.2,
    npm: 24.0,
    der: 0.1,
    peRatio: 22.4,
    pbv: 6.2,
    matchScore: 92,
    dividendYield: 0.5,
    changePercent: 1.2,
    volume: 28000000,
    avgVolume: 25000000,
    rsi: 60,
    ma50: 145,
    ma200: 135,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 95,
    fundamentalSummary: {
      id: "Monopoli search engine, kepemilikan YouTube, dan pertumbuhan pesat bisnis Google Cloud.",
      en: "Search engine monopoly, ownership of YouTube, and rapid Google Cloud expansion."
    },
    description: {
      id: "Alphabet adalah perusahaan induk dari Google, Android, YouTube, Google Cloud, serta lini riset inovasi AI DeepMind.",
      en: "Alphabet is the parent company of Google, Android, YouTube, Google Cloud, and AI research lab DeepMind."
    }
  },
  {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    sector: "Teknologi",
    price: 480,
    trend: "up",
    roe: 28.2,
    roa: 16.4,
    npm: 28.5,
    der: 0.1,
    peRatio: 26.5,
    pbv: 7.2,
    matchScore: 91,
    dividendYield: 0.4,
    changePercent: 2.1,
    volume: 20000000,
    avgVolume: 18000000,
    rsi: 63,
    ma50: 460,
    ma200: 410,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 94,
    fundamentalSummary: {
      id: "Raja media sosial, monetisasi iklan solid, serta efisiensi biaya yang masif ('Year of Efficiency').",
      en: "Social media king, robust ad monetization, and massive cost efficiencies."
    },
    description: {
      id: "Meta memiliki dan mengoperasikan platform komunikasi sosial terbesar di dunia termasuk Facebook, Instagram, WhatsApp, dan Threads.",
      en: "Meta owns and operates the world's largest social platforms including Facebook, Instagram, WhatsApp, and Threads."
    }
  },
  {
    ticker: "NFLX",
    name: "Netflix, Inc.",
    sector: "Telekomunikasi",
    price: 610,
    trend: "up",
    roe: 29.8,
    roa: 11.2,
    npm: 18.5,
    der: 1.1,
    peRatio: 38.0,
    pbv: 11.8,
    matchScore: 86,
    dividendYield: 0.0,
    changePercent: -0.4,
    volume: 4000000,
    avgVolume: 4500000,
    rsi: 52,
    ma50: 600,
    ma200: 550,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 85,
    fundamentalSummary: {
      id: "Pemimpin streaming berbayar global, didukung model produksi konten original dan monetisasi sharing-password.",
      en: "Global paid streaming leader, driven by original content production and password-sharing monetization."
    },
    description: {
      id: "Netflix menyediakan hiburan streaming berlangganan dengan ribuan film, serial TV, dan game mobile interaktif.",
      en: "Netflix provides subscription streaming entertainment with thousands of movies, TV series, and interactive games."
    }
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices, Inc.",
    sector: "Teknologi",
    price: 160,
    trend: "down",
    roe: 1.5,
    roa: 0.8,
    npm: 1.2,
    der: 0.05,
    peRatio: 120.0,
    pbv: 3.5,
    matchScore: 78,
    dividendYield: 0.0,
    changePercent: -3.5,
    volume: 62000000,
    avgVolume: 55000000,
    rsi: 31,
    ma50: 178,
    ma200: 155,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 82,
    fundamentalSummary: {
      id: "Kompetitor GPU AI terkuat setelah NVIDIA dengan jajaran chip accelerator MI300.",
      en: "Strongest GPU AI challenger to NVIDIA with its new MI300 accelerator chip line."
    },
    description: {
      id: "AMD merancang semikonduktor berkinerja tinggi, mikroprosesor Ryzen untuk PC/server, dan akselerator AI Radeon.",
      en: "AMD designs high-performance semiconductors, PC/server processors, and Radeon AI accelerators."
    }
  },
  {
    ticker: "COIN",
    name: "Coinbase Global, Inc.",
    sector: "Perbankan",
    price: 220,
    trend: "up",
    roe: 12.4,
    roa: 1.8,
    npm: 10.5,
    der: 1.5,
    peRatio: 42.0,
    pbv: 4.8,
    matchScore: 75,
    dividendYield: 0.0,
    changePercent: 5.2,
    volume: 12000000,
    avgVolume: 10000000,
    rsi: 69,
    ma50: 200,
    ma200: 160,
    isSharia: false,
    board: "NASDAQ",
    healthScore: 70,
    fundamentalSummary: {
      id: "Diuntungkan oleh volume perdagangan aset kripto dan arus masuk dana Bitcoin ETF.",
      en: "Highly leveraged to crypto trading volumes and Bitcoin ETF institutional inflows."
    },
    description: {
      id: "Coinbase adalah bursa pertukaran aset kripto berlisensi terbesar di Amerika Serikat.",
      en: "Coinbase is the largest regulated cryptocurrency exchange and custodian in the United States."
    }
  },

  // --- GLOBAL STOCKS ---
  {
    ticker: "7203.T",
    name: "Toyota Motor Corp",
    sector: "Industri",
    price: 3500,
    trend: "up",
    roe: 12.8,
    roa: 4.2,
    npm: 9.8,
    der: 0.9,
    peRatio: 10.5,
    pbv: 1.2,
    matchScore: 88,
    dividendYield: 2.8,
    changePercent: 0.5,
    volume: 8000000,
    avgVolume: 7500000,
    rsi: 54,
    ma50: 3400,
    ma200: 3100,
    isSharia: false,
    board: "Tokyo",
    healthScore: 88,
    fundamentalSummary: {
      id: "Raksasa otomotif dengan permintaan mobil hibrida (hybrid) yang sangat kuat secara global.",
      en: "Automotive giant enjoying extremely strong global demand for its hybrid vehicles."
    },
    description: {
      id: "Toyota Motor Corporation adalah produsen mobil terbesar di dunia asal Jepang, memimpin segmen hibrida.",
      en: "Toyota Motor Corporation is the world's largest automotive manufacturer, based in Japan and leading in hybrids."
    }
  },
  {
    ticker: "0700.HK",
    name: "Tencent Holdings Ltd.",
    sector: "Teknologi",
    price: 340,
    trend: "up",
    roe: 16.5,
    roa: 8.5,
    npm: 22.8,
    der: 0.3,
    peRatio: 15.2,
    pbv: 2.8,
    matchScore: 92,
    dividendYield: 2.1,
    changePercent: 1.8,
    volume: 15000000,
    avgVolume: 12000000,
    rsi: 59,
    ma50: 320,
    ma200: 300,
    isSharia: false,
    board: "Hong Kong",
    healthScore: 92,
    fundamentalSummary: {
      id: "Pemain game terbesar di dunia, pengembang WeChat super-app, dan portofolio investasi global.",
      en: "The world's largest gaming company, developer of the WeChat super-app, and holding massive global portfolios."
    },
    description: {
      id: "Tencent adalah konglomerat teknologi multinasional asal Tiongkok yang memimpin pasar media sosial, game, dan cloud.",
      en: "Tencent is a Chinese multinational technology giant leading in social media, gaming, and cloud services."
    }
  },
  {
    ticker: "ASML.AS",
    name: "ASML Holding N.V.",
    sector: "Teknologi",
    price: 880,
    trend: "up",
    roe: 28.5,
    roa: 15.2,
    npm: 26.4,
    der: 0.4,
    peRatio: 42.0,
    pbv: 18.5,
    matchScore: 95,
    dividendYield: 0.8,
    changePercent: 2.2,
    volume: 2000000,
    avgVolume: 1800000,
    rsi: 64,
    ma50: 850,
    ma200: 780,
    isSharia: false,
    board: "Euronext",
    healthScore: 96,
    fundamentalSummary: {
      id: "Monopoli absolut mesin litografi EUV yang krusial untuk pembuatan chip tercanggih di dunia.",
      en: "Absolute monopoly on EUV lithography machines crucial for making advanced microchips."
    },
    description: {
      id: "ASML adalah produsen sistem fotolitografi asal Belanda yang memasok mesin cetak chip ke TSMC, Intel, dan Samsung.",
      en: "ASML is a Dutch company supplying extreme ultraviolet (EUV) lithography systems to TSMC, Intel, and Samsung."
    }
  },
  {
    ticker: "NESN.SW",
    name: "Nestlé S.A.",
    sector: "Consumer",
    price: 95,
    trend: "down",
    roe: 22.0,
    roa: 8.5,
    npm: 12.1,
    der: 1.1,
    peRatio: 19.5,
    pbv: 5.4,
    matchScore: 86,
    dividendYield: 3.1,
    changePercent: -0.8,
    volume: 5000000,
    avgVolume: 6000000,
    rsi: 38,
    ma50: 98,
    ma200: 104,
    isSharia: false,
    board: "SIX Swiss",
    healthScore: 88,
    fundamentalSummary: {
      id: "Raksasa makanan & minuman defensif, sangat tangguh menghadapi inflasi berkat pricing power.",
      en: "Defensive food & beverage giant, highly resilient to inflation due to strong pricing power."
    },
    description: {
      id: "Nestle adalah perusahaan makanan dan minuman kemasan terbesar di dunia, berbasis di Swiss dengan ratusan merek global.",
      en: "Nestle is the world's largest packaged food and beverage company, based in Switzerland with hundreds of brands."
    }
  },
  {
    ticker: "SAP.DE",
    name: "SAP SE",
    sector: "Teknologi",
    price: 170,
    trend: "up",
    roe: 14.2,
    roa: 6.8,
    npm: 11.5,
    der: 0.3,
    peRatio: 28.4,
    pbv: 4.2,
    matchScore: 89,
    dividendYield: 1.2,
    changePercent: 1.4,
    volume: 3000000,
    avgVolume: 2800000,
    rsi: 58,
    ma50: 165,
    ma200: 150,
    isSharia: false,
    board: "Xetra",
    healthScore: 90,
    fundamentalSummary: {
      id: "Pemimpin global perangkat lunak ERP korporasi, saat ini sukses bertransisi ke model Cloud SaaS.",
      en: "Global leader in enterprise ERP software, successfully transitioning to cloud SaaS subscription models."
    },
    description: {
      id: "SAP SE adalah raksasa perangkat lunak asal Jerman yang memproduksi sistem manajemen data dan ERP untuk perusahaan besar.",
      en: "SAP SE is a German software giant specializing in enterprise resource planning (ERP) and database systems."
    }
  },
  {
    ticker: "9988.HK",
    name: "Alibaba Group Holding Ltd.",
    sector: "Teknologi",
    price: 75,
    trend: "down",
    roe: 8.4,
    roa: 4.5,
    npm: 9.2,
    der: 0.2,
    peRatio: 9.5,
    pbv: 1.1,
    matchScore: 80,
    dividendYield: 1.4,
    changePercent: -1.2,
    volume: 38000000,
    avgVolume: 42000000,
    rsi: 41,
    ma50: 78,
    ma200: 84,
    isSharia: true,
    board: "Hong Kong",
    healthScore: 80,
    fundamentalSummary: {
      id: "Valuasi sangat murah, memimpin e-commerce Tiongkok, dan memiliki potensi spin-off bisnis cloud & logistik.",
      en: "Very cheap valuation, dominates Chinese e-commerce, and has spin-off potentials for cloud & logistics."
    },
    description: {
      id: "Alibaba adalah raksasa internet dan e-commerce asal Tiongkok yang didirikan oleh Jack Ma, mengoperasikan Taobao dan Tmall.",
      en: "Alibaba is a Chinese internet and e-commerce giant founded by Jack Ma, operating Taobao, Tmall, and Alibaba Cloud."
    }
  }
];

export const modulesData = [
  {
    id: "mod-1",
    title: {
      id: "Dasar Investasi",
      en: "Investment Basics"
    },
    description: {
      id: "Memahami konsep dasar investasi, inflasi, bunga majemuk, dan instrumen pasar modal.",
      en: "Understanding the basic concepts of investing, inflation, compound interest, and capital market instruments."
    },
    subModules: [
      {
        id: "mod-1-1",
        title: { id: "Pengenalan Pasar Modal", en: "Introduction to Capital Market" },
        description: { id: "Pelajari apa itu pasar modal dan fungsinya.", en: "Learn what the capital market is and its functions." },
        xpReward: 100,
        order: 1,
        requiredModuleId: null,
        material: {
          id: "Pasar modal adalah tempat bertemunya pihak yang membutuhkan dana (perusahaan atau pemerintah) dengan pihak yang memiliki dana (investor), melalui transaksi instrumen keuangan seperti saham dan obligasi. Pasar modal berperan sebagai sarana pendanaan bagi perusahaan dan sarana investasi bagi masyarakat.\n\nFungsi Pasar Modal\nPasar modal memiliki beberapa fungsi utama, yaitu:\na. Sumber Pendanaan: Perusahaan dapat memperoleh dana untuk mengembangkan bisnis melalui penerbitan saham atau obligasi.\nb. Sarana Investasi: Masyarakat dapat menginvestasikan dana untuk mendapatkan keuntungan.\nc. Mendorong Pertumbuhan Ekonomi: Dengan adanya investasi, perusahaan berkembang, menciptakan lapangan kerja, dan meningkatkan aktivitas ekonomi.\n\nPihak-pihak di Pasar Modal\nBeberapa pihak yang terlibat di pasar modal antara lain:\na. Investor: Pihak yang menanamkan modal dengan tujuan mendapatkan keuntungan.\nb. Emiten: Perusahaan yang menawarkan saham atau obligasi kepada publik.\nc. Perusahaan Sekuritas: Perantara yang membantu dalam proses jual beli saham.\nd. Regulator: Lembaga yang mengawasi jalannya pasar modal agar tetap transparan dan adil.\n\nInstrumen Pasar Modal\nInstrumen yang diperdagangkan di pasar modal meliputi:\na. Saham: Bukti kepemilikan atas suatu perusahaan.\nb. Obligasi: Surat utang yang diterbitkan oleh perusahaan atau pemerintah.\nc. Reksa Dana: Wadah investasi yang dikelola oleh manajer investasi.\nd. ETF (Exchange Traded Fund): Instrumen investasi yang diperdagangkan seperti saham.\n\nContoh Kasus:\nSebuah perusahaan ingin memperluas bisnisnya namun tidak memiliki cukup dana. Perusahaan tersebut kemudian menjual saham kepada publik melalui pasar modal. Investor yang membeli saham tersebut mengharapkan keuntungan dari kenaikan harga saham atau dividen.\n\nRingkasan:\n• Pasar modal adalah tempat bertemunya investor dan pihak yang membutuhkan dana\n• Fungsi utama pasar modal adalah sebagai sarana pendanaan dan investasi\n• Pihak yang terlibat meliputi investor, emiten, sekuritas, dan regulator\n• Instrumen pasar modal meliputi saham, obligasi, reksa dana, dan ETF\n• Pasar modal berperan penting dalam pertumbuhan ekonomi",
          en: "The capital market is a meeting place for those who need funds (companies or governments) and those who have funds (investors), through transactions of financial instruments such as stocks and bonds. The capital market acts as a means of funding for companies and a means of investment for the community.\n\nFunction of the Capital Market\nThe capital market has several main functions, namely:\na. Funding Sources: Companies can obtain funds to develop their business through the issuance of shares or bonds.\nb. Investment Facilities: People can invest funds to make a profit.\nc. Encouraging Economic Growth: With investment, companies develop, create jobs, and increase economic activity.\n\nParties in the Capital Market\nSome of the parties involved in the capital market include:\na. Investor: Parties who invest capital with the aim of making a profit.\nb. Issuers: Companies that offer stocks or bonds to the public.\nc. Securities Company: Intermediaries who assist in the process of buying and selling shares.\nd. Regulator: Institutions that supervise the running of the capital market to remain transparent and fair.\n\nCapital Market Instruments\nInstruments traded on the capital market include:\na. Stock: Proof of ownership of a company.\nb. Bonds: Debt securities issued by companies or governments.\nc. Mutual Funds: Investment containers managed by investment managers.\nd. ETF (Exchange Traded Fund): Investment instruments that are traded like stocks.\n\nCase Examples:\nA company wants to expand its business but doesn't have enough funds. The company then sells shares to the public through the capital market. Investors who buy the stock expect to benefit from an increase in stock prices or dividends.\n\nSummary:\n• The capital market is a meeting place for investors and those who need funds\n• The main function of the capital market is as a means of funding and investment\n• Parties involved include investors, issuers, securities, and regulators\n• Capital market instruments include stocks, bonds, mutual funds, and ETFs\n• The capital market plays an important role in economic growth"
        },
        quiz: {
          questions: [
            {
              question: {
                id: "Pasar modal adalah:",
                en: "The capital market is:"
              },
              options: {
                id: [
                  "Tempat jual beli barang",
                  "Tempat bertemunya investor dan perusahaan",
                  "Tempat menyimpan uang",
                  "Tempat meminjam uang"
                ],
                en: [
                  "Place for buying and selling goods",
                  "A meeting place for investors and companies",
                  "Where to save money",
                  "Where to borrow money"
                ]
              },
              correctAnswer: 1
            },
            {
              question: {
                id: "Fungsi pasar modal bagi perusahaan adalah:",
                en: "The functions of the capital market for companies are:"
              },
              options: {
                id: [
                  "Menyimpan uang",
                  "Mendapatkan pinjaman pribadi",
                  "Memperoleh sumber pendanaan",
                  "Mengurangi pajak"
                ],
                en: [
                  "Saving money",
                  "Getting a personal loan",
                  "Obtaining funding sources",
                  "Reduce taxes"
                ]
              },
              correctAnswer: 2
            },
            {
              question: {
                id: "Pihak yang membeli saham disebut:",
                en: "The party that buys shares is called:"
              },
              options: {
                id: [
                  "Emiten",
                  "Investor",
                  "Regulator",
                  "Perusahaan Sekuritas"
                ],
                en: [
                  "Issuer",
                  "Investor",
                  "Regulator",
                  "Securities"
                ]
              },
              correctAnswer: 1
            },
            {
              question: {
                id: "Berikut ini yang termasuk dalam instrumen pasar modal adalah:",
                en: "The following are included in capital market instruments:"
              },
              options: {
                id: [
                  "Deposito",
                  "Tabungan",
                  "Saham",
                  "Emas"
                ],
                en: [
                  "Deposits",
                  "Savings",
                  "Stocks",
                  "Gold"
                ]
              },
              correctAnswer: 2
            },
            {
              question: {
                id: "Lembaga yang mengawasi pasar modal disebut:",
                en: "The institutions that supervise the capital market are called:"
              },
              options: {
                id: [
                  "Investor",
                  "Emiten",
                  "Regulator",
                  "Broker"
                ],
                en: [
                  "Investor",
                  "Issuer",
                  "Regulator",
                  "Broker"
                ]
              },
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "mod-1-2",
        title: { id: "Mengenal Saham", en: "Knowing Stocks" },
        description: { id: "Apa itu saham dan bagaimana cara kerjanya?", en: "What is a stock and how does it work?" },
        xpReward: 100,
        order: 2,
        requiredModuleId: "mod-1-1",
        material: { id: "Materi untuk Mengenal Saham sedang disiapkan.", en: "Material for Knowing Stocks is being prepared." },
        quiz: {
          question: { id: "Apa itu saham?", en: "What is a stock?" },
          options: { id: ["Surat utang", "Bukti kepemilikan", "Mata uang", "Barang dagangan"], en: ["Debt security", "Proof of ownership", "Currency", "Merchandise"] },
          correctAnswer: 1
        }
      },
      {
        id: "mod-1-3",
        title: { id: "Resiko dan Return", en: "Risk and Return" },
        description: { id: "Memahami hubungan resiko dan imbal hasil.", en: "Understanding the relationship between risk and return." },
        xpReward: 100,
        order: 3,
        requiredModuleId: "mod-1-2",
        material: { id: "Materi untuk Resiko dan Return sedang disiapkan.", en: "Material for Risk and Return is being prepared." },
        quiz: {
          question: { id: "Prinsip utama investasi adalah:", en: "The main principle of investing is:" },
          options: { id: ["Low risk, high return", "High risk, high return", "No risk, high return", "High risk, no return"], en: ["Low risk, high return", "High risk, high return", "No risk, high return", "High risk, no return"] },
          correctAnswer: 1
        }
      },
      {
        id: "mod-1-4",
        title: { id: "Cara Memulai Investasi", en: "How to Start Investing" },
        description: { id: "Langkah-langkah memulai investasi saham.", en: "Steps to start investing in stocks." },
        xpReward: 100,
        order: 4,
        requiredModuleId: "mod-1-3",
        material: { id: "Materi untuk Cara Memulai Investasi sedang disiapkan.", en: "Material for How to Start Investing is being prepared." },
        quiz: {
          question: { id: "Langkah pertama memulai investasi adalah:", en: "The first step to start investing is:" },
          options: { id: ["Membuka rekening dana nasabah (RDN)", "Meminjam uang", "Membeli mobil", "Keluar dari pekerjaan"], en: ["Open a customer fund account (RDN)", "Borrow money", "Buy a car", "Quit your job"] },
          correctAnswer: 0
        }
      },
      {
        id: "mod-1-5",
        title: { id: "Istilah Dasar Investasi", en: "Basic Investment Terms" },
        description: { id: "Mengenal istilah-istilah di pasar modal.", en: "Knowing terms in the capital market." },
        xpReward: 100,
        order: 5,
        requiredModuleId: "mod-1-4",
        material: { id: "Materi untuk Istilah Dasar Investasi sedang disiapkan.", en: "Material for Basic Investment Terms is being prepared." },
        quiz: {
          question: { id: "Apa itu dividen?", en: "What is a dividend?" },
          options: { id: ["Pajak", "Utang", "Pembagian keuntungan perusahaan", "Gaji"], en: ["Tax", "Debt", "Sharing of company profits", "Salary"] },
          correctAnswer: 2
        }
      },
      {
        id: "mod-1-6",
        title: { id: "Jenis Investor", en: "Types of Investors" },
        description: { id: "Mengenali profil risiko dan jenis investor.", en: "Recognizing risk profiles and types of investors." },
        xpReward: 100,
        order: 6,
        requiredModuleId: "mod-1-5",
        material: { id: "Materi untuk Jenis Investor sedang disiapkan.", en: "Material for Types of Investors is being prepared." },
        quiz: {
          question: { id: "Investor konservatif cenderung memilih:", en: "Conservative investors tend to choose:" },
          options: { id: ["Saham gorengan", "Kripto", "Deposito dan Obligasi", "Opsi saham"], en: ["Penny stocks", "Crypto", "Deposits and Bonds", "Stock options"] },
          correctAnswer: 2
        }
      },
      {
        id: "mod-1-7",
        title: { id: "Strategi Investasi", en: "Investment Strategies" },
        description: { id: "Strategi investasi untuk pemula.", en: "Investment strategies for beginners." },
        xpReward: 100,
        order: 7,
        requiredModuleId: "mod-1-6",
        material: { id: "Materi untuk Strategi Investasi sedang disiapkan.", en: "Material for Investment Strategies is being prepared." },
        quiz: {
          question: { id: "Strategi investasi jangka panjang disebut juga:", en: "Long-term investment strategy is also called:" },
          options: { id: ["Day trading", "Scalping", "Value investing / Buy and hold", "Arbitrase"], en: ["Day trading", "Scalping", "Value investing / Buy and hold", "Arbitrage"] },
          correctAnswer: 2
        }
      },
      {
        id: "mod-1-8",
        title: { id: "Kesalahan Pemula", en: "Beginner Mistakes" },
        description: { id: "Kesalahan umum yang sering dilakukan pemula.", en: "Common mistakes often made by beginners." },
        xpReward: 100,
        order: 8,
        requiredModuleId: "mod-1-7",
        material: { id: "Materi untuk Kesalahan Pemula sedang disiapkan.", en: "Material for Beginner Mistakes is being prepared." },
        quiz: {
          question: { id: "Kesalahan umum pemula adalah:", en: "A common beginner mistake is:" },
          options: { id: ["Ikut-ikutan tanpa riset (FOMO)", "Diversifikasi portofolio", "Rutin menabung", "Membaca laporan keuangan"], en: ["Following the trend without research (FOMO)", "Portfolio diversification", "Saving regularly", "Reading financial reports"] },
          correctAnswer: 0
        }
      }
    ]
  },
  {
    id: "mod-2",
    title: {
      id: "Analisis Fundamental",
      en: "Fundamental Analysis"
    },
    description: {
      id: "Belajar menilai kesehatan bisnis perusahaan melalui laporan keuangan dan rasio utama.",
      en: "Learn to assess a company's business health through financial statements and key ratios."
    },
    subModules: [
      {
        id: "mod-2-1",
        title: { id: "Dasar Analisis Fundamental", en: "Fundamentals of Fundamental Analysis" },
        description: { id: "Pengantar rasio keuangan utama.", en: "Introduction to key financial ratios." },
        xpReward: 120,
        order: 1,
        requiredModuleId: "mod-1-8",
        material: {
          id: "Analisis fundamental adalah metode analisis yang berfokus pada faktor-faktor bisnis riil seperti laporan keuangan, kualitas manajemen, kondisi industri, dan makroekonomi untuk menentukan nilai intrinsik suatu saham.\n\nKetika melakukan analisis fundamental, ada dua pendekatan utama: Top-Down (melihat makroekonomi, lalu industri, lalu perusahaan) dan Bottom-Up (fokus langsung pada kinerja perusahaan individual).\n\nTiga laporan keuangan utama yang wajib dipelajari adalah Neraca (Balance Sheet - menunjukkan aset, liabilitas, dan ekuitas), Laporan Laba Rugi (Income Statement - menunjukkan pendapatan dan laba bersih), dan Laporan Arus Kas (Cash Flow Statement - menunjukkan aliran uang masuk dan keluar).\n\nBeberapa rasio fundamental yang paling sering digunakan antara lain:\n1. ROE (Return on Equity): Mengukur seberapa efisien perusahaan menghasilkan laba dari ekuitas pemegang saham.\n2. DER (Debt to Equity Ratio): Mengukur tingkat utang perusahaan dibanding ekuitasnya.\n3. EPS (Earnings Per Share): Laba bersih per lembar saham.",
          en: "Fundamental analysis is a method of evaluating a stock by measuring its intrinsic value through real business factors such as financial statements, management quality, industry conditions, and macroeconomics.\n\nWhen conducting fundamental analysis, there are two main approaches: Top-Down (examining macroeconomics, then the industry, then the company) and Bottom-Up (focusing directly on individual company performance).\n\nThe three main financial statements you must study are the Balance Sheet (shows assets, liabilities, and equity), the Income Statement (shows revenue and net income), and the Cash Flow Statement (shows the inflow and outflow of cash).\n\nSome of the most commonly used fundamental ratios include:\n1. ROE (Return on Equity): Measures how efficiently a company generates profits from shareholder equity.\n2. DER (Debt to Equity Ratio): Measures the company's leverage or debt relative to its equity.\n3. EPS (Earnings Per Share): Net profit allocated to each outstanding share."
        },
        quiz: {
          question: {
            id: "Manakah laporan keuangan yang menunjukkan posisi aset, utang, dan modal perusahaan pada waktu tertentu?",
            en: "Which financial statement shows a company's assets, liabilities, and equity at a specific point in time?"
          },
          options: {
            id: [
              "Laporan Laba Rugi",
              "Laporan Arus Kas",
              "Neraca (Balance Sheet)",
              "Catatan Atas Laporan Keuangan"
            ],
            en: [
              "Income Statement",
              "Cash Flow Statement",
              "Balance Sheet",
              "Notes to Financial Statements"
            ]
          },
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: "mod-3",
    title: {
      id: "Analisis Teknikal",
      en: "Technical Analysis"
    },
    description: {
      id: "Membaca grafik harga, tren pasar, support & resistance, serta indikator volume.",
      en: "Read price charts, market trends, support & resistance, and volume indicators."
    },
    subModules: [
      {
        id: "mod-3-1",
        title: { id: "Dasar Analisis Teknikal", en: "Fundamentals of Technical Analysis" },
        description: { id: "Pengenalan grafik harga, tren pasar, support & resistance.", en: "Introduction to price charts, market trends, support & resistance." },
        xpReward: 140,
        order: 1,
        requiredModuleId: "mod-2-1",
        material: {
          id: "Berbeda dengan analisis fundamental yang menganalisis 'apa' yang harus dibeli, analisis teknikal berfokus pada 'kapan' waktu yang tepat untuk membeli atau menjual dengan menganalisis pergerakan harga historis dan volume perdagangan di pasar.\n\nTiga prinsip dasar analisis teknikal adalah:\n1. Market action discounts everything (semua informasi sudah tercermin pada harga pasar).\n2. Prices move in trends (harga bergerak mengikuti tren tertentu: uptrend, downtrend, atau sideways).\n3. History repeats itself (pola psikologis pasar cenderung berulang dari waktu ke waktu).\n\nKonsep terpenting dalam analisis teknikal adalah Support dan Resistance. Support adalah level harga di bawah di mana permintaan (buying pressure) cukup kuat untuk menahan penurunan harga. Sebaliknya, Resistance adalah level harga di atas di mana penawaran (selling pressure) cukup kuat untuk menahan kenaikan harga.\n\nIndikator teknikal populer meliputi Moving Average (MA) untuk mengidentifikasi tren, Relative Strength Index (RSI) untuk mendeteksi kondisi jenuh beli (overbought) atau jenuh jual (oversold), dan Volume untuk mengonfirmasi kekuatan pergerakan harga.",
          en: "Unlike fundamental analysis which analyzes 'what' to buy, technical analysis focuses on 'when' is the right time to buy or sell by analyzing historical price movements and trading volumes in the market.\n\nThe three basic premises of technical analysis are:\n1. Market action discounts everything (all information is already reflected in the market price).\n2. Prices move in trends (price moves in a specific trend: uptrend, downtrend, or sideways).\n3. History repeats itself (market psychological patterns tend to recur over time).\n\nThe most important concepts in technical analysis are Support and Resistance. Support is a price level where buying pressure is strong enough to halt a price decline. Conversely, Resistance is a price level where selling pressure is strong enough to halt a price increase.\n\nPopular technical indicators include Moving Average (MA) to identify trends, Relative Strength Index (RSI) to detect overbought or oversold conditions, and Volume to confirm the strength of price movements."
        },
        quiz: {
          question: {
            id: "Apa arti dari level 'Support' dalam analisis teknikal?",
            en: "What does the 'Support' level mean in technical analysis?"
          },
          options: {
            id: [
              "Level harga tertinggi dalam satu tahun",
              "Tingkat bunga acuan yang ditetapkan bank sentral",
              "Level harga di mana tekanan beli cenderung kuat menahan penurunan harga lebih lanjut",
              "Indikator yang menunjukkan perusahaan akan bangkrut"
            ],
            en: [
              "The highest price level in a year",
              "The benchmark interest rate set by the central bank",
              "A price level where buying pressure is likely to halt further price declines",
              "An indicator that shows a company is going bankrupt"
            ]
          },
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: "mod-4",
    title: {
      id: "Valuasi Saham",
      en: "Stock Valuation"
    },
    description: {
      id: "Menilai apakah harga suatu saham tergolong murah (undervalued) atau mahal (overvalued).",
      en: "Assessing whether a stock price is cheap (undervalued) or expensive (overvalued)."
    },
    subModules: [
      {
        id: "mod-4-1",
        title: { id: "Dasar Valuasi Saham", en: "Stock Valuation Basics" },
        description: { id: "Cara menilai apakah harga suatu saham tergolong murah atau mahal.", en: "How to assess whether a stock price is cheap or expensive." },
        xpReward: 160,
        order: 1,
        requiredModuleId: "mod-3-1",
        material: {
          id: "Valuasi saham adalah proses menentukan nilai wajar (fair value) atau nilai intrinsik dari selembar saham. Dengan mengetahui nilai wajarnya, kita bisa memutuskan apakah harga pasar saat ini murah (undervalued), wajar (fairly valued), atau mahal (overvalued).\n\nDua metode valuasi yang paling umum digunakan adalah:\n1. Valuasi Relatif (Relative Valuation): Membandingkan rasio harga saham dengan metrik keuangan perusahaan sejenis. Rasio utama yang digunakan adalah:\n   - PER (Price to Earnings Ratio): Membandingkan harga saham dengan laba per saham (EPS). Semakin rendah PER dibandingkan industri sejenis, biasanya semakin murah saham tersebut.\n   - PBV (Price to Book Value): Membandingkan harga saham dengan nilai buku per saham. Biasanya, PBV < 1 dianggap undervalued.\n2. Valuasi Absolut (Absolute Valuation): Menghitung nilai intrinsik secara langsung berdasarkan proyeksi arus kas masa depan yang didiskontokan ke masa kini (Discounted Cash Flow / DCF).\n\nIngat, membeli saham hebat pada harga yang terlalu mahal dapat menghasilkan return yang buruk. Oleh karena itu, carilah saham berkualitas dengan 'Margin of Safety' (selisih antara nilai intrinsik dengan harga pasar) yang cukup lebar untuk melindungi modal Anda.",
          en: "Stock valuation is the process of determining the fair value or intrinsic value of a stock. By knowing its fair value, we can decide whether the current market price is cheap (undervalued), fair (fairly valued), or expensive (overvalued).\n\nThe two most common valuation methods are:\n1. Relative Valuation: Comparing a stock's price ratios with the financial metrics of similar companies. Key ratios include:\n   - PER (Price to Earnings Ratio): Compares the stock price to its earnings per share (EPS). The lower the PER compared to peers, the cheaper the stock usually is.\n   - PBV (Price to Book Value): Compares the stock price to its book value per share. Typically, PBV < 1 is considered undervalued.\n2. Absolute Valuation: Directly calculates intrinsic value based on projected future cash flows discounted back to the present (Discounted Cash Flow / DCF).\n\nRemember, buying a great stock at a price that is too high can yield poor returns. Therefore, look for quality stocks with a sufficient 'Margin of Safety' (the difference between intrinsic value and market price) to protect your capital."
        },
        quiz: {
          question: {
            id: "Jika suatu saham memiliki harga Rp 1.000 dan nilai buku per saham (Book Value per Share) sebesar Rp 2.000, berapa rasio PBV-nya dan apa artinya?",
            en: "If a stock has a price of Rp 1,000 and a Book Value per Share of Rp 2,000, what is its PBV ratio and what does it mean?"
          },
          options: {
            id: [
              "PBV = 2.0, artinya saham tersebut tergolong sangat mahal",
              "PBV = 0.5, artinya saham tersebut diperdagangkan di bawah nilai bukunya (potensi murah)",
              "PBV = 1.0, artinya harga saham sudah sangat pas dan tidak bisa naik lagi",
              "PBV = -0.5, artinya perusahaan sedang mengalami kerugian besar"
            ],
            en: [
              "PBV = 2.0, meaning the stock is considered very expensive",
              "PBV = 0.5, meaning the stock is traded below its book value (potentially cheap)",
              "PBV = 1.0, meaning the stock price is perfectly fair and cannot rise further",
              "PBV = -0.5, meaning the company is experiencing massive losses"
            ]
          },
          correctAnswer: 1
        }
      }
    ]
  },
  {
    id: "mod-5",
    title: {
      id: "Manajemen Risiko",
      en: "Risk Management"
    },
    description: {
      id: "Melindungi modal investasi Anda melalui diversifikasi, penentuan posisi, dan cut loss.",
      en: "Protect your investment capital through diversification, position sizing, and cut loss."
    },
    subModules: [
      {
        id: "mod-5-1",
        title: { id: "Dasar Manajemen Risiko", en: "Risk Management Basics" },
        description: { id: "Strategi diversifikasi dan cut loss.", en: "Diversification and cut loss strategies." },
        xpReward: 180,
        order: 1,
        requiredModuleId: "mod-4-1",
        material: {
          id: "Ada ungkapan terkenal di dunia investasi: 'Jangan menaruh semua telurmu dalam satu keranjang.' Ini adalah inti dari Manajemen Risiko. Manajemen risiko yang baik adalah hal yang membedakan antara investor sukses jangka panjang dengan orang yang kehilangan seluruh modalnya di pasar saham.\n\nTiga pilar utama manajemen risiko:\n1. Diversifikasi: Membagi modal investasi ke berbagai jenis saham, sektor industri, atau instrumen keuangan yang berbeda. Jika salah satu sektor turun, portofolio Anda tetap terlindungi oleh sektor lain yang naik atau stabil.\n2. Position Sizing (Penentuan Ukuran Posisi): Menentukan seberapa besar persentase modal yang dialokasikan untuk satu saham tertentu. Disarankan untuk tidak menempatkan lebih dari 10-15% modal pada satu saham berisiko tinggi.\n3. Rencana Keluar (Exit Plan): Menentukan batasan kerugian sebelum membeli saham. Batasan ini bisa berupa:\n   - Cut Loss: Menjual saham ketika harganya turun melewati batas toleransi risiko (misalnya turun 5-7% dari harga beli) untuk mencegah kerugian yang lebih besar.\n   - Take Profit: Menjual saham untuk merealisasikan keuntungan setelah mencapai target harga wajar.",
          en: "There is a famous saying in investing: 'Don't put all your eggs in one basket.' This is the core of Risk Management. Proper risk management is what separates long-term successful investors from those who lose all their capital in the stock market.\n\nThe three main pillars of risk management:\n1. Diversification: Spreading your investment capital across different stocks, industrial sectors, or financial instruments. If one sector declines, your portfolio is protected by others that rise or remain stable.\n2. Position Sizing: Determining what percentage of your capital to allocate to a specific stock. It is highly recommended not to place more than 10-15% of your capital in a single high-risk stock.\n3. Exit Plan: Setting loss limits before buying a stock. These limits can be:\n   - Cut Loss: Selling a stock when its price drops past a risk tolerance threshold (e.g., 5-7% below purchase price) to prevent larger losses.\n   - Take Profit: Selling a stock to realize gains after it reaches your fair price target."
        },
        quiz: {
          question: {
            id: "Apa tujuan utama dari diversifikasi portofolio investasi?",
            en: "What is the primary goal of diversifying an investment portfolio?"
          },
          options: {
            id: [
              "Menjamin investasi pasti untung 100% tanpa celah",
              "Memaksimalkan biaya komisi broker",
              "Meminimalkan risiko total portofolio dengan menyebarkan modal ke berbagai sektor/instrumen",
              "Membuat portofolio terlihat rumit dan profesional"
            ],
            en: [
              "Guaranteeing 100% profitable investment with no loopholes",
              "Maximizing broker commission fees",
              "Minimizing total portfolio risk by spreading capital across various sectors/instruments",
              "Making the portfolio look complex and professional"
            ]
          },
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: "mod-6",
    title: {
      id: "Psikologi dan Mindset Investasi",
      en: "Psychology & Investment Mindset"
    },
    description: {
      id: "Mengatasi bias emosi seperti ketakutan, keserakahan, FOMO, dan panik jual.",
      en: "Overcoming emotional biases like fear, greed, FOMO, and panic selling."
    },
    subModules: [
      {
        id: "mod-6-1",
        title: { id: "Menguasai Emosi dalam Investasi", en: "Mastering Emotions in Investing" },
        description: { id: "Belajar mengendalikan emosi saat berinvestasi.", en: "Learn to control emotions when investing." },
        xpReward: 200,
        order: 1,
        requiredModuleId: "mod-5-1",
        material: {
          id: "Investasi saham bukan hanya tentang matematika dan rasio keuangan, melainkan pertarungan melawan psikologi diri sendiri. Pikiran kita sering kali menjadi musuh terbesar saat berinvestasi.\n\nBeberapa bias psikologis dan emosi berbahaya yang sering dihadapi investor:\n1. FOMO (Fear of Missing Out): Ketakutan ketinggalan tren. FOMO membuat orang terburu-buru membeli saham yang harganya sudah naik sangat tinggi tanpa analisis, yang sering berakhir dengan kerugian besar saat harga berbalik turun.\n2. Greed & Fear (Keserakahan & Ketakutan): Keserakahan membuat kita tidak mau menjual saham saat sudah untung banyak karena berharap naik lebih tinggi lagi. Sebaliknya, ketakutan membuat kita panik menjual (panic selling) rugi saat pasar koreksi wajar jangka pendek.\n3. Loss Aversion: Kecenderungan psikologis di mana rasa sakit akibat kehilangan Rp 1 juta dirasakan jauh lebih kuat daripada kesenangan mendapatkan Rp 1 juta. Ini menyebabkan investor membiarkan kerugian membengkak (tidak mau cut loss) dengan harapan harga akan kembali ke harga beli.\n\nUntuk menjadi investor sukses, miliki 'mindset maraton', bukan 'mindset sprint'. Investasi adalah perjalanan jangka panjang yang membutuhkan kesabaran, kedisiplinan, dan ketenangan emosi.",
          en: "Stock investing is not just about mathematics and financial ratios, but a battle against one's own psychology. Our minds are often our own worst enemy when investing.\n\nSeveral dangerous psychological biases and emotions that investors frequently face:\n1. FOMO (Fear of Missing Out): The fear of missing a trend. FOMO drives people to rush into buying a stock that has soared high without analysis, which often results in heavy losses when the price reverses.\n2. Greed & Fear: Greed keeps us from selling a stock when we have a solid profit because we hope it goes even higher. Conversely, fear drives panic selling at a loss during normal short-term market corrections.\n3. Loss Aversion: A psychological tendency where the pain of losing Rp 1 million is felt much more intensely than the pleasure of gaining Rp 1 million. This causes investors to let losses run deep (refusing to cut loss) in hopes of breaking even.\n\nTo become a successful investor, develop a 'marathon mindset', not a 'sprint mindset'. Investing is a long-term journey that demands patience, discipline, and emotional stability."
        },
        quiz: {
          question: {
            id: "Apa istilah psikologis untuk dorongan emosi membeli suatu saham terburu-buru karena takut tertinggal oleh kenaikan harganya?",
            en: "What is the psychological term for the emotional urge to buy a stock hastily out of fear of being left behind by its rising price?"
          },
          options: {
            id: [
              "Loss Aversion",
              "FOMO (Fear of Missing Out)",
              "Confirmation Bias",
              "Value Investing"
            ],
            en: [
              "Loss Aversion",
              "FOMO (Fear of Missing Out)",
              "Confirmation Bias",
              "Value Investing"
            ]
          },
          correctAnswer: 1
        }
      }
    ]
  }
];

