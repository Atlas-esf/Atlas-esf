// ==================== SCRIPT.JS ====================
// کامل و فعال با همه قابلیت‌ها

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 جرثقیل سازی اطلس اصفهان - در حال بارگذاری...');
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ آیکون‌ها بارگذاری شدند');
    } else {
        console.error('❌ Lucide Icons لود نشد!');
    }
    
    // Initialize the application
    initializeApp();
});

// ==================== GLOBAL STATE ====================
let currentUser = null;
let products = [];
let editingProductId = null;

// Valid users (hardcoded for demo)
const VALID_USERS = [
    { username: 'parsa', password: '12345678', name: 'پارسا' },
    { username: 'arman', password: '12345678', name: 'آرمان' },
    { username: 'admin', password: 'atlas1403', name: 'مدیر سیستم' }
];

// Products Data (default)
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        title: 'جرثقیل ۱۵ تن - سه تلسکوپ',
        image: './P1.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'سه تلسکوپ',
        floorType: 'با کف و دوبل',
        price: '۲,۵۰۰ میلیون تومان',
        isNew: true
    },
    {
        id: 2,
        title: 'جرثقیل ۱۵ تن - دو تلسکوپ',
        image: './P2.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'دو تلسکوپ',
        floorType: 'با کف و دوبل',
        price: '۲,۲۵۰ میلیون تومان',
        isNew: true
    },
    {
        id: 3,
        title: 'جرثقیل ۱۵ تن - سه تلسکوپ',
        image: './P3.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'سه تلسکوپ',
        floorType: 'بدون کف و دوبل',
        price: '۲,۲۵۰ میلیون تومان',
        isNew: true
    },
    {
        id: 4,
        title: 'جرثقیل ۱۵ تن - دو تلسکوپ',
        image: './P4.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'دو تلسکوپ',
        floorType: 'بدون کف و دوبل',
        price: '۲,۰۰۰ میلیون تومان',
        isNew: true
    }
];

// ==================== MAIN APP INITIALIZATION ====================
function initializeApp() {
    console.log('🚀 برنامه در حال راه‌اندازی...');
    
    // Load saved data from localStorage
    loadSavedData();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Render products
    renderProducts();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Force show chatbot button
    ensureChatbotButton();
    
    console.log('✅ برنامه با موفقیت راه‌اندازی شد!');
}

// ==================== LOAD SAVED DATA ====================
function loadSavedData() {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('👤 کاربر ذخیره شده یافت شد:', currentUser.username);
        } catch (e) {
            console.error('❌ خطا در خواندن کاربر:', e);
            currentUser = null;
        }
    }
    
    // Load products from localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        try {
            products = JSON.parse(savedProducts);
            console.log('📦 محصولات ذخیره شده بارگذاری شدند:', products.length);
        } catch (e) {
            console.error('❌ خطا در خواندن محصولات:', e);
            products = [...DEFAULT_PRODUCTS];
        }
    } else {
        // Use default products if none saved
        products = [...DEFAULT_PRODUCTS];
        console.log('📦 محصولات پیش‌فرض بارگذاری شدند');
    }
    
    // Update UI based on loaded data
    updateAuthUI();
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    console.log('🎯 در حال تنظیم event listener ها...');
    
    // Triple click on logo to login
    const logoSection = document.getElementById('logoSection');
    if (logoSection) {
        let clickCount = 0;
        let clickTimer = null;
        
        logoSection.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 1000);
            }
            
            if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                
                if (!currentUser) {
                    console.log('👆 Triple click detected! Opening login modal');
                    openModal('loginModal');
                } else {
                    console.log('👤 کاربر قبلاً وارد شده:', currentUser.username);
                }
            }
        });
        console.log('✅ Logo click listener added');
    }
    
    // Dashboard button
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', showDashboard);
        console.log('✅ Dashboard button listener added');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
        console.log('✅ Logout button listener added');
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form listener added');
    }
    
    // Edit form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditProduct);
        console.log('✅ Edit form listener added');
    }
    
    // Close login modal
    const closeLoginBtn = document.getElementById('closeLoginModal');
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => closeModal('loginModal'));
        console.log('✅ Close login modal listener added');
    }
    
    // Close edit modal
    const closeEditBtn = document.getElementById('closeEditModal');
    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', () => closeModal('editModal'));
        console.log('✅ Close edit modal listener added');
    }
    
    // Cancel edit
    const cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => closeModal('editModal'));
        console.log('✅ Cancel edit listener added');
    }
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
            
            // Close chatbot if open
            const chatbotWindow = document.getElementById('chatbotWindow');
            if (chatbotWindow && chatbotWindow.style.display === 'flex') {
                chatbotWindow.style.display = 'none';
                document.getElementById('chatbotBtn').style.display = 'flex';
            }
        }
    });
    
    console.log('✅ همه event listener ها تنظیم شدند');
}

