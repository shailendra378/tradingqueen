// Enhanced Authentication System for Trading Queen Website

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.passwordStrength = 0;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkLoginStatus();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI based on login status
        this.updateAuthUI();
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        // Signup button
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.showSignupModal());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form submission
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Forgot password form
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Modal switching
        const switchToSignup = document.getElementById('switchToSignup');
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignupModal();
            });
        }

        const switchToLogin = document.getElementById('switchToLogin');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLoginModal();
            });
        }

        // Forgot password link
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }

        // Back to login from forgot password
        const backToLogin = document.getElementById('backToLogin');
        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        // Password toggle buttons
        const toggleLoginPassword = document.getElementById('toggleLoginPassword');
        if (toggleLoginPassword) {
            toggleLoginPassword.addEventListener('click', () => this.togglePassword('loginPassword', 'toggleLoginPassword'));
        }

        const toggleSignupPassword = document.getElementById('toggleSignupPassword');
        if (toggleSignupPassword) {
            toggleSignupPassword.addEventListener('click', () => this.togglePassword('signupPassword', 'toggleSignupPassword'));
        }

        // Demo credentials button
        const fillDemoCredentials = document.getElementById('fillDemoCredentials');
        if (fillDemoCredentials) {
            fillDemoCredentials.addEventListener('click', () => this.fillDemoCredentials());
        }

        // Password strength checker
        const signupPassword = document.getElementById('signupPassword');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Confirm password validation
        const signupConfirmPassword = document.getElementById('signupConfirmPassword');
        if (signupConfirmPassword) {
            signupConfirmPassword.addEventListener('input', (e) => this.validatePasswordMatch());
        }

        // Real-time form validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
            input.addEventListener('input', () => this.clearValidation(input));
        });

        // Name validation
        const nameInput = document.getElementById('signupName');
        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateName(nameInput));
            nameInput.addEventListener('input', () => this.clearValidation(nameInput));
        }

        // Phone validation
        const phoneInput = document.getElementById('signupPhone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
            phoneInput.addEventListener('input', () => this.clearValidation(phoneInput));
        }
    }

    showLoginModal() {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }

    showSignupModal() {
        const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
        signupModal.show();
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual authentication)
            const loginResult = await this.authenticateUser(email, password);
            
            if (loginResult.success) {
                this.currentUser = loginResult.user;
                this.isLoggedIn = true;
                
                // Store login state
                localStorage.setItem('tradingQueen_user', JSON.stringify(this.currentUser));
                localStorage.setItem('tradingQueen_token', loginResult.token);
                
                // Update UI
                this.updateAuthUI();
                
                // Close modal
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();
                
                // Show success message
                this.showNotification('Login successful! Welcome back.', 'success');
                
                // Clear form
                document.getElementById('loginForm').reset();
                
            } else {
                this.showNotification(loginResult.message || 'Login failed. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('An error occurred during login. Please try again.', 'danger');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(event) {
        event.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Basic validation
        if (!this.validateSignupData(name, email, password)) {
            return;
        }

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual registration)
            const signupResult = await this.registerUser(name, email, password);
            
            if (signupResult.success) {
                // Close modal
                const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
                signupModal.hide();
                
                // Show success message
                this.showNotification('Account created successfully! Please login.', 'success');
                
                // Clear form
                document.getElementById('signupForm').reset();
                
                // Show login modal
                setTimeout(() => {
                    this.showLoginModal();
                }, 1000);
                
            } else {
                this.showNotification(signupResult.message || 'Registration failed. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('An error occurred during registration. Please try again.', 'danger');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateSignupData(name, email, password) {
        // Name validation
        if (name.length < 2) {
            this.showNotification('Name must be at least 2 characters long.', 'warning');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'warning');
            return false;
        }

        // Password validation
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long.', 'warning');
            return false;
        }

        return true;
    }

    async authenticateUser(email, password) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo users for testing
        const demoUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
                joinDate: '2024-01-15'
            },
            {
                id: 2,
                name: 'Admin User',
                email: 'admin@tradingqueen.com',
                password: 'admin123',
                role: 'admin',
                joinDate: '2023-12-01'
            }
        ];

        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return {
                success: true,
                user: userWithoutPassword,
                token: this.generateToken(user.id)
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password.'
            };
        }
    }

    async registerUser(name, email, password) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if email already exists (demo check)
        const existingEmails = ['existing@example.com', 'admin@tradingqueen.com'];
        
        if (existingEmails.includes(email)) {
            return {
                success: false,
                message: 'Email already exists. Please use a different email.'
            };
        }

        // Simulate successful registration
        return {
            success: true,
            message: 'Account created successfully!'
        };
    }

    generateToken(userId) {
        // Simple token generation (use proper JWT in production)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return btoa(`${userId}:${timestamp}:${random}`);
    }

    logout() {
        // Clear user data
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Clear storage
        localStorage.removeItem('tradingQueen_user');
        localStorage.removeItem('tradingQueen_token');
        
        // Update UI
        this.updateAuthUI();
        
        // Show success message
        this.showNotification('You have been logged out successfully.', 'info');
        
        // Redirect to home if on protected page
        if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('profile')) {
            window.location.href = '/';
        }
    }

    checkLoginStatus() {
        const storedUser = localStorage.getItem('tradingQueen_user');
        const storedToken = localStorage.getItem('tradingQueen_token');
        
        if (storedUser && storedToken) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.isLoggedIn = true;
                
                // Validate token (basic check)
                if (this.isTokenValid(storedToken)) {
                    console.log('User logged in:', this.currentUser.name);
                } else {
                    // Token expired, logout
                    this.logout();
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.logout();
            }
        }
    }

    isTokenValid(token) {
        try {
            const decoded = atob(token);
            const [userId, timestamp, random] = decoded.split(':');
            const tokenAge = Date.now() - parseInt(timestamp);
            
            // Token expires after 24 hours (86400000 ms)
            return tokenAge < 86400000;
        } catch (error) {
            return false;
        }
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.isLoggedIn && this.currentUser) {
            // Hide login/signup buttons
            if (loginBtn) loginBtn.classList.add('d-none');
            if (signupBtn) signupBtn.classList.add('d-none');
            
            // Show logout button with user name
            if (logoutBtn) {
                logoutBtn.classList.remove('d-none');
                logoutBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
            }
            
            // Update any user-specific content
            this.updateUserContent();
            
        } else {
            // Show login/signup buttons
            if (loginBtn) loginBtn.classList.remove('d-none');
            if (signupBtn) signupBtn.classList.remove('d-none');
            
            // Hide logout button
            if (logoutBtn) logoutBtn.classList.add('d-none');
        }
    }

    updateUserContent() {
        // Update personalized content based on user data
        const userElements = document.querySelectorAll('[data-user-content]');
        userElements.forEach(element => {
            const contentType = element.getAttribute('data-user-content');
            switch (contentType) {
                case 'name':
                    element.textContent = this.currentUser.name;
                    break;
                case 'email':
                    element.textContent = this.currentUser.email;
                    break;
                case 'role':
                    element.textContent = this.currentUser.role;
                    break;
                case 'welcome':
                    element.textContent = `Welcome back, ${this.currentUser.name}!`;
                    break;
            }
        });
    }

    showNotification(message, type = 'info') {
        // Use the global notification function
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }

    // Enhanced modal switching methods
    switchToSignupModal() {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
            loginModal.hide();
        }
        setTimeout(() => {
            this.showSignupModal();
        }, 300);
    }

    switchToLoginModal() {
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        if (signupModal) {
            signupModal.hide();
        }
        setTimeout(() => {
            this.showLoginModal();
        }, 300);
    }

    showForgotPasswordModal() {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
            loginModal.hide();
        }
        setTimeout(() => {
            const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
            forgotPasswordModal.show();
        }, 300);
    }

    // Password toggle functionality
    togglePassword(passwordFieldId, toggleButtonId) {
        const passwordField = document.getElementById(passwordFieldId);
        const toggleButton = document.getElementById(toggleButtonId);
        const icon = toggleButton.querySelector('i');

        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Fill demo credentials
    fillDemoCredentials() {
        document.getElementById('loginEmail').value = 'john@example.com';
        document.getElementById('loginPassword').value = 'password123';
        
        // Add visual feedback
        const demoBtn = document.getElementById('fillDemoCredentials');
        const originalText = demoBtn.textContent;
        demoBtn.textContent = 'Filled!';
        demoBtn.classList.add('btn-success');
        
        setTimeout(() => {
            demoBtn.textContent = originalText;
            demoBtn.classList.remove('btn-success');
        }, 2000);
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let strengthLabel = '';
        let strengthClass = '';

        // Check password criteria
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Determine strength level
        switch (strength) {
            case 0:
            case 1:
                strengthLabel = 'Very Weak';
                strengthClass = 'weak';
                break;
            case 2:
                strengthLabel = 'Weak';
                strengthClass = 'weak';
                break;
            case 3:
                strengthLabel = 'Fair';
                strengthClass = 'fair';
                break;
            case 4:
                strengthLabel = 'Good';
                strengthClass = 'good';
                break;
            case 5:
                strengthLabel = 'Strong';
                strengthClass = 'strong';
                break;
        }

        // Update UI
        strengthBar.className = `progress-bar ${strengthClass}`;
        strengthBar.style.width = `${(strength / 5) * 100}%`;
        strengthText.textContent = `Password strength: ${strengthLabel}`;
        
        this.passwordStrength = strength;
    }

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const confirmField = document.getElementById('signupConfirmPassword');

        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError(confirmField, 'Passwords do not match');
        } else if (confirmPassword) {
            this.showFieldSuccess(confirmField, 'Passwords match');
        }
    }

    // Real-time validation methods
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showFieldError(input, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            this.showFieldSuccess(input, 'Valid email address');
            return true;
        }
    }

    validateName(input) {
        const name = input.value.trim();

        if (!name) {
            this.showFieldError(input, 'Name is required');
            return false;
        } else if (name.length < 2) {
            this.showFieldError(input, 'Name must be at least 2 characters');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            this.showFieldError(input, 'Name can only contain letters and spaces');
            return false;
        } else {
            this.showFieldSuccess(input, 'Valid name');
            return true;
        }
    }

    validatePhone(input) {
        const phone = input.value.trim();
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

        if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            this.showFieldError(input, 'Please enter a valid phone number');
            return false;
        } else if (phone) {
            this.showFieldSuccess(input, 'Valid phone number');
            return true;
        }
        return true;
    }

    // Field validation UI helpers
    showFieldError(field, message) {
        this.clearValidation(field);
        field.classList.add('is-invalid');
        
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }

    showFieldSuccess(field, message) {
        this.clearValidation(field);
        field.classList.add('is-valid');
        
        const feedback = document.createElement('div');
        feedback.className = 'valid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }

    clearValidation(field) {
        field.classList.remove('is-invalid', 'is-valid');
        const feedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }

    // Forgot password handler
    async handleForgotPassword(event) {
        event.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        
        if (!this.validateEmail(document.getElementById('forgotEmail'))) {
            return;
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Close modal
            const forgotPasswordModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            forgotPasswordModal.hide();
            
            // Show success message
            this.showNotification('Password reset link sent to your email!', 'success');
            
            // Clear form
            document.getElementById('forgotPasswordForm').reset();
            
        } catch (error) {
            this.showNotification('Failed to send reset link. Please try again.', 'danger');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Enhanced form submission with better UX
    setFormLoading(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            form.classList.add('loading');
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            submitBtn.disabled = true;
        } else {
            form.classList.remove('loading');
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            submitBtn.disabled = false;
        }
    }

    // Enhanced signup validation
    validateSignupForm() {
        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('signupConfirmPassword');
        const agreeTerms = document.getElementById('agreeTerms');

        let isValid = true;

        // Validate all fields
        if (!this.validateName(name)) isValid = false;
        if (!this.validateEmail(email)) isValid = false;
        
        if (password.value.length < 6) {
            this.showFieldError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else if (this.passwordStrength < 3) {
            this.showFieldError(password, 'Please choose a stronger password');
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (!agreeTerms.checked) {
            this.showNotification('Please agree to the Terms of Service and Privacy Policy', 'warning');
            isValid = false;
        }

        return isValid;
    }

    // Public methods for external use
    getCurrentUser() {
        return this.currentUser;
    }

    isUserLoggedIn() {
        return this.isLoggedIn;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    requireAuth(callback) {
        if (this.isLoggedIn) {
            callback();
        } else {
            this.showNotification('Please login to access this feature.', 'warning');
            this.showLoginModal();
        }
    }

    // Analytics and tracking
    trackAuthEvent(event, data = {}) {
        console.log(`Auth Event: ${event}`, data);
        // In production, send to analytics service
        // gtag('event', event, { event_category: 'authentication', ...data });
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Make auth system globally available
window.AuthSystem = authSystem;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
