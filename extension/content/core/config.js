/**
 * ChatFocus - Core Configuration
 * Central configuration for the extension
 */

export const CONFIG = {
    DEFAULT_KEEP_OPEN: 1,
    DEFAULT_ENABLED: true,
    DEFAULT_PREVIEW_LENGTH: 85,
    DEBOUNCE_DELAY: 500,
    INIT_DELAY: 1000,

    // Site-specific selectors will be loaded from site adapters
    SELECTORS: {
        articles: ['article', '[data-message-id]', '[role="article"]'],
        authorRole: ['[data-message-author-role]', '[data-author-role]', '[role]'],
        textContent: ['.markdown', '.whitespace-pre-wrap', '[data-message-content]', 'p']
    }
};