// ==================== AUTHENTICATION FUNCTIONS ====================
function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 در حال پردازش ورود...');
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    console.log('📝 اطلاعات ورود:', { username, password: '***' });
    
    // Find valid user
    const validUser = VALID_USERS.find(
        user => user.username === username && user.password === password
    );
    
    if (validUser) {
        currentUser = {
            username: validUser.username,
            name: validUser.name
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Hide error
        errorDiv.style.display = 'none';
        
        // Close modal
        closeModal('loginModal');
        
        // Update UI
        updateAuthUI();
        
        // Re-render products (to show edit buttons)
        renderProducts();
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        console.log('✅ ورود موفق:', currentUser.username);
        
        // Show success message
        showToast('ورود موفقیت‌آمیز بود!', 'success');
    } else {
        errorDiv.textContent = '❌ نام کاربری یا رمز عبور اشتباه است';
        errorDiv.style.display = 'block';
        console.log('❌ ورود ناموفق');
        
        // Shake animation
        errorDiv.classList.add('shake');
        setTimeout(() => errorDiv.classList.remove('shake'), 500);
    }
}

function logout() {
    console.log('👋 در حال خروج...');
    
    // Clear user data
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Update UI
    updateAuthUI();
    
    // Re-render products (to hide edit buttons)
    renderProducts();
    
    // Hide dashboard if open
    hideDashboard();
    
    console.log('✅ خروج موفقیت‌آمیز');
    
    // Show logout message
    showToast('با موفقیت خارج شدید.', 'info');
}

function updateAuthUI() {
    const userInfo = document.getElementById('userInfo');
    const usernameSpan = document.getElementById('username');
    
    if (currentUser) {
        userInfo.style.display = 'flex';
        usernameSpan.textContent = currentUser.name || currentUser.username;
        console.log('👤 UI به‌روزرسانی شد: کاربر وارد شده');
    } else {
        userInfo.style.display = 'none';
        console.log('👤 UI به‌روزرسانی شد: کاربر خارج شده');
    }
    
    // Refresh icons
    if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 100);
    }
}

