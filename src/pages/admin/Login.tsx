
import { useRef, useState } from 'react';
import { API_BASE_URL, RECAPTCHA_SITE_KEY } from '../../config';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [error, setError] = useState('');
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // 2FA States
    const [show2FA, setShow2FA] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [verifyCode, setVerifyCode] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            setError("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, captchaToken })
            });
            const result = await response.json();

            if (result.success) {
                if (result.require2FA) {
                    // 1. Aşama Başarılı -> 2FA Ekranına Geç
                    setShow2FA(true);
                    setUserId(result.userId);
                    setError(result.message || "Lütfen mailinize gelen kodu girin.");
                    setCaptchaToken(null); // Captcha'yı sıfırla (tekrar gerekmesin)
                } else {
                    // 2FA Kapalıysa veya token direkt geldiyse (Eskisi)
                    completeLogin(result.user);
                }
            } else {
                setError(result.message);
                recaptchaRef.current?.reset();
                setCaptchaToken(null);
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı.');
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code: verifyCode })
            });
            const result = await response.json();

            if (result.success) {
                completeLogin(result.user);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Doğrulama hatası.');
        }
    };

    const completeLogin = (user: any) => {
        localStorage.setItem('adminUser', JSON.stringify(user));

        if (user.role === 'hr') {
            navigate('/admin/dashboard');
        } else if (user.role === 'manager') {
            navigate('/admin/manager');
        } else if (user.role === 'super') {
            navigate('/admin/super');
        } else {
            setError("Yetkisiz rol.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Genel Yönetim Paneli</h1>
                    <p className="text-gray-500 text-sm">Devam etmek için giriş yapın</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                {show2FA ? (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div className="text-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-blue-600">lock_clock</span>
                            <h2 className="text-lg font-bold mt-2">İki Adımlı Doğrulama</h2>
                            <p className="text-xs text-gray-500">Lütfen mail adresinize gönderilen 6 haneli kodu giriniz.</p>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value)}
                                className="w-full text-center px-4 py-3 text-2xl tracking-[1em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Doğrula ve Giriş Yap
                        </button>
                        <button type="button" onClick={() => setShow2FA(false)} className="w-full text-sm text-gray-500 hover:text-gray-700">
                            Geri Dön
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>


                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={(token) => setCaptchaToken(token)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!captchaToken}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Giriş Yap
                        </button>
                    </form>
                )}
            </div >
        </div >
    );
}
