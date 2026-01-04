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
    // Check if password matches
    const validUser = VALID_USERS.find(user => 
        user.username === tempUsername && user.password === password
    );
    
    if (validUser) {
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
            text: 'برای تغییر قیمت محصولات:\n1. روی آیکون "ویرایش" در کنار هر محصول کلیک کنید\n2. قیمت جدید را وارد کنید\n3. روی دکمه "ذخیره" کلیک کنید\n\nتغییرات برای همه کاربران سایت اعمال خواهد شد.',
            sender: 'bot',
            timestamp: new Date()
        });
        
        // Log the user in via chat (optional - you can also sync with main auth)
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

    // Price questions
    if (message.includes('قیمت') || message.includes('هزینه') || message.includes('تومان')) {
        return 'قیمت جرثقیل‌های ما بسته به مدل و مشخصات متفاوته:\n\n🔸 جرثقیل ۱۵ تن سه تلسکوپ با کف: ۲,۵۰۰ میلیون تومان\n🔸 جرثقیل ۱۵ تن دو تلسکوپ با کف: ۲,۲۵۰ میلیون تومان\n🔸 جرثقیل ۱۵ تن سه تلسکوپ بدون کف: ۲,۲۵۰ میلیون تومان\n🔸 جرثقیل ۱۵ تن دو تلسکوپ بدون کف: ۲,۰۰۰ میلیون تومان\n\nبرای مشاوره و قیمت دقیق با ما تماس بگیرید!';
    }

    // Admin features mention
    if (message.includes('تغییر') || message.includes('ویرایش') || message.includes('مدیریت')) {
        return 'برای تغییر قیمت‌ها باید وارد حساب مدیر شوید. اگر مدیر هستید، نام کاربری خود (arman یا parsa) را وارد کنید.';
    }

    // ... (بقیه پاسخ‌های هوش مصنوعی بدون تغییر باقی می‌مانند)
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

// ... (بقیه توابع بدون تغییر باقی می‌مانند)
