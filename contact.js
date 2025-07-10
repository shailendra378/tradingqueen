// Contact Routes
const express = require('express');
const router = express.Router();

// In-memory storage for contact submissions (replace with database in production)
const contactSubmissions = new Map();
const callbacks = new Map();

// Submit contact form
router.post('/submit', (req, res) => {
    try {
        const { name, email, phone, subject, message, type = 'general' } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required',
                fields: ['name', 'email', 'message']
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
        
        // Phone validation (if provided)
        if (phone) {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid phone number format'
                });
            }
        }
        
        // Create submission
        const submissionId = `CONTACT-${Date.now()}`;
        const submission = {
            id: submissionId,
            name,
            email,
            phone: phone || null,
            subject: subject || 'General Inquiry',
            message,
            type,
            status: 'new',
            priority: 'normal',
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responses: []
        };
        
        contactSubmissions.set(submissionId, submission);
        
        // Auto-assign priority based on keywords
        const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediate', 'critical'];
        const messageText = message.toLowerCase();
        if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
            submission.priority = 'high';
        }
        
        res.json({
            success: true,
            message: 'Contact form submitted successfully',
            submissionId,
            estimatedResponse: '24 hours',
            timestamp: new Date().toISOString()
        });
        
        // Log submission for admin
        console.log(`New contact submission: ${submissionId} from ${email}`);
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact form'
        });
    }
});

// Request callback
router.post('/callback', (req, res) => {
    try {
        const { name, phone, preferredTime, topic } = req.body;
        
        // Validation
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Name and phone number are required',
                fields: ['name', 'phone']
            });
        }
        
        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format'
            });
        }
        
        // Create callback request
        const callbackId = `CALLBACK-${Date.now()}`;
        const callback = {
            id: callbackId,
            name,
            phone,
            preferredTime: preferredTime || 'anytime',
            topic: topic || 'General Discussion',
            status: 'pending',
            requestedAt: new Date().toISOString(),
            scheduledAt: null,
            completedAt: null,
            notes: ''
        };
        
        callbacks.set(callbackId, callback);
        
        res.json({
            success: true,
            message: 'Callback request submitted successfully',
            callbackId,
            estimatedCallback: 'Within 2 business hours',
            timestamp: new Date().toISOString()
        });
        
        // Log callback request for admin
        console.log(`New callback request: ${callbackId} for ${phone}`);
        
    } catch (error) {
        console.error('Callback request error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit callback request'
        });
    }
});

// Get contact submission status
router.get('/submission/:submissionId', (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = contactSubmissions.get(submissionId);
        
        if (!submission) {
            return res.status(404).json({
                success: false,
                error: 'Submission not found'
            });
        }
        
        // Return public information only
        const publicSubmission = {
            id: submission.id,
            subject: submission.subject,
            status: submission.status,
            priority: submission.priority,
            submittedAt: submission.submittedAt,
            updatedAt: submission.updatedAt,
            responseCount: submission.responses.length
        };
        
        res.json({
            success: true,
            data: publicSubmission,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch submission'
        });
    }
});

// Get callback status
router.get('/callback/:callbackId', (req, res) => {
    try {
        const { callbackId } = req.params;
        const callback = callbacks.get(callbackId);
        
        if (!callback) {
            return res.status(404).json({
                success: false,
                error: 'Callback request not found'
            });
        }
        
        // Return public information only
        const publicCallback = {
            id: callback.id,
            topic: callback.topic,
            status: callback.status,
            requestedAt: callback.requestedAt,
            scheduledAt: callback.scheduledAt,
            preferredTime: callback.preferredTime
        };
        
        res.json({
            success: true,
            data: publicCallback,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get callback error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch callback request'
        });
    }
});

// Get office information
router.get('/office-info', (req, res) => {
    try {
        const officeInfo = {
            address: {
                street: "123 Financial District",
                area: "Bandra Kurla Complex",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400051",
                country: "India"
            },
            contact: {
                phone: "+91 9876543210",
                email: "info@tradingqueen.com",
                whatsapp: "+91 9876543210",
                telegram: "@tradingqueen"
            },
            hours: {
                weekdays: "9:00 AM - 6:00 PM",
                saturday: "9:00 AM - 2:00 PM",
                sunday: "Closed",
                timezone: "Asia/Kolkata"
            },
            services: [
                "Portfolio Management",
                "Investment Advisory",
                "Market Research",
                "Trading Education",
                "Financial Planning"
            ],
            socialMedia: {
                facebook: "https://facebook.com/tradingqueen",
                twitter: "https://twitter.com/tradingqueen",
                linkedin: "https://linkedin.com/company/tradingqueen",
                youtube: "https://youtube.com/tradingqueen",
                instagram: "https://instagram.com/tradingqueen"
            }
        };
        
        res.json({
            success: true,
            data: officeInfo,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get office info error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch office information'
        });
    }
});

