document.addEventListener('DOMContentLoaded', async () => {
    // === 1. OS Detection for Shortcuts ===
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Update key symbols
    const modKeys = document.querySelectorAll('.key-mod');
    const shiftKeys = document.querySelectorAll('.key-shift');

    modKeys.forEach(el => el.textContent = isMac ? '⌘' : 'Ctrl');
    shiftKeys.forEach(el => el.textContent = isMac ? '⇧' : 'Shift');

    // === 2. Element References ===
    const enabledCheckbox = document.getElementById('enabled');
    const keepOpenSlider = document.getElementById('keepOpen');
    const keepOpenValue = document.getElementById('keepOpenValue');
    const previewLengthInput = document.getElementById('previewLength');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    const statusMessage = document.getElementById('statusMessage');

    // === 3. Logic ===
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

    async function saveSettings() {
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        try {
            const settings = {
                enabled: enabledCheckbox.checked,
                keepOpen: parseInt(keepOpenSlider.value, 10),
                previewLength: parseInt(previewLengthInput.value, 10)
            };

            if (settings.keepOpen < 1 || settings.keepOpen > 5) {
                showStatus('Keep Open must be between 1 and 5', 'error');
                return; // Guard clause
            }
            if (settings.previewLength < 30 || settings.previewLength > 300) {
                showStatus('Preview Length must be between 30 and 300', 'error');
                return;
            }

            await chrome.storage.sync.set(settings);
            showStatus('Settings saved successfully!', 'success');

            // Notify Active Tabs
            const targetUrls = [
                'https://chatgpt.com/*',
                'https://chat.openai.com/*',
                'https://claude.ai/*',
                'https://gemini.google.com/*'
            ];

            const tabs = await chrome.tabs.query({ url: targetUrls });
            for (const tab of tabs) {
                try {
                    await chrome.tabs.sendMessage(tab.id, {
                        action: 'settingsUpdated',
                        settings
                    });
                } catch (err) {
                    // Ignore sleeping tabs
                }
            }
        } catch (error) {
            console.error('Error saving:', error);
            showStatus('Error saving settings', 'error');
        } finally {
            setTimeout(() => {
                saveButton.disabled = false;
                saveButton.textContent = 'Save Changes';
            }, 500);
        }
    }

    async function resetSettings() {
        if (!confirm('Reset all settings to default?')) return;
        try {
            await chrome.storage.sync.remove(['enabled', 'keepOpen', 'previewLength']);
            await loadSettings();
            showStatus('Settings reset to defaults', 'success');
            saveSettings(); // Sync to tabs
        } catch (error) {
            console.error('Error resetting:', error);
        }
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.classList.add('visible');
        setTimeout(() => {
            statusMessage.classList.remove('visible');
        }, 3000);
    }

    // === 4. Event Listeners ===
    keepOpenSlider.addEventListener('input', (e) => keepOpenValue.textContent = e.target.value);
    saveButton.addEventListener('click', saveSettings);
    resetButton.addEventListener('click', resetSettings);
    previewLengthInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveSettings();
    });

    await loadSettings();
});