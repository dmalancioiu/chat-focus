/**
 * ChatFocus - State Management
 * Centralized state for the extension
 */

export const state = {
    // Core state
    observer: null,
    settings: {},
    messageStates: new Map(),
    isEnabled: true,
    saveStateTimeout: null,

    // TOC state
    tocVisible: false,
    tocSearchQuery: '',

    // Controls state
    controlsPosition: null,
    isAllExpanded: false,

    // Code mode state
    isCodeMode: false,

    // Initialize state from storage
    async init() {
        // Will be implemented when we refactor storage
    },

    // Reset state
    reset() {
        this.messageStates.clear();
        this.tocSearchQuery = '';
        this.isCodeMode = false;
        this.isAllExpanded = false;
    }
};