// ==================== PRODUCT MANAGEMENT ====================
function renderProducts() {
    console.log('🔄 در حال رندر محصولات...');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('❌ المنت productsGrid یافت نشد!');
        return;
    }
    
    // Clear grid
    productsGrid.innerHTML = '';
    
    // Render each product
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    console.log(`✅ ${products.length} محصول رندر شد`);
    
    // Refresh icons
    if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 100);
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.title}" class="product-image"
                 onerror="this.src='https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'">
            <div class="product-image-overlay"></div>
            ${product.isNew ? `
                <div class="product-badge">
                    <i data-lucide="sparkles"></i>
                    <span>جدید</span>
                </div>
            ` : ''}
        </div>

        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>

            <div class="product-features">
                <div class="product-feature">
                    <div class="feature-dot dot-blue"></div>
                    <span>${product.capacity}</span>
                </div>
                <div class="product-feature">
                    <div class="feature-dot dot-orange"></div>
                    <span>${product.telescopeType}</span>
                </div>
                <div class="product-feature">
                    <div class="feature-dot dot-green"></div>
                    <span>${product.floorType}</span>
                </div>
            </div>

            <div class="price-section">
                <button class="btn-toggle-price" data-product-id="${product.id}">
                    <span>مشاهده قیمت</span>
                    <i data-lucide="chevron-down"></i>
                </button>

                <div class="price-display" id="price-${product.id}">
                    <div class="price-info">
                        <span class="price-label">
                            <i data-lucide="star"></i>
                            قیمت:
                        </span>
                        <span class="price-value">${product.price}</span>
                    </div>
                    ${currentUser ? `
                        <button class="btn-edit-price" data-product-id="${product.id}">
                            <i data-lucide="edit-3"></i>
                            <span>ویرایش</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const toggleBtn = card.querySelector('.btn-toggle-price');
    toggleBtn.addEventListener('click', () => togglePrice(product.id));
    
    if (currentUser) {
        const editBtn = card.querySelector('.btn-edit-price');
        if (editBtn) {
            editBtn.addEventListener('click', () => openEditModal(product.id));
        }
    }
    
    return card;
}

function togglePrice(productId) {
    const priceDisplay = document.getElementById(`price-${productId}`);
    const toggleBtn = document.querySelector(`[data-product-id="${productId}"].btn-toggle-price`);
    
    if (!priceDisplay || !toggleBtn) return;
    
    if (priceDisplay.classList.contains('show')) {
        priceDisplay.classList.remove('show');
        toggleBtn.classList.remove('active');
    } else {
        priceDisplay.classList.add('show');
        toggleBtn.classList.add('active');
    }
    
    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function openEditModal(productId) {
    console.log('✏️ باز کردن مدال ویرایش محصول:', productId);
    
    editingProductId = productId;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('editProductTitle').textContent = product.title;
        document.getElementById('editTitle').value = product.title;
        document.getElementById('editCapacity').value = product.capacity;
        document.getElementById('editTelescope').value = product.telescopeType;
        document.getElementById('editFloor').value = product.floorType;
        document.getElementById('editPrice').value = product.price;
        
        openModal('editModal');
    }
}

function handleEditProduct(e) {
    e.preventDefault();
    console.log('💾 در حال ذخیره ویرایش محصول...');
    
    const title = document.getElementById('editTitle').value;
    const capacity = document.getElementById('editCapacity').value;
    const telescopeType = document.getElementById('editTelescope').value;
    const floorType = document.getElementById('editFloor').value;
    const price = document.getElementById('editPrice').value;
    
    if (editingProductId) {
        const productIndex = products.findIndex(p => p.id === editingProductId);
        
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                title,
                capacity,
                telescopeType,
                floorType,
                price
            };
            
            // Save to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Close modal
            closeModal('editModal');
            
            // Re-render
            renderProducts();
            
            // Re-render dashboard if open
            renderDashboard();
            
            // Reset
            editingProductId = null;
            
            console.log('✅ محصول ویرایش شد');
            showToast('محصول با موفقیت ویرایش شد.', 'success');
        }
    }
}

// ==================== DASHBOARD FUNCTIONS ====================
function showDashboard() {
    console.log('📊 در حال نمایش داشبورد...');
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderDashboard();
}

function hideDashboard() {
    console.log('🏠 بازگشت به سایت...');
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function renderDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    
    if (!dashboard) return;
    
    // Calculate stats
    const totalProducts = products.length;
    const newProducts = products.filter(p => p.isNew).length;
    const totalPrice = products.reduce((acc, p) => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''));
        return acc + (isNaN(price) ? 0 : price);
    }, 0);
    const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;
    
    dashboard.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <div class="container">
                    <div class="dashboard-header-content">
                        <div class="dashboard-title">
                            <button class="btn-back" onclick="hideDashboard()">
                                <i data-lucide="arrow-left"></i>
                                <span>بازگشت به سایت</span>
                            </button>
                            <h1>پنل مدیریت</h1>
                        </div>
                        <div class="user-info">
                            <div class="user-badge">
                                <i data-lucide="user"></i>
                                <span>${currentUser.name || currentUser.username}</span>
                            </div>
                            <button class="btn-logout" onclick="logout()">
                                <i data-lucide="log-out"></i>
                                <span>خروج</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #f97316, #ea580c);">
                                <i data-lucide="package"></i>
                            </div>
                            <div class="stat-info">
                                <p>کل محصولات</p>
                                <p>${totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i data-lucide="trending-up"></i>
                            </div>
                            <div class="stat-info">
                                <p>محصولات جدید</p>
                                <p>${newProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                                <i data-lucide="dollar-sign"></i>
                            </div>
                            <div class="stat-info">
                                <p>میانگین قیمت</p>
                                <p>${averagePrice.toFixed(0)}M</p>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #a855f7, #9333ea);">
                                <i data-lucide="activity"></i>
                            </div>
                            <div class="stat-info">
                                <p>وضعیت</p>
                                <p>فعال</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="products-table-container">
                    <div class="products-table-header">
                        <h2>مدیریت محصولات</h2>
                        <p>${products.length} محصول موجود</p>
                    </div>
                    <div class="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>تصویر</th>
                                    <th>عنوان</th>
                                    <th>ظرفیت</th>
                                    <th>تلسکوپ</th>
                                    <th>نوع کف</th>
                                    <th>قیمت</th>
                                    <th>وضعیت</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(product => `
                                    <tr>
                                        <td>
                                            <img src="${product.image}" alt="${product.title}" class="product-table-image" 
                                                 onerror="this.src='https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop'">
                                        </td>
                                        <td>${product.title}</td>
                                        <td>${product.capacity}</td>
                                        <td>${product.telescopeType}</td>
                                        <td>${product.floorType}</td>
                                        <td style="color: #ea580c; font-weight: 700;">${product.price}</td>
                                        <td>
                                            <span class="product-status ${product.isNew ? 'status-new' : 'status-normal'}">
                                                ${product.isNew ? 'جدید' : 'عادی'}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn-edit" onclick="openEditModal(${product.id})">
                                                <i data-lucide="edit-3"></i>
                                                <span>ویرایش</span>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Refresh icons
    if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 100);
    }
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
    console.log(`📦 باز کردن مدال: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Refresh icons
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }
}

function closeModal(modalId) {
    console.log(`❌ بستن مدال: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear error messages
        const errorDiv = modal.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// ==================== CHATBOT FUNCTIONS ====================
let messages = [];
let isChatbotInitialized = false;

function initializeChatbot() {
    if (isChatbotInitialized) return;
    
    console.log('🤖 در حال راه‌اندازی چت بات...');
    
    // Add welcome message
    messages = [
        {
            id: 1,
            text: 'سلام! 👋 من دستیار هوشمند جرثقیل سازی اطلس اصفهان هستم.\n\nچطور می‌تونم کمکتون کنم؟',
            sender: 'bot',
            timestamp: new Date()
        }
    ];

    // Render initial messages
    renderChatMessages();

    // Chatbot button click
    const chatbotBtn = document.getElementById('chatbotBtn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', () => {
            console.log('💬 دکمه چت بات کلیک شد');
            document.getElementById('chatbotWindow').style.display = 'flex';
            chatbotBtn.style.display = 'none';
            
            // Refresh icons and scroll to bottom
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                scrollToBottom();
            }, 100);
        });
    }

    // Close chatbot
    const closeChatbotBtn = document.getElementById('closeChatbot');
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => {
            document.getElementById('chatbotWindow').style.display = 'none';
            document.getElementById('chatbotBtn').style.display = 'flex';
        });
    }

    // Send message
    const sendBtn = document.getElementById('sendMessage');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChatMessage);
    }

    // Enter key to send
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    isChatbotInitialized = true;
    console.log('✅ چت بات راه‌اندازی شد');
}

