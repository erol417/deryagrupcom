const getApiBaseUrl = () => {
    // IIS Reverse Proxy kullanacağımız için API isteklerini
    // direkt aynı domain'e gönderiyoruz (Portsuz).
    // Örn: http://deryagrup.com/api/... 
    // IIS bunu alıp arkadaki 3003'e iletecek.
    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3003';
        }
        return window.location.origin;
    }
    return '';
};

export const API_BASE_URL = getApiBaseUrl();
export const RECAPTCHA_SITE_KEY = '6LdPFjEsAAAAAHvLuQ55TYqyG0JJRposQQ0ZZNeZ';
