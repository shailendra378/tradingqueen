// Market Data Routes
const express = require('express');
const router = express.Router();

// Simulated market data (replace with real API integration in production)
let marketData = {
    indices: {
        nifty: {
            symbol: 'NIFTY 50',
            price: 19850.25,
            change: 125.30,
            changePercent: 0.63,
            volume: 2500000,
            high: 19895.30,
            low: 19785.20,
            lastUpdated: new Date().toISOString()
        },
        sensex: {
            symbol: 'SENSEX',
            price: 66589.93,
            change: 298.67,
            changePercent: 0.45,
            volume: 1800000,
            high: 66750.45,
            low: 66450.20,
            lastUpdated: new Date().toISOString()
        },
        banknifty: {
            symbol: 'BANK NIFTY',
            price: 44250.80,
            change: -89.45,
            changePercent: -0.20,
            volume: 3200000,
            high: 44380.50,
            low: 44150.30,
            lastUpdated: new Date().toISOString()
        },
        usdinr: {
            symbol: 'USD/INR',
            price: 83.25,
            change: 0.15,
            changePercent: 0.18,
            volume: 0,
            high: 83.35,
            low: 83.10,
            lastUpdated: new Date().toISOString()
        }
    },
    stocks: {
        gainers: [
            { symbol: 'RELIANCE', price: 2456.75, change: 59.45, changePercent: 2.48, volume: 1500000 },
            { symbol: 'TCS', price: 3789.20, change: 68.90, changePercent: 1.85, volume: 890000 },
            { symbol: 'INFY', price: 1456.25, change: 23.75, changePercent: 1.66, volume: 1200000 },
            { symbol: 'HINDUNILVR', price: 2650.30, change: 32.10, changePercent: 1.23, volume: 750000 },
            { symbol: 'ITC', price: 420.85, change: 4.15, changePercent: 0.99, volume: 2100000 }
        ],
        losers: [
            { symbol: 'SBIN', price: 590.45, change: -11.25, changePercent: -1.87, volume: 1800000 },
            { symbol: 'AXISBANK', price: 1045.20, change: -15.30, changePercent: -1.44, volume: 950000 },
            { symbol: 'BHARTIARTL', price: 1180.75, change: -13.45, changePercent: -1.13, volume: 1100000 },
            { symbol: 'MARUTI', price: 10250.30, change: -98.70, changePercent: -0.95, volume: 320000 },
            { symbol: 'ASIANPAINT', price: 3245.60, change: -25.40, changePercent: -0.78, volume: 480000 }
        ]
    },
    sectors: [
        { name: 'Banking', change: 1.25, volume: 5600000 },
        { name: 'IT', change: 0.85, volume: 3200000 },
        { name: 'Pharma', change: -0.45, volume: 1800000 },
        { name: 'Auto', change: 0.35, volume: 2100000 },
        { name: 'FMCG', change: -0.15, volume: 1500000 },
        { name: 'Energy', change: 1.45, volume: 2800000 },
        { name: 'Metals', change: -1.05, volume: 1900000 },
        { name: 'Realty', change: 2.15, volume: 900000 }
    ]
};

// Function to simulate real-time data updates
const updateMarketData = () => {
    // Update indices with small random variations
    Object.keys(marketData.indices).forEach(key => {
        const index = marketData.indices[key];
        const variation = (Math.random() - 0.5) * (index.price * 0.001); // 0.1% max variation
        
        index.price += variation;
        index.change += variation;
        index.changePercent = (index.change / (index.price - index.change)) * 100;
        index.volume += Math.floor(Math.random() * 100000);
        index.lastUpdated = new Date().toISOString();
        
        // Update high/low
        if (index.price > index.high) index.high = index.price;
        if (index.price < index.low) index.low = index.price;
    });

    // Update stock prices
    ['gainers', 'losers'].forEach(category => {
        marketData.stocks[category].forEach(stock => {
            const variation = (Math.random() - 0.5) * (stock.price * 0.002);
            stock.price += variation;
            stock.change += variation;
            stock.changePercent = (stock.change / (stock.price - stock.change)) * 100;
            stock.volume += Math.floor(Math.random() * 50000);
        });
    });

    // Update sectors
    marketData.sectors.forEach(sector => {
        const variation = (Math.random() - 0.5) * 0.1;
        sector.change += variation;
        sector.volume += Math.floor(Math.random() * 100000);
    });
};

// Update market data every 30 seconds
setInterval(updateMarketData, 30000);

// Get all market data
router.get('/overview', (req, res) => {
    try {
        res.json({
            success: true,
            data: marketData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Market overview error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market data'
        });
    }
});

// Get specific index data
router.get('/index/:symbol', (req, res) => {
    try {
        const { symbol } = req.params;
        const index = marketData.indices[symbol.toLowerCase()];
        
        if (!index) {
            return res.status(404).json({
                success: false,
                error: 'Index not found'
            });
        }

        res.json({
            success: true,
            data: index,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Index data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch index data'
        });
    }
});

// Get top gainers
router.get('/gainers', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const gainers = marketData.stocks.gainers
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, limit);

        res.json({
            success: true,
            data: gainers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Gainers data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch gainers data'
        });
    }
});

// Get top losers
router.get('/losers', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const losers = marketData.stocks.losers
            .sort((a, b) => a.changePercent - b.changePercent)
            .slice(0, limit);

        res.json({
            success: true,
            data: losers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Losers data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch losers data'
        });
    }
});

// Get sector performance
router.get('/sectors', (req, res) => {
    try {
        res.json({
            success: true,
            data: marketData.sectors,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sectors data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sectors data'
        });
    }
});

// Get market status
router.get('/status', (req, res) => {
    try {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
        
        // Market hours: 9:15 AM to 3:30 PM IST (915 to 1530)
        const isMarketOpen = isWeekday && currentTime >= 915 && currentTime <= 1530;

        res.json({
            success: true,
            data: {
                isOpen: isMarketOpen,
                status: isMarketOpen ? 'OPEN' : 'CLOSED',
                nextSession: isMarketOpen ? 'Current Session' : 'Next Trading Day',
                timezone: 'Asia/Kolkata',
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Market status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market status'
        });
    }
});

// Search stocks
router.get('/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Search query must be at least 2 characters'
            });
        }

        const allStocks = [...marketData.stocks.gainers, ...marketData.stocks.losers];
        const results = allStocks.filter(stock => 
            stock.symbol.toLowerCase().includes(q.toLowerCase())
        );

        res.json({
            success: true,
            data: results,
            query: q,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Stock search error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search stocks'
        });
    }
});

// Get historical data (simulated)
router.get('/historical/:symbol', (req, res) => {
    try {
        const { symbol } = req.params;
        const { period = '1M' } = req.query;
        
        // Generate simulated historical data
        const days = period === '1D' ? 1 : period === '1W' ? 7 : period === '1M' ? 30 : 90;
        const basePrice = marketData.indices[symbol.toLowerCase()]?.price || 1000;
        
        const historicalData = [];
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const variation = (Math.random() - 0.5) * (basePrice * 0.02);
            const price = basePrice + variation;
            
            historicalData.push({
                date: date.toISOString().split('T')[0],
                open: price - (Math.random() * 10),
                high: price + (Math.random() * 15),
                low: price - (Math.random() * 15),
                close: price,
                volume: Math.floor(Math.random() * 5000000) + 1000000
            });
        }

        res.json({
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                period,
                data: historicalData
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Historical data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch historical data'
        });
    }
});

module.exports = router;
