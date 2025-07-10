// Services and E-commerce Routes
const express = require('express');
const router = express.Router();

// Simulated services data
const servicesData = {
    services: [
        {
            id: 1,
            name: "Portfolio Management",
            category: "investment",
            description: "Professional portfolio management services tailored to your investment goals and risk tolerance.",
            shortDescription: "Expert portfolio management for optimal returns",
            price: 25000,
            duration: "12 months",
            features: [
                "Personalized investment strategy",
                "Regular portfolio rebalancing",
                "Risk assessment and management",
                "Monthly performance reports",
                "24/7 expert support",
                "Tax optimization strategies"
            ],
            benefits: [
                "Professional expertise",
                "Diversified investments",
                "Risk management",
                "Regular monitoring"
            ],
            rating: 4.8,
            reviews: 156,
            popular: true,
            imageUrl: "https://via.placeholder.com/400x300?text=Portfolio+Management"
        },
        {
            id: 2,
            name: "Stock Market Research",
            category: "research",
            description: "In-depth market analysis and research reports for informed investment decisions.",
            shortDescription: "Comprehensive market research and analysis",
            price: 15000,
            duration: "6 months",
            features: [
                "Daily market analysis",
                "Stock recommendations",
                "Sector reports",
                "Technical analysis",
                "Fundamental research",
                "Market outlook reports"
            ],
            benefits: [
                "Data-driven insights",
                "Expert analysis",
                "Timely recommendations",
                "Market trends"
            ],
            rating: 4.6,
            reviews: 89,
            popular: false,
            imageUrl: "https://via.placeholder.com/400x300?text=Market+Research"
        },
        {
            id: 3,
            name: "Trading Classes",
            category: "education",
            description: "Learn stock market trading from experts with our comprehensive courses.",
            shortDescription: "Professional trading education and mentorship",
            price: 12000,
            duration: "3 months",
            features: [
                "Live trading sessions",
                "Technical analysis training",
                "Risk management techniques",
                "Trading psychology",
                "Practical exercises",
                "Certification upon completion"
            ],
            benefits: [
                "Expert guidance",
                "Hands-on learning",
                "Practical skills",
                "Certification"
            ],
            rating: 4.9,
            reviews: 234,
            popular: true,
            imageUrl: "https://via.placeholder.com/400x300?text=Trading+Classes"
        },
        {
            id: 4,
            name: "Investment Planning",
            category: "planning",
            description: "Comprehensive financial planning services for your future investment needs.",
            shortDescription: "Strategic investment planning for long-term wealth",
            price: 20000,
            duration: "Ongoing",
            features: [
                "Goal-based planning",
                "Retirement planning",
                "Tax planning",
                "Insurance planning",
                "Estate planning",
                "Regular reviews"
            ],
            benefits: [
                "Future security",
                "Goal achievement",
                "Tax efficiency",
                "Wealth preservation"
            ],
            rating: 4.7,
            reviews: 112,
            popular: false,
            imageUrl: "https://via.placeholder.com/400x300?text=Investment+Planning"
        },
        {
            id: 5,
            name: "Insurance Services",
            category: "insurance",
            description: "Comprehensive insurance solutions to protect your investments and family.",
            shortDescription: "Complete insurance coverage and advisory",
            price: 8000,
            duration: "12 months",
            features: [
                "Life insurance planning",
                "Health insurance advisory",
                "Investment-linked policies",
                "Claims assistance",
                "Policy reviews",
                "Premium optimization"
            ],
            benefits: [
                "Financial protection",
                "Peace of mind",
                "Expert guidance",
                "Cost optimization"
            ],
            rating: 4.5,
            reviews: 67,
            popular: false,
            imageUrl: "https://via.placeholder.com/400x300?text=Insurance+Services"
        },
        {
            id: 6,
            name: "Loan Advisory",
            category: "loans",
            description: "Expert guidance on various loan products and financial assistance.",
            shortDescription: "Professional loan advisory and assistance",
            price: 5000,
            duration: "One-time",
            features: [
                "Loan eligibility assessment",
                "Best rate comparison",
                "Documentation assistance",
                "Application processing",
                "Negotiation support",
                "Post-approval support"
            ],
            benefits: [
                "Best rates",
                "Quick processing",
                "Expert negotiation",
                "Hassle-free process"
            ],
            rating: 4.4,
            reviews: 45,
            popular: false,
            imageUrl: "https://via.placeholder.com/400x300?text=Loan+Advisory"
        }
    ],
    packages: [
        {
            id: 'basic',
            name: 'Basic Package',
            price: 30000,
            duration: '6 months',
            services: [1, 2],
            discount: 10,
            popular: false,
            features: [
                'Portfolio Management',
                'Market Research',
                'Monthly Reports',
                'Email Support'
            ]
        },
        {
            id: 'premium',
            name: 'Premium Package',
            price: 50000,
            duration: '12 months',
            services: [1, 2, 3, 4],
            discount: 20,
            popular: true,
            features: [
                'All Basic features',
                'Trading Classes',
                'Investment Planning',
                'Priority Support',
                'Quarterly Reviews'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise Package',
            price: 80000,
            duration: '12 months',
            services: [1, 2, 3, 4, 5, 6],
            discount: 25,
            popular: false,
            features: [
                'All Premium features',
                'Insurance Services',
                'Loan Advisory',
                'Dedicated Manager',
                'Custom Solutions'
            ]
        }
    ]
};

// Shopping cart storage (in-memory, replace with database in production)
const carts = new Map();
const orders = new Map();

// Get all services
router.get('/list', (req, res) => {
    try {
        const { category, popular, limit } = req.query;
        let services = [...servicesData.services];
        
        // Filter by category
        if (category && category !== 'all') {
            services = services.filter(service => service.category === category);
        }
        
        // Filter by popular
        if (popular === 'true') {
            services = services.filter(service => service.popular);
        }
        
        // Apply limit
        if (limit) {
            services = services.slice(0, parseInt(limit));
        }
        
        res.json({
            success: true,
            data: services,
            total: services.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch services'
        });
    }
});

// Get single service
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const service = servicesData.services.find(s => s.id === parseInt(id));
        
        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
        
        res.json({
            success: true,
            data: service,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service'
        });
    }
});

