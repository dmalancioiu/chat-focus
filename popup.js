// Popup script for ChatFocus

document.addEventListener('DOMContentLoaded', async () => {
    const enabledCheckbox = document.getElementById('enabled');
    const expandAllButton = document.getElementById('expandAll');
    const collapseAllButton = document.getElementById('collapseAll');
    const openSettingsButton = document.getElementById('openSettings');
    const status = document.getElementById('status');

    // Load current state
    async function loadState() {
        try {
            const settings = await chrome.storage.sync.get(['enabled']);
            enabledCheckbox.checked = settings.enabled !== undefined ? settings.enabled : true;
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }

    // Toggle extension
    async function toggleExtension() {
        const newState = enabledCheckbox.checked;
        try {
            await chrome.storage.sync.set({ enabled: newState });
            
            // Notify content scripts
            const tabs = await chrome.tabs.query({
                url: ['https://chatgpt.com/*', 'https://claude.ai/*']
            });
            
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { 
                    action: 'toggle', 
                    enabled: newState 
                });
            });

            showStatus(newState ? 'Enabled' : 'Disabled');
        } catch (error) {
            console.error('Error toggling extension:', error);
            showStatus('Error', true);
        }
    }

    // Send action to content script
    async function sendAction(action) {
        try {
            const tabs = await chrome.tabs.query({
                url: ['https://chatgpt.com/*', 'https://claude.ai/*'],
                active: true
            });

            if (tabs.length === 0) {
                showStatus('No active chat tab', true);
                return;
            }

            await chrome.tabs.sendMessage(tabs[0].id, { action });
            showStatus('Done');
        } catch (error) {
            console.error('Error sending action:', error);
            showStatus('Error: ' + error.message, true);
        }
    }

    function showStatus(message, isError = false) {
        status.textContent = message;
        status.className = 'status show';
        if (isError) {
            status.style.color = '#d32f2f';
        } else {
            status.style.color = '#666';
        }
        setTimeout(() => {
            status.className = 'status';
        }, 2000);
    }

    // Event listeners
    enabledCheckbox.addEventListener('change', toggleExtension);
    expandAllButton.addEventListener('click', () => sendAction('expandAll'));
    collapseAllButton.addEventListener('click', () => sendAction('collapseAll'));
    openSettingsButton.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    // Load initial state
    await loadState();
});
