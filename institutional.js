// Institutional Data Routes (FII/DII/Client)
const express = require('express');
const router = express.Router();

// Simulated institutional data
let institutionalData = {
    fii: {
        today: -2450,
        mtd: 8750,
        ytd: 45230,
        sentiment: 65,
        flows: {
            equity: -2450,
            debt: 890,
            hybrid: 125
        },
        lastUpdated: new Date().toISOString()
    },
    dii: {
        today: 3680,
        mtd: 12450,
        ytd: 89560,
        sentiment: 78,
        flows: {
            equity: 3680,
            debt: 1250,
            hybrid: 340
        },
        lastUpdated: new Date().toISOString()
    },
    client: {
        active: 2847,
        newSignups: 156,
        volume: 45.2,
        profit: 12.5,
        sentiment: 72,
        demographics: {
            retail: 85,
            hni: 12,
            institutional: 3
        },
        lastUpdated: new Date().toISOString()
    },
    marketImpact: {
        netFlow: 0,
        marketCap: 2894567.8,
        impact: 0,
        lastUpdated: new Date().toISOString()
    }
};

// Live updates feed
let liveUpdates = [
    {
        id: 1,
        time: '15:30',
        message: 'FII sold ₹450 Cr in Banking sector, DII bought ₹680 Cr',
        type: 'flow',
        timestamp: new Date().toISOString()
    },
    {
        id: 2,
        time: '15:25',
        message: 'Large block deal: ₹890 Cr transaction in IT sector',
        type: 'transaction',
        timestamp: new Date().toISOString()
    },
    {
        id: 3,
        time: '15:20',
        message: 'Client activity surge: +23% increase in retail participation',
        type: 'client',
        timestamp: new Date().toISOString()
    },
    {
        id: 4,
        time: '15:15',
        message: 'DII net buying continues for 5th consecutive session',
        type: 'flow',
        timestamp: new Date().toISOString()
    }
];

// Function to update institutional data with realistic variations
const updateInstitutionalData = () => {
    // Update FII data
    const fiiVariation = (Math.random() - 0.5) * 500;
    institutionalData.fii.today += fiiVariation;
    institutionalData.fii.mtd += fiiVariation * 0.1;
    institutionalData.fii.sentiment += (Math.random() - 0.5) * 5;
    institutionalData.fii.sentiment = Math.max(0, Math.min(100, institutionalData.fii.sentiment));
    
    // Update flows
    institutionalData.fii.flows.equity += fiiVariation * 0.8;
    institutionalData.fii.flows.debt += (Math.random() - 0.5) * 100;
    institutionalData.fii.flows.hybrid += (Math.random() - 0.5) * 50;
    
    // Update DII data
    const diiVariation = (Math.random() - 0.5) * 300;
    institutionalData.dii.today += diiVariation;
    institutionalData.dii.mtd += diiVariation * 0.1;
    institutionalData.dii.sentiment += (Math.random() - 0.5) * 3;
    institutionalData.dii.sentiment = Math.max(0, Math.min(100, institutionalData.dii.sentiment));
    
    // Update flows
    institutionalData.dii.flows.equity += diiVariation * 0.9;
    institutionalData.dii.flows.debt += (Math.random() - 0.5) * 150;
    institutionalData.dii.flows.hybrid += (Math.random() - 0.5) * 50;
    
    // Update client data
    institutionalData.client.active += Math.floor((Math.random() - 0.5) * 100);
    institutionalData.client.newSignups += Math.floor((Math.random() - 0.5) * 20);
    institutionalData.client.volume += (Math.random() - 0.5) * 5;
    institutionalData.client.profit += (Math.random() - 0.5) * 2;
    institutionalData.client.sentiment += (Math.random() - 0.5) * 4;
    institutionalData.client.sentiment = Math.max(0, Math.min(100, institutionalData.client.sentiment));
    
    // Update market impact
    institutionalData.marketImpact.netFlow = institutionalData.fii.today + institutionalData.dii.today;
    institutionalData.marketImpact.impact = (institutionalData.marketImpact.netFlow / 289456.78).toFixed(2);
    
    // Update timestamps
    const now = new Date().toISOString();
    institutionalData.fii.lastUpdated = now;
    institutionalData.dii.lastUpdated = now;
    institutionalData.client.lastUpdated = now;
    institutionalData.marketImpact.lastUpdated = now;
};