// Get service packages
router.get('/packages/list', (req, res) => {
    try {
        res.json({
            success: true,
            data: servicesData.packages,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get packages error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch packages'
        });
    }
});

// Get service categories
router.get('/categories/list', (req, res) => {
    try {
        const categories = [
            { id: 'investment', name: 'Investment Services', count: 2 },
            { id: 'research', name: 'Research & Analysis', count: 1 },
            { id: 'education', name: 'Education & Training', count: 1 },
            { id: 'planning', name: 'Financial Planning', count: 1 },
            { id: 'insurance', name: 'Insurance Services', count: 1 },
            { id: 'loans', name: 'Loan Advisory', count: 1 }
        ];
        
        res.json({
            success: true,
            data: categories,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// Add to cart
router.post('/cart/add', (req, res) => {
    try {
        const { userId, serviceId, packageId, quantity = 1 } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }
        
        if (!serviceId && !packageId) {
            return res.status(400).json({
                success: false,
                error: 'Service ID or Package ID is required'
            });
        }
        
        // Get or create cart for user
        if (!carts.has(userId)) {
            carts.set(userId, { items: [], total: 0, updatedAt: new Date().toISOString() });
        }
        
        const cart = carts.get(userId);
        
        // Find service or package
        let item;
        if (serviceId) {
            item = servicesData.services.find(s => s.id === parseInt(serviceId));
            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'Service not found'
                });
            }
        } else {
            item = servicesData.packages.find(p => p.id === packageId);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    error: 'Package not found'
                });
            }
        }
        
        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(cartItem => 
            (serviceId && cartItem.serviceId === parseInt(serviceId)) ||
            (packageId && cartItem.packageId === packageId)
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            const cartItem = {
                id: Date.now(),
                serviceId: serviceId ? parseInt(serviceId) : null,
                packageId: packageId || null,
                name: item.name,
                price: item.price,
                quantity,
                addedAt: new Date().toISOString()
            };
            cart.items.push(cartItem);
        }
        
        // Update cart total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Item added to cart',
            cart,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item to cart'
        });
    }
});

// Get cart
router.get('/cart/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const cart = carts.get(userId) || { items: [], total: 0 };
        
        res.json({
            success: true,
            data: cart,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart'
        });
    }
});

// Update cart item
router.put('/cart/update', (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        
        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'User ID, item ID, and quantity are required'
            });
        }
        
        const cart = carts.get(userId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }
        
        const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }
        
        if (quantity <= 0) {
            // Remove item
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }
        
        // Update cart total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Cart updated',
            cart,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart'
        });
    }
});

// Remove from cart
router.delete('/cart/remove', (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and item ID are required'
            });
        }
        
        const cart = carts.get(userId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }
        
        const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }
        
        cart.items.splice(itemIndex, 1);
        
        // Update cart total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Item removed from cart',
            cart,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove item from cart'
        });
    }
});

// Clear cart
router.delete('/cart/clear/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        if (carts.has(userId)) {
            carts.delete(userId);
        }
        
        res.json({
            success: true,
            message: 'Cart cleared',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart'
        });
    }
});

// Create order
router.post('/order/create', (req, res) => {
    try {
        const { userId, paymentMethod, billingAddress } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }
        
        const cart = carts.get(userId);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
        }
        
        // Create order
        const orderId = `ORD-${Date.now()}`;
        const order = {
            id: orderId,
            userId,
            items: [...cart.items],
            total: cart.total,
            paymentMethod: paymentMethod || 'pending',
            billingAddress,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        orders.set(orderId, order);
        
        // Clear cart
        carts.delete(userId);
        
        res.json({
            success: true,
            message: 'Order created successfully',
            order,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
});

// Get order
router.get('/order/:orderId', (req, res) => {
    try {
        const { orderId } = req.params;
        const order = orders.get(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: order,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
});

// Get user orders
router.get('/orders/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userOrders = Array.from(orders.values())
            .filter(order => order.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({
            success: true,
            data: userOrders,
            total: userOrders.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// SIP Calculator
router.post('/calculator/sip', (req, res) => {
    try {
        const { monthlyAmount, expectedReturn, timePeriod } = req.body;
        
        if (!monthlyAmount || !expectedReturn || !timePeriod) {
            return res.status(400).json({
                success: false,
                error: 'Monthly amount, expected return, and time period are required'
            });
        }
        
        const monthlyRate = expectedReturn / 12 / 100;
        const months = timePeriod * 12;
        
        const maturityAmount = monthlyAmount * (((Math.pow(1 + monthlyRate, months)) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalInvestment = monthlyAmount * months;
        const totalReturns = maturityAmount - totalInvestment;
        
        res.json({
            success: true,
            data: {
                monthlyAmount,
                expectedReturn,
                timePeriod,
                totalInvestment: Math.round(totalInvestment),
                maturityAmount: Math.round(maturityAmount),
                totalReturns: Math.round(totalReturns),
                returnPercentage: ((totalReturns / totalInvestment) * 100).toFixed(2)
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('SIP calculator error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate SIP'
        });
    }
});

module.exports = router;
