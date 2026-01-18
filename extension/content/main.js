import { CONFIG } from './core/config.js';
import { loadSettings, settings, saveSettings } from './storage/settings.js';
import { foldOldMessages } from './features/message-folding/folding.js';
import { createTableOfContents, toggleTOC, updateActiveTOCItem } from './features/table-of-contents/toc.js';
import { createFloatingControls } from './features/controls/floating-controls.js';
import { expandAllMessages, collapseAllMessages, toggleExpandCollapseAll } from './features/controls/actions.js';
import { showNotification } from './core/utils.js';

// Import Adapters
import { ChatGPTAdapter } from './sites/chatgpt/adapter.js';
import { ClaudeAdapter } from './sites/claude/adapter.js';
import { GeminiAdapter } from './sites/gemini/adapter.js';

let isEnabled = true;
let observer = null;
let foldTimer = null;
let activeAdapter = null;

// Site Detection Logic
function detectSite() {
    const host = window.location.hostname;
    if (host.includes('claude.ai')) return ClaudeAdapter;
    if (host.includes('gemini.google.com')) return GeminiAdapter;
    return ChatGPTAdapter;
}

export async function toggleExtension() {
    isEnabled = !isEnabled;
    settings.enabled = isEnabled;
    await saveSettings();

    if (isEnabled) {
        foldOldMessages();
        showNotification('ChatFocus enabled');
    } else {
        expandAllMessages();
        showNotification('ChatFocus disabled');
    }
}

function initObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
            // Performance: Ignore text changes (AI typing)
            if (mutation.type !== 'childList') continue;

            const target = mutation.target;
            // Ignore our own UI elements
            if (target.classList && (
                target.classList.contains('chat-focus-toc') ||
                target.classList.contains('chat-focus-controls') ||
                target.classList.contains('chat-focus-label')
            )) {
                continue;
            }

            // Only run if nodes were added
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            if (foldTimer) cancelAnimationFrame(foldTimer);
            foldTimer = requestAnimationFrame(() => {
                setTimeout(foldOldMessages, CONFIG.DEBOUNCE_DELAY);
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', async (e) => {
        if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return;

        switch (e.key.toUpperCase()) {
            case 'E': e.preventDefault(); expandAllMessages(); break;
            case 'C': e.preventDefault(); collapseAllMessages(); break;
            case ' ': e.preventDefault(); toggleExpandCollapseAll(); break;
            case 'T': e.preventDefault(); await toggleExtension(); break;
            case 'O': e.preventDefault(); toggleTOC(); break;
        }
    });
}

async function init() {
    // 1. Detect and Initialize Adapter
    activeAdapter = detectSite();
    if (!activeAdapter) {
        console.warn('ChatFocus: Unknown site, extension disabled.');
        return;
    }

    // 2. Inject Adapter Selectors into Global CONFIG
    // This allows existing modules (folding.js) to work without changes
    CONFIG.SELECTORS = activeAdapter.selectors;
    activeAdapter.init();

    // 3. Load Settings
    await loadSettings();
    isEnabled = settings.enabled;
    if (!isEnabled) {
        console.log("ChatFocus: Disabled in settings");
        return;
    }

    // 4. Start Features
    setTimeout(() => {
        initObserver();
        foldOldMessages();
    }, CONFIG.INIT_DELAY);

    setupKeyboardShortcuts();
    createTableOfContents();
    createFloatingControls();

    console.log(`ChatFocus: Loaded for ${activeAdapter.displayName}`);
}

init();