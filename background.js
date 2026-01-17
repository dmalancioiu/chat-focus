// Background service worker for ChatFocus

// Install/update handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.sync.set({
            enabled: true,
            keepOpen: 1,
            previewLength: 85
        });
        
        // Open options page on first install
        chrome.runtime.openOptionsPage();
    } else if (details.reason === 'update') {
        console.log('ChatFocus updated to version', chrome.runtime.getManifest().version);
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getSettings') {
        chrome.storage.sync.get(['enabled', 'keepOpen', 'previewLength'], (settings) => {
            sendResponse(settings);
        });
        return true; // Keep channel open for async response
    }
});
