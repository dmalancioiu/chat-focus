/**
 * ChatFocus - Settings Storage
 * Handles all chrome.storage interactions
 */

import { CONFIG } from '../core/config.js';
import { state } from '../core/state.js';

export async function loadSettings() {
    try {
        const syncData = await chrome.storage.sync.get(['enabled', 'keepOpen', 'previewLength']);
        state.settings.enabled = syncData.enabled !== undefined ? syncData.enabled : CONFIG.DEFAULT_ENABLED;
        state.settings.keepOpen = syncData.keepOpen || CONFIG.DEFAULT_KEEP_OPEN;
        state.settings.previewLength = syncData.previewLength || CONFIG.DEFAULT_PREVIEW_LENGTH;

        const localData = await chrome.storage.local.get(['messageStates', 'tocVisible', 'controlsPosition']);
        if (localData.messageStates) {
            state.messageStates = new Map(Object.entries(localData.messageStates));
        }
        if (localData.tocVisible !== undefined) {
            state.tocVisible = localData.tocVisible;
        }
        if (localData.controlsPosition) {
            state.controlsPosition = localData.controlsPosition;
        }

        state.isEnabled = state.settings.enabled;
    } catch (error) {
        console.error('ChatFocus: Error loading settings', error);
    }
}

export async function saveSettings() {
    try {
        await chrome.storage.sync.set({
            enabled: state.settings.enabled,
            keepOpen: state.settings.keepOpen,
            previewLength: state.settings.previewLength
        });
    } catch (error) {
        console.error('ChatFocus: Error saving settings', error);
    }
}

export function saveMessageState(msgId, isExpanded) {
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
