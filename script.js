const emailSection = document.getElementById('email-section');
const passwordSection = document.getElementById('password-section');
const billingSection = document.getElementById('billing-section');
const nextBtn = document.getElementById('next-btn');
const loginBtn = document.getElementById('login-btn');
const submitBillingBtn = document.getElementById('submit-billing-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const alertBox = document.getElementById('alert-message');
const userEmailDisplay = document.getElementById('user-email-display');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');

let timerInterval;

// 「次へ」ボタンの処理
nextBtn.addEventListener('click', () => {
    // エラー表示をリセット
    emailInput.classList.remove('email-error-input');
    document.querySelector('label[for="email"]').classList.remove('email-error-placeholder');

    if (emailInput.value.trim() !== '') {
        // 入力されたメールアドレスを表示
        userEmailDisplay.textContent = emailInput.value;
        
        // 画面を切り替え
        emailSection.style.display = 'none';
        passwordSection.style.display = 'block';
        passwordInput.focus(); // パスワード欄にフォーカス
    } else {
        // メールが空の場合のエラー表示
        emailInput.focus();
        emailInput.classList.add('email-error-input');
        document.querySelector('label[for="email"]').classList.add('email-error-placeholder');
    }
});

// 「ログイン」ボタンの処理
loginBtn.addEventListener('click', () => {
    if (passwordInput.value.trim() !== '') {
        // 警告音を再生
        playWarningSound();
        
        // 請求ページを表示
        passwordSection.style.display = 'none';
        billingSection.style.display = 'block';
        startTimer(2 * 60); // 2分間のタイマーを開始
    } else {
        // パスワードが空の場合の処理（ここでは何もせず、単に次に進まない）
        passwordInput.focus();
    }
});

// 「パスワードをお忘れの場合」ボタンの処理
forgotPasswordBtn.addEventListener('click', () => {
    alertBox.innerHTML = '<h3><strong>フィッシングの警告</strong></h3>' +
                         '<p>このリンクは、本来はパスワード再設定のページに移動しますが、この模擬サイトでは機能しません。</p>' +
                         '<p><strong>このサイトは学習用の模擬サイトであり、情報はどこにも送信されていませんのでご安心ください。</strong></p>' +
                         '<p>URLが「google.com」ではない、デザインが少しおかしいなど、怪しい点がないか常に確認する習慣をつけましょう。</p>';
    alertBox.style.display = 'block';
    passwordSection.style.display = 'none';
    if (timerInterval) clearInterval(timerInterval); // タイマーがあれば停止
    billingSection.style.display = 'none'; // 請求ページも隠す
});

// 「確認して続行」ボタンの処理 (請求ページ)
submitBillingBtn.addEventListener('click', () => {
    // 請求情報入力フィールドのバリデーション（簡易的なもの）
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvc = document.getElementById('cvc').value.trim();
    const cardHolderName = document.getElementById('card-holder-name').value.trim();

    if (cardNumber && expiryDate && cvc && cardHolderName) {
        // すべてのフィールドが入力されていれば警告表示
        playWarningSound();
        clearInterval(timerInterval); // タイマーを停止
        alertBox.innerHTML = '<h3><strong>フィッシングの警告</strong></h3>' +
                             '<p>もしこれが本物のフィッシングサイトなら、あなたの**クレジットカード情報**は、今まさに盗まれていました。</p>' +
                             '<p><strong>このサイトは学習用の模擬サイトであり、情報はどこにも送信されていませんのでご安心ください。</strong></p>' +
                             '<p>Googleや他の正規のサービスが、緊急に電話番号やクレジットカード情報を要求することはほとんどありません。不審な要求には常に注意しましょう。</p>';
        alertBox.style.display = 'block';
        billingSection.style.display = 'none';
    } else {
        // 未入力の場合のエラー表示 (簡易的)
        alert("すべての請求情報を入力してください。");
        // 実際には各フィールドにエラー表示を出すのがよりリアルです
    }
});

// 警告音を再生する関数
function playWarningSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.5);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

// 入力フィールドが空でない場合にプレースホルダーを上に移動させる処理
document.querySelectorAll('.input-field').forEach(input => {
    // ページ読み込み時に値がある場合（オートフィルなど）に対応
    if (input.value.trim() !== '') {
        input.classList.add('not-empty');
    }

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.add('not-empty');
        } else {
            input.classList.remove('not-empty');
        }
    });
});

// タイマー関数
function startTimer(duration) {
    let timer = duration;
    const display = document.getElementById('timer');
    const subheaderTimerDisplay = document.getElementById('subheader-timer'); // 新しいID

    timerInterval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        subheaderTimerDisplay.textContent = minutes + ":" + seconds; // サブヘッダー内のタイマーも更新

        if (--timer < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00";
            subheaderTimerDisplay.textContent = "00:00";
            // タイマーが終了した際の処理
            alertBox.innerHTML = '<h3><strong>時間切れの警告</strong></h3>' +
                                 '<p>制限時間が過ぎたため、この操作は完了できませんでした。</p>' +
                                 '<p><strong>このサイトは学習用の模擬サイトであり、情報はどこにも送信されていませんのでご安心ください。</strong></p>' +
                                 '<p>フィッシング詐欺では、心理的圧力をかけるためにタイマーがよく使われます。焦らず、常にURLや情報の信頼性を確認しましょう。</p>';
            alertBox.style.display = 'block';
            billingSection.style.display = 'none'; // 請求ページを隠す
        }
    }, 1000);
}
