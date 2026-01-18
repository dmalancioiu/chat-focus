/**
 * Gemini Site Adapter
 * Provides Gemini-specific implementations
 */

import { SELECTORS } from './selectors.js';

export const GeminiAdapter = {
    name: 'gemini',
    displayName: 'Gemini',
    domains: ['gemini.google.com'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for Gemini');
        document.body.classList.add('chat-focus-site-gemini');
    },

    getMessages() {
        // Try each selector set in order of specificity
        for (const selector of SELECTORS.articles) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                // Filter out non-message elements
                const filtered = Array.from(elements).filter(el => {
                    // Check if element contains text content
                    const hasContent = el.textContent.trim().length > 0;
                    // Skip UI elements
                    const isUIElement = el.classList.contains('chat-focus-label') ||
                                      el.classList.contains('chat-focus-controls') ||
                                      el.classList.contains('chat-focus-toc') ||
                                      el.tagName === 'SCRIPT' ||
                                      el.tagName === 'STYLE';
                    return hasContent && !isUIElement;
                });

                if (filtered.length > 0) {
                    return filtered;
                }
            }
        }
        return [];
    },

    detectMessageType(element) {
        // 1. Check element tag name (custom elements)
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'user-query') return 'user';
        if (tagName === 'model-response') return 'ai';

        // 2. Check data attributes
        const isModel = element.getAttribute('data-is-model');
        if (isModel === 'true' || isModel === '1') return 'ai';
        if (isModel === 'false' || isModel === '0') return 'user';

        const messageAuthor = element.getAttribute('data-message-author');
        if (messageAuthor) {
            const author = messageAuthor.toLowerCase();
            if (author.includes('user')) return 'user';
            if (author.includes('model') || author.includes('gemini') || author.includes('assistant')) return 'ai';
        }

        // 3. Check element classes
        const classList = element.className.toLowerCase();
        if (classList.includes('user-query') || classList.includes('user-message')) {
            return 'user';
        }
        if (classList.includes('model-response') || classList.includes('ai-message') ||
            classList.includes('assistant')) {
            return 'ai';
        }

        // 4. Check parent containers
        if (element.closest('.user-query-container') || element.closest('user-query')) {
            return 'user';
        }
        if (element.closest('.model-response-container') || element.closest('model-response')) {
            return 'ai';
        }

        // 5. Check for visual indicators (avatars, icons)
        if (element.querySelector('.user-photo') || element.querySelector('img[alt*="user" i]')) {
            return 'user';
        }
        if (element.querySelector('.logo-img') ||
            element.querySelector('img[alt*="gemini" i]') ||
            element.querySelector('img[alt*="bard" i]')) {
            return 'ai';
        }

        return 'unknown';
    },

    hasCodeBlocks(element) {
        // Gemini uses <code-block> custom elements often
        return element.querySelector('code-block') !== null || element.querySelector('pre') !== null;
    },

    onNewMessage(element) {
        // Gemini specific handling
    },

    cleanup() {
        document.body.classList.remove('chat-focus-site-gemini');
    }
};