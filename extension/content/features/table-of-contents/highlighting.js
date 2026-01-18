/**
 * ChatFocus - Search Highlighting
 * Handles search term highlighting (Ctrl+F style)
 */

import { CONFIG } from '../../core/config.js';

export function highlightSearchTerm(element, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return;

    // Remove any existing highlights first
    clearSearchHighlights(element);

    // Find all text nodes and highlight matching terms
    const textContent = CONFIG.SELECTORS.textContent;
    for (const selector of textContent) {
        const contentElements = element.querySelectorAll(selector);

        contentElements.forEach(contentEl => {
            highlightInElement(contentEl, searchTerm);
        });
    }

    // Scroll to first highlight (centered for better visibility of the highlighted term)
    const firstHighlight = element.querySelector('.chat-focus-highlight');
    if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function highlightInElement(element, searchTerm) {
    const searchLower = searchTerm.toLowerCase();

    // Walk through text nodes
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const nodesToReplace = [];
    let node;

    while (node = walker.nextNode()) {
        const text = node.textContent;
        const textLower = text.toLowerCase();

        if (textLower.includes(searchLower)) {
            nodesToReplace.push(node);
        }
    }

    // Replace text nodes with highlighted versions
    nodesToReplace.forEach(node => {
        const text = node.textContent;
        const textLower = text.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let index = textLower.indexOf(searchLower);

        while (index !== -1) {
            // Add text before match
            if (index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(text.substring(lastIndex, index))
                );
            }

            // Add highlighted match
            const mark = document.createElement('mark');
            mark.className = 'chat-focus-highlight';
            mark.textContent = text.substring(index, index + searchTerm.length);
            fragment.appendChild(mark);

            lastIndex = index + searchTerm.length;
            index = textLower.indexOf(searchLower, lastIndex);
        }

        // Add remaining text
        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(text.substring(lastIndex))
            );
        }

        node.parentNode.replaceChild(fragment, node);
    });
}

export function clearSearchHighlights(element) {
    const highlights = element.querySelectorAll('.chat-focus-highlight');
    highlights.forEach(highlight => {
        const text = document.createTextNode(highlight.textContent);
        highlight.parentNode.replaceChild(text, highlight);
    });

    // Normalize to merge adjacent text nodes
    element.normalize();
}

export function clearAllSearchHighlights() {
    const allMessages = document.querySelectorAll('.chat-focus-processed');
    allMessages.forEach(msg => clearSearchHighlights(msg));
}
