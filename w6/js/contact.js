// Contact Form and Communication Features for Trading Queen

class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Contact Manager initialized');
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Real-time form validation
        const formInputs = contactForm?.querySelectorAll('input, select, textarea');
        formInputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupFormValidation() {
        // Custom validation messages
        const validationMessages = {
            firstName: 'Please enter your first name',
            lastName: 'Please enter your last name',
            email: 'Please enter a valid email address',
            subject: 'Please select a subject',
            message: 'Please enter your message (minimum 10 characters)',
            privacy: 'You must agree to the privacy policy to continue'
        };

        // Apply custom validation
        Object.keys(validationMessages).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.setCustomValidity('');
                field.addEventListener('invalid', () => {
                    field.setCustomValidity(validationMessages[fieldId]);
                });
            }
        });
    }

    async handleContactForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = this.getFormData(form);
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await this.submitContactForm(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Track form submission
            this.trackFormSubmission(formData);
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    getFormData(form) {
        const formData = new FormData(form);
        return {
            firstName: formData.get('firstName') || document.getElementById('firstName').value,
            lastName: formData.get('lastName') || document.getElementById('lastName').value,
            email: formData.get('email') || document.getElementById('email').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            subject: formData.get('subject') || document.getElementById('subject').value,
            message: formData.get('message') || document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked,
            privacy: document.getElementById('privacy').checked,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
    }

    validateForm(data) {
        let isValid = true;
        const errors = [];

        // Required field validation
        if (!data.firstName.trim()) {
            errors.push('First name is required');
            this.showFieldError('firstName', 'First name is required');
            isValid = false;
        }

        if (!data.lastName.trim()) {
            errors.push('Last name is required');
            this.showFieldError('lastName', 'Last name is required');
            isValid = false;
        }

        if (!data.email.trim() || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!data.subject) {
            errors.push('Subject is required');
            this.showFieldError('subject', 'Please select a subject');
            isValid = false;
        }

        if (!data.message.trim() || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters');
            this.showFieldError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (!data.privacy) {
            errors.push('Privacy policy agreement is required');
            this.showFieldError('privacy', 'You must agree to the privacy policy');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;

        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    this.showFieldError(fieldId, `${fieldId === 'firstName' ? 'First' : 'Last'} name is required`);
                    return false;
                }
                break;
            
            case 'email':
                if (!value || !this.isValidEmail(value)) {
                    this.showFieldError(fieldId, 'Please enter a valid email address');
                    return false;
                }
                break;
            
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(fieldId, 'Please enter a valid phone number');
                    return false;
                }
                break;
            
            case 'message':
                if (!value || value.length < 10) {
                    this.showFieldError(fieldId, 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remove existing error
        this.clearFieldError(field);

        // Add error class
        field.classList.add('is-invalid');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        // Insert error message
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorMsg = field.parentNode.querySelector('.invalid-feedback');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    async submitContactForm(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In production, send data to your backend API
        console.log('Contact form submitted:', data);
        
        // Simulate different response scenarios
        const scenarios = ['success', 'success', 'success', 'error']; // 75% success rate
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        if (scenario === 'error') {
            throw new Error('Simulated submission error');
        }
        
        return {
            success: true,
            message: 'Message sent successfully',
            ticketId: 'TQ' + Date.now()
        };
    }

    showSuccessMessage() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle"></i> Message Sent Successfully!
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                            <h4>Thank you for contacting us!</h4>
                            <p class="text-muted">We have received your message and will respond within 2 hours during business hours.</p>
                        </div>
                        <div class="contact-next-steps">
                            <h6>What happens next?</h6>
                            <ul class="list-unstyled text-start">
                                <li><i class="fas fa-envelope text-primary me-2"></i> You'll receive a confirmation email shortly</li>
                                <li><i class="fas fa-user-tie text-success me-2"></i> Our expert will review your inquiry</li>
                                <li><i class="fas fa-phone text-warning me-2"></i> We'll contact you within 2 hours</li>
                                <li><i class="fas fa-calendar text-info me-2"></i> Schedule a consultation if needed</li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Continue</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const successModal = new bootstrap.Modal(modal);
        successModal.show();
        
        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    showErrorMessage(message) {
        // Use global notification if available
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification(message, 'danger');
        } else {
            alert(message);
        }
    }

    trackFormSubmission(data) {
        // Track form submission for analytics
        console.log('Form submission tracked:', {
            subject: data.subject,
            timestamp: data.timestamp,
            newsletter: data.newsletter
        });
        
        // In production, send to analytics service
        // gtag('event', 'form_submit', { form_name: 'contact' });
    }
}

// Quick contact functions
function openMap() {
    const address = "123 Financial District, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
}

function callUs() {
    window.location.href = 'tel:+919876543210';
}

function emailUs() {
    window.location.href = 'mailto:info@tradingqueen.com?subject=General Inquiry';
}

function startWhatsAppChat() {
    const message = encodeURIComponent("Hi! I'm interested in Trading Queen's services. Can you help me?");
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
}

function startTelegramChat() {
    window.open('https://t.me/tradingqueen', '_blank');
}

function scheduleCallback() {
    // Create callback scheduling modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Schedule a Callback</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="callbackForm">
                        <div class="mb-3">
                            <label class="form-label">Your Name</label>
                            <input type="text" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Phone Number</label>
                            <input type="tel" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Preferred Time</label>
                            <select class="form-select" required>
                                <option value="">Select preferred time</option>
                                <option value="morning">Morning (9 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                <option value="evening">Evening (4 PM - 6 PM)</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Purpose of Call</label>
                            <select class="form-select" required>
                                <option value="">Select purpose</option>
                                <option value="services">Services Information</option>
                                <option value="portfolio">Portfolio Management</option>
                                <option value="trading">Trading Classes</option>
                                <option value="support">Technical Support</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" onclick="submitCallback()">Schedule Callback</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const callbackModal = new bootstrap.Modal(modal);
    callbackModal.show();
    
    // Remove modal from DOM after it's hidden
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function submitCallback() {
    // Simulate callback scheduling
    const modal = bootstrap.Modal.getInstance(document.querySelector('.modal'));
    modal.hide();
    
    setTimeout(() => {
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification('Callback scheduled successfully! We will call you within 2 hours.', 'success');
        } else {
            alert('Callback scheduled successfully! We will call you within 2 hours.');
        }
    }, 500);
}

function startLiveChat() {
    // Simulate live chat
    if (window.TradingQueen && window.TradingQueen.showNotification) {
        window.TradingQueen.showNotification('Live chat feature coming soon! Please use WhatsApp or call us directly.', 'info');
    } else {
        alert('Live chat feature coming soon! Please use WhatsApp or call us directly.');
    }
}

// Initialize contact manager
document.addEventListener('DOMContentLoaded', function() {
    window.contactManager = new ContactManager();
    
    // Make it globally available
    window.ContactManager = window.contactManager;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactManager;
}
