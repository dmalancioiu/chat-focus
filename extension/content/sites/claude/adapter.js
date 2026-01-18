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
        // Try to find messages using specific selectors first
        for (const selector of SELECTORS.articles) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                // Filter out non-message elements
                const filtered = Array.from(elements).filter(el => {
                    // Check if element contains text or code blocks
                    const hasContent = el.textContent.trim().length > 0;
                    // Skip UI elements
                    const isUIElement = el.classList.contains('chat-focus-label') ||
                                      el.classList.contains('chat-focus-controls') ||
                                      el.classList.contains('chat-focus-toc');
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
        // 1. Check data-testid attributes (most reliable)
        const testId = element.getAttribute('data-testid');
        if (testId) {
            if (testId.includes('user')) return 'user';
            if (testId.includes('claude') || testId.includes('assistant')) return 'ai';
        }

        // 2. Check element classes
        const classList = element.className.toLowerCase();
        if (classList.includes('user-message') || classList.includes('font-user')) {
            return 'user';
        }
        if (classList.includes('claude-message') || classList.includes('font-claude') ||
            classList.includes('assistant')) {
            return 'ai';
        }

        // 3. Check for child elements with specific classes
        if (element.querySelector('.font-user-message') || element.querySelector('[data-testid="user-message"]')) {
            return 'user';
        }
        if (element.querySelector('.font-claude-message') || element.querySelector('[data-testid="claude-message"]')) {
            return 'ai';
        }

        // 4. Check for visual indicators (avatars, icons)
        const hasUserAvatar = element.querySelector('img[alt*="user" i]') ||
                             element.querySelector('[class*="user-avatar"]');
        if (hasUserAvatar) return 'user';

        const hasClaudeIcon = element.querySelector('svg[class*="claude"]') ||
                             element.querySelector('[class*="assistant-avatar"]');
        if (hasClaudeIcon) return 'ai';

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