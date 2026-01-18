/**
 * ChatFocus - Message Processing
 * Handles message detection, preview extraction, and type determination
 */

import { CONFIG } from '../../core/config.js';
import { safeQuerySelector } from '../../core/utils.js';

export function extractPreviewText(msgRow, settings) {
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

export function extractFullText(msgRow) {
    for (const selector of CONFIG.SELECTORS.textContent) {
        const textDiv = safeQuerySelector([selector], msgRow);
        if (textDiv) {
            const text = textDiv.innerText || textDiv.textContent || '';
            if (text.trim()) return text.trim();
        }
    }
    return "";
}

export function determineMessageType(msgRow) {
    // Try to detect from DOM attributes
    for (const selector of CONFIG.SELECTORS.authorRole) {
        const authorNode = safeQuerySelector([selector], msgRow);
        if (authorNode) {
            const role = authorNode.getAttribute('data-message-author-role') ||
                authorNode.getAttribute('data-author-role') ||
                authorNode.getAttribute('role') || '';

            if (role.toLowerCase().includes('user')) {
                return 'user';
            }
            if (role.toLowerCase().includes('assistant') || role.toLowerCase().includes('ai')) {
                return 'ai';
            }
        }
    }

    // Check classes
    const classes = msgRow.className.toLowerCase();
    if (classes.includes('user')) return 'user';
    if (classes.includes('assistant')) return 'ai';

    // Check for avatar or icon indicators
    const avatar = msgRow.querySelector('img[alt*="user" i], [data-testid*="user" i]');
    if (avatar) return 'user';

    const aiAvatar = msgRow.querySelector('img[alt*="assistant" i], [data-testid*="assistant" i], [data-testid*="ai" i]');
    if (aiAvatar) return 'ai';

    return 'unknown';
}

export function determineFirstMessageType(articles) {
    if (articles.length === 0) return 'user';

    const firstType = determineMessageType(articles[0]);
    if (firstType !== 'unknown') return firstType;

    // Default assumption: first message is from user
    return 'user';
}
