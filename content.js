/**
 * ChatFocus - Production-Ready Auto-Collapse Extension
 * Automatically collapses past messages in AI chat interfaces for better focus
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    DEFAULT_KEEP_OPEN: 1, // Number of recent messages to keep open
    DEFAULT_ENABLED: true,
    DEFAULT_PREVIEW_LENGTH: 85,
    DEBOUNCE_DELAY: 500, // Reduced from 1000ms for better responsiveness
    INIT_DELAY: 1000, // Delay before initializing observer
    SELECTORS: {
        // Multiple selector strategies for better compatibility
        articles: ['article', '[data-message-id]', '[role="article"]'],
        authorRole: ['[data-message-author-role]', '[data-author-role]', '[role]'],
        textContent: ['.markdown', '.whitespace-pre-wrap', '[data-message-content]', 'p']
    }
};

// ==================== STATE MANAGEMENT ====================
let observer = null;
let settings = { ...CONFIG };
let messageStates = new Map(); // Track expanded/collapsed state per message
let isEnabled = true;
let saveStateTimeout;

// ==================== UTILITY FUNCTIONS ====================
function safeQuerySelector(selectors, parent = document) {
    for (const selector of selectors) {
        try {
            const element = parent.querySelector(selector);
            if (element) return element;
        } catch (e) {
            console.warn(`ChatFocus: Invalid selector "${selector}"`, e);
        }
    }
    return null;
}

function safeQuerySelectorAll(selectors, parent = document) {
    const results = [];
    for (const selector of selectors) {
        try {
            const elements = Array.from(parent.querySelectorAll(selector));
            if (elements.length > 0) {
                return elements;
            }
        } catch (e) {
            console.warn(`ChatFocus: Invalid selector "${selector}"`, e);
        }
    }
    return results;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getMessageId(msgRow) {
    // Try multiple strategies to get a unique ID
    const idAttr = msgRow.getAttribute('data-message-id') ||
        msgRow.getAttribute('id') ||
        msgRow.getAttribute('data-id');
    if (idAttr) return idAttr;

    // Fallback: generate ID from content hash
    const content = msgRow.textContent?.substring(0, 50) || '';
    return `msg_${content.length}_${Date.now()}`;
}

// ==================== SETTINGS MANAGEMENT ====================
async function loadSettings() {
    try {
        // 1. Load User Preferences from SYNC (Cloud)
        const syncData = await chrome.storage.sync.get(['enabled', 'keepOpen', 'previewLength']);
        settings.enabled = syncData.enabled !== undefined ? syncData.enabled : CONFIG.DEFAULT_ENABLED;
        settings.keepOpen = syncData.keepOpen || CONFIG.DEFAULT_KEEP_OPEN;
        settings.previewLength = syncData.previewLength || CONFIG.DEFAULT_PREVIEW_LENGTH;

        // 2. Load Message States from LOCAL (Disk) - This fixes the quota error
        const localData = await chrome.storage.local.get(['messageStates']);
        if (localData.messageStates) {
            messageStates = new Map(Object.entries(localData.messageStates));
        }

        isEnabled = settings.enabled;
    } catch (error) {
        console.error('ChatFocus: Error loading settings', error);
    }
}

async function saveSettings() {
    try {
        await chrome.storage.sync.set({
            enabled: settings.enabled,
            keepOpen: settings.keepOpen,
            previewLength: settings.previewLength,
            messageStates: Object.fromEntries(messageStates)
        });
    } catch (error) {
        console.error('ChatFocus: Error saving settings', error);
    }
}

function saveMessageState(msgId, isExpanded) {
    // 1. Update memory immediately so the UI feels fast
    messageStates.set(msgId, isExpanded);

    // 2. Clear any pending save (Debounce)
    clearTimeout(saveStateTimeout);

    // 3. Wait 1 second before actually writing to disk
    saveStateTimeout = setTimeout(async () => {
        try {
            // Use .local instead of .sync to avoid "MAX_WRITE_OPERATIONS" error
            await chrome.storage.local.set({
                messageStates: Object.fromEntries(messageStates)
            });
        } catch (error) {
            console.error('ChatFocus: Error saving message state', error);
        }
    }, 1000);
}

// ==================== CORE FUNCTIONALITY ====================
function extractPreviewText(msgRow) {
    let previewText = "Collapsed Message";

    for (const selector of CONFIG.SELECTORS.textContent) {
        const textDiv = safeQuerySelector([selector], msgRow);
        if (textDiv) {
            const text = textDiv.innerText || textDiv.textContent || '';
            if (text.trim()) {
                previewText = text
                    .replace(/[\n\r]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                    .substring(0, settings.previewLength);
                if (text.length > settings.previewLength) {
                    previewText += "...";
                }
                break;
            }
        }
    }

    return previewText;
}

function extractFullText(msgRow) {
    let fullText = "";
    for (const selector of CONFIG.SELECTORS.textContent) {
        const textDiv = safeQuerySelector([selector], msgRow);
        if (textDiv) {
            const text = textDiv.innerText || textDiv.textContent || '';
            if (text.trim()) {
                fullText = text.trim();
                break;
            }
        }
    }
    return fullText;
}

// AI Summarization using the chat's own API
async function generateSummary(text, msgType) {
    if (!text || text.length < 50) return null; // Don't summarize short messages

    try {
        // Try to use the page's existing API if available
        // This is a lightweight approach - we'll create a simple summary
        const words = text.split(/\s+/);
        if (words.length <= 20) return null; // Already short enough

        // Simple extractive summarization (first sentence or key phrases)
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        if (sentences.length > 0) {
            const firstSentence = sentences[0].trim();
            if (firstSentence.length <= settings.previewLength) {
                return firstSentence;
            }
        }

        // Fallback: extract key phrases
        const keyPhrases = text
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 4)
            .slice(0, 10)
            .join(' ');

        return keyPhrases.length > 0 ? keyPhrases.substring(0, settings.previewLength) : null;
    } catch (error) {
        console.warn('ChatFocus: Error generating summary', error);
        return null;
    }
}

function determineMessageType(msgRow) {
    for (const selector of CONFIG.SELECTORS.authorRole) {
        const authorNode = safeQuerySelector([selector], msgRow);
        if (authorNode) {
            const role = authorNode.getAttribute('data-message-author-role') ||
                authorNode.getAttribute('data-author-role') ||
                authorNode.getAttribute('role') ||
                '';

            if (role.toLowerCase().includes('user') ||
                authorNode.textContent?.toLowerCase().includes('user')) {
                return 'user';
            }
            if (role.toLowerCase().includes('assistant') ||
                role.toLowerCase().includes('ai') ||
                authorNode.textContent?.toLowerCase().includes('assistant')) {
                return 'ai';
            }
        }
    }

    // Fallback: check for common patterns
    if (msgRow.classList.toString().toLowerCase().includes('user')) return 'user';
    if (msgRow.classList.toString().toLowerCase().includes('assistant')) return 'ai';

    return 'unknown';
}

function processMessage(msgRow, msgId) {
    try {
        if (msgRow.classList.contains('chat-focus-processed')) return;

        const msgType = determineMessageType(msgRow);
        const isUser = msgType === 'user';
        let previewText = extractPreviewText(msgRow);

        // Add classes
        msgRow.classList.add('chat-focus-processed');

        // Check if we should restore previous state
        const wasExpanded = messageStates.get(msgId);
        if (wasExpanded !== true) {
            msgRow.classList.add('chat-focus-collapsed');
        }

        // Add type-specific styling
        if (isUser) {
            msgRow.classList.add('chat-focus-user-collapsed');
        } else {
            msgRow.classList.add('chat-focus-ai-collapsed');
        }

        // Create label element
        const label = document.createElement('div');
        label.className = 'chat-focus-label';
        label.setAttribute('role', 'button');
        label.setAttribute('tabindex', '0');
        label.setAttribute('aria-label', `Expand message: ${previewText}`);
        label.innerHTML = `<span class="chat-focus-icon"></span> <span class="chat-focus-text">${escapeHtml(previewText)}</span>`;

        if (wasExpanded === true) {
            label.style.display = 'none';
        }

        msgRow.prepend(label);

        // Create refold button - subtle, native style
        const refoldBtn = document.createElement('div');
        refoldBtn.className = 'chat-focus-refold-btn';
        refoldBtn.setAttribute('role', 'button');
        refoldBtn.setAttribute('tabindex', '0');
        refoldBtn.setAttribute('aria-label', 'Collapse message');
        refoldBtn.textContent = 'Collapse';
        msgRow.appendChild(refoldBtn);

        // Store message data for TOC
        const fullText = extractFullText(msgRow);
        msgRow._chatFocusData = {
            id: msgId,
            type: msgType,
            previewText: previewText,
            fullText: fullText,
            element: msgRow
        };

        // Generate AI summary for longer messages
        if (!isUser && fullText.length > 200) {
            generateSummary(fullText, msgType).then(summary => {
                if (summary && summary !== previewText) {
                    const summaryBadge = document.createElement('div');
                    summaryBadge.className = 'chat-focus-summary';
                    summaryBadge.textContent = 'Summary';
                    summaryBadge.title = summary;
                    label.appendChild(summaryBadge);
                    msgRow._chatFocusData.summary = summary;
                    updateTableOfContents();
                }
            });
        }

        // Update TOC when message is processed
        updateTableOfContents();

        // Toggle handlers
        const expandMessage = (e) => {
            e?.stopPropagation();
            msgRow.classList.remove('chat-focus-collapsed');
            label.style.display = 'none';
            saveMessageState(msgId, true);
        };

        const collapseMessage = (e) => {
            e?.stopPropagation();
            msgRow.classList.add('chat-focus-collapsed');
            label.style.display = 'flex';
            saveMessageState(msgId, false);
        };

        // Click handlers
        label.addEventListener('click', expandMessage);
        refoldBtn.addEventListener('click', collapseMessage);

        // Keyboard accessibility
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                expandMessage(e);
            }
        });

        refoldBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                collapseMessage(e);
            }
        });

        // Store handlers for cleanup
        msgRow._chatFocusHandlers = { expandMessage, collapseMessage };
    } catch (error) {
        console.error('ChatFocus: Error processing message', error);
    }
}

function foldOldMessages() {
    if (!isEnabled) return;

    try {
        const articles = safeQuerySelectorAll(CONFIG.SELECTORS.articles);

        if (articles.length < settings.keepOpen + 1) return;

        // Process all messages except the last N (keep recent ones open)
        const keepOpenCount = Math.max(1, settings.keepOpen);
        for (let i = 0; i < articles.length - keepOpenCount; i++) {
            const msgRow = articles[i];
            const msgId = getMessageId(msgRow);
            processMessage(msgRow, msgId);
        }
    } catch (error) {
        console.error('ChatFocus: Error in foldOldMessages', error);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', async (e) => {
        // Ctrl/Cmd + Shift + E: Expand all
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            expandAllMessages();
        }

        // Ctrl/Cmd + Shift + C: Collapse all
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            collapseAllMessages();
        }

        // Ctrl/Cmd + Shift + T: Toggle extension
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            await toggleExtension();
        }

        // Ctrl/Cmd + Shift + O: Toggle Table of Contents
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
            e.preventDefault();
            toggleTOC();
        }
    });
}

function expandAllMessages() {
    const processed = document.querySelectorAll('.chat-focus-processed.chat-focus-collapsed');
    processed.forEach(msgRow => {
        const label = msgRow.querySelector('.chat-focus-label');
        if (label && msgRow._chatFocusHandlers) {
            msgRow._chatFocusHandlers.expandMessage();
        }
    });
}

function collapseAllMessages() {
    const processed = document.querySelectorAll('.chat-focus-processed:not(.chat-focus-collapsed)');
    processed.forEach(msgRow => {
        const refoldBtn = msgRow.querySelector('.chat-focus-refold-btn');
        if (refoldBtn && msgRow._chatFocusHandlers) {
            msgRow._chatFocusHandlers.collapseMessage();
        }
    });
}

async function toggleExtension() {
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

function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'chat-focus-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('chat-focus-notification-show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('chat-focus-notification-show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ==================== OBSERVER MANAGEMENT ====================
function initObserver() {
    if (observer) {
        observer.disconnect();
    }

    const targetNode = document.body;
    if (!targetNode) {
        console.warn('ChatFocus: document.body not found, retrying...');
        setTimeout(initObserver, 500);
        return;
    }

    const config = {
        childList: true,
        subtree: true,
        attributes: false, // Optimize: don't watch attributes
        characterData: false // Optimize: don't watch text changes
    };

    observer = new MutationObserver((mutationsList) => {
        // Debounce with requestAnimationFrame for better performance
        if (window.foldTimer) {
            cancelAnimationFrame(window.foldTimer);
        }

        window.foldTimer = requestAnimationFrame(() => {
            setTimeout(foldOldMessages, settings.debounceDelay || CONFIG.DEBOUNCE_DELAY);
        });
    });

    try {
        observer.observe(targetNode, config);
        console.log('ChatFocus: Observer initialized');
    } catch (error) {
        console.error('ChatFocus: Error initializing observer', error);
    }
}

function cleanup() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (window.foldTimer) {
        cancelAnimationFrame(window.foldTimer);
        clearTimeout(window.foldTimer);
        window.foldTimer = null;
    }
    // Remove TOC
    const toc = document.getElementById('chat-focus-toc');
    const toggle = document.getElementById('chat-focus-toc-toggle');
    if (toc) toc.remove();
    if (toggle) toggle.remove();

    // Remove floating controls
    const controls = document.getElementById('chat-focus-controls');
    if (controls) controls.remove();
}

// ==================== TABLE OF CONTENTS ====================
let tocVisible = false;
let tocElement = null;
let tocToggle = null;

function createTableOfContents() {
    // Create toggle button
    if (!tocToggle) {
        tocToggle = document.createElement('div');
        tocToggle.id = 'chat-focus-toc-toggle';
        tocToggle.className = 'chat-focus-toc-toggle';
        tocToggle.innerHTML = '📑';
        tocToggle.setAttribute('aria-label', 'Toggle Table of Contents');
        tocToggle.addEventListener('click', toggleTOC);
        document.body.appendChild(tocToggle);
    }

    // Create TOC sidebar
    if (!tocElement) {
        tocElement = document.createElement('div');
        tocElement.id = 'chat-focus-toc';
        tocElement.className = 'chat-focus-toc hidden';

        const header = document.createElement('div');
        header.className = 'chat-focus-toc-header';
        header.innerHTML = `
            <h3 class="chat-focus-toc-title">Table of Contents</h3>
            <button class="chat-focus-toc-close" aria-label="Close">×</button>
        `;

        const content = document.createElement('div');
        content.className = 'chat-focus-toc-content';
        content.id = 'chat-focus-toc-content';

        tocElement.appendChild(header);
        tocElement.appendChild(content);

        header.querySelector('.chat-focus-toc-close').addEventListener('click', () => {
            toggleTOC();
        });

        document.body.appendChild(tocElement);
    }
}

function toggleTOC() {
    tocVisible = !tocVisible;
    if (tocElement) {
        tocElement.classList.toggle('hidden', !tocVisible);
    }
    if (tocToggle) {
        tocToggle.classList.toggle('hidden', tocVisible);
    }
    if (tocVisible) {
        updateTableOfContents();
    }
}

function updateTableOfContents() {
    if (!tocElement || !tocVisible) return;

    const content = document.getElementById('chat-focus-toc-content');
    if (!content) return;

    // Get all processed messages
    const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));
    const tocItems = messages
        .map(msg => msg._chatFocusData)
        .filter(data => data && data.element);

    if (tocItems.length === 0) {
        content.innerHTML = '<div style="padding: 20px; text-align: center; color: #8e8ea0; font-size: 13px;">No messages yet</div>';
        return;
    }

    // Build TOC HTML
    content.innerHTML = tocItems.map((data, index) => {
        const displayText = data.summary || data.previewText || 'Message';
        const typeClass = data.type === 'user' ? 'user' : 'ai';
        return `
            <div class="chat-focus-toc-item" data-msg-id="${data.id}" data-index="${index}">
                <div class="chat-focus-toc-item-type ${typeClass}"></div>
                <div class="chat-focus-toc-item-text">${escapeHtml(displayText)}</div>
            </div>
        `;
    }).join('');

    // Add click handlers
    content.querySelectorAll('.chat-focus-toc-item').forEach(item => {
        item.addEventListener('click', () => {
            const msgId = item.getAttribute('data-msg-id');
            const msgData = tocItems.find(d => d.id === msgId);
            if (msgData && msgData.element) {
                // Scroll to message
                msgData.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Expand if collapsed
                if (msgData.element.classList.contains('chat-focus-collapsed')) {
                    const label = msgData.element.querySelector('.chat-focus-label');
                    if (label && msgData.element._chatFocusHandlers) {
                        msgData.element._chatFocusHandlers.expandMessage();
                    }
                }

                // Highlight active item
                content.querySelectorAll('.chat-focus-toc-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');

                // Update active item on scroll
                updateActiveTOCItem();
            }
        });
    });

    updateActiveTOCItem();
}

function updateActiveTOCItem() {
    if (!tocElement || !tocVisible) return;

    const content = document.getElementById('chat-focus-toc-content');
    if (!content) return;

    const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));
    const viewportTop = window.scrollY + 100;

    let activeIndex = -1;
    messages.forEach((msg, index) => {
        const rect = msg.getBoundingClientRect();
        if (rect.top <= viewportTop && rect.bottom >= viewportTop) {
            activeIndex = index;
        }
    });

    content.querySelectorAll('.chat-focus-toc-item').forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

// ==================== FLOATING CONTROL WIDGET ====================
function createFloatingControls() {
    // Remove existing controls if any
    const existing = document.getElementById('chat-focus-controls');
    if (existing) existing.remove();

    const controls = document.createElement('div');
    controls.id = 'chat-focus-controls';
    controls.className = 'chat-focus-controls';

    // Expand All button
    const expandBtn = createControlButton('expand', 'Expand All', () => {
        expandAllMessages();
    });

    // Collapse All button
    const collapseBtn = createControlButton('collapse', 'Collapse All', () => {
        collapseAllMessages();
    });

    // TOC button
    const tocBtn = createControlButton('toc', 'Table of Contents', () => {
        toggleTOC();
    });

    // Toggle Extension button
    const toggleBtn = createControlButton('toggle', 'Toggle Extension', async () => {
        await toggleExtension();
    });

    controls.appendChild(expandBtn);
    controls.appendChild(collapseBtn);
    controls.appendChild(tocBtn);
    controls.appendChild(toggleBtn);

    document.body.appendChild(controls);

    // Show controls with animation
    setTimeout(() => {
        controls.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 100);
}

function createControlButton(type, tooltip, onClick) {
    const btn = document.createElement('button');
    btn.className = `chat-focus-control-btn ${type}`;
    btn.setAttribute('aria-label', tooltip);
    btn.setAttribute('type', 'button');

    const tooltipEl = document.createElement('span');
    tooltipEl.className = 'tooltip';
    tooltipEl.textContent = tooltip;
    btn.appendChild(tooltipEl);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
    });

    return btn;
}

// ==================== INITIALIZATION ====================
async function init() {
    try {
        await loadSettings();

        if (!isEnabled) {
            console.log('ChatFocus: Extension is disabled');
            return;
        }

        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    initObserver();
                    foldOldMessages();
                }, CONFIG.INIT_DELAY);
            });
        } else {
            setTimeout(() => {
                initObserver();
                foldOldMessages();
            }, CONFIG.INIT_DELAY);
        }

        setupKeyboardShortcuts();

        // Initialize Table of Contents
        createTableOfContents();

        // Initialize floating control widget
        createFloatingControls();

        // Update active TOC item on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveTOCItem, 100);
        }, { passive: true });

        // Listen for settings changes
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.enabled) {
                isEnabled = changes.enabled.newValue;
                if (isEnabled) {
                    foldOldMessages();
                } else {
                    expandAllMessages();
                }
            }
            if (changes.keepOpen) {
                settings.keepOpen = changes.keepOpen.newValue;
                // Reprocess all messages
                document.querySelectorAll('.chat-focus-processed').forEach(el => {
                    el.classList.remove('chat-focus-processed');
                });
                foldOldMessages();
            }
            if (changes.previewLength) {
                settings.previewLength = changes.previewLength.newValue;
            }
        });

        // Listen for messages from popup/background
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'toggle') {
                isEnabled = message.enabled;
                settings.enabled = message.enabled;
                if (isEnabled) {
                    foldOldMessages();
                } else {
                    expandAllMessages();
                }
                sendResponse({ success: true });
            } else if (message.action === 'expandAll') {
                expandAllMessages();
                sendResponse({ success: true });
            } else if (message.action === 'collapseAll') {
                collapseAllMessages();
                sendResponse({ success: true });
            } else if (message.action === 'settingsUpdated') {
                if (message.settings) {
                    Object.assign(settings, message.settings);
                    isEnabled = settings.enabled;
                }
                // Reprocess messages with new settings
                document.querySelectorAll('.chat-focus-processed').forEach(el => {
                    el.classList.remove('chat-focus-processed');
                });
                foldOldMessages();
                sendResponse({ success: true });
            }
            return true; // Keep channel open for async response
        });

        console.log('ChatFocus: Extension loaded successfully');
    } catch (error) {
        console.error('ChatFocus: Initialization error', error);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Initialize
init();