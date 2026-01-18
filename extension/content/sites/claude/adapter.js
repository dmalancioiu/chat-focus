/**
 * Claude Site Adapter
 * Provides Claude-specific implementations
 */

import { SELECTORS } from './selectors.js';

export const ClaudeAdapter = {
    name: 'claude',
    displayName: 'Claude',
    domains: ['claude.ai'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for Claude');
        document.body.classList.add('chat-focus-site-claude');
    },

    getMessages() {
        // Collect all potential message elements
        let messages = [];
        for (const selector of SELECTORS.articles) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                // If we found specific classes, prefer those
                messages = Array.from(elements);
                break;
            }
        }
        return messages;
    },

    detectMessageType(element) {
        // Claude uses specific classes for User vs AI
        const classList = element.className.toLowerCase();

        if (classList.includes('user-message') || element.querySelector('.font-user-message')) {
            return 'user';
        }
        if (classList.includes('claude-message') || element.querySelector('.font-claude-message')) {
            return 'ai';
        }

        // Fallback: Data attributes
        if (element.getAttribute('data-testid') === 'user-message') return 'user';
        if (element.getAttribute('data-testid') === 'claude-message') return 'ai';

        return 'unknown';
    },

    hasCodeBlocks(element) {
        return element.querySelector('pre') !== null;
    },

    onNewMessage(element) {
        // Optional: Claude specific post-processing
    },

    cleanup() {
        document.body.classList.remove('chat-focus-site-claude');
    }
};