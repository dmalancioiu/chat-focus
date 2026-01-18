/**
 * ChatFocus - Core Utilities
 * Shared utility functions
 */

export function safeQuerySelector(selectors, parent = document) {
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

export function safeQuerySelectorAll(selectors, parent = document) {
    for (const selector of selectors) {
        try {
            const elements = Array.from(parent.querySelectorAll(selector));
            if (elements.length > 0) return elements;
        } catch (e) {
            console.warn(`ChatFocus: Invalid selector "${selector}"`, e);
        }
    }
    return [];
}

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function getMessageId(msgRow) {
    const idAttr = msgRow.getAttribute('data-message-id') ||
        msgRow.getAttribute('id') ||
        msgRow.getAttribute('data-id');
    if (idAttr) return idAttr;

    const content = msgRow.textContent?.substring(0, 50) || '';
    return `msg_${content.length}_${Date.now()}`;
}
