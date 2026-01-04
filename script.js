// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeApp();
});

// Products Data - قیمت‌ها به میلیارد تومان تغییر کرد
let products = [
    {
        id: 1,
        title: 'جرثقیل ۱۵ تن - سه تلسکوپ',
        image: './P1.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'سه تلسکوپ',
        floorType: 'با کف و دوبل',
        price: '۲.۵ میلیارد تومان',
        isNew: true
    },
    {
        id: 2,
        title: 'جرثقیل ۱۵ تن - دو تلسکوپ',
        image: './P2.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'دو تلسکوپ',
        floorType: 'با کف و دوبل',
        price: '۲.۲۵ میلیارد تومان',
        isNew: true
    },
    {
        id: 3,
        title: 'جرثقیل ۱۵ تن - سه تلسکوپ',
        image: './P3.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'سه تلسکوپ',
        floorType: 'بدون کف و دوبل',
        price: '۲.۲۵ میلیارد تومان',
        isNew: true
    },
    {
        id: 4,
        title: 'جرثقیل ۱۵ تن - دو تلسکوپ',
        image: './P4.jpg',
        capacity: 'ظرفیت: ۱۵ تن',
        telescopeType: 'دو تلسکوپ',
        floorType: 'بدون کف و دوبل',
        price: '۲ میلیارد تومان',
        isNew: true
    }
];

// Auth State
const VALID_USERS = [
    { username: 'parsa', password: '12345678' },
    { username: 'arman', password: '12345678' }
];

let currentUser = null;
let editingProductId = null;
let clickCount = 0;
let clickTimer = null;

// Initialize App
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    // Load saved products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    // Render products
    renderProducts();

    // Setup event listeners
    setupEventListeners();

    // Initialize chatbot
    initializeChatbot();

    // Reinitialize Lucide icons
    lucide.createIcons();
}

// Setup Event Listeners
function setupEventListeners() {
    // Triple click logo to login
    document.getElementById('logoSection').addEventListener('click', handleLogoClick);

    // Dashboard button
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', showDashboard);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Edit form
    document.getElementById('editForm').addEventListener('submit', handleEditProduct);

    // Close modals
    document.getElementById('closeLoginModal').addEventListener('click', () => {
        closeModal('loginModal');
    });

    document.getElementById('closeEditModal').addEventListener('click', () => {
        closeModal('editModal');
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        closeModal('editModal');
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Handle Logo Click (Triple Click to Login)
function handleLogoClick() {
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
            openModal('loginModal');
        }
    }
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    // Reinitialize Lucide icons
    lucide.createIcons();
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.title}" class="product-image"
                 onerror="this.onerror=null; this.src='./images/product${product.id}.jpg'">
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

    // Add event listener for toggle price button
    const toggleBtn = card.querySelector('.btn-toggle-price');
    toggleBtn.addEventListener('click', () => {
        togglePrice(product.id);
    });

    // Add event listener for edit button if user is logged in
    if (currentUser) {
        const editBtn = card.querySelector('.btn-edit-price');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openEditModal(product.id);
            });
        }
    }

    return card;
}

