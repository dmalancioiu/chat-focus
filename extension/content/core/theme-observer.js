// Watches the host site (ChatGPT/Claude) for theme changes
export function initThemeObserver() {
    // Return all UI components that need theming
    const getElements = () => {
        return [
            document.getElementById('chat-focus-controls'),
            document.getElementById('chat-focus-stats'),
            document.getElementById('chat-focus-toc') // <--- Added this
        ];
    };

    const checkTheme = () => {
        // Detect Dark Mode on the site
        const isDark =
            document.documentElement.classList.contains('dark') ||
            document.documentElement.getAttribute('data-theme') === 'dark' ||
            document.body.classList.contains('dark-theme') ||
            document.body.classList.contains('dark');

        // Apply class to all our UI components
        getElements().forEach(el => {
            if (el) {
                if (isDark) {
                    el.classList.add('cf-dark');
                } else {
                    el.classList.remove('cf-dark');
                }
            }
        });
    };

    // 1. Check immediately
    checkTheme();

    // 2. Watch for changes (e.g. user toggles theme in settings)
    const observer = new MutationObserver((mutations) => {
        checkTheme();
    });

    // Observe <html> and <body> for class/attribute changes
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return observer;
}