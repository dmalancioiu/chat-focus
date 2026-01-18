/**
 * ChatFocus - Settings Storage
 * Handles all chrome.storage interactions
 */

import { CONFIG } from '../core/config.js';
import { messageStates, pinnedMessages, tocVisible, controlsPosition } from '../core/state.js';

// Export settings object directly for main.js to use
export const settings = {
    enabled: CONFIG.DEFAULT_ENABLED, // Global enabled (deprecated, kept for backwards compatibility)
    enabledPlatforms: {
        chatgpt: true,
        claude: true,
        gemini: true
    },
    keepOpen: CONFIG.DEFAULT_KEEP_OPEN,
    previewLength: CONFIG.DEFAULT_PREVIEW_LENGTH
};

export async function loadSettings() {
    try {
        const syncData = await chrome.storage.sync.get(['enabled', 'enabledPlatforms', 'keepOpen', 'previewLength']);

        // Update the exported settings object
        settings.enabled = syncData.enabled !== undefined ? syncData.enabled : CONFIG.DEFAULT_ENABLED;

        // Load per-platform settings, with fallback to global enabled for backwards compatibility
        if (syncData.enabledPlatforms) {
            settings.enabledPlatforms = syncData.enabledPlatforms;
        } else if (syncData.enabled !== undefined) {
            // Migrate old settings: if old enabled exists, use it for all platforms
            settings.enabledPlatforms = {
                chatgpt: syncData.enabled,
                claude: syncData.enabled,
                gemini: syncData.enabled
            };
        }

        settings.keepOpen = syncData.keepOpen || CONFIG.DEFAULT_KEEP_OPEN;
        settings.previewLength = syncData.previewLength || CONFIG.DEFAULT_PREVIEW_LENGTH;

        // Load local state data
        const localData = await chrome.storage.local.get(['messageStates', 'pinnedMessages', 'tocVisible', 'controlsPosition']);

        // Update shared state modules
        if (localData.messageStates) {
            messageStates.clear();
            Object.entries(localData.messageStates).forEach(([k, v]) => messageStates.set(k, v));
        }
        if (localData.pinnedMessages) {
            pinnedMessages.clear();
            localData.pinnedMessages.forEach(id => pinnedMessages.add(id));
        }
        if (localData.tocVisible !== undefined) {
            tocVisible.value = localData.tocVisible;
        }
        if (localData.controlsPosition) {
            controlsPosition.value = localData.controlsPosition;
        }
    } catch (error) {
        console.error('ChatFocus: Error loading settings', error);
    }
}

export async function saveSettings() {
    try {
        await chrome.storage.sync.set({
            enabled: settings.enabled,
            enabledPlatforms: settings.enabledPlatforms,
            keepOpen: settings.keepOpen,
            previewLength: settings.previewLength
        });
    } catch (error) {
        console.error('ChatFocus: Error saving settings', error);
    }
}

// Debounce timer for saving state
let saveStateTimeout;

export function saveMessageState(msgId, isExpanded) {
    messageStates.set(msgId, isExpanded);

    clearTimeout(saveStateTimeout);
    saveStateTimeout = setTimeout(async () => {
        try {
            await chrome.storage.local.set({
                messageStates: Object.fromEntries(messageStates)
            });
        } catch (error) {
            console.error('ChatFocus: Error saving message state', error);
        }
    }, 1000);
}

export async function saveTocState() {
    try {
        await chrome.storage.local.set({ tocVisible: tocVisible.value });
    } catch (error) {
        console.error('ChatFocus: Error saving TOC state', error);
    }
}

export async function saveControlsPosition(position) {
    try {
        await chrome.storage.local.set({ controlsPosition: position });
    } catch (error) {
        console.error('ChatFocus: Error saving controls position', error);
    }
}

export async function togglePinnedMessage(msgId) {
    if (pinnedMessages.has(msgId)) {
        pinnedMessages.delete(msgId);
    } else {
        pinnedMessages.add(msgId);
    }

    try {
        await chrome.storage.local.set({
            pinnedMessages: Array.from(pinnedMessages)
        });
    } catch (error) {
        console.error('ChatFocus: Error saving pinned messages', error);
    }

    return pinnedMessages.has(msgId);
}