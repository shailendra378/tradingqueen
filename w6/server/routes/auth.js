// Authentication Routes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// In-memory user storage (replace with database in production)
const users = new Map();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: 'Too many authentication attempts, please try again later.' }
});

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'trading-queen-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// User registration
router.post('/signup', authLimiter, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required',
                fields: ['name', 'email', 'password']
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        if (users.has(email)) {
            return res.status(409).json({
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            isActive: true,
            profile: {
                investmentExperience: 'beginner',
                riskTolerance: 'moderate',
                portfolioValue: 0
            }
        };

        users.set(email, user);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Registration failed',
            message: 'Please try again later'
        });
    }
});

// User login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = users.get(email);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Account is deactivated'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = new Date().toISOString();

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                lastLogin: user.lastLogin
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            message: 'Please try again later'
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.email);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch profile'
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
    try {
        const { name, investmentExperience, riskTolerance } = req.body;
        const user = users.get(req.user.email);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Update user data
        if (name) user.name = name;
        if (investmentExperience) user.profile.investmentExperience = investmentExperience;
        if (riskTolerance) user.profile.riskTolerance = riskTolerance;

        user.updatedAt = new Date().toISOString();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile: user.profile,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            error: 'Failed to update profile'
        });
    }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.email);
        if (user) {
            user.lastLogout = new Date().toISOString();
        }

        res.json({
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Logout failed'
        });
    }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name
        }
    });
});

// Demo accounts for testing
const createDemoAccounts = async () => {
    const demoUsers = [
        {
            name: 'Demo User',
            email: 'demo@tradingqueen.com',
            password: 'demo123'
        },
        {
            name: 'Test Investor',
            email: 'test@tradingqueen.com',
            password: 'test123'
        }
    ];

    for (const demoUser of demoUsers) {
        if (!users.has(demoUser.email)) {
            const hashedPassword = await bcrypt.hash(demoUser.password, 12);
            users.set(demoUser.email, {
                id: Date.now().toString() + Math.random(),
                name: demoUser.name,
                email: demoUser.email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isActive: true,
                profile: {
                    investmentExperience: 'intermediate',
                    riskTolerance: 'moderate',
                    portfolioValue: 50000
                }
            });
        }
    }
};

// Initialize demo accounts
createDemoAccounts();

module.exports = router;
