// E-commerce System for Trading Queen Services

class ECommerceSystem {
    constructor() {
        this.cart = [];
        this.orders = [];
        this.init();
    }

    init() {
        console.log('E-commerce System initialized');
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.setupServiceFilters();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e));
        });

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.showCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Place order button
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => this.placeOrder());
        }

        // Service filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => this.filterServices(e));
        });
    }

    setupServiceFilters() {
        // Initialize service filtering
        this.filterServices({ target: document.querySelector('.filter-btn.active') });
    }

    addToCart(event) {
        const button = event.target;
        const serviceName = button.getAttribute('data-service');
        const price = parseInt(button.getAttribute('data-price'));
        const type = button.getAttribute('data-type');

        // Check if user is logged in for premium services
        if (price > 10000 && window.AuthSystem && !window.AuthSystem.isUserLoggedIn()) {
            window.AuthSystem.requireAuth(() => {
                this.addToCart(event);
            });
            return;
        }

        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.name === serviceName);
        
        if (existingItem) {
            this.showNotification('Item already in cart!', 'warning');
            return;
        }

        // Add item to cart
        const cartItem = {
            id: Date.now(),
            name: serviceName,
            price: price,
            type: type,
            quantity: 1,
            addedAt: new Date().toISOString()
        };

        this.cart.push(cartItem);
        this.saveCartToStorage();
        this.updateCartDisplay();
        
        // Visual feedback
        button.textContent = 'Added to Cart';
        button.disabled = true;
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.disabled = false;
            button.classList.remove('btn-success');
        }, 2000);

        this.showNotification(`${serviceName} added to cart!`, 'success');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartModal();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = this.calculateTotal();
        
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.style.display = this.cart.length > 0 ? 'block' : 'none';
        }

        // Update checkout button state
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    showCart() {
        this.updateCartModal();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    }

    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.type}</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">₹${this.formatPrice(item.price)}</div>
                        <button class="btn btn-sm btn-outline-danger" onclick="ecommerceSystem.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        if (cartTotal) {
            cartTotal.textContent = `₹${this.formatPrice(this.calculateTotal())}`;
        }
    }

    proceedToCheckout() {
        // Check if user is logged in
        if (window.AuthSystem && !window.AuthSystem.isUserLoggedIn()) {
            window.AuthSystem.requireAuth(() => {
                this.proceedToCheckout();
            });
            return;
        }

        // Close cart modal and open checkout modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }

        this.updateCheckoutModal();
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    }

    updateCheckoutModal() {
        const checkoutSummary = document.getElementById('checkoutSummary');
        const checkoutTotal = document.getElementById('checkoutTotal');

        if (checkoutSummary) {
            checkoutSummary.innerHTML = this.cart.map(item => `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name}</span>
                    <span>₹${this.formatPrice(item.price)}</span>
                </div>
            `).join('');
        }

        if (checkoutTotal) {
            checkoutTotal.textContent = `₹${this.formatPrice(this.calculateTotal())}`;
        }

        // Pre-fill user data if logged in
        if (window.AuthSystem && window.AuthSystem.isUserLoggedIn()) {
            const user = window.AuthSystem.getCurrentUser();
            const form = document.getElementById('checkoutForm');
            if (form && user) {
                const nameInput = form.querySelector('input[type="text"]');
                const emailInput = form.querySelector('input[type="email"]');
                
                if (nameInput) nameInput.value = user.name || '';
                if (emailInput) emailInput.value = user.email || '';
            }
        }
    }

    async placeOrder() {
        const form = document.getElementById('checkoutForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const orderData = {
            id: Date.now(),
            items: [...this.cart],
            total: this.calculateTotal(),
            customerInfo: {
                name: form.querySelector('input[type="text"]').value,
                email: form.querySelector('input[type="email"]').value,
                phone: form.querySelector('input[type="tel"]').value,
                pan: form.querySelector('input[type="text"]:nth-of-type(2)').value,
                address: form.querySelector('textarea').value
            },
            paymentMethod: form.querySelector('input[name="paymentMethod"]:checked').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Show loading state
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const originalText = placeOrderBtn.textContent;
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;

        try {
            // Simulate payment processing
            await this.processPayment(orderData);
            
            // Save order
            this.orders.push(orderData);
            this.saveOrdersToStorage();
            
            // Clear cart
            this.cart = [];
            this.saveCartToStorage();
            this.updateCartDisplay();
            
            // Close checkout modal
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            if (checkoutModal) {
                checkoutModal.hide();
            }
            
            // Show success message
            this.showOrderConfirmation(orderData);
            
        } catch (error) {
            console.error('Order processing error:', error);
            this.showNotification('Order processing failed. Please try again.', 'danger');
        } finally {
            // Reset button state
            placeOrderBtn.textContent = originalText;
            placeOrderBtn.disabled = false;
        }
    }

    async processPayment(orderData) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate payment gateway integration
        const paymentMethods = {
            card: 'Credit/Debit Card',
            upi: 'UPI Payment',
            netbanking: 'Net Banking'
        };
        
        console.log(`Processing payment via ${paymentMethods[orderData.paymentMethod]}`);
        console.log(`Amount: ₹${this.formatPrice(orderData.total)}`);
        
        // In production, integrate with actual payment gateways like:
        // - Razorpay
        // - Stripe
        // - PayU
        // - Paytm
        
        return {
            success: true,
            transactionId: 'TXN' + Date.now(),
            paymentMethod: orderData.paymentMethod
        };
    }

    showOrderConfirmation(orderData) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle"></i> Order Confirmed!
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                            <h4>Thank you for your order!</h4>
                            <p class="text-muted">Order ID: #${orderData.id}</p>
                        </div>
                        <div class="order-summary">
                            <h6>Order Summary:</h6>
                            ${orderData.items.map(item => `
                                <div class="d-flex justify-content-between">
                                    <span>${item.name}</span>
                                    <span>₹${this.formatPrice(item.price)}</span>
                                </div>
                            `).join('')}
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span>₹${this.formatPrice(orderData.total)}</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="text-muted">
                                You will receive a confirmation email shortly. 
                                Our team will contact you within 24 hours to discuss your services.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Continue</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const confirmationModal = new bootstrap.Modal(modal);
        confirmationModal.show();
        
        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    filterServices(event) {
        const filter = event.target.getAttribute('data-filter');
        const serviceItems = document.querySelectorAll('.service-item');
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter service items
        serviceItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.classList.add('fade-in-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in-up');
            }
        });
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-IN').format(price);
    }

    saveCartToStorage() {
        localStorage.setItem('tradingQueen_cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const storedCart = localStorage.getItem('tradingQueen_cart');
        if (storedCart) {
            try {
                this.cart = JSON.parse(storedCart);
            } catch (error) {
                console.error('Error loading cart from storage:', error);
                this.cart = [];
            }
        }
    }

    saveOrdersToStorage() {
        localStorage.setItem('tradingQueen_orders', JSON.stringify(this.orders));
    }

    loadOrdersFromStorage() {
        const storedOrders = localStorage.getItem('tradingQueen_orders');
        if (storedOrders) {
            try {
                this.orders = JSON.parse(storedOrders);
            } catch (error) {
                console.error('Error loading orders from storage:', error);
                this.orders = [];
            }
        }
    }

    showNotification(message, type = 'info') {
        // Use the global notification function
        if (window.TradingQueen && window.TradingQueen.showNotification) {
            window.TradingQueen.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Public API methods
    getCart() {
        return [...this.cart];
    }

    getOrders() {
        return [...this.orders];
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartModal();
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    // Analytics and reporting
    getCartAnalytics() {
        return {
            totalItems: this.cart.length,
            totalValue: this.calculateTotal(),
            averageItemValue: this.cart.length > 0 ? this.calculateTotal() / this.cart.length : 0,
            serviceTypes: this.cart.reduce((types, item) => {
                types[item.type] = (types[item.type] || 0) + 1;
                return types;
            }, {})
        };
    }

    getOrderAnalytics() {
        return {
            totalOrders: this.orders.length,
            totalRevenue: this.orders.reduce((total, order) => total + order.total, 0),
            averageOrderValue: this.orders.length > 0 ? 
                this.orders.reduce((total, order) => total + order.total, 0) / this.orders.length : 0,
            ordersByStatus: this.orders.reduce((statuses, order) => {
                statuses[order.status] = (statuses[order.status] || 0) + 1;
                return statuses;
            }, {}),
            paymentMethods: this.orders.reduce((methods, order) => {
                methods[order.paymentMethod] = (methods[order.paymentMethod] || 0) + 1;
                return methods;
            }, {})
        };
    }
}

// Initialize e-commerce system
document.addEventListener('DOMContentLoaded', function() {
    window.ecommerceSystem = new ECommerceSystem();
    
    // Make it globally available
    window.ECommerceSystem = window.ecommerceSystem;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ECommerceSystem;
}