// Get FAQ
router.get('/faq', (req, res) => {
    try {
        const faq = [
            {
                id: 1,
                category: "General",
                question: "What services does Trading Queen offer?",
                answer: "We offer comprehensive financial services including portfolio management, stock market research, trading education, investment planning, insurance services, and loan advisory."
            },
            {
                id: 2,
                category: "Investment",
                question: "What is the minimum investment amount?",
                answer: "The minimum investment varies by service. For portfolio management, it starts from ₹1 lakh. For our trading classes, the fee is ₹12,000 for a 3-month course."
            },
            {
                id: 3,
                category: "Trading",
                question: "Do you provide trading signals?",
                answer: "Yes, our market research service includes daily trading signals, stock recommendations, and technical analysis. We also provide real-time market updates and alerts."
            },
            {
                id: 4,
                category: "Support",
                question: "What are your customer support hours?",
                answer: "Our customer support is available Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM (IST). We also provide email support 24/7."
            },
            {
                id: 5,
                category: "Account",
                question: "How do I track my portfolio performance?",
                answer: "We provide monthly performance reports and you can access your portfolio dashboard 24/7 through our client portal. Real-time updates are available for premium clients."
            },
            {
                id: 6,
                category: "Payment",
                question: "What payment methods do you accept?",
                answer: "We accept bank transfers, UPI payments, credit/debit cards, and cheques. All payments are processed securely through encrypted channels."
            },
            {
                id: 7,
                category: "Education",
                question: "Are the trading classes suitable for beginners?",
                answer: "Yes, our trading classes are designed for all levels - from complete beginners to advanced traders. We provide personalized learning paths based on your experience level."
            },
            {
                id: 8,
                category: "Research",
                question: "How accurate are your stock recommendations?",
                answer: "Our research team has a track record of 75%+ accuracy in stock recommendations. However, all investments carry risk and past performance doesn't guarantee future results."
            }
        ];
        
        const { category } = req.query;
        let filteredFaq = faq;
        
        if (category && category !== 'all') {
            filteredFaq = faq.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }
        
        res.json({
            success: true,
            data: filteredFaq,
            categories: [...new Set(faq.map(item => item.category))],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get FAQ error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch FAQ'
        });
    }
});

// Get contact statistics (for admin)
router.get('/stats', (req, res) => {
    try {
        const submissions = Array.from(contactSubmissions.values());
        const callbackRequests = Array.from(callbacks.values());
        
        const stats = {
            totalSubmissions: submissions.length,
            totalCallbacks: callbackRequests.length,
            pendingSubmissions: submissions.filter(s => s.status === 'new').length,
            pendingCallbacks: callbackRequests.filter(c => c.status === 'pending').length,
            highPrioritySubmissions: submissions.filter(s => s.priority === 'high').length,
            todaySubmissions: submissions.filter(s => {
                const today = new Date().toDateString();
                return new Date(s.submittedAt).toDateString() === today;
            }).length,
            todayCallbacks: callbackRequests.filter(c => {
                const today = new Date().toDateString();
                return new Date(c.requestedAt).toDateString() === today;
            }).length,
            averageResponseTime: "4.2 hours", // Simulated
            customerSatisfaction: "4.8/5" // Simulated
        };
        
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contact statistics'
        });
    }
});

// Submit feedback
router.post('/feedback', (req, res) => {
    try {
        const { name, email, rating, feedback, category = 'general' } = req.body;
        
        // Validation
        if (!name || !email || !rating || !feedback) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, rating, and feedback are required'
            });
        }
        
        // Rating validation
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }
        
        // Create feedback submission
        const feedbackId = `FEEDBACK-${Date.now()}`;
        const feedbackSubmission = {
            id: feedbackId,
            name,
            email,
            rating: parseInt(rating),
            feedback,
            category,
            submittedAt: new Date().toISOString(),
            status: 'received'
        };
        
        // Store feedback (in production, save to database)
        console.log(`New feedback received: ${feedbackId} - Rating: ${rating}/5`);
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit feedback'
        });
    }
});

module.exports = router;
