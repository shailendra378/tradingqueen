// News and Blogs Routes
const express = require('express');
const router = express.Router();

// Simulated news data (replace with real API integration in production)
let newsData = {
    marketNews: [
        {
            id: 1,
            title: "Indian Markets Rally on Strong Q3 Results",
            summary: "Nifty and Sensex surge as major companies report better-than-expected quarterly earnings.",
            content: "The Indian stock markets witnessed a significant rally today as major companies across sectors reported robust quarterly earnings. The Nifty 50 index gained over 1.5% while the Sensex climbed more than 500 points during the trading session.",
            source: "Economic Times",
            author: "Market Reporter",
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            category: "market",
            tags: ["earnings", "nifty", "sensex", "rally"],
            imageUrl: "https://via.placeholder.com/400x200?text=Market+Rally",
            readTime: "3 min read"
        },
        {
            id: 2,
            title: "RBI Maintains Repo Rate at 6.5%",
            summary: "Reserve Bank of India keeps key interest rates unchanged in latest monetary policy review.",
            content: "The Reserve Bank of India (RBI) has decided to maintain the repo rate at 6.5% in its latest monetary policy committee meeting. The decision was widely expected by market participants and economists.",
            source: "Business Standard",
            author: "Policy Analyst",
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            category: "policy",
            tags: ["rbi", "repo-rate", "monetary-policy"],
            imageUrl: "https://via.placeholder.com/400x200?text=RBI+Policy",
            readTime: "4 min read"
        },
        {
            id: 3,
            title: "Tech Stocks Lead Market Gains",
            summary: "IT sector outperforms as global technology demand remains strong.",
            content: "Technology stocks led the market gains today with major IT companies posting significant increases. The sector benefited from strong global demand for digital services and positive earnings outlook.",
            source: "Mint",
            author: "Tech Correspondent",
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            category: "sector",
            tags: ["technology", "it-sector", "stocks"],
            imageUrl: "https://via.placeholder.com/400x200?text=Tech+Stocks",
            readTime: "2 min read"
        },
        {
            id: 4,
            title: "Foreign Institutional Investors Turn Bullish",
            summary: "FIIs increase equity allocation as market fundamentals improve.",
            content: "Foreign institutional investors have turned increasingly bullish on Indian equities, with net inflows reaching multi-month highs. Improved economic indicators and corporate earnings have boosted investor confidence.",
            source: "Financial Express",
            author: "Investment Analyst",
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
            category: "investment",
            tags: ["fii", "foreign-investment", "equity"],
            imageUrl: "https://via.placeholder.com/400x200?text=FII+Investment",
            readTime: "5 min read"
        },
        {
            id: 5,
            title: "Banking Sector Shows Resilience",
            summary: "Major banks report strong asset quality and improved margins.",
            content: "The banking sector demonstrated remarkable resilience with major lenders reporting improved asset quality metrics and net interest margins. Credit growth remains robust across retail and corporate segments.",
            source: "Money Control",
            author: "Banking Reporter",
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            category: "banking",
            tags: ["banking", "asset-quality", "credit-growth"],
            imageUrl: "https://via.placeholder.com/400x200?text=Banking+Sector",
            readTime: "4 min read"
        }
    ],
    globalNews: [
        {
            id: 6,
            title: "US Federal Reserve Signals Rate Pause",
            summary: "Fed officials indicate potential pause in rate hikes amid economic uncertainty.",
            content: "Federal Reserve officials have signaled a potential pause in interest rate increases as they assess the impact of previous hikes on the economy. Markets responded positively to the dovish stance.",
            source: "Reuters",
            author: "Global Markets",
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            category: "global",
            tags: ["federal-reserve", "interest-rates", "us-economy"],
            imageUrl: "https://via.placeholder.com/400x200?text=Fed+Policy",
            readTime: "3 min read"
        },
        {
            id: 7,
            title: "China's Economic Recovery Gains Momentum",
            summary: "Latest data shows accelerating growth in manufacturing and services.",
            content: "China's economic recovery is gaining momentum with recent data showing strong growth in both manufacturing and services sectors. The positive trend is expected to benefit global markets.",
            source: "Bloomberg",
            author: "Asia Correspondent",
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            category: "global",
            tags: ["china", "economic-recovery", "manufacturing"],
            imageUrl: "https://via.placeholder.com/400x200?text=China+Economy",
            readTime: "4 min read"
        }
    ],
    economicData: [
        {
            id: 8,
            title: "India's GDP Growth Beats Expectations",
            summary: "Economy grows 7.2% in latest quarter, surpassing analyst forecasts.",
            content: "India's gross domestic product expanded by 7.2% in the latest quarter, beating economist expectations of 6.8%. The strong performance was driven by robust domestic consumption and investment.",
            source: "Economic Survey",
            author: "Economic Analyst",
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            category: "economic-data",
            tags: ["gdp", "economic-growth", "india"],
            imageUrl: "https://via.placeholder.com/400x200?text=GDP+Growth",
            readTime: "5 min read"
        },
        {
            id: 9,
            title: "Inflation Moderates to 5.2%",
            summary: "Consumer price inflation eases from previous month's 5.7%.",
            content: "Consumer price inflation moderated to 5.2% in the latest month from 5.7% in the previous month, providing some relief to policymakers and consumers alike.",
            source: "Statistics Ministry",
            author: "Data Analyst",
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            category: "economic-data",
            tags: ["inflation", "cpi", "consumer-prices"],
            imageUrl: "https://via.placeholder.com/400x200?text=Inflation+Data",
            readTime: "3 min read"
        }
    ]
};

