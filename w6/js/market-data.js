// Market Data Integration for Trading Queen Website

class MarketDataManager {
    constructor() {
        this.apiKeys = {
            // Add your API keys here (use environment variables in production)
            alphavantage: 'demo', // Replace with actual API key
            finnhub: 'demo', // Replace with actual API key
            polygon: 'demo' // Replace with actual API key
        };
        
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
        this.updateInterval = null;
        this.websocket = null;
        
        this.init();
    }

    init() {
        console.log('Market Data Manager initialized');
        this.setupRealTimeUpdates();
        this.loadInitialData();
    }

    async loadInitialData() {
        try {
            // Load Indian market indices
            await this.loadIndianIndices();
            
            // Load currency data
            await this.loadCurrencyData();
            
            // Load top stocks
            await this.loadTopStocks();
            
            // Load market news
            await this.loadMarketNews();
            
        } catch (error) {
            console.error('Error loading initial market data:', error);
            this.loadFallbackData();
        }
    }

    async loadIndianIndices() {
        try {
            // For demo purposes, using simulated data
            // In production, integrate with NSE API or other Indian market data providers
            const indices = await this.getIndianMarketData();
            this.updateIndicesDisplay(indices);
        } catch (error) {
            console.error('Error loading Indian indices:', error);
            this.loadFallbackIndices();
        }
    }

    async getIndianMarketData() {
        // Simulate API call to NSE or other Indian market data provider
        // In production, replace with actual API calls
        
        const baseData = {
            nifty50: { base: 19800, volatility: 200 },
            sensex: { base: 66500, volatility: 500 },
            banknifty: { base: 44200, volatility: 300 },
            niftynext50: { base: 68500, volatility: 400 }
        };

        const data = {};
        for (const [key, config] of Object.entries(baseData)) {
            const change = (Math.random() - 0.5) * config.volatility;
            const price = config.base + change;
            const changePercent = (change / config.base) * 100;
            
            data[key] = {
                price: price,
                change: change,
                changePercent: changePercent,
                volume: Math.floor(Math.random() * 1000000) + 500000,
                high: price + Math.abs(change) * 0.5,
                low: price - Math.abs(change) * 0.5,
                timestamp: new Date().toISOString()
            };
        }

        return data;
    }

    async loadCurrencyData() {
        try {
            // Using a free currency API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            
            const usdInr = {
                price: data.rates.INR,
                change: (Math.random() - 0.5) * 0.5,
                changePercent: ((Math.random() - 0.5) * 0.5 / data.rates.INR) * 100,
                timestamp: new Date().toISOString()
            };

            this.updateCurrencyDisplay(usdInr);
        } catch (error) {
            console.error('Error loading currency data:', error);
            this.loadFallbackCurrency();
        }
    }

    async loadTopStocks() {
        try {
            // Simulate top Indian stocks data
            const topStocks = await this.getTopIndianStocks();
            this.updateTopStocksDisplay(topStocks);
        } catch (error) {
            console.error('Error loading top stocks:', error);
            this.loadFallbackStocks();
        }
    }

