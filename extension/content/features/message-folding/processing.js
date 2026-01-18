import { CONFIG } from '../../core/config.js';
import { safeQuerySelector, safeQuerySelectorAll } from '../../core/utils.js';

export function extractPreviewText(msgRow) {
    let previewText = "Collapsed Message";
    for (const selector of CONFIG.SELECTORS.textContent) {
        const textDiv = safeQuerySelector([selector], msgRow);
        if (textDiv) {
            const text = textDiv.innerText || textDiv.textContent || '';
            if (text.trim()) {
                previewText = text.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").trim();
                break;
            }
        }
    }
    return previewText.substring(0, 85) + (previewText.length > 85 ? "..." : "");
}

// export function extractFullText(msgRow) {
//     for (const selector of CONFIG.SELECTORS.textContent) {
//         const textDiv = safeQuerySelector([selector], msgRow);
//         if (textDiv && textDiv.textContent.trim()) return textDiv.textContent.trim();
//     }
//     return "";
// }

export function determineMessageType(msgRow) {
    // Use adapter-specific detection if available
    if (CONFIG.ADAPTER && CONFIG.ADAPTER.detectMessageType) {
        const type = CONFIG.ADAPTER.detectMessageType(msgRow);
        if (type !== 'unknown') return type;
    }

    // Fallback to generic detection
    // 1. Try Author Role attributes
    for (const selector of CONFIG.SELECTORS.authorRole) {
        const authorNode = safeQuerySelector([selector], msgRow);
        if (authorNode) {
            const role = (authorNode.getAttribute('data-message-author-role') ||
                authorNode.getAttribute('role') || '').toLowerCase();
            if (role.includes('user')) return 'user';
            if (role.includes('assistant') || role.includes('ai')) return 'ai';
        }
    }
    // 2. Fallback to classes
    const classes = msgRow.className.toLowerCase();
    if (classes.includes('user')) return 'user';
    if (classes.includes('assistant')) return 'ai';

    // 3. Fallback to icons
    if (msgRow.querySelector('img[alt*="user" i]')) return 'user';
    if (msgRow.querySelector('img[alt*="assistant" i]')) return 'ai';

    return 'unknown';
}

export function determineFirstMessageType(articles) {
    if (articles.length === 0) return 'user';
    const firstType = determineMessageType(articles[0]);
    return firstType !== 'unknown' ? firstType : 'user';
}

export function getMessageId(msgRow) {
    return msgRow.getAttribute('data-message-id') ||
        msgRow.getAttribute('id') ||
        `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}