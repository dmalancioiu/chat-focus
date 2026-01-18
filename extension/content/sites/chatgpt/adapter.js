/**
 * ChatGPT Site Adapter
 * Provides ChatGPT-specific implementations
 */

import { SELECTORS } from './selectors.js';

export const ChatGPTAdapter = {
    name: 'chatgpt',
    displayName: 'ChatGPT',
    domains: ['chat.openai.com', 'chatgpt.com'],
    selectors: SELECTORS,

    /**
     * Initialize adapter
     */
    init() {
        console.log('ChatFocus: Initialized for ChatGPT');
        // ChatGPT-specific initialization if needed
    },

    /**
     * Get all message elements
     * @returns {Array<HTMLElement>}
     */
    getMessages() {
        for (const selector of SELECTORS.articles) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                return Array.from(elements);
            }
        }
        return [];
    },

    /**
     * Detect message type (user or ai)
     * @param {HTMLElement} element
     * @returns {'user'|'ai'|'unknown'}
     */
    detectMessageType(element) {
        for (const selector of SELECTORS.authorRole) {
            const authorNode = element.querySelector(selector);
            if (authorNode) {
                const role = authorNode.getAttribute('data-message-author-role') ||
                    authorNode.getAttribute('data-author-role') ||
                    authorNode.getAttribute('role') || '';

                if (role.toLowerCase().includes('user')) {
                    return 'user';
                }
                if (role.toLowerCase().includes('assistant')) {
                    return 'ai';
                }
            }
        }

        // Fallback to class detection
        const classes = element.className.toLowerCase();
        if (classes.includes('user')) return 'user';
        if (classes.includes('assistant')) return 'ai';

        return 'unknown';
    },

    /**
     * Check if element has code blocks
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    hasCodeBlocks(element) {
        for (const selector of SELECTORS.codeBlocks) {
            const blocks = element.querySelectorAll(selector);
            if (blocks.length > 0) {
                // Verify it's not inline code
                for (const block of blocks) {
                    if (block.tagName === 'PRE' ||
                        (block.textContent && block.textContent.includes('\n'))) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /**
     * Called when a new message is detected
     * @param {HTMLElement} element
     */
    onNewMessage(element) {
        // ChatGPT-specific handling if needed
    },

    /**
     * Cleanup when adapter is disabled
     */
    cleanup() {
        // Cleanup if needed
    }
};