    async getTopIndianStocks() {
        const stockSymbols = [
            { symbol: 'RELIANCE', name: 'Reliance Industries', base: 2450 },
            { symbol: 'TCS', name: 'Tata Consultancy Services', base: 3780 },
            { symbol: 'HDFCBANK', name: 'HDFC Bank', base: 1680 },
            { symbol: 'INFY', name: 'Infosys', base: 1450 },
            { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', base: 2650 },
            { symbol: 'ITC', name: 'ITC Limited', base: 420 },
            { symbol: 'SBIN', name: 'State Bank of India', base: 590 },
            { symbol: 'BHARTIARTL', name: 'Bharti Airtel', base: 1180 }
        ];

        const stocks = stockSymbols.map(stock => {
            const change = (Math.random() - 0.5) * (stock.base * 0.05);
            const price = stock.base + change;
            const changePercent = (change / stock.base) * 100;
            
            return {
                symbol: stock.symbol,
                name: stock.name,
                price: price,
                change: change,
                changePercent: changePercent,
                volume: Math.floor(Math.random() * 10000000) + 1000000,
                marketCap: price * (Math.floor(Math.random() * 1000000000) + 100000000),
                recommendation: this.getRandomRecommendation(),
                timestamp: new Date().toISOString()
            };
        });

        return stocks;
    }

    getRandomRecommendation() {
        const recommendations = ['BUY', 'HOLD', 'SELL'];
        const weights = [0.5, 0.35, 0.15]; // More likely to be BUY
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                return recommendations[i];
            }
        }
        return 'HOLD';
    }

    async loadMarketNews() {
        try {
            // Using NewsAPI for market news (replace with your API key)
            const newsData = await this.getMarketNews();
            this.updateNewsDisplay(newsData);
        } catch (error) {
            console.error('Error loading market news:', error);
            this.loadFallbackNews();
        }
    }

    async getMarketNews() {
        // Simulate news API call
        // In production, use NewsAPI, Google News API, or other news services
        const newsItems = [
            {
                title: "Indian Markets Rally on Strong Q3 Earnings",
                description: "Nifty and Sensex surge as major companies report better-than-expected quarterly results.",
                source: "Economic Times",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                url: "#",
                category: "markets"
            },
            {
                title: "RBI Keeps Repo Rate Unchanged at 6.5%",
                description: "Reserve Bank of India maintains status quo on interest rates in latest monetary policy review.",
                source: "Business Standard",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                url: "#",
                category: "policy"
            },
            {
                title: "Tech Stocks Lead Market Gains",
                description: "IT sector outperforms as global technology demand remains robust.",
                source: "Mint",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                url: "#",
                category: "sectors"
            },
            {
                title: "FII Inflows Boost Market Sentiment",
                description: "Foreign institutional investors continue to pump money into Indian equities.",
                source: "Financial Express",
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                url: "#",
                category: "flows"
            }
        ];

        return newsItems;
    }

    updateIndicesDisplay(indices) {
        // Update NIFTY 50
        if (indices.nifty50) {
            this.updateMarketCard('nifty', indices.nifty50);
        }

        // Update SENSEX
        if (indices.sensex) {
            this.updateMarketCard('sensex', indices.sensex);
        }

        // Update BANK NIFTY
        if (indices.banknifty) {
            this.updateMarketCard('banknifty', indices.banknifty);
        }
    }

    updateCurrencyDisplay(currencyData) {
        this.updateMarketCard('usdinr', currencyData);
    }

    updateMarketCard(symbol, data) {
        const priceElement = document.getElementById(`${symbol}-price`);
        const changeElement = document.getElementById(`${symbol}-change`);

        if (priceElement && changeElement) {
            // Update price
            priceElement.textContent = this.formatPrice(data.price);

            // Update change with color coding
            const changeText = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`;
            changeElement.textContent = changeText;

            // Apply color classes
            const colorClass = data.change >= 0 ? 'text-success' : 'text-danger';
            priceElement.className = colorClass;
            changeElement.className = colorClass;

            // Add pulse animation
            priceElement.classList.add('pulse');
            setTimeout(() => {
                priceElement.classList.remove('pulse');
            }, 1000);

            // Store data for charts
            this.storeChartData(symbol, data);
        }
    }

    updateTopStocksDisplay(stocks) {
        const stockContainer = document.getElementById('top-stocks');
        if (!stockContainer) return;

        stockContainer.innerHTML = '';

        stocks.slice(0, 4).forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item mb-3';

            const changeClass = stock.change >= 0 ? 'text-success' : 'text-danger';
            const changeSymbol = stock.change >= 0 ? '+' : '';

            stockItem.innerHTML = `
                <div>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <small class="text-muted">${stock.name}</small>
                    <div class="stock-change ${changeClass}">
                        ${changeSymbol}${stock.change.toFixed(2)} (${changeSymbol}${stock.changePercent.toFixed(2)}%)
                    </div>
                </div>
                <div class="text-end">
                    <div class="stock-price ${changeClass}">₹${this.formatPrice(stock.price)}</div>
                    <small class="badge bg-${this.getRecommendationColor(stock.recommendation)}">${stock.recommendation}</small>
                </div>
            `;

            stockContainer.appendChild(stockItem);
        });
    }

    updateNewsDisplay(newsData) {
        const newsContainer = document.getElementById('latest-news');
        if (!newsContainer) return;

        newsContainer.innerHTML = '';

        newsData.slice(0, 3).forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item mb-3';
            
            const timeAgo = this.getTimeAgo(new Date(news.publishedAt));
            
            newsItem.innerHTML = `
                <h6>${news.title}</h6>
                <p>${news.description}</p>
                <small class="text-muted">${news.source} • ${timeAgo}</small>
            `;

            newsContainer.appendChild(newsItem);
        });
    }

    storeChartData(symbol, data) {
        if (!this.cache.has('chartData')) {
            this.cache.set('chartData', new Map());
        }

        const chartData = this.cache.get('chartData');
        if (!chartData.has(symbol)) {
            chartData.set(symbol, []);
        }

        const symbolData = chartData.get(symbol);
        symbolData.push({
            timestamp: new Date(data.timestamp),
            price: data.price,
            change: data.change
        });

        // Keep only last 100 data points
        if (symbolData.length > 100) {
            symbolData.shift();
        }
    }

    setupRealTimeUpdates() {
        // Update data every 30 seconds
        this.updateInterval = setInterval(() => {
            this.loadInitialData();
        }, 30000);

        // Setup WebSocket for real-time updates (if available)
        this.setupWebSocket();
    }

    setupWebSocket() {
        // WebSocket implementation for real-time data
        // This would connect to a real-time market data provider
        try {
            // Example WebSocket connection (replace with actual endpoint)
            // this.websocket = new WebSocket('wss://your-market-data-provider.com/stream');
            
            // For demo, we'll simulate WebSocket updates
            this.simulateWebSocketUpdates();
        } catch (error) {
            console.error('WebSocket connection failed:', error);
        }
    }

    simulateWebSocketUpdates() {
        // Simulate real-time price updates every 5 seconds
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of update
                this.loadIndianIndices();
            }
        }, 5000);
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    getRecommendationColor(recommendation) {
        switch(recommendation) {
            case 'BUY': return 'success';
            case 'SELL': return 'danger';
            case 'HOLD': return 'warning';
            default: return 'secondary';
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    // Fallback data methods
    loadFallbackData() {
        console.log('Loading fallback market data');
        
        const fallbackData = {
            nifty50: { price: 19850.25, change: 125.30, changePercent: 0.63 },
            sensex: { price: 66589.93, change: 298.67, changePercent: 0.45 },
            banknifty: { price: 44250.80, change: -89.45, changePercent: -0.20 }
        };

        this.updateIndicesDisplay(fallbackData);
        this.loadFallbackCurrency();
        this.loadFallbackStocks();
        this.loadFallbackNews();
    }

    loadFallbackIndices() {
        const fallbackIndices = {
            nifty50: { price: 19850.25, change: 125.30, changePercent: 0.63 },
            sensex: { price: 66589.93, change: 298.67, changePercent: 0.45 },
            banknifty: { price: 44250.80, change: -89.45, changePercent: -0.20 }
        };
        this.updateIndicesDisplay(fallbackIndices);
    }

    loadFallbackCurrency() {
        const fallbackCurrency = { price: 83.25, change: 0.15, changePercent: 0.18 };
        this.updateCurrencyDisplay(fallbackCurrency);
    }

    loadFallbackStocks() {
        const fallbackStocks = [
            { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 23.45, changePercent: 0.96, recommendation: 'BUY' },
            { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3789.20, change: 45.80, changePercent: 1.22, recommendation: 'BUY' },
            { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: -12.30, changePercent: -0.73, recommendation: 'HOLD' },
            { symbol: 'INFY', name: 'Infosys', price: 1456.25, change: 18.75, changePercent: 1.30, recommendation: 'BUY' }
        ];
        this.updateTopStocksDisplay(fallbackStocks);
    }

    loadFallbackNews() {
        const fallbackNews = [
            {
                title: "Indian Markets Rally on Strong Q3 Results",
                description: "Nifty and Sensex surge as major companies report better-than-expected quarterly earnings.",
                source: "Economic Times",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "RBI Maintains Repo Rate at 6.5%",
                description: "Reserve Bank of India keeps key interest rates unchanged in latest monetary policy review.",
                source: "Business Standard",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "Tech Stocks Lead Market Gains",
                description: "IT sector outperforms as global technology demand remains strong.",
                source: "Mint",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
        ];
        this.updateNewsDisplay(fallbackNews);
    }

    // Public API methods
    getChartData(symbol) {
        const chartData = this.cache.get('chartData');
        return chartData ? chartData.get(symbol) || [] : [];
    }

    refreshData() {
        this.loadInitialData();
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.websocket) {
            this.websocket.close();
        }
        this.cache.clear();
    }
}

// Initialize market data manager
const marketDataManager = new MarketDataManager();

// Make it globally available
window.MarketDataManager = marketDataManager;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketDataManager;
}
