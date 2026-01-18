import { CONFIG } from './core/config.js';
import { loadSettings, settings, saveSettings } from './storage/settings.js';
import { foldOldMessages } from './features/message-folding/folding.js';
import { createTableOfContents, toggleTOC, updateActiveTOCItem } from './features/table-of-contents/toc.js';
import { createFloatingControls } from './features/controls/floating-controls.js';
import { expandAllMessages, collapseAllMessages, toggleExpandCollapseAll } from './features/controls/actions.js';
import { showNotification } from './core/utils.js';

let isEnabled = true;
let observer = null;
let foldTimer = null;

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
            // 1. Ignore text changes (AI typing) - Huge performance win
            if (mutation.type !== 'childList') continue;

            // 2. Ignore our own UI elements
            const target = mutation.target;
            if (target.classList && (
                target.classList.contains('chat-focus-toc') ||
                target.classList.contains('chat-focus-controls') ||
                target.classList.contains('chat-focus-label')
            )) {
                continue;
            }

            // 3. Only run if actual nodes were added
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

function setupScrollTracking() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveTOCItem();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

async function init() {
    await loadSettings();
    isEnabled = settings.enabled;
    if (!isEnabled) return;

    setTimeout(() => {
        initObserver();
        foldOldMessages();
    }, CONFIG.INIT_DELAY);

    setupKeyboardShortcuts();
    createTableOfContents();
    createFloatingControls();
    setupScrollTracking();

    console.log('ChatFocus: Modular architecture loaded');
}

init();