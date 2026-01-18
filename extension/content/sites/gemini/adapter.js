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
        // Gemini messages are often custom elements
        const messages = document.querySelectorAll(SELECTORS.articles.join(','));
        return Array.from(messages);
    },

    detectMessageType(element) {
        // 1. Check for User Query classes
        if (element.classList.contains('user-query-container') ||
            element.closest('.user-query-container')) {
            return 'user';
        }

        // 2. Check for Model Response classes
        if (element.classList.contains('model-response-container') ||
            element.closest('.model-response-container') ||
            element.getAttribute('data-is-model') === 'true') {
            return 'ai';
        }

        // 3. Fallback: Check internal text/structure
        if (element.querySelector('.user-photo')) return 'user';
        if (element.querySelector('.logo-img') || element.querySelector('img[alt="Gemini"]')) return 'ai';

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