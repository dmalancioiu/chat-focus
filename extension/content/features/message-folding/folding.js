import { CONFIG } from '../../core/config.js';
import { messageStates, pinnedMessages, isCodeMode } from '../../core/state.js';
import { settings, saveMessageState, togglePinnedMessage } from '../../storage/settings.js';
import { escapeHtml, safeQuerySelectorAll } from '../../core/utils.js';
import { determineMessageType, determineFirstMessageType, extractPreviewText, getMessageId } from './processing.js';
import { updateTableOfContents } from '../table-of-contents/toc.js';
import { checkExpandCollapseState } from '../controls/actions.js';
import { updateCodeModeClasses } from '../code-mode/code-mode.js';
import { ICONS } from '../../core/icons.js';
import { updateStats } from '../stats/stats.js';

export function processMessage(msgRow, msgId, turnIndex, shouldCollapse = true, msgType = null) {
    try {
        if (msgRow.classList.contains('chat-focus-processed')) return;

        // Determine type if not provided
        if (!msgType) {
            msgType = determineMessageType(msgRow);
        }

        const isUser = msgType === 'user';
        const previewText = extractPreviewText(msgRow);

        msgRow.classList.add('chat-focus-processed');
        msgRow.setAttribute('data-turn-index', turnIndex);

        // Check if message is pinned
        const isPinned = pinnedMessages.has(msgId);

        // check saved state
        const wasExpanded = messageStates.get(msgId);
        if (isPinned) {
            // Pinned messages are always expanded
            shouldCollapse = false;
        } else if (wasExpanded === true) {
            shouldCollapse = false;
        } else if (wasExpanded === false) {
            shouldCollapse = true;
        }

        // Apply classes
        if (isUser) msgRow.classList.add('chat-focus-user-collapsed');
        else msgRow.classList.add('chat-focus-ai-collapsed');

        if (shouldCollapse) msgRow.classList.add('chat-focus-collapsed');
        if (isPinned) msgRow.classList.add('chat-focus-pinned');

        // Create UI elements
        const label = createFoldLabel(isUser, turnIndex, previewText, shouldCollapse);
        const refoldBtn = createRefoldBtn();
        const pinBtn = createPinBtn(isPinned);

        msgRow.prepend(label);
        msgRow.appendChild(pinBtn);
        msgRow.appendChild(refoldBtn);

        // Store data for other modules
        msgRow._chatFocusData = {
            id: msgId,
            type: msgType,
            previewText: previewText,
            //fullText: extractFullText(msgRow),
            element: msgRow,
            turnIndex: turnIndex
        };

        //updateTableOfContents();

        // Bind Events
        const handlers = createEventHandlers(msgRow, label, msgId, pinBtn);
        label.addEventListener('click', handlers.expandMessage);
        refoldBtn.addEventListener('click', handlers.collapseMessage);
        pinBtn.addEventListener('click', handlers.togglePin);

        // Keyboard support
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlers.expandMessage(e);
            }
        });
        refoldBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlers.collapseMessage(e);
            }
        });
        pinBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlers.togglePin(e);
            }
        });

        // Double click support
        msgRow.addEventListener('dblclick', (e) => {
            if (e.target.closest('button, a, input, textarea, select, .chat-focus-label, .chat-focus-refold-btn')) return;
            msgRow.classList.contains('chat-focus-collapsed') ? handlers.expandMessage(e) : handlers.collapseMessage(e);
        });

        msgRow._chatFocusHandlers = handlers;

    } catch (error) {
        console.error('ChatFocus: Error processing message', error);
    }
}

function createFoldLabel(isUser, turnIndex, previewText, isCollapsed) {
    const label = document.createElement('div');
    label.className = 'chat-focus-label';
    label.setAttribute('role', 'button');
    label.setAttribute('tabindex', '0');
    label.style.display = isCollapsed ? 'flex' : 'none';
    label.innerHTML = `
        <span class="chat-focus-icon"></span>
        <span class="chat-focus-text">${escapeHtml(previewText)}</span>
        <span class="chat-focus-turn-index">#${turnIndex}</span>
    `;
    return label;
}