// Toggle Price Display
function togglePrice(productId) {
    const priceDisplay = document.getElementById(`price-${productId}`);
    const toggleBtn = document.querySelector(`[data-product-id="${productId}"].btn-toggle-price`);
    
    if (priceDisplay.classList.contains('show')) {
        priceDisplay.classList.remove('show');
        toggleBtn.classList.remove('active');
    } else {
        priceDisplay.classList.add('show');
        toggleBtn.classList.add('active');
    }

    // Reinitialize Lucide icons
    lucide.createIcons();
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    const validUser = VALID_USERS.find(
        user => user.username === username && user.password === password
    );

    if (validUser) {
        currentUser = { username: validUser.username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        errorDiv.style.display = 'none';
        closeModal('loginModal');
        updateAuthUI();
        renderProducts();
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        errorDiv.textContent = 'نام کاربری یا رمز عبور اشتباه است';
        errorDiv.style.display = 'block';
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    renderProducts();
    hideDashboard();
}

// Update Auth UI
function updateAuthUI() {
    const userInfo = document.getElementById('userInfo');
    const usernameSpan = document.getElementById('username');

    if (currentUser) {
        userInfo.style.display = 'flex';
        usernameSpan.textContent = currentUser.username;
    } else {
        userInfo.style.display = 'none';
    }

    // Reinitialize Lucide icons
    lucide.createIcons();
}

// Open Edit Modal
function openEditModal(productId) {
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

    // Reinitialize Lucide icons
    lucide.createIcons();
}

// Handle Edit Product
function handleEditProduct(e) {
    e.preventDefault();
    
    const title = document.getElementById('editTitle').value;
    const capacity = document.getElementById('editCapacity').value;
    const telescopeType = document.getElementById('editTelescope').value;
    const floorType = document.getElementById('editFloor').value;
    let price = document.getElementById('editPrice').value;
    
    // اضافه کردن "میلیارد تومان" به قیمت اگر نداشته باشد
    if (!price.includes('میلیارد') && !price.includes('تومان')) {
        price = price + ' میلیارد تومان';
    }
    
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
            
            // Close modal and re-render
            closeModal('editModal');
            renderProducts();
            renderDashboard();
            
            // Reset form
            document.getElementById('editForm').reset();
            editingProductId = null;
        }
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderDashboard();
}

// Hide Dashboard
function hideDashboard() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Render Dashboard
function renderDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    
    // Calculate stats
    const totalProducts = products.length;
    const newProducts = products.filter(p => p.isNew).length;
    const averagePrice = products.reduce((acc, p) => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''));
        return acc + (isNaN(price) ? 0 : price);
    }, 0) / totalProducts;

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
                                <span>${currentUser.username}</span>
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
                                <p>${averagePrice.toFixed(2)} میلیارد</p>
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
                                                 onerror="this.onerror=null; this.src='./images/product${product.id}.jpg'">
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

    lucide.createIcons();
}

// Open Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reinitialize Lucide icons
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear error messages
    const errorDiv = modal.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            closeModal(modal.id);
        });
        
        // Close chatbot if open
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow.style.display === 'flex') {
            chatbotWindow.style.display = 'none';
            document.getElementById('chatbotBtn').style.display = 'flex';
        }
    }
});

// ===== CHATBOT FUNCTIONALITY =====

let messages = [];
let isWaitingForPassword = false;
let tempUsername = '';

function initializeChatbot() {
    // Add welcome message
    messages = [
        {
            id: 1,
            text: 'سلام! من دستیار هوشمند جرثقیل سازی اطلس اصفهان هستم. چطور می‌تونم کمکتون کنم؟',
            sender: 'bot',
            timestamp: new Date()
        }
    ];

    renderChatMessages();

    // Chatbot button
    document.getElementById('chatbotBtn').addEventListener('click', () => {
        document.getElementById('chatbotWindow').style.display = 'flex';
        document.getElementById('chatbotBtn').style.display = 'none';
        lucide.createIcons();
    });

    // Close chatbot
    document.getElementById('closeChatbot').addEventListener('click', () => {
        document.getElementById('chatbotWindow').style.display = 'none';
        document.getElementById('chatbotBtn').style.display = 'flex';
        // Reset authentication state when closing chat
        isWaitingForPassword = false;
        tempUsername = '';
    });

    // Send message
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

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

    // Handle authentication flow
    if (isWaitingForPassword) {
        setTimeout(() => {
            hideTypingIndicator();
            handlePasswordInput(message);
        }, 1000);
    } else {
        // Check if user is trying to login as admin
        const adminUsernames = ['arman', 'parsa'];
        if (adminUsernames.includes(message.toLowerCase())) {
            setTimeout(() => {
                hideTypingIndicator();
                handleAdminLoginAttempt(message.toLowerCase());
            }, 1000);
        } else {
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
            }, 1000);
        }
    }
}

