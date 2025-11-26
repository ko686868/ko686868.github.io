// スムーススクロール
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    if (anchors.length === 0) return;
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // フォーカス管理
                if (target.hasAttribute('tabindex')) {
                    target.focus();
                } else {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            }
        });
    });
}

// お問い合わせフォームの処理
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    // 要素が存在しない場合は処理を終了
    if (!contactForm || !formMessage) {
        console.warn('フォーム要素が見つかりません');
        return;
    }
    
    // エラーメッセージをクリアする関数
    function clearErrors() {
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (messageError) messageError.textContent = '';
        
        // 入力フィールドからエラー状態を削除
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'false');
        });
    }
    
    // 個別フィールドのバリデーション
    function validateField(input, errorElement, errorMessage) {
        if (!input.value.trim()) {
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
            input.setAttribute('aria-invalid', 'true');
            return false;
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.setAttribute('aria-invalid', 'false');
        return true;
    }
    
    // メールアドレスのバリデーション
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // リアルタイムバリデーション
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, nameError, '名前を入力してください。');
        });
        
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim()) {
                validateField(nameInput, nameError, '');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const emailValue = emailInput.value.trim();
            if (!emailValue) {
                validateField(emailInput, emailError, 'メールアドレスを入力してください。');
            } else if (!validateEmail(emailValue)) {
                if (emailError) {
                    emailError.textContent = '正しいメールアドレスを入力してください。';
                }
                emailInput.setAttribute('aria-invalid', 'true');
            } else {
                validateField(emailInput, emailError, '');
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) {
                validateField(emailInput, emailError, '');
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            validateField(messageInput, messageError, 'メッセージを入力してください。');
        });
        
        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim()) {
                validateField(messageInput, messageError, '');
            }
        });
    }
    
    // フォーム送信処理
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // エラーメッセージをクリア
        clearErrors();
        
        // フォームデータの取得
        const formData = {
            name: nameInput ? nameInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : '',
            message: messageInput ? messageInput.value.trim() : ''
        };
        
        let isValid = true;
        
        // バリデーション
        if (!validateField(nameInput, nameError, '名前を入力してください。')) {
            isValid = false;
        }
        
        if (!formData.email) {
            if (!validateField(emailInput, emailError, 'メールアドレスを入力してください。')) {
                isValid = false;
            }
        } else if (!validateEmail(formData.email)) {
            if (emailError) {
                emailError.textContent = '正しいメールアドレスを入力してください。';
            }
            if (emailInput) {
                emailInput.setAttribute('aria-invalid', 'true');
            }
            isValid = false;
        }
        
        if (!validateField(messageInput, messageError, 'メッセージを入力してください。')) {
            isValid = false;
        }
        
        if (!isValid) {
            // 最初のエラーフィールドにフォーカス
            const firstError = contactForm.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
            showMessage('入力内容をご確認ください。', 'error', formMessage);
            return;
        }
        
        // 送信処理（実際の実装ではサーバーに送信）
        // ここでは送信成功のシミュレーション
        showMessage('お問い合わせありがとうございます。送信が完了しました。', 'success', formMessage);
        
        // フォームをリセット
        contactForm.reset();
        clearErrors();
        
        // フォーカスを最初のフィールドに戻す
        if (nameInput) {
            nameInput.focus();
        }
    });
}

function showMessage(message, type, messageElement) {
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';
    messageElement.setAttribute('role', 'alert');
    
    // メッセージが表示されたらスクロール
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// スクロール時のヘッダーアニメーション（オプション）
function initHeaderAnimation() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    let ticking = false;
    let lastScroll = 0;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset || window.pageYOffset || 0;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // 初期状態を設定
    updateHeader();
}

// プロジェクトカードのスライドアニメーション
let sliderInterval = null;

function initProjectSlider() {
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length === 0) return;
    
    // 既存のインターバルをクリア
    if (sliderInterval) {
        clearInterval(sliderInterval);
        sliderInterval = null;
    }
    
    let currentIndex = 0;
    
    // すべてのカードを初期位置（右側）に設定
    projectCards.forEach((card, index) => {
        if (index === 0) {
            // 最初のカードだけアクティブにする
            card.classList.add('active');
        } else {
            // 他のカードは右側に配置
            card.style.transform = 'translateX(150%)';
            card.style.opacity = '0';
        }
    });
    
    // 3秒間隔でカードを切り替え
    sliderInterval = setInterval(() => {
        // 現在のカードを左にスライドアウト
        const currentCard = projectCards[currentIndex];
        if (currentCard) {
            currentCard.classList.remove('active');
            currentCard.classList.add('prev');
        }
        
        // 次のカードのインデックスを計算
        currentIndex = (currentIndex + 1) % projectCards.length;
        
        // 次のカードを右側から準備
        const nextCard = projectCards[currentIndex];
        if (nextCard) {
            nextCard.classList.remove('prev');
            nextCard.style.transform = 'translateX(150%)';
            nextCard.style.opacity = '0';
            
            // 少し遅延させてから右からスライドイン
            setTimeout(() => {
                nextCard.classList.add('active');
            }, 50);
        }
    }, 3000);
    
    // ページが非表示になったときにインターバルをクリア
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (sliderInterval) {
                clearInterval(sliderInterval);
                sliderInterval = null;
            }
        } else {
            if (!sliderInterval) {
                initProjectSlider();
            }
        }
    });
}

// ページ読み込み時のアニメーション（オプション）
function initScrollAnimation() {
    const sections = document.querySelectorAll('.section');
    
    if (sections.length === 0) return;
    
    // IntersectionObserverがサポートされているか確認
    if (typeof IntersectionObserver === 'undefined') {
        // サポートされていない場合は全て表示
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // 一度表示されたら監視を停止
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // 最初のセクションはすぐに表示
    if (sections[0]) {
        sections[0].style.opacity = '1';
        sections[0].style.transform = 'translateY(0)';
        observer.unobserve(sections[0]);
    }
}

// DOMContentLoaded時に初期化
function init() {
    try {
        initSmoothScroll();
        initContactForm();
        initHeaderAnimation();
        // initProjectSlider(); // プロジェクトスライダーアニメーションは無効化
        initScrollAnimation();
    } catch (error) {
        console.error('初期化エラー:', error);
    }
}

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOMContentLoadedがすでに発火済みの場合
    init();
}

// ページアンロード時にクリーンアップ
window.addEventListener('beforeunload', () => {
    // スライダーアニメーションは無効化のため、クリーンアップ不要
});

