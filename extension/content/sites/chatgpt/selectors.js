/**
 * ChatGPT - Site-Specific Selectors
 * Defines DOM selectors for ChatGPT platform
 */

export const SELECTORS = {
    // Message containers
    articles: [
        'article',
        '[data-message-id]',
        '[role="article"]'
    ],

    // Author role detection
    authorRole: [
        '[data-message-author-role]',
        '[data-author-role]',
        '[role]'
    ],

    // Text content
    textContent: [
        '.markdown',
        '.whitespace-pre-wrap',
        '[data-message-content]',
        'p'
    ],

    // Code blocks
    codeBlocks: [
        'pre',
        'pre code',
        'code[class*="language-"]',
        '.code-block',
        'div[class*="code"] pre'
    ]
};
