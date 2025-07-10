// Main JavaScript for Trading Queen Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeWebsite();
    
    // Load market data
    loadMarketData();
    
    // Load latest news
    loadLatestNews();
    
    // Load top stocks
    loadTopStocks();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start real-time updates
    startRealTimeUpdates();
});

function initializeWebsite() {
    console.log('Trading Queen Website Initialized');
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('fade-in-up');
        }, index * 200);
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hero carousel auto-play control
    const carousel = document.querySelector('#heroCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            bootstrap.Carousel.getInstance(this).pause();
        });
        
        carousel.addEventListener('mouseleave', function() {
            bootstrap.Carousel.getInstance(this).cycle();
        });
    }
    
    // Market card hover effects
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
    
    // Service card click tracking
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('.card-title').textContent;
            console.log(`Service clicked: ${serviceName}`);
            // Track analytics here
        });
    });
}

function loadMarketData() {
    // Simulate real market data (In production, use real APIs)
    const marketData = {
        nifty: {
            price: 19850.25,
            change: +125.30,
            changePercent: +0.63
        },
        sensex: {
            price: 66589.93,
            change: +298.67,
            changePercent: +0.45
        },
        banknifty: {
            price: 44250.80,
            change: -89.45,
            changePercent: -0.20
        },
        usdinr: {
            price: 83.25,
            change: +0.15,
            changePercent: +0.18
        }
    };
    
    updateMarketDisplay(marketData);
}

function updateMarketDisplay(data) {
    // Update NIFTY
    updateMarketCard('nifty', data.nifty);
    
    // Update SENSEX
    updateMarketCard('sensex', data.sensex);
    
    // Update BANK NIFTY
    updateMarketCard('banknifty', data.banknifty);
    
    // Update USD/INR
    updateMarketCard('usdinr', data.usdinr);
}

function updateMarketCard(symbol, data) {
    const priceElement = document.getElementById(`${symbol}-price`);
    const changeElement = document.getElementById(`${symbol}-change`);
    
    if (priceElement && changeElement) {
        // Update price
        priceElement.textContent = formatPrice(data.price);
        
        // Update change with color coding
        const changeText = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`;
        changeElement.textContent = changeText;
        
        // Apply color classes
        priceElement.className = data.change >= 0 ? 'text-success' : 'text-danger';
        changeElement.className = data.change >= 0 ? 'text-success' : 'text-danger';
        
        // Add animation
        priceElement.classList.add('pulse');
        setTimeout(() => {
            priceElement.classList.remove('pulse');
        }, 1000);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

function loadLatestNews() {
    // Simulate news data (In production, use Google News API)
    const newsData = [
        {
            title: "Indian Markets Rally on Strong Q3 Results",
            summary: "Nifty and Sensex surge as major companies report better-than-expected quarterly earnings.",
            time: "2 hours ago",
            source: "Economic Times"
        },
        {
            title: "RBI Maintains Repo Rate at 6.5%",
            summary: "Reserve Bank of India keeps key interest rates unchanged in latest monetary policy review.",
            time: "4 hours ago",
            source: "Business Standard"
        },
        {
            title: "Tech Stocks Lead Market Gains",
            summary: "IT sector outperforms as global technology demand remains strong.",
            time: "6 hours ago",
            source: "Mint"
        }
    ];
    
    displayNews(newsData);
}

function displayNews(newsData) {
    const newsContainer = document.getElementById('latest-news');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item mb-3';
        newsItem.innerHTML = `
            <h6>${news.title}</h6>
            <p>${news.summary}</p>
            <small class="text-muted">${news.source} • ${news.time}</small>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function loadTopStocks() {
    // Simulate top stock picks
    const stockData = [
        {
            symbol: "RELIANCE",
            price: 2456.75,
            change: +23.45,
            changePercent: +0.96,
            recommendation: "BUY"
        },
        {
            symbol: "TCS",
            price: 3789.20,
            change: +45.80,
            changePercent: +1.22,
            recommendation: "BUY"
        },
        {
            symbol: "HDFC BANK",
            price: 1678.90,
            change: -12.30,
            changePercent: -0.73,
            recommendation: "HOLD"
        },
        {
            symbol: "INFOSYS",
            price: 1456.25,
            change: +18.75,
            changePercent: +1.30,
            recommendation: "BUY"
        }
    ];
    
    displayTopStocks(stockData);
}

function displayTopStocks(stockData) {
    const stockContainer = document.getElementById('top-stocks');
    if (!stockContainer) return;
    
    stockContainer.innerHTML = '';
    
    stockData.forEach(stock => {
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item mb-3';
        
        const changeClass = stock.change >= 0 ? 'text-success' : 'text-danger';
        const changeSymbol = stock.change >= 0 ? '+' : '';
        
        stockItem.innerHTML = `
            <div>
                <div class="stock-symbol">${stock.symbol}</div>
                <small class="stock-change ${changeClass}">
                    ${changeSymbol}${stock.change.toFixed(2)} (${changeSymbol}${stock.changePercent.toFixed(2)}%)
                </small>
            </div>
            <div class="text-end">
                <div class="stock-price ${changeClass}">₹${formatPrice(stock.price)}</div>
                <small class="badge bg-${getRecommendationColor(stock.recommendation)}">${stock.recommendation}</small>
            </div>
        `;
        stockContainer.appendChild(stockItem);
    });
}

function getRecommendationColor(recommendation) {
    switch(recommendation) {
        case 'BUY': return 'success';
        case 'SELL': return 'danger';
        case 'HOLD': return 'warning';
        default: return 'secondary';
    }
}

function startRealTimeUpdates() {
    // Update market data every 30 seconds
    setInterval(() => {
        loadMarketData();
    }, 30000);
    
    // Update news every 5 minutes
    setInterval(() => {
        loadLatestNews();
    }, 300000);
    
    // Update stock picks every 2 minutes
    setInterval(() => {
        loadTopStocks();
    }, 120000);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function trackPagePerformance() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        }, 0);
    });
}

// Initialize performance tracking
trackPagePerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, send error to logging service
});

// Export functions for use in other modules
window.TradingQueen = {
    showNotification,
    formatCurrency,
    debounce,
    loadMarketData,
    loadLatestNews,
    loadTopStocks
};