// Function to add new live updates
const addLiveUpdate = () => {
    const updateMessages = [
        'FII activity increases in pharma sector',
        'DII shows strong buying interest in mid-cap stocks',
        'Retail participation reaches new monthly high',
        'Large institutional order executed in banking stocks',
        'Foreign funds show renewed interest in IT sector',
        'Domestic funds continue systematic buying pattern',
        'Client portfolio rebalancing activity observed',
        'Institutional flows support market stability',
        'FII net selling in auto sector continues',
        'DII accumulation pattern observed in FMCG stocks'
    ];
    
    const types = ['flow', 'transaction', 'client', 'sector'];
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const newUpdate = {
        id: Date.now(),
        time: timeString,
        message: updateMessages[Math.floor(Math.random() * updateMessages.length)],
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: now.toISOString()
    };
    
    // Add to beginning of array
    liveUpdates.unshift(newUpdate);
    
    // Keep only last 20 updates
    if (liveUpdates.length > 20) {
        liveUpdates = liveUpdates.slice(0, 20);
    }
};

// Update data every 60 seconds
setInterval(updateInstitutionalData, 60000);

// Add new live update every 2 minutes
setInterval(addLiveUpdate, 120000);

// Get all institutional data
router.get('/overview', (req, res) => {
    try {
        res.json({
            success: true,
            data: institutionalData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Institutional overview error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch institutional data'
        });
    }
});

// Get FII data only
router.get('/fii', (req, res) => {
    try {
        res.json({
            success: true,
            data: institutionalData.fii,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('FII data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch FII data'
        });
    }
});

// Get DII data only
router.get('/dii', (req, res) => {
    try {
        res.json({
            success: true,
            data: institutionalData.dii,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('DII data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch DII data'
        });
    }
});

// Get client data only
router.get('/client', (req, res) => {
    try {
        res.json({
            success: true,
            data: institutionalData.client,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Client data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch client data'
        });
    }
});

// Get market impact data
router.get('/impact', (req, res) => {
    try {
        res.json({
            success: true,
            data: institutionalData.marketImpact,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Market impact error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market impact data'
        });
    }
});

// Get live updates
router.get('/live-updates', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const updates = liveUpdates.slice(0, limit);
        
        res.json({
            success: true,
            data: updates,
            total: liveUpdates.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Live updates error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch live updates'
        });
    }
});

// Get historical institutional flows
router.get('/historical/:type', (req, res) => {
    try {
        const { type } = req.params; // fii, dii, or client
        const { period = '1M' } = req.query;
        
        if (!['fii', 'dii', 'client'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid type. Must be fii, dii, or client'
            });
        }
        
        // Generate historical data
        const days = period === '1W' ? 7 : period === '1M' ? 30 : 90;
        const baseValue = institutionalData[type].today;
        
        const historicalData = [];
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const variation = (Math.random() - 0.5) * (Math.abs(baseValue) * 0.3);
            const value = baseValue + variation;
            
            historicalData.push({
                date: date.toISOString().split('T')[0],
                value: Math.round(value),
                sentiment: Math.round(institutionalData[type].sentiment + (Math.random() - 0.5) * 10)
            });
        }
        
        res.json({
            success: true,
            data: {
                type,
                period,
                flows: historicalData
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Historical institutional data error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch historical data'
        });
    }
});

// Get sector-wise institutional flows
router.get('/sectors', (req, res) => {
    try {
        const sectorFlows = [
            { sector: 'Banking', fii: -450, dii: 680, net: 230 },
            { sector: 'IT', fii: 320, dii: 890, net: 1210 },
            { sector: 'Pharma', fii: -120, dii: 340, net: 220 },
            { sector: 'Auto', fii: -200, dii: 150, net: -50 },
            { sector: 'FMCG', fii: 80, dii: 420, net: 500 },
            { sector: 'Energy', fii: -300, dii: 560, net: 260 },
            { sector: 'Metals', fii: -180, dii: 290, net: 110 },
            { sector: 'Realty', fii: 45, dii: 180, net: 225 }
        ];
        
        res.json({
            success: true,
            data: sectorFlows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sector flows error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sector flows'
        });
    }
});

// Add manual live update (for admin use)
router.post('/live-updates', (req, res) => {
    try {
        const { message, type = 'manual' } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const newUpdate = {
            id: Date.now(),
            time: timeString,
            message,
            type,
            timestamp: now.toISOString()
        };
        
        liveUpdates.unshift(newUpdate);
        
        // Keep only last 20 updates
        if (liveUpdates.length > 20) {
            liveUpdates = liveUpdates.slice(0, 20);
        }
        
        res.json({
            success: true,
            data: newUpdate,
            message: 'Live update added successfully'
        });
    } catch (error) {
        console.error('Add live update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add live update'
        });
    }
});

module.exports = router;
