import { CONFIG } from './core/config.js';
import { loadSettings, settings, saveSettings } from './storage/settings.js';
import { foldOldMessages } from './features/message-folding/folding.js';
import { createTableOfContents, toggleTOC, updateActiveTOCItem } from './features/table-of-contents/toc.js';
import { createFloatingControls } from './features/controls/floating-controls.js';
import { expandAllMessages, collapseAllMessages, toggleExpandCollapseAll } from './features/controls/actions.js';
import { toggleCodeMode } from './features/code-mode/code-mode.js';
import { toggleStats } from './features/stats/stats.js';
import { showNotification } from './core/utils.js';
import { createStatsPanel, updateStats } from './features/stats/stats.js';
import { initThemeObserver } from './core/theme-observer.js';

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

// Open popup instead of toggling
export function openPopup() {
    // This will be triggered from the floating controls button
    // The popup is opened via the browser action icon, so we just notify the user
    showNotification('Use the extension popup to toggle platforms');
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
                target.classList.contains('chat-focus-label') ||
                target.classList.contains('chat-focus-refold-btn') ||
                target.classList.contains('chat-focus-processed') // Ignore already processed messages
            )) {
                continue;
            }

            // Check if added nodes are our own UI elements
            let hasRelevantChanges = false;
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Skip if it's one of our UI elements
                    if (node.classList && (
                        node.classList.contains('chat-focus-label') ||
                        node.classList.contains('chat-focus-refold-btn') ||
                        node.classList.contains('chat-focus-toc') ||
                        node.classList.contains('chat-focus-controls')
                    )) {
                        continue;
                    }
                    hasRelevantChanges = true;
                    break;
                }
            }

            if (hasRelevantChanges) {
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
            // case 'E': e.preventDefault(); expandAllMessages(); break;
            // case 'C': e.preventDefault(); collapseAllMessages(); break;
            case ' ': e.preventDefault(); toggleExpandCollapseAll(); break;
            case 'O': e.preventDefault(); toggleTOC(); break;
            case 'S': e.preventDefault(); toggleStats(); break;
            case 'C': e.preventDefault(); toggleCodeMode(); break;
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

    // 2. Inject Adapter Selectors and Reference into Global CONFIG
    // This allows existing modules (folding.js) to work without changes
    CONFIG.SELECTORS = activeAdapter.selectors;
    CONFIG.ADAPTER = activeAdapter;
    activeAdapter.init();

    // 3. Load Settings
    await loadSettings();

    // Check if this platform is enabled
    const platformKey = activeAdapter.name; // 'chatgpt', 'claude', or 'gemini'
    const isPlatformEnabled = settings.enabledPlatforms[platformKey];

    if (!isPlatformEnabled) {
        console.log(`ChatFocus: Disabled for ${activeAdapter.displayName}`);
        return;
    }

    isEnabled = isPlatformEnabled;

    // 4. Start Features
    setTimeout(() => {
        initObserver();
        foldOldMessages();
    }, CONFIG.INIT_DELAY);

    setupKeyboardShortcuts();
    createTableOfContents();
    createFloatingControls();
    createStatsPanel();

    initThemeObserver();

    console.log(`ChatFocus: Loaded for ${activeAdapter.displayName}`);
}

init();