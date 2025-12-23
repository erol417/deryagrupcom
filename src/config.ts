const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // Localhost kontrolü (Masaüstü/Sunucu içi erişim)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3003';
        }
        // Dış erişim (Protocol-Relative)
        // Site HTTPS ise -> https://domain:3003
        // Site HTTP ise -> http://domain:3003
        return `//${hostname}:3003`;
    }
    return 'http://localhost:3003';
};

export const API_BASE_URL = getApiBaseUrl();
export const RECAPTCHA_SITE_KEY = '6LdPFjEsAAAAAHvLuQ55TYqyG0JJRposQQ0ZZNeZ';
