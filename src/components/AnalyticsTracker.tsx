import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function AnalyticsTracker() {
    const location = useLocation();
    const initialized = useRef(false);

    useEffect(() => {
        // Track Page View
        // (In React Strict Mode, this might run twice in dev, useRef helps but usually strict mode is dev only)
        // We will just let it run.

        const trackPage = async () => {
            try {
                // Get Location Info (Mock or Real)
                // Since this runs on client, we can't easily get IP Location without external service.
                // We will rely on Server to get IP.
                // Use a free API for City if needed, but for performance, we skip it or use sessionStorage cache.

                let city = sessionStorage.getItem('analytics_city');
                if (!city) {
                    try {
                        const res = await fetch('https://ipapi.co/json/');
                        const data = await res.json();
                        if (data.city) {
                            city = data.city;
                            sessionStorage.setItem('analytics_city', city);
                        }
                    } catch (e) {
                        // Silent fail
                    }
                }

                await fetch(`${API_BASE_URL}/api/analytics/collect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'pageview',
                        path: location.pathname,
                        meta: { city }
                    })
                });
            } catch (e) {
                // Ignore analytics errors
            }
        };

        trackPage();

    }, [location]);

    // Track Clicks
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if vital element
            const interactive = target.closest('button, a, .clickable');
            if (interactive) {
                const text = interactive.innerText || interactive.getAttribute('aria-label') || 'Icon-Button';
                const actionName = `Clicked: ${text.substring(0, 20)}`; // Limit length

                // Debounce simple way: don't track every single click if spamming
                // Just fire and forget
                fetch(`${API_BASE_URL}/api/analytics/collect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'click',
                        path: window.location.pathname,
                        action: actionName
                    })
                }).catch(() => { });
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return null; // Renderless component
}
