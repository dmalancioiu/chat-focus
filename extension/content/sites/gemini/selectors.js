/**
 * Gemini - Site-Specific Selectors
 * Defines DOM selectors for Google Gemini
 */

export const SELECTORS = {
    // Message containers - Gemini uses custom elements and specific containers
    articles: [
        // Custom elements (newer Gemini)
        'message-content',
        'model-response',
        'user-query',
        // Class-based selectors
        '.message-content',
        '[data-test-id="message-content"]',
        '.user-query-container',
        '.model-response-container',
        // Generic conversation containers
        '[class*="conversation-container"] > div',
        '[class*="message-container"]',
        // Fallback to data attributes
        '[data-message-index]',
        '[data-is-model]'
    ],

    // Author role detection
    authorRole: [
        '[data-is-model]',
        '[data-message-author]',
        '.user-query-container',
        '.model-response-container',
        'user-query',
        'model-response'
    ],

    // Text content
    textContent: [
        '.message-content',
        '[data-test-id="message-text"]',
        '.model-response-text',
        '.user-query-text',
        '[class*="markdown"]',
        'p'
    ],

    // Code blocks
    codeBlocks: [
        'code-block',
        'pre code',
        'pre',
        '[class*="code-block"]',
        '.code-block-decoration'
    ]
};