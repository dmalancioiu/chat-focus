/**
 * Claude - Site-Specific Selectors
 * Defines DOM selectors for Claude.ai
 */

export const SELECTORS = {
    // Message containers - Claude uses a more generic structure
    articles: [
        // Try specific message containers first
        '[data-testid="user-message"]',
        '[data-testid="claude-message"]',
        '[data-testid*="message"]',
        // Main conversation container children
        'main > div > div > div',
        // Grid layout children (common pattern)
        '.grid > div[class*="group"]',
        '.font-user-message',
        '.font-claude-message'
    ],

    // Author role detection (used to classify User vs AI)
    authorRole: [
        '[data-testid="user-message"]',
        '[data-testid="claude-message"]',
        '.font-user-message',
        '.font-claude-message'
    ],

    // Text content - Claude typically uses whitespace-pre-wrap
    textContent: [
        '[data-testid="message-content"]',
        '.whitespace-pre-wrap',
        'p',
        'div[class*="prose"]',
        '.font-user-message',
        '.font-claude-message'
    ],

    // Code blocks
    codeBlocks: [
        'pre code',
        'pre',
        '[class*="code-block"]',
        'code[class*="language-"]'
    ]
};