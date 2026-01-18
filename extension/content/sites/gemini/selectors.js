/**
 * Gemini - Site-Specific Selectors
 * Defines DOM selectors for Google Gemini
 */

export const SELECTORS = {
    // Message containers
    articles: [
        'message-content',            // Gemini custom element
        '.message-content',           // Class fallback
        '[data-test-id="message-content"]',
        '.user-query-container',      // User specific
        '.model-response-container'   // Model specific
    ],

    // Author role detection
    authorRole: [
        '[data-is-model]',            // Attribute often used by Gemini
        '.user-query-container',
        '.model-response-container'
    ],

    // Text content
    textContent: [
        '.message-content',
        '.model-response-text',
        '.user-query-text',
        'p'
    ],

    // Code blocks
    codeBlocks: [
        'code-block',                 // Gemini often uses custom elements
        'pre',
        '.code-block-decoration'
    ]
};