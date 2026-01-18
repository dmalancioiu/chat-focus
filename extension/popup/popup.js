// Popup script for ChatFocus

document.addEventListener('DOMContentLoaded', async () => {
    const enabledCheckbox = document.getElementById('enabled');
    const toggleButton = document.getElementById('toggleExpandCollapse');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    const openSettingsButton = document.getElementById('openSettings');
    const status = document.getElementById('status');
    let isExpanded = false;

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

    // Toggle expand/collapse
    function updateToggleButton() {
        if (isExpanded) {
            // Show collapse state
            toggleIcon.innerHTML = '<polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>';
            toggleText.textContent = 'Collapse All';
        } else {
            // Show expand state
            toggleIcon.innerHTML = '<polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/>';
            toggleText.textContent = 'Expand All';
        }
    }

    async function handleToggle() {
        if (isExpanded) {
            await sendAction('collapseAll');
            isExpanded = false;
        } else {
            await sendAction('expandAll');
            isExpanded = true;
        }
        updateToggleButton();
    }

    // Event listeners
    enabledCheckbox.addEventListener('change', toggleExtension);
    toggleButton.addEventListener('click', handleToggle);
    openSettingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });

    // Load initial state
    await loadState();
});
