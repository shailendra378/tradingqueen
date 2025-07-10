// News API Integration for Trading Queen Website

class NewsAPIManager {
    constructor() {
        this.apiKeys = {
            // Add your API keys here (use environment variables in production)
            newsapi: 'demo', // Replace with actual NewsAPI key
            gnews: 'demo', // Replace with actual GNews API key
            finnhub: 'demo' // Replace with actual Finnhub API key
        };
        
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
        this.currentPage = 1;
        this.pageSize = 10;
        this.currentCategory = 'all';
        this.newsData = [];
        
        this.init();
    }

    init() {
        console.log('News API Manager initialized');
        this.setupEventListeners();
        this.loadInitialNews();
        this.startBreakingNewsTicker();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // News filter buttons
        document.querySelectorAll('.news-filter-btn').forEach(button => {
            button.addEventListener('click', (e) => this.filterNews(e));
        });

        // Refresh news button
        const refreshBtn = document.getElementById('refreshNews');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshNews());
        }

        // Load more news button
        const loadMoreBtn = document.getElementById('loadMoreNews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreNews());
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.subscribeNewsletter(e));
        }
    }

    async loadInitialNews() {
        try {
            // Load featured news
            await this.loadFeaturedNews();
            
            // Load latest news
            await this.loadLatestNews();
            
            // Update news count
            this.updateNewsCount();
            
        } catch (error) {
            console.error('Error loading initial news:', error);
            this.loadFallbackNews();
        }
    }

    async loadFeaturedNews() {
        try {
            const featuredNews = await this.getFeaturedNews();
            this.displayFeaturedNews(featuredNews);
        } catch (error) {
            console.error('Error loading featured news:', error);
            this.loadFallbackFeaturedNews();
        }
    }

    async getFeaturedNews() {
        // Simulate API call to get featured news
        // In production, use actual news APIs like NewsAPI, GNews, etc.
        
        const featuredArticles = [
            {
                title: "Indian Markets Hit Record High as FII Inflows Surge",
                description: "The Nifty 50 and Sensex reached new all-time highs today as foreign institutional investors pumped in record amounts into Indian equities, driven by strong Q3 earnings and positive economic indicators.",
                content: "Indian stock markets witnessed a historic rally today with both benchmark indices scaling new peaks. The Nifty 50 crossed the 20,000 mark for the first time while the Sensex surged past 67,000 points...",
                source: "Economic Times",
                author: "Market Desk",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/800x400/667eea/ffffff?text=Market+Rally",
                category: "markets",
                importance: "high"
            }
        ];

        return featuredArticles;
    }

    displayFeaturedNews(articles) {
        const container = document.getElementById('featuredNews');
        if (!container || !articles.length) return;

        container.innerHTML = articles.map(article => `
            <div class="card featured-card mb-4">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${article.urlToImage}" class="img-fluid rounded-start h-100 object-fit-cover" alt="Featured News">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-danger">Featured</span>
                                <small class="text-muted">${this.getTimeAgo(new Date(article.publishedAt))}</small>
                            </div>
                            <h4 class="card-title">${article.title}</h4>
                            <p class="card-text">${article.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-user"></i> ${article.author} | 
                                    <i class="fas fa-newspaper"></i> ${article.source}
                                </small>
                                <button class="btn btn-primary" onclick="newsManager.showFullArticle('${article.title}')">
                                    Read Full Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadLatestNews() {
        try {
            const latestNews = await this.getLatestNews(this.currentCategory, this.currentPage);
            this.newsData = this.currentPage === 1 ? latestNews : [...this.newsData, ...latestNews];
            this.displayLatestNews(this.newsData);
        } catch (error) {
            console.error('Error loading latest news:', error);
            this.loadFallbackLatestNews();
        }
    }

    async getLatestNews(category = 'all', page = 1) {
        // Simulate API call to get latest news
        // In production, integrate with actual news APIs
        
        const newsCategories = {
            markets: ['stock market', 'trading', 'equity', 'mutual funds', 'IPO'],
            economy: ['GDP', 'inflation', 'economic policy', 'budget', 'fiscal'],
            policy: ['RBI', 'monetary policy', 'government policy', 'regulation'],
            global: ['global markets', 'international trade', 'forex', 'commodities'],
            crypto: ['cryptocurrency', 'bitcoin', 'blockchain', 'digital currency']
        };

        const sampleNews = [
            {
                title: "RBI Keeps Repo Rate Unchanged at 6.5% in Latest Policy Review",
                description: "The Reserve Bank of India maintained the repo rate at 6.5% for the sixth consecutive time, citing balanced inflation and growth concerns.",
                source: "Business Standard",
                author: "Policy Desk",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/f093fb/ffffff?text=RBI+Policy",
                category: "policy"
            },
            {
                title: "IT Sector Leads Market Rally with 3% Gains",
                description: "Information Technology stocks surged 3% today led by TCS, Infosys, and Wipro on strong Q3 earnings expectations.",
                source: "Mint",
                author: "Sector Desk",
                publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/4facfe/ffffff?text=IT+Sector",
                category: "markets"
            },
            {
                title: "India's GDP Growth Projected at 6.8% for FY24",
                description: "Economic Survey projects India's GDP growth at 6.8% for the current fiscal year, supported by strong domestic demand.",
                source: "Financial Express",
                author: "Economy Desk",
                publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/667eea/ffffff?text=GDP+Growth",
                category: "economy"
            },
            {
                title: "Foreign Institutional Investors Pour ₹15,000 Crore in January",
                description: "FIIs have invested a net amount of ₹15,000 crore in Indian equities this month, showing strong confidence in the market.",
                source: "Economic Times",
                author: "Investment Desk",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/f093fb/ffffff?text=FII+Investment",
                category: "markets"
            },
            {
                title: "Bitcoin Surges Past $45,000 Amid Institutional Interest",
                description: "Bitcoin price crossed $45,000 mark as institutional investors show renewed interest in cryptocurrency investments.",
                source: "CoinDesk India",
                author: "Crypto Desk",
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/ffc107/ffffff?text=Bitcoin+Rally",
                category: "crypto"
            },
            {
                title: "Global Markets Mixed as US Fed Signals Rate Pause",
                description: "International markets showed mixed performance after the US Federal Reserve hinted at pausing rate hikes in upcoming meetings.",
                source: "Reuters India",
                author: "Global Desk",
                publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/28a745/ffffff?text=Global+Markets",
                category: "global"
            }
        ];

        // Filter by category if not 'all'
        let filteredNews = category === 'all' ? sampleNews : sampleNews.filter(news => news.category === category);
        
        // Simulate pagination
        const startIndex = (page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return filteredNews.slice(startIndex, endIndex);
    }

    displayLatestNews(articles) {
        const container = document.getElementById('latestNews');
        if (!container) return;

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No news articles found</h5>
                    <p class="text-muted">Try selecting a different category or refresh the page.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = articles.map(article => `
            <div class="card news-card mb-4" data-category="${article.category}">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${article.urlToImage}" class="img-fluid rounded-start h-100 object-fit-cover" alt="News Image">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-${this.getCategoryColor(article.category)}">${this.getCategoryName(article.category)}</span>
                                <small class="text-muted">${this.getTimeAgo(new Date(article.publishedAt))}</small>
                            </div>
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-user"></i> ${article.author} | 
                                    <i class="fas fa-newspaper"></i> ${article.source}
                                </small>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm me-2" onclick="newsManager.shareArticle('${article.title}')">
                                        <i class="fas fa-share"></i>
                                    </button>
                                    <button class="btn btn-primary btn-sm" onclick="newsManager.showFullArticle('${article.title}')">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startBreakingNewsTicker() {
        const breakingNews = [
            "🚨 Nifty hits new all-time high of 20,150 points",
            "📈 Banking sector surges 4% on positive Q3 results",
            "💰 FII inflows cross ₹20,000 crore this month",
            "🏦 RBI maintains repo rate at 6.5% for sixth time",
            "🌍 Global markets rally on Fed rate pause signals"
        ];

        let currentIndex = 0;
        const ticker = document.getElementById('breakingNews');
        
        if (ticker) {
            setInterval(() => {
                ticker.textContent = breakingNews[currentIndex];
                currentIndex = (currentIndex + 1) % breakingNews.length;
            }, 5000);
        }
    }

    filterNews(event) {
        const category = event.target.getAttribute('data-category');
        this.currentCategory = category;
        this.currentPage = 1;
        
        // Update active filter button
        document.querySelectorAll('.news-filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Load filtered news
        this.loadLatestNews();
    }

    async refreshNews() {
        const refreshBtn = document.getElementById('refreshNews');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        try {
            this.currentPage = 1;
            await this.loadLatestNews();
            await this.loadFeaturedNews();
            this.showNotification('News refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing news:', error);
            this.showNotification('Failed to refresh news. Please try again.', 'danger');
        } finally {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }
    }

    async loadMoreNews() {
        const loadMoreBtn = document.getElementById('loadMoreNews');
        const originalText = loadMoreBtn.textContent;
        
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        try {
            this.currentPage++;
            await this.loadLatestNews();
        } catch (error) {
            console.error('Error loading more news:', error);
            this.showNotification('Failed to load more news.', 'danger');
        } finally {
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;
        }
    }

    subscribeNewsletter(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate newsletter subscription
        setTimeout(() => {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        }, 1000);
    }

    showFullArticle(title) {
        // Create modal for full article view
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center py-4">
                            <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                            <h5>Full Article View</h5>
                            <p class="text-muted">In a production environment, this would display the complete article content from the news API.</p>
                            <p class="text-muted">Integration with news providers like NewsAPI, GNews, or direct RSS feeds would provide the full article text.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Share Article</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const articleModal = new bootstrap.Modal(modal);
        articleModal.show();
        
        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    shareArticle(title) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'Check out this article from Trading Queen',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Article link copied to clipboard!', 'info');
            });
        }
    }

    setupAutoRefresh() {
        // Auto-refresh news every 10 minutes
        setInterval(() => {
            this.refreshNews();
        }, 600000);
    }

    updateNewsCount() {
        const totalNewsElement = document.getElementById('totalNews');
        if (totalNewsElement) {
            totalNewsElement.textContent = '1000+';
        }
    }

    // Utility methods
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    getCategoryColor(category) {
        const colors = {
            markets: 'primary',
            economy: 'success',
            policy: 'warning',
            global: 'info',
            crypto: 'secondary'
        };
        return colors[category] || 'secondary';
    }

    getCategoryName(category) {
        const names = {
            markets: 'Markets',
            economy: 'Economy',
            policy: 'Policy',
            global: 'Global',
            crypto: 'Crypto'
        };
        return names[category] || 'General';
    }

    showNotification(message, type = 'info') {
        // Use the global notification function
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Fallback methods
    loadFallbackNews() {
        this.loadFallbackFeaturedNews();
        this.loadFallbackLatestNews();
    }

    loadFallbackFeaturedNews() {
        const fallbackFeatured = [
            {
                title: "Indian Markets Hit Record High as FII Inflows Surge",
                description: "The Nifty 50 and Sensex reached new all-time highs today as foreign institutional investors pumped in record amounts into Indian equities.",
                source: "Economic Times",
                author: "Market Desk",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/800x400/667eea/ffffff?text=Market+Rally",
                category: "markets"
            }
        ];
        this.displayFeaturedNews(fallbackFeatured);
    }

    loadFallbackLatestNews() {
        const fallbackLatest = [
            {
                title: "RBI Keeps Repo Rate Unchanged at 6.5%",
                description: "The Reserve Bank of India maintained the repo rate at 6.5% for the sixth consecutive time.",
                source: "Business Standard",
                author: "Policy Desk",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/f093fb/ffffff?text=RBI+Policy",
                category: "policy"
            },
            {
                title: "IT Sector Leads Market Rally with 3% Gains",
                description: "Information Technology stocks surged 3% today led by TCS, Infosys, and Wipro.",
                source: "Mint",
                author: "Sector Desk",
                publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                urlToImage: "https://via.placeholder.com/400x200/4facfe/ffffff?text=IT+Sector",
                category: "markets"
            }
        ];
        this.displayLatestNews(fallbackLatest);
    }
}

// Initialize news manager
document.addEventListener('DOMContentLoaded', function() {
    window.newsManager = new NewsAPIManager();
    
    // Make it globally available
    window.NewsAPIManager = window.newsManager;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsAPIManager;
}
