/**
 * Claude - Site-Specific Selectors
 * Defines DOM selectors for Claude.ai
 */

export const SELECTORS = {
    // Message containers
    articles: [
        '.font-user-message',
        '.font-claude-message',
        '[data-testid="user-message"]',
        '[data-testid="claude-message"]',
        '.grid-cols-1 > div' // Fallback for message rows
    ],

    // Author role detection (used to classify User vs AI)
    authorRole: [
        '.font-user-message',    // User class
        '.font-claude-message',  // AI class
        '[data-testid="user-message"]',
        '[data-testid="claude-message"]'
    ],

    // Text content
    textContent: [
        '.whitespace-pre-wrap',
        '.font-user-message',
        '.font-claude-message'
    ],

    // Code blocks
    codeBlocks: [
        'pre',
        '.code-block',
        'code'
    ]
};