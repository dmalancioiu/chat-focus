import { ICONS } from '../../core/icons.js';

let isAllExpanded = false;

export function toggleExpandCollapseAll() {
    isAllExpanded ? collapseAllMessages() : expandAllMessages();
}

export function expandAllMessages() {
    document.querySelectorAll('.chat-focus-processed.chat-focus-collapsed').forEach(row => {
        row._chatFocusHandlers?.expandMessage();
    });
    isAllExpanded = true;
    updateToggleButton();
}

export function collapseAllMessages() {
    const messages = Array.from(document.querySelectorAll('.chat-focus-processed:not(.chat-focus-collapsed)'));
    if (messages.length > 0) messages.pop(); // Keep last open

    messages.forEach(row => {
        row._chatFocusHandlers?.collapseMessage();
    });
    isAllExpanded = false;
    updateToggleButton();
}

export function checkExpandCollapseState() {
    const collapsed = document.querySelectorAll('.chat-focus-processed.chat-focus-collapsed').length;
    const expanded = document.querySelectorAll('.chat-focus-processed:not(.chat-focus-collapsed)').length;
    isAllExpanded = expanded > collapsed;
    updateToggleButton();
}

function updateToggleButton() {
    const btn = document.querySelector('.chat-focus-controls-btn.toggle-expand');
    if (!btn) return;

    btn.innerHTML = isAllExpanded ? ICONS.collapse : ICONS.expand;
    btn.ariaLabel = isAllExpanded ? 'Collapse All' : 'Expand All';
}