const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Eğer localhost'taysak localhost'u kullan
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3003';
        }
        // Değilse (Canlı domain ise) o domainin 3003 portunu kullan
        return `${window.location.protocol}//${window.location.hostname}:3003`;
    }
    return 'http://localhost:3003';
};

export const API_BASE_URL = getApiBaseUrl();
export const RECAPTCHA_SITE_KEY = '6LdPFjEsAAAAAHvLuQ55TYqyG0JJRposQQ0ZZNeZ';