function createRefoldBtn() {
    const btn = document.createElement('div');
    btn.className = 'chat-focus-refold-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.textContent = 'Fold';
    return btn;
}

function createPinBtn(isPinned) {
    const btn = document.createElement('button');
    btn.className = 'chat-focus-pin-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', isPinned ? 'Unpin message' : 'Pin message');
    btn.innerHTML = isPinned ? ICONS.pinFilled : ICONS.pin;
    if (isPinned) {
        btn.classList.add('pinned');
    }
    return btn;
}

function createEventHandlers(msgRow, label, msgId, pinBtn) {
    return {
        expandMessage: (e) => {
            e?.stopPropagation();
            // Can't collapse pinned messages
            if (pinnedMessages.has(msgId)) return;

            msgRow.classList.remove('chat-focus-collapsed');
            label.style.display = 'none';
            saveMessageState(msgId, true);
            checkExpandCollapseState();
            if (isCodeMode.value) updateCodeModeClasses();
        },
        collapseMessage: (e) => {
            e?.stopPropagation();
            // Can't collapse pinned messages
            if (pinnedMessages.has(msgId)) return;

            msgRow.classList.add('chat-focus-collapsed');
            label.style.display = 'flex';
            saveMessageState(msgId, false);
            checkExpandCollapseState();
            if (isCodeMode.value) updateCodeModeClasses();
        },
        togglePin: async (e) => {
            e?.stopPropagation();
            const isPinned = await togglePinnedMessage(msgId);

            // Update button appearance
            pinBtn.innerHTML = isPinned ? ICONS.pinFilled : ICONS.pin;
            pinBtn.setAttribute('aria-label', isPinned ? 'Unpin message' : 'Pin message');
            pinBtn.classList.toggle('pinned', isPinned);

            // Update message state
            msgRow.classList.toggle('chat-focus-pinned', isPinned);

            if (isPinned) {
                // Expand pinned message
                msgRow.classList.remove('chat-focus-collapsed');
                label.style.display = 'none';
            }

            // Update TOC to reorder pinned messages
            updateTableOfContents();
            updateStats();
            checkExpandCollapseState();
        }
    };
}

export function foldOldMessages() {
    if (!settings.enabled) return;

    // Use adapter-specific getMessages if available
    let articles;
    if (CONFIG.ADAPTER && CONFIG.ADAPTER.getMessages) {
        articles = CONFIG.ADAPTER.getMessages();
    } else {
        articles = safeQuerySelectorAll(CONFIG.SELECTORS.articles);
    }

    if (articles.length === 0) {
        return;
    }

    // Check if all messages are already processed
    const unprocessedMessages = articles.filter(msg => !msg.classList.contains('chat-focus-processed'));
    if (unprocessedMessages.length === 0) {
        return; // Nothing to do
    }

    // Only log when we have new messages to process
    if (unprocessedMessages.length > 0) {
        console.log(`ChatFocus: Processing ${unprocessedMessages.length} new message(s)`);
    }

    const keepOpenCount = Math.max(1, settings.keepOpen);
    const firstType = determineFirstMessageType(articles);

    articles.forEach((msgRow, index) => {
        const msgId = getMessageId(msgRow);
        const turnIndex = index + 1;
        const shouldCollapse = index < articles.length - keepOpenCount;

        // Alternating logic
        let msgType;
        if (firstType === 'user') msgType = index % 2 === 0 ? 'user' : 'ai';
        else msgType = index % 2 === 0 ? 'ai' : 'user';

        processMessage(msgRow, msgId, turnIndex, shouldCollapse, msgType);
    });

    updateTableOfContents();
    updateStats();

    checkExpandCollapseState();
    if (isCodeMode.value) updateCodeModeClasses();
}