function ensureChatbotButton() {
    console.log('🔍 بررسی دکمه چت بات...');
    const chatbotBtn = document.getElementById('chatbotBtn');
    
    if (chatbotBtn) {
        // Ensure button is visible and positioned correctly
        chatbotBtn.style.display = 'flex';
        chatbotBtn.style.position = 'fixed';
        chatbotBtn.style.bottom = '24px';
        chatbotBtn.style.left = '24px';
        chatbotBtn.style.zIndex = '9999';
        chatbotBtn.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
        chatbotBtn.style.width = '64px';
        chatbotBtn.style.height = '64px';
        chatbotBtn.style.borderRadius = '50%';
        chatbotBtn.style.border = 'none';
        chatbotBtn.style.cursor = 'pointer';
        chatbotBtn.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.5)';
        chatbotBtn.style.alignItems = 'center';
        chatbotBtn.style.justifyContent = 'center';
        chatbotBtn.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        chatbotBtn.addEventListener('mouseenter', () => {
            chatbotBtn.style.transform = 'scale(1.1)';
            chatbotBtn.style.boxShadow = '0 15px 40px rgba(249, 115, 22, 0.6)';
        });
        
        chatbotBtn.addEventListener('mouseleave', () => {
            chatbotBtn.style.transform = 'scale(1)';
            chatbotBtn.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.5)';
        });
        
        console.log('✅ دکمه چت بات نمایش داده می‌شود');
    } else {
        console.error('❌ دکمه چت بات یافت نشد!');
        // Create button manually
        createChatbotButtonManually();
    }
}

