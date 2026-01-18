import { CONFIG } from '../../core/config.js';
import { tocSearchQuery } from '../../core/state.js';

export function highlightSearchTerm(element, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return;
    clearSearchHighlights(element);

    CONFIG.SELECTORS.textContent.forEach(selector => {
        element.querySelectorAll(selector).forEach(el => highlightInElement(el, searchTerm));
    });

    const firstHighlight = element.querySelector('.chat-focus-highlight');
    if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function highlightInElement(element, searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];
    let node;

    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(searchLower)) nodesToReplace.push(node);
    }

    nodesToReplace.forEach(node => {
        const text = node.textContent;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let index = text.toLowerCase().indexOf(searchLower);

        while (index !== -1) {
            if (index > lastIndex) fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
            const mark = document.createElement('mark');
            mark.className = 'chat-focus-highlight';
            mark.textContent = text.substring(index, index + searchTerm.length);
            fragment.appendChild(mark);
            lastIndex = index + searchTerm.length;
            index = text.toLowerCase().indexOf(searchLower, lastIndex);
        }
        if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        node.parentNode.replaceChild(fragment, node);
    });
}

export function clearSearchHighlights(element) {
    element.querySelectorAll('.chat-focus-highlight').forEach(highlight => {
        const text = document.createTextNode(highlight.textContent);
        highlight.parentNode.replaceChild(text, highlight);
    });
    element.normalize();
}

export function clearAllSearchHighlights() {
    document.querySelectorAll('.chat-focus-processed').forEach(msg => clearSearchHighlights(msg));
}

export function updateSearchResultCount(count) {
    const searchContainer = document.querySelector('.chat-focus-toc-search');
    if (!searchContainer) return;

    let badge = searchContainer.querySelector('.chat-focus-search-count');
    if (!badge && tocSearchQuery.value) {
        badge = document.createElement('div');
        badge.className = 'chat-focus-search-count';
        searchContainer.appendChild(badge);
    }

    if (badge) {
        if (!tocSearchQuery.value) {
            badge.remove();
        } else {
            badge.textContent = count === 0 ? 'No matches found' : `${count} result${count === 1 ? '' : 's'}`;
            badge.style.color = count === 0 ? 'var(--cf-color-text-tertiary)' : 'var(--cf-color-accent)';
        }
    }
}