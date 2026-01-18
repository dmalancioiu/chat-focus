/**
 * Claude Site Adapter
 * Provides Claude-specific implementations
 *
 * TODO: Implement when adding Claude support
 */

import { SELECTORS } from './selectors.js';

export const ClaudeAdapter = {
    name: 'claude',
    displayName: 'Claude',
    domains: ['claude.ai'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for Claude');
        // TODO: Claude-specific initialization
    },

    getMessages() {
        // TODO: Implement Claude message detection
        return [];
    },

    detectMessageType(element) {
        // TODO: Implement Claude message type detection
        return 'unknown';
    },

    hasCodeBlocks(element) {
        // TODO: Implement Claude code block detection
        return false;
    },

    onNewMessage(element) {
        // TODO: Claude-specific handling
    },

    cleanup() {
        // TODO: Cleanup
    }
};