function createChatbotButtonManually() {
    console.log('🛠️ ایجاد دستی دکمه چت بات...');
    
    const chatbotBtn = document.createElement('button');
    chatbotBtn.id = 'chatbotBtn';
    chatbotBtn.className = 'chatbot-btn';
    chatbotBtn.innerHTML = '<i data-lucide="message-circle"></i>';
    
    // Apply styles
    Object.assign(chatbotBtn.style, {
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #f97316, #ea580c)',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
        transition: 'all 0.3s ease'
    });
    
    // Add to body
    document.body.appendChild(chatbotBtn);
    
    // Add event listener
    chatbotBtn.addEventListener('click', () => {
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow) {
            chatbotWindow.style.display = 'flex';
            chatbotBtn.style.display = 'none';
        }
    });
    
    console.log('✅ دکمه چت بات دستی ایجاد شد');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log('💭 ارسال پیام کاربر:', message);
    
    // Add user message
    messages.push({
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date()
    });

    input.value = '';
    renderChatMessages();
    scrollToBottom();

    // Show typing indicator
    showTypingIndicator();

    // Get AI response after delay
    setTimeout(() => {
        hideTypingIndicator();
        
        const response = getAIResponse(message);
        messages.push({
            id: messages.length + 1,
            text: response,
            sender: 'bot',
            timestamp: new Date()
        });
        
        renderChatMessages();
        scrollToBottom();
    }, 1500);
}

function getAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    console.log('🤔 پردازش سوال کاربر:', userMessage);

    // Greetings
    if (message.includes('سلام') || message.includes('درود') || message.includes('صبح') || message.includes('عصر') || message.includes('علیک')) {
        return 'سلام و درود! 😊\nخوش آمدید به جرثقیل سازی اطلس اصفهان.\nچطور می‌تونم کمکتون کنم؟';
    }

    // Price questions
    if (message.includes('قیمت') || message.includes('هزینه') || message.includes('تومان') || message.includes('چقدر')) {
        return '💰 **لیست قیمت جرثقیل‌ها:**\n\n' +
               '🔸 **جرثقیل ۱۵ تن سه تلسکوپ با کف:** ۲,۵۰۰ میلیون تومان\n' +
               '🔸 **جرثقیل ۱۵ تن دو تلسکوپ با کف:** ۲,۲۵۰ میلیون تومان\n' +
               '🔸 **جرثقیل ۱۵ تن سه تلسکوپ بدون کف:** ۲,۲۵۰ میلیون تومان\n' +
               '🔸 **جرثقیل ۱۵ تن دو تلسکوپ بدون کف:** ۲,۰۰۰ میلیون تومان\n\n' +
               '📞 برای مشاوره و قیمت دقیق با ما تماس بگیرید: **۰۹۱۳۴۲۰۲۰۷۶**';
    }

    // Capacity questions
    if (message.includes('ظرفیت') || message.includes('تن') || message.includes('وزن') || message.includes('چند تن')) {
        return '⚖️ **ظرفیت جرثقیل‌ها:**\n\n' +
               'در حال حاضر مدل‌های **۱۵ تنی** تولید می‌کنیم.\n' +
               '✅ مناسب برای کارهای ساختمانی\n' +
               '✅ مناسب برای پروژه‌های صنعتی\n' +
               '✅ کیفیت بالا و ایمنی کامل\n\n' +
               'اگر نیاز به ظرفیت خاصی دارید، سفارشی‌سازی می‌کنیم!';
    }

    // Telescope questions
    if (message.includes('تلسکوپ') || message.includes('بازو') || message.includes('بازوی')) {
        return '🔭 **انواع تلسکوپ:**\n\n' +
               '**دو تلسکوپ:**\n' +
               '• مناسب فضاهای محدود\n' +
               '• وزن کمتر\n' +
               '• قیمت مناسب‌تر\n\n' +
               '**سه تلسکوپ:**\n' +
               '• برد بیشتر\n' +
               '• انعطاف‌پذیری بالاتر\n' +
               '• قدرت مانور بهتر\n\n' +
               'انتخاب نوع بستگی به نیاز کاری شما داره.';
    }

    // Floor type questions
    if (message.includes('کف') || message.includes('دوبل') || message.includes('بدون کف')) {
        return '🛠️ **انواع کف:**\n\n' +
               '**با کف و دوبل:**\n' +
               '• امنیت و پایداری بیشتر\n' +
               '• عمر مفید بالاتر\n' +
               '• تحمل وزن بهتر\n\n' +
               '**بدون کف و دوبل:**\n' +
               '• سبک‌تر\n' +
               '• قیمت اقتصادی‌تر\n' +
               '• مناسب کارهای سبک‌تر\n\n' +
               'هر دو مدل کیفیت عالی دارن!';
    }

    // Contact questions
    if (message.includes('تماس') || message.includes('شماره') || message.includes('موبایل') || message.includes('تلفن')) {
        return '📞 **راه‌های ارتباط با ما:**\n\n' +
               '**تلفن:** ۰۹۱۳۴۲۰۲۰۷۶\n' +
               '**اینستاگرام:** @alikarimi_1013\n' +
               '**مدیریت:** علیرضا کریمی\n\n' +
               '⏰ **ساعات کاری:** هر روز ۸ صبح تا ۸ شب\n' +
               'منتظر تماس شما هستیم! 📱';
    }

    // Address questions
    if (message.includes('آدرس') || message.includes('نشانی') || message.includes('مکان') || message.includes('کجا')) {
        return '📍 **آدرس ما:**\n\n' +
               'اصفهان، شهرک صنعتی امیرکبیر\n' +
               '(شاهپور جدید)، خیابان امام رضا\n' +
               'دفتر جرثقیل اصفهان اطلس\n\n' +
               '🗺️ برای مسیریابی از گوگل مپ استفاده کنید.\n' +
               'خوشحال می‌شیم از حضورتون استقبال کنیم! 🏢';
    }

    // Warranty questions
    if (message.includes('گارانتی') || message.includes('ضمانت') || message.includes('خدمات') || message.includes('پشتیبانی')) {
        return '🛡️ **خدمات و گارانتی:**\n\n' +
               '✅ **گارانتی کیفیت ساخت** (۲ سال)\n' +
               '✅ **خدمات پس از فروش** کامل\n' +
               '✅ **پشتیبانی ۲۴/۷** تلفنی\n' +
               '✅ **مشاوره رایگان** قبل از خرید\n' +
               '✅ **نصب و راه‌اندازی** رایگان\n\n' +
               'رضایت شما اولویت ماست! ✨';
    }

    // Quality questions
    if (message.includes('کیفیت') || message.includes('مرغوب') || message.includes('استاندارد') || message.includes('جنس')) {
        return '⭐ **کیفیت ساخت:**\n\n' +
               '• **مواد اولیه:** درجه یک\n' +
               '• **تکنولوژی:** روز دنیا\n' +
               '• **کنترل کیفیت:** دقیق\n' +
               '• **استانداردها:** ایمنی کامل\n' \\
               '• **تست‌های فنی:** قبل از تحویل\n\n' +
               '**بیش از ۱۰ سال تجربه** در خدمت شما!';
    }

    // Delivery questions
    if (message.includes('تحویل') || message.includes('ارسال') || message.includes('زمان') || message.includes('چند روز')) {
        return '🚚 **زمان تحویل:**\n\n' +
               '• **مدل‌های آماده:** ۳-۵ روز کاری\n' +
               '• **سفارشی‌سازی:** ۲-۴ هفته\n' +
               '• **نصب و آموزش:** رایگان\n\n' +
               '📞 برای اطلاعات دقیق‌تر تماس بگیرید: **۰۹۱۳۴۲۰۲۰۷۶**';
    }

    // Thanks
    if (message.includes('ممنون') || message.includes('متشکر') || message.includes('سپاس') || message.includes('مرسی')) {
        return 'خواهش می‌کنم! 😊\n' +
               'همیشه در خدمت شما هستیم.\n' +
               'اگر سوال دیگه‌ای دارید، بپرسید!';
    }

    // Goodbye
    if (message.includes('خداحافظ') || message.includes('بای') || message.includes('فعلا') || message.includes('خدانگهدار')) {
        return 'خداحافظ! 👋\n' +
               'امیدواریم به زودی همکاری کنیم.\n' +
               'موفق و پیروز باشید! 🙏';
    }

    // Default response
    return '🤔 سوال خوبیه!\n' +
           'برای اطلاعات دقیق‌تر بهتره با تیم ما تماس بگیرید:\n\n' +
           '📞 **۰۹۱۳۴۲۰۲۰۷۶**\n' +
           '📱 **@alikarimi_1013**\n\n' +
           'یا می‌تونید درباره:\n' +
           '• قیمت‌ها 💰\n' +
           '• ظرفیت‌ها ⚖️\n' +
           '• گارانتی 🛡️\n' +
           '• آدرس 📍\n' +
           'بپرسید!';
}

function renderChatMessages() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender}">
            <div class="message-avatar ${msg.sender === 'bot' ? 'avatar-bot' : 'avatar-user'}">
                <i data-lucide="${msg.sender === 'bot' ? 'bot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    ${msg.text.replace(/\n/g, '<br>')}
                </div>
                <div class="message-time">
                    ${msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    `).join('');

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message bot';
    indicator.innerHTML = `
        <div class="message-avatar avatar-bot">
            <i data-lucide="bot"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(indicator);
    
    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'info') {
    console.log(`📢 Toast: ${message}`);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? '#10b981' : 
                   type === 'error' ? '#ef4444' : 
                   type === 'warning' ? '#f59e0b' : '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        animation: 'toastSlideIn 0.3s ease'
    });
    
    // Add to body
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add CSS for toast animation
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .shake {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(toastStyles);

// ==================== EXPOSE FUNCTIONS TO GLOBAL SCOPE ====================
// برای دسترسی از inline onclick
window.openEditModal = openEditModal;
window.hideDashboard = hideDashboard;
window.logout = logout;
