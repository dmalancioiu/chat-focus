/**
 * ChatFocus - Settings Storage
 * Handles all chrome.storage interactions
 */

import { CONFIG } from '../core/config.js';
import { messageStates, tocVisible, controlsPosition } from '../core/state.js';

// Export settings object directly for main.js to use
export const settings = {
    enabled: CONFIG.DEFAULT_ENABLED,
    keepOpen: CONFIG.DEFAULT_KEEP_OPEN,
    previewLength: CONFIG.DEFAULT_PREVIEW_LENGTH
};

export async function loadSettings() {
    try {
        const syncData = await chrome.storage.sync.get(['enabled', 'keepOpen', 'previewLength']);

        // Update the exported settings object
        settings.enabled = syncData.enabled !== undefined ? syncData.enabled : CONFIG.DEFAULT_ENABLED;
        settings.keepOpen = syncData.keepOpen || CONFIG.DEFAULT_KEEP_OPEN;
        settings.previewLength = syncData.previewLength || CONFIG.DEFAULT_PREVIEW_LENGTH;

        // Load local state data
        const localData = await chrome.storage.local.get(['messageStates', 'tocVisible', 'controlsPosition']);

        // Update shared state modules
        if (localData.messageStates) {
            messageStates.clear();
            Object.entries(localData.messageStates).forEach(([k, v]) => messageStates.set(k, v));
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