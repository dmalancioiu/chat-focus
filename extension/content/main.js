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

    observer = new MutationObserver(() => {
        if (foldTimer) cancelAnimationFrame(foldTimer);
        foldTimer = requestAnimationFrame(() => {
            setTimeout(foldOldMessages, CONFIG.DEBOUNCE_DELAY);
        });
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