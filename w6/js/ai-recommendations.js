// AI Stock Recommendations Module for Trading Queen Website

class AIRecommendations {
    constructor() {
        this.recommendations = [];
        this.isLoading = false;
        this.lastUpdate = null;
        this.init();
    }

    init() {
        this.loadAIRecommendations();
        this.startRealTimeUpdates();
    }

    async loadAIRecommendations() {
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Simulate AI analysis with real-time data
            const recommendations = await this.generateAIRecommendations();
            this.recommendations = recommendations;
            this.displayRecommendations();
            this.lastUpdate = new Date();
        } catch (error) {
            console.error('Error loading AI recommendations:', error);
            this.showErrorState();
        } finally {
            this.isLoading = false;
        }
    }

    async generateAIRecommendations() {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generate AI-powered recommendations based on market analysis
        const aiRecommendations = [
            {
                symbol: 'RELIANCE',
                companyName: 'Reliance Industries Ltd',
                currentPrice: 2456.75,
                targetPrice: 2650.00,
                recommendation: 'STRONG BUY',
                confidence: 92,
                aiScore: 8.7,
                reasoning: 'Strong fundamentals, expanding digital business, and favorable oil refining margins',
                timeHorizon: '3-6 months',
                riskLevel: 'Medium',
                sector: 'Energy & Petrochemicals',
                marketCap: '16.6L Cr',
                pe: 24.5,
                change: +23.45,
                changePercent: +0.96
            },
            {
                symbol: 'TCS',
                companyName: 'Tata Consultancy Services',
                currentPrice: 3789.20,
                targetPrice: 4100.00,
                recommendation: 'BUY',
                confidence: 88,
                aiScore: 8.4,
                reasoning: 'Leading IT services provider with strong digital transformation capabilities',
                timeHorizon: '6-12 months',
                riskLevel: 'Low',
                sector: 'Information Technology',
                marketCap: '13.8L Cr',
                pe: 28.3,
                change: +45.80,
                changePercent: +1.22
            },
            {
                symbol: 'HDFCBANK',
                companyName: 'HDFC Bank Ltd',
                currentPrice: 1678.90,
                targetPrice: 1850.00,
                recommendation: 'BUY',
                confidence: 85,
                aiScore: 8.1,
                reasoning: 'Strong deposit growth, improving asset quality, and digital banking initiatives',
                timeHorizon: '6-9 months',
                riskLevel: 'Low',
                sector: 'Banking & Financial Services',
                marketCap: '12.7L Cr',
                pe: 18.7,
                change: -12.30,
                changePercent: -0.73
            },
            {
                symbol: 'INFY',
                companyName: 'Infosys Ltd',
                currentPrice: 1456.25,
                targetPrice: 1600.00,
                recommendation: 'BUY',
                confidence: 82,
                aiScore: 7.9,
                reasoning: 'Strong client additions, cloud transformation deals, and margin improvement',
                timeHorizon: '3-6 months',
                riskLevel: 'Medium',
                sector: 'Information Technology',
                marketCap: '6.1L Cr',
                pe: 26.8,
                change: +18.75,
                changePercent: +1.30
            },
            {
                symbol: 'ICICIBANK',
                companyName: 'ICICI Bank Ltd',
                currentPrice: 1089.45,
                targetPrice: 1200.00,
                recommendation: 'HOLD',
                confidence: 75,
                aiScore: 7.2,
                reasoning: 'Stable performance but facing headwinds from rising interest rates',
                timeHorizon: '6-12 months',
                riskLevel: 'Medium',
                sector: 'Banking & Financial Services',
                marketCap: '7.6L Cr',
                pe: 16.4,
                change: +8.90,
                changePercent: +0.82
            }
        ];

        return aiRecommendations;
    }

    displayRecommendations() {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;

        container.innerHTML = '';

        // Create header with last update time
        const header = document.createElement('div');
        header.className = 'ai-header mb-3 d-flex justify-content-between align-items-center';
        header.innerHTML = `
            <div>
                <small class="text-muted">Last Updated: ${this.formatTime(this.lastUpdate)}</small>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="aiRecommendations.loadAIRecommendations()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
        `;
        container.appendChild(header);

        // Display recommendations
        this.recommendations.forEach((rec, index) => {
            const recElement = this.createRecommendationCard(rec, index);
            container.appendChild(recElement);
        });
    }

    createRecommendationCard(rec, index) {
        const card = document.createElement('div');
        card.className = 'ai-recommendation-card mb-3';
        
        const changeClass = rec.change >= 0 ? 'text-success' : 'text-danger';
        const changeIcon = rec.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const recColor = this.getRecommendationColor(rec.recommendation);
        const confidenceColor = this.getConfidenceColor(rec.confidence);

        card.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <div class="stock-info">
                                <h6 class="mb-1 fw-bold">${rec.symbol}</h6>
                                <small class="text-muted">${rec.companyName}</small>
                                <div class="mt-2">
                                    <span class="badge bg-${recColor} me-2">${rec.recommendation}</span>
                                    <span class="badge bg-${confidenceColor}">${rec.confidence}% Confidence</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">
                            <div class="price-info">
                                <h5 class="mb-0">₹${rec.currentPrice.toFixed(2)}</h5>
                                <small class="${changeClass}">
                                    <i class="fas ${changeIcon}"></i>
                                    ${rec.change >= 0 ? '+' : ''}${rec.change.toFixed(2)} (${rec.changePercent >= 0 ? '+' : ''}${rec.changePercent.toFixed(2)}%)
                                </small>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">
                            <div class="target-info">
                                <small class="text-muted">Target Price</small>
                                <h6 class="mb-0 text-primary">₹${rec.targetPrice.toFixed(2)}</h6>
                                <small class="text-success">
                                    +${(((rec.targetPrice - rec.currentPrice) / rec.currentPrice) * 100).toFixed(1)}% upside
                                </small>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">
                            <div class="ai-score">
                                <small class="text-muted">AI Score</small>
                                <div class="score-circle">
                                    <span class="score-value">${rec.aiScore}</span>
                                    <small>/10</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="recommendation-details">
                                <small class="text-muted d-block">Risk: ${rec.riskLevel}</small>
                                <small class="text-muted d-block">Horizon: ${rec.timeHorizon}</small>
                                <small class="text-muted d-block">Sector: ${rec.sector}</small>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="ai-reasoning">
                                <small class="text-muted">
                                    <i class="fas fa-brain me-1"></i>
                                    <strong>AI Analysis:</strong> ${rec.reasoning}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <div class="stock-metrics d-flex gap-3">
                                <small class="text-muted">Market Cap: ${rec.marketCap}</small>
                                <small class="text-muted">P/E: ${rec.pe}</small>
                                <small class="text-muted">Sector: ${rec.sector}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add click event for detailed analysis
        card.addEventListener('click', () => {
            this.showDetailedAnalysis(rec);
        });

        return card;
    }

    getRecommendationColor(recommendation) {
        switch (recommendation) {
            case 'STRONG BUY': return 'success';
            case 'BUY': return 'primary';
            case 'HOLD': return 'warning';
            case 'SELL': return 'danger';
            case 'STRONG SELL': return 'dark';
            default: return 'secondary';
        }
    }

    getConfidenceColor(confidence) {
        if (confidence >= 90) return 'success';
        if (confidence >= 80) return 'primary';
        if (confidence >= 70) return 'warning';
        return 'secondary';
    }

    showLoadingState() {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-loading text-center py-4">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading AI recommendations...</span>
                </div>
                <h6>AI is analyzing market data...</h6>
                <p class="text-muted">Processing thousands of data points to generate personalized recommendations</p>
                <div class="progress mt-3" style="height: 6px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
            </div>
        `;
    }

    showErrorState() {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-error text-center py-4">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h6>Unable to load AI recommendations</h6>
                <p class="text-muted">Please check your connection and try again</p>
                <button class="btn btn-primary" onclick="aiRecommendations.loadAIRecommendations()">
                    <i class="fas fa-retry"></i> Retry
                </button>
            </div>
        `;
    }

    showDetailedAnalysis(recommendation) {
        // Create detailed analysis modal or expand card
        console.log('Showing detailed analysis for:', recommendation.symbol);
        
        // For now, show a notification with key details
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification(
                `${recommendation.symbol}: ${recommendation.recommendation} with ${recommendation.confidence}% confidence. Target: ₹${recommendation.targetPrice}`,
                'info'
            );
        }
    }

    startRealTimeUpdates() {
        // Update AI recommendations every 5 minutes
        setInterval(() => {
            if (!this.isLoading) {
                this.loadAIRecommendations();
            }
        }, 300000); // 5 minutes
    }

    formatTime(date) {
        if (!date) return 'Never';
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Public methods
    refreshRecommendations() {
        this.loadAIRecommendations();
    }

    getRecommendationBySymbol(symbol) {
        return this.recommendations.find(rec => rec.symbol === symbol);
    }

    getTopRecommendations(count = 3) {
        return this.recommendations
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, count);
    }
}

// Initialize AI recommendations system
const aiRecommendations = new AIRecommendations();

// Make globally available
window.AIRecommendations = aiRecommendations;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIRecommendations;
}