function handleAdminLoginAttempt(username) {
    tempUsername = username;
    isWaitingForPassword = true;
    
    messages.push({
        id: messages.length + 1,
        text: `سلام مدیر ${username}، لطفاً رمز عبور خود را وارد کنید:`,
        sender: 'bot',
        timestamp: new Date()
    });
    
    renderChatMessages();
    scrollToBottom();
}

function handlePasswordInput(password) {
    // Check if password matches (رمز: 12345678)
    if (password === '12345678') {
        // Successful login
        messages.push({
            id: messages.length + 1,
            text: `خوش آمدید مدیر ${tempUsername}! حالا می‌توانید قیمت‌ها را تغییر دهید.`,
            sender: 'bot',
            timestamp: new Date()
        });
        
        // Add a message with edit instructions
        messages.push({
            id: messages.length + 1,
            text: 'برای تغییر قیمت محصولات:\n1. به پنل مدیریت مراجعه کنید\n2. روی آیکون "ویرایش" در کنار هر محصول کلیک کنید\n3. قیمت جدید را وارد کنید (بر حسب میلیارد تومان)\n4. روی دکمه "ذخیره" کلیک کنید\n\nتغییرات برای همه کاربران سایت اعمال خواهد شد.',
            sender: 'bot',
            timestamp: new Date()
        });
        
        // Log the user in via chat
        currentUser = { username: tempUsername };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        renderProducts();
        
    } else {
        // Wrong password
        messages.push({
            id: messages.length + 1,
            text: 'رمز عبور اشتباه است. لطفاً دوباره امتحان کنید.',
            sender: 'bot',
            timestamp: new Date()
        });
    }
    
    // Reset authentication state
    isWaitingForPassword = false;
    tempUsername = '';
    
    renderChatMessages();
    scrollToBottom();
}

function getAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Check for admin login attempts in normal conversation
    const adminUsernames = ['arman', 'parsa'];
    if (adminUsernames.includes(message)) {
        return `سلام مدیر ${message}، برای ورود لطفاً نام کاربری خود را در چت وارد کنید.`;
    }

    // Greetings
    if (message.includes('سلام') || message.includes('درود') || message.includes('صبح') || message.includes('عصر')) {
        return 'سلام و درود! خوش اومدید به جرثقیل سازی اطلس اصفهان. چطور می‌تونم کمکتون کنم؟';
    }

    // Price questions - به میلیارد تومان تغییر کرد
    if (message.includes('قیمت') || message.includes('هزینه') || message.includes('تومان') || message.includes('میلیارد')) {
        return 'قیمت جرثقیل‌های ما بسته به مدل و مشخصات متفاوته (به میلیارد تومان):\n\n🔸 جرثقیل ۱۵ تن سه تلسکوپ با کف: ۲.۵ میلیارد تومان\n🔸 جرثقیل ۱۵ تن دو تلسکوپ با کف: ۲.۲۵ میلیارد تومان\n🔸 جرثقیل ۱۵ تن سه تلسکوپ بدون کف: ۲.۲۵ میلیارد تومان\n🔸 جرثقیل ۱۵ تن دو تلسکوپ بدون کف: ۲ میلیارد تومان\n\nبرای مشاوره و قیمت دقیق با ما تماس بگیرید!';
    }

    // Capacity questions
    if (message.includes('ظرفیت') || message.includes('تن') || message.includes('وزن')) {
        return 'جرثقیل‌های ما با ظرفیت ۱۵ تن تولید می‌شن که برای اکثر کارهای صنعتی و ساختمانی مناسبه. اگر نیاز به ظرفیت بیشتر یا کمتر دارید، می‌تونیم سفارشی‌سازی کنیم!';
    }

    // Telescope questions
    if (message.includes('تلسکوپ') || message.includes('بازو')) {
        return 'ما دو نوع جرثقیل تولید می‌کنیم:\n\n🔹 دو تلسکوپ: مناسب برای فضاهای محدودتر\n🔹 سه تلسکوپ: برد بیشتر و انعطاف‌پذیری بالاتر\n\nانتخاب نوع تلسکوپ بستگی به نیاز کاری شما داره.';
    }

    // Floor type questions
    if (message.includes('کف') || message.includes('دوبل')) {
        return 'جرثقیل‌های ما در دو حالت ارائه می‌شن:\n\n✅ با کف و دوبل: امنیت و پایداری بیشتر\n✅ بدون کف و دوبل: سبک‌تر و اقتصادی‌تر\n\nهر دو مدل کیفیت عالی دارن!';
    }

    // Contact questions
    if (message.includes('تماس') || message.includes('شماره') || message.includes('موبایل') || message.includes('تلفن')) {
        return 'برای تماس با ما:\n\n📞 تلفن: ۰۹۱۳۴۲۰۲۰۷۶\n📧 اینستاگرام: @alikarimi_1013\n👤 مدیریت: علیرضا کریمی\n\nمنتظر تماس شما هستیم!';
    }

    // Address questions
    if (message.includes('آدرس') || message.includes('نشانی') || message.includes('مکان') || message.includes('کجا')) {
        return 'آدرس ما:\n\n📍 اصفهان، شهرک صنعتی امیرکبیر (شاهپور جدید)، خیابان امام رضا\n🏢 دفتر جرثقیل اصفهان اطلس\n\nخوشحال می‌شیم از حضورتون استقبال کنیم!';
    }

    // Warranty questions
    if (message.includes('گارانتی') || message.includes('ضمانت') || message.includes('خدمات')) {
        return 'ما پشتیبانی و خدمات کامل ارائه می‌دیم:\n\n✨ گارانتی کیفیت ساخت\n✨ خدمات پس از فروش\n✨ پشتیبانی ۲۴/۷\n✨ مشاوره رایگان\n\nرضایت شما برای ما مهمه!';
    }

    // Quality questions
    if (message.includes('کیفیت') || message.includes('مرغوب') || message.includes('استاندارد')) {
        return 'جرثقیل‌های ما با بالاترین کیفیت و استانداردهای روز دنیا تولید می‌شن:\n\n⭐ مواد اولیه درجه یک\n⭐ تکنولوژی روز\n⭐ کنترل کیفیت دقیق\n⭐ مطابق با استانداردهای ایمنی\n\nبیش از یک دهه تجربه در خدمت شما!';
    }

    // Delivery questions
    if (message.includes('تحویل') || message.includes('ارسال') || message.includes('زمان')) {
        return 'زمان تحویل بسته به مدل و سفارش متفاوته. معمولا بین ۲ تا ۴ هفته طول می‌کشه. برای اطلاعات دقیق‌تر لطفا با ما تماس بگیرید: ۰۹۱۳۴۲۰۲۰۷۶';
    }

    // Admin features mention
    if (message.includes('تغییر') || message.includes('ویرایش') || message.includes('مدیریت') || message.includes('ورود')) {
        return 'برای تغییر قیمت‌ها باید وارد حساب مدیر شوید. اگر مدیر هستید، نام کاربری خود (arman یا parsa) را وارد کنید.';
    }

    // Thanks
    if (message.includes('ممنون') || message.includes('متشکر') || message.includes('سپاس')) {
        return 'خواهش می‌کنم! همیشه در خدمت شما هستیم. اگر سوال دیگه‌ای دارید، بپرسید! 😊';
    }

    // Goodbye
    if (message.includes('خداحافظ') || message.includes('بای') || message.includes('فعلا')) {
        return 'خداحافظ! امیدواریم به زودی همکاری کنیم. موفق باشید! 🙏';
    }

    // Default response
    return 'سوال جالبیه! بهتره برای اطلاعات دقیق‌تر با تیم ما تماس بگیرید:\n\n📞 ۰۹۱۳۴۲۰۲۰۷۶\n📧 @alikarimi_1013\n\nچیز دیگه‌ای می‌تونم کمکتون کنم؟';
}

function renderChatMessages() {
    const messagesContainer = document.getElementById('chatbotMessages');
    
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

    lucide.createIcons();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
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
    lucide.createIcons();
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
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}