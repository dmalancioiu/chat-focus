/**
 * ChatFocus - Settings Storage
 * Handles all chrome.storage interactions
 */

import { CONFIG } from '../core/config.js';
import { state } from '../core/state.js';

// Export the settings object directly so main.js can use it
export let settings = {
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

        // Also update the shared state for other modules
        if (state && state.settings) {
            state.settings = settings;
            state.isEnabled = settings.enabled;
        }

        const localData = await chrome.storage.local.get(['messageStates', 'tocVisible', 'controlsPosition']);
        if (localData.messageStates && state) {
            state.messageStates = new Map(Object.entries(localData.messageStates));
        }
        if (localData.tocVisible !== undefined && state) {
            state.tocVisible = localData.tocVisible;
        }
        if (localData.controlsPosition && state) {
            state.controlsPosition = localData.controlsPosition;
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

        // Update state if needed
        if (state) state.isEnabled = settings.enabled;
    } catch (error) {
        console.error('ChatFocus: Error saving settings', error);
    }
}

export function saveMessageState(msgId, isExpanded) {
    if (!state) return;

    state.messageStates.set(msgId, isExpanded);
    clearTimeout(state.saveStateTimeout);
    state.saveStateTimeout = setTimeout(async () => {
        try {
            await chrome.storage.local.set({
                messageStates: Object.fromEntries(state.messageStates)
            });
        } catch (error) {
            console.error('ChatFocus: Error saving message state', error);
        }
    }, 1000);
}

export async function saveTocState() {
    if (!state) return;
    try {
        await chrome.storage.local.set({ tocVisible: state.tocVisible });
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