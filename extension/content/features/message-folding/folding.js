/**
 * ChatFocus - Message Folding
 * Handles message collapse/expand functionality
 */

import { state } from '../../core/state.js';
import { CONFIG } from '../../core/config.js';
import { escapeHtml, getMessageId, safeQuerySelectorAll } from '../../core/utils.js';
import { extractPreviewText, extractFullText, determineMessageType, determineFirstMessageType } from './processing.js';
import { saveMessageState } from '../../storage/settings.js';

// Forward declarations for functions that will be imported from other modules
let updateTableOfContents;
let checkExpandCollapseState;
let updateCodeModeClasses;

export function setDependencies(deps) {
    updateTableOfContents = deps.updateTableOfContents;
    checkExpandCollapseState = deps.checkExpandCollapseState;
    updateCodeModeClasses = deps.updateCodeModeClasses;
}

export function processMessage(msgRow, msgId, turnIndex, shouldCollapse = true, msgType = null) {
    try {
        if (msgRow.classList.contains('chat-focus-processed')) return;

        // If type not provided, try to determine it (fallback)
        if (!msgType) {
            msgType = determineMessageType(msgRow);
        }

        const isUser = msgType === 'user';
        const previewText = extractPreviewText(msgRow, state.settings);

        msgRow.classList.add('chat-focus-processed');

        // Store turn index as data attribute
        msgRow.setAttribute('data-turn-index', turnIndex);

        // Check saved state first, then use shouldCollapse parameter
        const wasExpanded = state.messageStates.get(msgId);
        if (wasExpanded === true) {
            // User explicitly expanded this before, keep it expanded
            shouldCollapse = false;
        } else if (wasExpanded === false) {
            // User explicitly collapsed this before, keep it collapsed
            shouldCollapse = true;
        }

        // Add type-specific class (for styling only)
        if (isUser) {
            msgRow.classList.add('chat-focus-user-collapsed');
        } else {
            msgRow.classList.add('chat-focus-ai-collapsed');
        }

        // Apply collapsed state if needed
        if (shouldCollapse) {
            msgRow.classList.add('chat-focus-collapsed');
        }

        // Create fold bar label
        const label = document.createElement('div');
        label.className = 'chat-focus-label';
        label.setAttribute('role', 'button');
        label.setAttribute('tabindex', '0');
        label.setAttribute('aria-label', `${isUser ? 'User' : 'AI'} message, turn ${turnIndex}. Click to expand: ${previewText}`);
        label.innerHTML = `
            <span class="chat-focus-icon"></span>
            <span class="chat-focus-text">${escapeHtml(previewText)}</span>
            <span class="chat-focus-turn-index">#${turnIndex}</span>
        `;

        // Show label only if message is collapsed
        if (!shouldCollapse) {
            label.style.display = 'none';
        }

        msgRow.prepend(label);

        // Create refold button
        const refoldBtn = document.createElement('div');
        refoldBtn.className = 'chat-focus-refold-btn';
        refoldBtn.setAttribute('role', 'button');
        refoldBtn.setAttribute('tabindex', '0');
        refoldBtn.setAttribute('aria-label', 'Collapse this message');
        refoldBtn.setAttribute('title', 'Fold');
        refoldBtn.textContent = 'Fold';
        msgRow.appendChild(refoldBtn);

        // Store message data
        const fullText = extractFullText(msgRow);
        msgRow._chatFocusData = {
            id: msgId,
            type: msgType,
            previewText: previewText,
            fullText: fullText,
            element: msgRow,
            turnIndex: turnIndex
        };

        if (updateTableOfContents) updateTableOfContents();

        // Event handlers
        const expandMessage = (e) => {
            e?.stopPropagation();
            msgRow.classList.remove('chat-focus-collapsed');
            label.style.display = 'none';
            saveMessageState(msgId, true);
            if (checkExpandCollapseState) checkExpandCollapseState();

            // Update code mode classes if in code mode
            if (state.isCodeMode && updateCodeModeClasses) {
                updateCodeModeClasses();
            }
        };

        const collapseMessage = (e) => {
            e?.stopPropagation();
            msgRow.classList.add('chat-focus-collapsed');
            label.style.display = 'flex';
            saveMessageState(msgId, false);
            if (checkExpandCollapseState) checkExpandCollapseState();

            // Update code mode classes if in code mode
            if (state.isCodeMode && updateCodeModeClasses) {
                updateCodeModeClasses();
            }
        };

        label.addEventListener('click', expandMessage);
        refoldBtn.addEventListener('click', collapseMessage);

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

        msgRow._chatFocusHandlers = { expandMessage, collapseMessage };

        // Add double-click to collapse/expand
        msgRow.addEventListener('dblclick', (e) => {
            // Don't trigger if double-clicking on buttons, links, or inputs
            if (e.target.closest('button, a, input, textarea, select, .chat-focus-label, .chat-focus-refold-btn')) {
                return;
            }

            const isCollapsed = msgRow.classList.contains('chat-focus-collapsed');
            if (isCollapsed) {
                expandMessage(e);
            } else {
                collapseMessage(e);
            }
        });
    } catch (error) {
        console.error('ChatFocus: Error processing message', error);
    }
}

export function foldOldMessages() {
    if (!state.isEnabled) return;

    try {
        const articles = safeQuerySelectorAll(CONFIG.SELECTORS.articles);
        if (articles.length === 0) return;

        const keepOpenCount = Math.max(1, state.settings.keepOpen);

        // Determine first message type, then alternate
        const firstType = determineFirstMessageType(articles);

        // Process ALL messages so they all have handlers
        articles.forEach((msgRow, index) => {
            const msgId = getMessageId(msgRow);
            const turnIndex = index + 1;
            const shouldCollapse = index < articles.length - keepOpenCount;

            // Alternate message types: if first is 'user', pattern is user, ai, user, ai...
            // If first is 'ai', pattern is ai, user, ai, user...
            let msgType;
            if (firstType === 'user') {
                msgType = index % 2 === 0 ? 'user' : 'ai';
            } else {
                msgType = index % 2 === 0 ? 'ai' : 'user';
            }

            processMessage(msgRow, msgId, turnIndex, shouldCollapse, msgType);
        });

        // Update toggle button state after processing
        if (checkExpandCollapseState) checkExpandCollapseState();

        // Update code mode classes if code mode is active
        if (state.isCodeMode && updateCodeModeClasses) {
            updateCodeModeClasses();
        }
    } catch (error) {
        console.error('ChatFocus: Error in foldOldMessages', error);
    }
}