// Newsletter subscribers (in-memory storage)
let newsletterSubscribers = new Set();

// Function to simulate real-time news updates
const updateNewsData = () => {
    // Add timestamp variations to make news appear more dynamic
    newsData.marketNews.forEach(news => {
        // Simulate view count increases
        if (!news.views) news.views = Math.floor(Math.random() * 1000) + 100;
        news.views += Math.floor(Math.random() * 10);
    });
};

// Update news data every 5 minutes
setInterval(updateNewsData, 5 * 60 * 1000);

// Get all news
router.get('/all', (req, res) => {
    try {
        const { category, limit = 10, offset = 0 } = req.query;
        
        let allNews = [
            ...newsData.marketNews,
            ...newsData.globalNews,
            ...newsData.economicData
        ];
        
        // Filter by category if specified
        if (category && category !== 'all') {
            allNews = allNews.filter(news => news.category === category);
        }
        
        // Sort by published date (newest first)
        allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Apply pagination
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedNews = allNews.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedNews,
            total: allNews.length,
            limit: parseInt(limit),
            offset: parseInt(offset),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get all news error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch news'
        });
    }
});

// Get market news
router.get('/market', (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const marketNews = newsData.marketNews
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: marketNews,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Market news error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market news'
        });
    }
});

// Get global news
router.get('/global', (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const globalNews = newsData.globalNews
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: globalNews,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Global news error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch global news'
        });
    }
});

// Get economic data news
router.get('/economic', (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const economicNews = newsData.economicData
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: economicNews,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Economic news error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch economic news'
        });
    }
});

// Get single news article
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const allNews = [
            ...newsData.marketNews,
            ...newsData.globalNews,
            ...newsData.economicData
        ];
        
        const article = allNews.find(news => news.id === parseInt(id));
        
        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }
        
        // Increment view count
        if (!article.views) article.views = 0;
        article.views++;
        
        res.json({
            success: true,
            data: article,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch article'
        });
    }
});

// Search news
router.get('/search/:query', (req, res) => {
    try {
        const { query } = req.params;
        const { limit = 10 } = req.query;
        
        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Search query must be at least 2 characters'
            });
        }
        
        const allNews = [
            ...newsData.marketNews,
            ...newsData.globalNews,
            ...newsData.economicData
        ];
        
        const searchResults = allNews.filter(news => 
            news.title.toLowerCase().includes(query.toLowerCase()) ||
            news.summary.toLowerCase().includes(query.toLowerCase()) ||
            news.content.toLowerCase().includes(query.toLowerCase()) ||
            news.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        const limitedResults = searchResults
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: limitedResults,
            query,
            total: searchResults.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Search news error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search news'
        });
    }
});

// Newsletter subscription
router.post('/newsletter/subscribe', (req, res) => {
    try {
        const { email, name } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }
        
        // Check if already subscribed
        if (newsletterSubscribers.has(email)) {
            return res.status(409).json({
                success: false,
                error: 'Email already subscribed'
            });
        }
        
        // Add to subscribers
        newsletterSubscribers.add(email);
        
        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            email,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to subscribe to newsletter'
        });
    }
});

// Newsletter unsubscribe
router.post('/newsletter/unsubscribe', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        
        if (!newsletterSubscribers.has(email)) {
            return res.status(404).json({
                success: false,
                error: 'Email not found in subscribers'
            });
        }
        
        newsletterSubscribers.delete(email);
        
        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter',
            email,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unsubscribe from newsletter'
        });
    }
});

// Get trending topics
router.get('/trending/topics', (req, res) => {
    try {
        const allNews = [
            ...newsData.marketNews,
            ...newsData.globalNews,
            ...newsData.economicData
        ];
        
        // Extract and count tags
        const tagCounts = {};
        allNews.forEach(news => {
            news.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        // Sort by frequency and get top 10
        const trendingTopics = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));
        
        res.json({
            success: true,
            data: trendingTopics,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Trending topics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch trending topics'
        });
    }
});

// Get news categories
router.get('/categories/list', (req, res) => {
    try {
        const categories = [
            { id: 'market', name: 'Market News', count: newsData.marketNews.length },
            { id: 'global', name: 'Global News', count: newsData.globalNews.length },
            { id: 'economic-data', name: 'Economic Data', count: newsData.economicData.length },
            { id: 'policy', name: 'Policy Updates', count: 0 },
            { id: 'sector', name: 'Sector Analysis', count: 0 },
            { id: 'investment', name: 'Investment Insights', count: 0 },
            { id: 'banking', name: 'Banking & Finance', count: 0 }
        ];
        
        res.json({
            success: true,
            data: categories,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

module.exports = router;
