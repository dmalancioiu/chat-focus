/**
 * Gemini Site Adapter
 * Provides Gemini-specific implementations
 *
 * TODO: Implement when adding Gemini support
 */

import { SELECTORS } from './selectors.js';

export const GeminiAdapter = {
    name: 'gemini',
    displayName: 'Google Gemini',
    domains: ['gemini.google.com'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for Gemini');
        // TODO: Gemini-specific initialization
    },

    getMessages() {
        // TODO: Implement Gemini message detection
        return [];
    },

    detectMessageType(element) {
        // TODO: Implement Gemini message type detection
        return 'unknown';
    },

    hasCodeBlocks(element) {
        // TODO: Implement Gemini code block detection
        return false;
    },

    onNewMessage(element) {
        // TODO: Gemini-specific handling
    },

    cleanup() {
        // TODO: Cleanup
    }
};
