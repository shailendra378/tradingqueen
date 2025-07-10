// Market Update Page JavaScript

class MarketUpdatePage {
    constructor() {
        this.tradingViewWidget = null;
        this.sectorHeatmap = null;
        this.updateInterval = null;
        this.init();
    }

    init() {
        console.log('Market Update Page initialized');
        this.setupTradingViewChart();
        this.setupSectorHeatmap();
        this.loadDetailedMarketData();
        this.loadInstitutionalData();
        this.loadTopGainersLosers();
        this.setupRealTimeUpdates();
        this.updateLastUpdatedTime();
        this.startLiveUpdates();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Webinar registration buttons
        document.querySelectorAll('.webinar-item button').forEach(button => {
            button.addEventListener('click', (e) => {
                const webinarTitle = e.target.closest('.webinar-item').querySelector('h6').textContent;
                this.registerForWebinar(webinarTitle);
            });
        });

        // Chart timeframe buttons
        document.querySelectorAll('.chart-controls button').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-controls button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    setupTradingViewChart() {
        try {
            // TradingView Advanced Chart Widget
            this.tradingViewWidget = new TradingView.widget({
                "autosize": true,
                "symbol": "NSE:NIFTY",
                "interval": "D",
                "timezone": "Asia/Kolkata",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-chart",
                "studies": [
                    "RSI@tv-basicstudies",
                    "MACD@tv-basicstudies",
                    "Volume@tv-basicstudies"
                ],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650",
                "no_referral_id": true,
                "withdateranges": true,
                "hide_side_toolbar": false,
                "details": true,
                "hotlist": true,
                "calendar": true,
                "studies_overrides": {},
                "overrides": {
                    "paneProperties.background": "#ffffff",
                    "paneProperties.vertGridProperties.color": "#e1e3e6",
                    "paneProperties.horzGridProperties.color": "#e1e3e6",
                    "symbolWatermarkProperties.transparency": 90,
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f"
                }
            });
        } catch (error) {
            console.error('Error setting up TradingView chart:', error);
            this.setupFallbackChart();
        }
    }

    setupFallbackChart() {
        const chartContainer = document.getElementById('tradingview-chart');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center">
                        <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">Chart Loading...</h5>
                        <p class="text-muted">Please wait while we load the advanced chart</p>
                    </div>
                </div>
            `;
        }
    }

    setupSectorHeatmap() {
        try {
            // TradingView Sector Heatmap
            const heatmapWidget = new TradingView.widget({
                "width": "100%",
                "height": 300,
                "colorTheme": "light",
                "dataSource": "SPX500",
                "exchange": "NSE",
                "showChart": false,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": false,
                "showSymbolLogo": false,
                "showFloatingTooltip": true,
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                "gridLineColor": "rgba(240, 243, 250, 0)",
                "scaleFontColor": "rgba(106, 109, 120, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
                "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
                "container_id": "sector-heatmap"
            });
        } catch (error) {
            console.error('Error setting up sector heatmap:', error);
            this.setupFallbackHeatmap();
        }
    }

    setupFallbackHeatmap() {
        const heatmapContainer = document.getElementById('sector-heatmap');
        if (heatmapContainer) {
            const sectors = [
                { name: 'Banking', change: 2.45, color: 'success' },
                { name: 'IT', change: 1.87, color: 'success' },
                { name: 'Pharma', change: -0.65, color: 'danger' },
                { name: 'Auto', change: 0.92, color: 'success' },
                { name: 'FMCG', change: -0.23, color: 'danger' },
                { name: 'Energy', change: 1.34, color: 'success' },
                { name: 'Metals', change: -1.12, color: 'danger' },
                { name: 'Realty', change: 3.21, color: 'success' }
            ];

            heatmapContainer.innerHTML = `
                <div class="row g-2">
                    ${sectors.map(sector => `
                        <div class="col-3">
                            <div class="card bg-${sector.color} bg-opacity-10 border-${sector.color}">
                                <div class="card-body text-center p-2">
                                    <h6 class="card-title mb-1">${sector.name}</h6>
                                    <small class="text-${sector.color}">${sector.change >= 0 ? '+' : ''}${sector.change}%</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    async loadDetailedMarketData() {
        try {
            // Get market data from the market data manager
            const marketData = await this.getDetailedMarketData();
            this.updateDetailedMarketDisplay(marketData);
        } catch (error) {
            console.error('Error loading detailed market data:', error);
            this.loadFallbackDetailedData();
        }
    }

    async getDetailedMarketData() {
        // Simulate detailed market data
        const indices = ['nifty', 'sensex', 'banknifty', 'usdinr'];
        const data = {};

        indices.forEach(index => {
            const basePrice = this.getBasePrice(index);
            const change = (Math.random() - 0.5) * (basePrice * 0.02);
            const price = basePrice + change;
            const changePercent = (change / basePrice) * 100;
            const volume = Math.floor(Math.random() * 10000000) + 1000000;

            data[index] = {
                price: price,
                change: change,
                changePercent: changePercent,
                volume: volume,
                high: price + Math.abs(change) * 0.5,
                low: price - Math.abs(change) * 0.5,
                progress: Math.min(Math.max((changePercent + 2) * 25, 0), 100)
            };
        });

        return data;
    }

    getBasePrice(index) {
        const basePrices = {
            nifty: 19850,
            sensex: 66590,
            banknifty: 44250,
            usdinr: 83.25
        };
        return basePrices[index] || 1000;
    }

    updateDetailedMarketDisplay(data) {
        Object.keys(data).forEach(index => {
            const indexData = data[index];
            
            // Update price
            const priceElement = document.getElementById(`${index}-price-detailed`);
            if (priceElement) {
                priceElement.textContent = this.formatPrice(indexData.price);
                priceElement.className = indexData.change >= 0 ? 'text-success' : 'text-danger';
            }

            // Update change
            const changeElement = document.getElementById(`${index}-change-detailed`);
            if (changeElement) {
                const changeText = `${indexData.change >= 0 ? '+' : ''}${indexData.change.toFixed(2)} (${indexData.changePercent >= 0 ? '+' : ''}${indexData.changePercent.toFixed(2)}%)`;
                changeElement.textContent = changeText;
                changeElement.className = indexData.change >= 0 ? 'text-success' : 'text-danger';
            }

            // Update volume
            const volumeElement = document.getElementById(`${index}-volume`);
            if (volumeElement) {
                volumeElement.textContent = this.formatVolume(indexData.volume);
            }

            // Update progress bar
            const progressElement = document.getElementById(`${index}-progress`);
            if (progressElement) {
                progressElement.style.width = `${indexData.progress}%`;
                progressElement.className = `progress-bar ${indexData.change >= 0 ? 'bg-success' : 'bg-danger'}`;
            }

            // Update range for USD/INR
            if (index === 'usdinr') {
                const rangeElement = document.getElementById('usdinr-range');
                if (rangeElement) {
                    rangeElement.textContent = `${indexData.low.toFixed(2)} - ${indexData.high.toFixed(2)}`;
                }
            }
        });
    }

    async loadTopGainersLosers() {
        try {
            const gainersLosers = await this.getTopGainersLosers();
            this.updateGainersLosersDisplay(gainersLosers);
        } catch (error) {
            console.error('Error loading gainers/losers:', error);
            this.loadFallbackGainersLosers();
        }
    }

    async getTopGainersLosers() {
        const stocks = [
            'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL',
            'ASIANPAINT', 'MARUTI', 'KOTAKBANK', 'LT', 'AXISBANK', 'ICICIBANK', 'WIPRO'
        ];

        const stockData = stocks.map(symbol => {
            const basePrice = Math.random() * 3000 + 500;
            const change = (Math.random() - 0.5) * (basePrice * 0.1);
            const changePercent = (change / basePrice) * 100;

            return {
                symbol: symbol,
                price: basePrice + change,
                change: change,
                changePercent: changePercent,
                volume: Math.floor(Math.random() * 5000000) + 100000
            };
        });

        // Sort by change percentage
        const gainers = stockData
            .filter(stock => stock.changePercent > 0)
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, 5);

        const losers = stockData
            .filter(stock => stock.changePercent < 0)
            .sort((a, b) => a.changePercent - b.changePercent)
            .slice(0, 5);

        return { gainers, losers };
    }

    updateGainersLosersDisplay(data) {
        // Update gainers
        const gainersContainer = document.getElementById('top-gainers');
        if (gainersContainer && data.gainers) {
            gainersContainer.innerHTML = data.gainers.map(stock => `
                <div class="stock-row d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                        <strong>${stock.symbol}</strong>
                        <div class="text-muted small">Vol: ${this.formatVolume(stock.volume)}</div>
                    </div>
                    <div class="text-end">
                        <div class="text-success">₹${this.formatPrice(stock.price)}</div>
                        <div class="text-success small">+${stock.changePercent.toFixed(2)}%</div>
                    </div>
                </div>
            `).join('');
        }

        // Update losers
        const losersContainer = document.getElementById('top-losers');
        if (losersContainer && data.losers) {
            losersContainer.innerHTML = data.losers.map(stock => `
                <div class="stock-row d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                        <strong>${stock.symbol}</strong>
                        <div class="text-muted small">Vol: ${this.formatVolume(stock.volume)}</div>
                    </div>
                    <div class="text-end">
                        <div class="text-danger">₹${this.formatPrice(stock.price)}</div>
                        <div class="text-danger small">${stock.changePercent.toFixed(2)}%</div>
                    </div>
                </div>
            `).join('');
        }
    }

    async loadInstitutionalData() {
        try {
            const institutionalData = await this.getInstitutionalData();
            this.updateInstitutionalDisplay(institutionalData);
        } catch (error) {
            console.error('Error loading institutional data:', error);
            this.loadFallbackInstitutionalData();
        }
    }

    async getInstitutionalData() {
        // Simulate real-time institutional data with variations
        return {
            fii: {
                today: -2450 + Math.random() * 500 - 250,
                mtd: 8750 + Math.random() * 1000 - 500,
                ytd: 45230 + Math.random() * 2000 - 1000,
                sentiment: 65 + Math.random() * 10 - 5,
                equity: -2450 + Math.random() * 200 - 100,
                debt: 890 + Math.random() * 100 - 50,
                hybrid: 125 + Math.random() * 50 - 25
            },
            dii: {
                today: 3680 + Math.random() * 300 - 150,
                mtd: 12450 + Math.random() * 800 - 400,
                ytd: 89560 + Math.random() * 3000 - 1500,
                sentiment: 78 + Math.random() * 8 - 4,
                equity: 3680 + Math.random() * 200 - 100,
                debt: 1250 + Math.random() * 150 - 75,
                hybrid: 340 + Math.random() * 50 - 25
            },
            client: {
                active: 2847 + Math.floor(Math.random() * 100 - 50),
                newSignups: 156 + Math.floor(Math.random() * 20 - 10),
                volume: 45.2 + Math.random() * 5 - 2.5,
                profit: 12.5 + Math.random() * 2 - 1,
                sentiment: 72 + Math.random() * 8 - 4
            }
        };
    }

    updateInstitutionalDisplay(data) {
        // Update FII Data
        this.updateDataElement('fii-today', data.fii.today, true);
        this.updateDataElement('fii-mtd', data.fii.mtd, true);
        this.updateDataElement('fii-ytd', data.fii.ytd, true);
        this.updateDataElement('fii-equity', data.fii.equity, true);
        this.updateDataElement('fii-debt', data.fii.debt, true);
        this.updateDataElement('fii-hybrid', data.fii.hybrid, true);
        this.updateSentimentBar('fii-sentiment', data.fii.sentiment, 'primary');
        
        // Update DII Data
        this.updateDataElement('dii-today', data.dii.today, true);
        this.updateDataElement('dii-mtd', data.dii.mtd, true);
        this.updateDataElement('dii-ytd', data.dii.ytd, true);
        this.updateDataElement('dii-equity', data.dii.equity, true);
        this.updateDataElement('dii-debt', data.dii.debt, true);
        this.updateDataElement('dii-hybrid', data.dii.hybrid, true);
        this.updateSentimentBar('dii-sentiment', data.dii.sentiment, 'success');
        
        // Update Client Data
        this.updateDataElement('client-active', data.client.active, false);
        this.updateDataElement('client-new', data.client.newSignups, false, '+');
        this.updateDataElement('client-volume', data.client.volume, false, '₹', ' Cr');
        this.updateDataElement('client-profit', data.client.profit, false, '+', '%');
        this.updateSentimentBar('client-sentiment', data.client.sentiment, 'warning');
        
        // Update Market Impact
        const netFlow = data.fii.today + data.dii.today;
        this.updateDataElement('net-flow', netFlow, true);
        this.updateDataElement('market-cap', 2894567.8, true, '₹', ' Cr');
        this.updateDataElement('flow-impact', (netFlow / 289456.78).toFixed(2), false, '+', '%');
        
        // Update timestamps
        const currentTime = new Date().toLocaleTimeString('en-IN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        }) + ' IST';
        
        const fiiUpdateElement = document.getElementById('fii-update');
        const diiUpdateElement = document.getElementById('dii-update');
        if (fiiUpdateElement) fiiUpdateElement.textContent = currentTime;
        if (diiUpdateElement) diiUpdateElement.textContent = currentTime;
    }

    updateDataElement(elementId, value, isCurrency, prefix = '', suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let formattedValue;
        if (isCurrency) {
            const sign = value >= 0 ? '+' : '';
            formattedValue = `${sign}₹${Math.abs(value).toLocaleString('en-IN')} Cr`;
            element.className = value >= 0 ? 'text-success' : 'text-danger';
        } else {
            formattedValue = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
        }
        
        element.textContent = formattedValue;
        
        // Add pulse animation for updates
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 1000);
    }

    updateSentimentBar(elementId, percentage, colorClass) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.style.width = `${percentage}%`;
        element.className = `progress-bar bg-${colorClass}`;
        
        let sentimentText;
        if (percentage >= 70) {
            sentimentText = colorClass === 'warning' ? 'Optimistic' : 'Bullish';
        } else if (percentage >= 50) {
            sentimentText = 'Neutral';
        } else {
            sentimentText = 'Bearish';
        }
        
        element.innerHTML = `<small>${sentimentText} ${percentage.toFixed(0)}%</small>`;
    }

    startLiveUpdates() {
        // Initialize with some sample updates
        const initialUpdates = [
            { time: '15:30', message: 'FII sold ₹450 Cr in Banking sector, DII bought ₹680 Cr' },
            { time: '15:25', message: 'Large block deal: ₹890 Cr transaction in IT sector' },
            { time: '15:20', message: 'Client activity surge: +23% increase in retail participation' },
            { time: '15:15', message: 'DII net buying continues for 5th consecutive session' }
        ];
        
        const container = document.getElementById('live-updates');
        if (container) {
            container.innerHTML = initialUpdates.map(update => 
                `<div class="update-item">
                    <span class="time">${update.time}</span>
                    <span class="message">${update.message}</span>
                </div>`
            ).join('');
        }

        // Start adding new updates periodically
        setInterval(() => {
            this.addLiveUpdate();
        }, 120000); // Add new update every 2 minutes
    }

    addLiveUpdate() {
        const updates = [
            'FII activity increases in pharma sector',
            'DII shows strong buying interest in mid-cap stocks',
            'Retail participation reaches new monthly high',
            'Large institutional order executed in banking stocks',
            'Foreign funds show renewed interest in IT sector',
            'Domestic funds continue systematic buying pattern',
            'Client portfolio rebalancing activity observed',
            'Institutional flows support market stability'
        ];
        
        const container = document.getElementById('live-updates');
        if (!container) return;
        
        const currentTime = new Date().toLocaleTimeString('en-IN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        
        const newUpdate = document.createElement('div');
        newUpdate.className = 'update-item';
        newUpdate.innerHTML = `
            <span class="time">${currentTime}</span>
            <span class="message">${randomUpdate}</span>
        `;
        
        // Add to top of list
        container.insertBefore(newUpdate, container.firstChild);
        
        // Remove oldest update if more than 10
        const updatesList = container.querySelectorAll('.update-item');
        if (updatesList.length > 10) {
            container.removeChild(updatesList[updatesList.length - 1]);
        }
        
        // Add animation
        newUpdate.style.opacity = '0';
        newUpdate.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            newUpdate.style.transition = 'all 0.3s ease';
            newUpdate.style.opacity = '1';
            newUpdate.style.transform = 'translateX(0)';
        }, 100);
    }

    loadFallbackInstitutionalData() {
        const fallbackData = {
            fii: {
                today: -2450, mtd: 8750, ytd: 45230, sentiment: 65,
                equity: -2450, debt: 890, hybrid: 125
            },
            dii: {
                today: 3680, mtd: 12450, ytd: 89560, sentiment: 78,
                equity: 3680, debt: 1250, hybrid: 340
            },
            client: {
                active: 2847, newSignups: 156, volume: 45.2, profit: 12.5, sentiment: 72
            }
        };
        this.updateInstitutionalDisplay(fallbackData);
    }

    setupRealTimeUpdates() {
        // Update data every 30 seconds
        this.updateInterval = setInterval(() => {
            this.loadDetailedMarketData();
            this.loadInstitutionalData();
            this.loadTopGainersLosers();
            this.updateLastUpdatedTime();
        }, 30000);
    }

    updateLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            const now = new Date();
            lastUpdatedElement.textContent = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    registerForWebinar(webinarTitle) {
        // Check if user is logged in
        if (window.AuthSystem && window.AuthSystem.isUserLoggedIn()) {
            // Show success message
            if (window.TradingQueen && window.TradingQueen.showNotification) {
                window.TradingQueen.showNotification(
                    `Successfully registered for "${webinarTitle}". You will receive a confirmation email shortly.`,
                    'success'
                );
            }
        } else {
            // Require login
            if (window.AuthSystem) {
                window.AuthSystem.requireAuth(() => {
                    this.registerForWebinar(webinarTitle);
                });
            }
        }
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    formatVolume(volume) {
        if (volume >= 10000000) {
            return (volume / 10000000).toFixed(1) + 'Cr';
        } else if (volume >= 100000) {
            return (volume / 100000).toFixed(1) + 'L';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        return volume.toString();
    }

    loadFallbackDetailedData() {
        const fallbackData = {
            nifty: { price: 19850.25, change: 125.30, changePercent: 0.63, volume: 2500000, progress: 65 },
            sensex: { price: 66589.93, change: 298.67, changePercent: 0.45, volume: 1800000, progress: 55 },
            banknifty: { price: 44250.80, change: -89.45, changePercent: -0.20, volume: 3200000, progress: 45 },
            usdinr: { price: 83.25, change: 0.15, changePercent: 0.18, volume: 0, progress: 52 }
        };
        this.updateDetailedMarketDisplay(fallbackData);
    }

    loadFallbackGainersLosers() {
        const fallbackData = {
            gainers: [
                { symbol: 'RELIANCE', price: 2456.75, changePercent: 2.45, volume: 1500000 },
                { symbol: 'TCS', price: 3789.20, changePercent: 1.87, volume: 890000 },
                { symbol: 'INFY', price: 1456.25, changePercent: 1.65, volume: 1200000 },
                { symbol: 'HINDUNILVR', price: 2650.30, changePercent: 1.23, volume: 750000 },
                { symbol: 'ITC', price: 420.85, changePercent: 0.98, volume: 2100000 }
            ],
            losers: [
                { symbol: 'SBIN', price: 590.45, changePercent: -1.85, volume: 1800000 },
                { symbol: 'AXISBANK', price: 1045.20, changePercent: -1.45, volume: 950000 },
                { symbol: 'BHARTIARTL', price: 1180.75, changePercent: -1.12, volume: 1100000 },
                { symbol: 'MARUTI', price: 10250.30, changePercent: -0.95, volume: 320000 },
                { symbol: 'ASIANPAINT', price: 3245.60, changePercent: -0.78, volume: 480000 }
            ]
        };
        this.updateGainersLosersDisplay(fallbackData);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.tradingViewWidget) {
            // TradingView widget cleanup if needed
        }
    }
}

// SIP Calculator function
function calculateSIP() {
    const amount = parseFloat(document.getElementById('sipAmount').value);
    const returnRate = parseFloat(document.getElementById('sipReturn').value);
    const period = parseFloat(document.getElementById('sipPeriod').value);

    if (amount && returnRate && period) {
        const monthlyRate = returnRate / 12 / 100;
        const months = period * 12;
        
        const maturityAmount = amount * (((Math.pow(1 + monthlyRate, months)) - 1) / monthlyRate) * (1 + monthlyRate);
        
        document.getElementById('sipMaturityAmount').textContent = 
            '₹' + new Intl.NumberFormat('en-IN').format(Math.round(maturityAmount));
        document.getElementById('sipResult').classList.remove('d-none');
    }
}

// Chart timeframe change function
function changeTimeframe(timeframe) {
    console.log('Changing timeframe to:', timeframe);
    // This would update the TradingView chart timeframe
    // Implementation depends on TradingView widget API
}

// Initialize the market update page
document.addEventListener('DOMContentLoaded', function() {
    const marketUpdatePage = new MarketUpdatePage();
    
    // Make it globally available
    window.MarketUpdatePage = marketUpdatePage;
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.MarketUpdatePage) {
        window.MarketUpdatePage.destroy();
    }
});
