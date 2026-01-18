// Options page script for ChatFocus

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
document.body.classList.add(isMac ? 'platform-mac' : 'platform-win');

document.addEventListener('DOMContentLoaded', async () => {
    const enabledCheckbox = document.getElementById('enabled');
    const keepOpenSlider = document.getElementById('keepOpen');
    const keepOpenValue = document.getElementById('keepOpenValue');
    const previewLengthInput = document.getElementById('previewLength');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    const statusMessage = document.getElementById('statusMessage');

    // Load current settings
    async function loadSettings() {
        try {
            const settings = await chrome.storage.sync.get([
                'enabled',
                'keepOpen',
                'previewLength'
            ]);

            enabledCheckbox.checked = settings.enabled !== undefined ? settings.enabled : true;
            keepOpenSlider.value = settings.keepOpen || 1;
            keepOpenValue.textContent = keepOpenSlider.value;
            previewLengthInput.value = settings.previewLength || 85;
        } catch (error) {
            console.error('Error loading settings:', error);
            showStatus('Error loading settings', 'error');
        }
    }

    // Save settings
    async function saveSettings() {
        try {
            const settings = {
                enabled: enabledCheckbox.checked,
                keepOpen: parseInt(keepOpenSlider.value, 10),
                previewLength: parseInt(previewLengthInput.value, 10)
            };

            // Validate
            if (settings.keepOpen < 1 || settings.keepOpen > 5) {
                showStatus('Keep Open must be between 1 and 5', 'error');
                return;
            }

            if (settings.previewLength < 30 || settings.previewLength > 200) {
                showStatus('Preview Length must be between 30 and 200', 'error');
                return;
            }

            await chrome.storage.sync.set(settings);
            showStatus('Settings saved successfully!', 'success');

            // Notify content scripts of changes
            const tabs = await chrome.tabs.query({
                url: ['https://chatgpt.com/*', 'https://claude.ai/*']
            });

            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings });
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            showStatus('Error saving settings', 'error');
        }
    }

    // Reset to defaults
    async function resetSettings() {
        if (!confirm('Reset all settings to defaults?')) return;

        try {
            await chrome.storage.sync.clear();
            await loadSettings();
            showStatus('Settings reset to defaults', 'success');
        } catch (error) {
            console.error('Error resetting settings:', error);
            showStatus('Error resetting settings', 'error');
        }
    }

    // Show status message
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 3000);
    }

    // Update range value display
    keepOpenSlider.addEventListener('input', (e) => {
        keepOpenValue.textContent = e.target.value;
    });

    // Event listeners
    saveButton.addEventListener('click', saveSettings);
    resetButton.addEventListener('click', resetSettings);

    // Allow Enter key to save
    previewLengthInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveSettings();
        }
    });

    // Load settings on page load
    await loadSettings();
});
