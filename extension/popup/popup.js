document.addEventListener('DOMContentLoaded', async () => {
    const platformCheckboxes = {
        chatgpt: document.getElementById('enabled-chatgpt'),
        claude: document.getElementById('enabled-claude'),
        gemini: document.getElementById('enabled-gemini')
    };

    const statusBadge = document.getElementById('status-badge');
    const openSettingsButton = document.getElementById('openSettings');

    // 1. Load Settings
    async function loadState() {
        try {
            const settings = await chrome.storage.sync.get(['enabledPlatforms']);
            const enabledPlatforms = settings.enabledPlatforms || {
                chatgpt: true,
                claude: true,
                gemini: true
            };

            platformCheckboxes.chatgpt.checked = enabledPlatforms.chatgpt;
            platformCheckboxes.claude.checked = enabledPlatforms.claude;
            platformCheckboxes.gemini.checked = enabledPlatforms.gemini;
        } catch (error) {
            console.error('ChatFocus: Error loading popup state', error);
        }
    }

    // 2. Detect Current Tab
    async function detectActiveTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Reset badge
        statusBadge.textContent = "Idle";
        statusBadge.classList.remove('active');

        if (!tab || !tab.url) return;

        const url = tab.url;
        let siteName = null;

        if (url.includes('chatgpt.com') || url.includes('openai.com')) {
            siteName = "Active";
        } else if (url.includes('claude.ai')) {
            siteName = "Active";
        } else if (url.includes('gemini.google.com')) {
            siteName = "Active";
        }

        if (siteName) {
            statusBadge.textContent = siteName;
            statusBadge.classList.add('active');
        }
    }

    // 3. Handle Toggles
    async function togglePlatform(platform, enabled) {
        try {
            const settings = await chrome.storage.sync.get(['enabledPlatforms']);
            const enabledPlatforms = settings.enabledPlatforms || {
                chatgpt: true,
                claude: true,
                gemini: true
            };

            enabledPlatforms[platform] = enabled;
            await chrome.storage.sync.set({ enabledPlatforms });

            // Reload tabs for immediate effect
            const urlPatterns = {
                chatgpt: ['*://chatgpt.com/*', '*://chat.openai.com/*'],
                claude: ['*://claude.ai/*'],
                gemini: ['*://gemini.google.com/*']
            };

            const patterns = urlPatterns[platform];
            if (patterns) {
                const tabs = await chrome.tabs.query({ url: patterns });
                tabs.forEach(tab => chrome.tabs.reload(tab.id));
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Event Listeners
    Object.entries(platformCheckboxes).forEach(([platform, checkbox]) => {
        checkbox.addEventListener('change', (e) => {
            togglePlatform(platform, e.target.checked);
        });
    });

    if (openSettingsButton) {
        openSettingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.runtime.openOptionsPage();
        });
    }

    // Init
    await loadState();
    await detectActiveTab();
});