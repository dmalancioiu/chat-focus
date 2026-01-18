// /**
//  * ChatFocus - Modern UI Redesign
//  * Clean, accessible UI augmentation for ChatGPT
//  */

// // ==================== CONFIGURATION ====================
// const CONFIG = {
//     DEFAULT_KEEP_OPEN: 1,
//     DEFAULT_ENABLED: true,
//     DEFAULT_PREVIEW_LENGTH: 85,
//     DEBOUNCE_DELAY: 500,
//     INIT_DELAY: 1000,
//     SELECTORS: {
//         articles: ['article', '[data-message-id]', '[role="article"]'],
//         authorRole: ['[data-message-author-role]', '[data-author-role]', '[role]'],
//         textContent: ['.markdown', '.whitespace-pre-wrap', '[data-message-content]', 'p']
//     }
// };

// // SVG Icons
// const ICONS = {
//     expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>`,
//     collapse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>`,
//     list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
//     code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
//     search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
//     close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
//     settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
// };

// // ==================== STATE MANAGEMENT ====================
// let observer = null;
// let settings = { ...CONFIG };
// let messageStates = new Map();
// let isEnabled = true;
// let saveStateTimeout;
// let tocVisible = false;
// let tocSearchQuery = '';
// let controlsPosition = null;

// // ==================== UTILITY FUNCTIONS ====================
// function safeQuerySelector(selectors, parent = document) {
//     for (const selector of selectors) {
//         try {
//             const element = parent.querySelector(selector);
//             if (element) return element;
//         } catch (e) {
//             console.warn(`ChatFocus: Invalid selector "${selector}"`, e);
//         }
//     }
//     return null;
// }

// function safeQuerySelectorAll(selectors, parent = document) {
//     for (const selector of selectors) {
//         try {
//             const elements = Array.from(parent.querySelectorAll(selector));
//             if (elements.length > 0) return elements;
//         } catch (e) {
//             console.warn(`ChatFocus: Invalid selector "${selector}"`, e);
//         }
//     }
//     return [];
// }

// function escapeHtml(text) {
//     const div = document.createElement('div');
//     div.textContent = text;
//     return div.innerHTML;
// }

// function getMessageId(msgRow) {
//     const idAttr = msgRow.getAttribute('data-message-id') ||
//         msgRow.getAttribute('id') ||
//         msgRow.getAttribute('data-id');
//     if (idAttr) return idAttr;

//     const content = msgRow.textContent?.substring(0, 50) || '';
//     return `msg_${content.length}_${Date.now()}`;
// }

// // ==================== SETTINGS MANAGEMENT ====================
// async function loadSettings() {
//     try {
//         const syncData = await chrome.storage.sync.get(['enabled', 'keepOpen', 'previewLength']);
//         settings.enabled = syncData.enabled !== undefined ? syncData.enabled : CONFIG.DEFAULT_ENABLED;
//         settings.keepOpen = syncData.keepOpen || CONFIG.DEFAULT_KEEP_OPEN;
//         settings.previewLength = syncData.previewLength || CONFIG.DEFAULT_PREVIEW_LENGTH;

//         const localData = await chrome.storage.local.get(['messageStates', 'tocVisible', 'controlsPosition']);
//         if (localData.messageStates) {
//             messageStates = new Map(Object.entries(localData.messageStates));
//         }
//         if (localData.tocVisible !== undefined) {
//             tocVisible = localData.tocVisible;
//         }
//         if (localData.controlsPosition) {
//             controlsPosition = localData.controlsPosition;
//         }

//         isEnabled = settings.enabled;
//     } catch (error) {
//         console.error('ChatFocus: Error loading settings', error);
//     }
// }

// async function saveSettings() {
//     try {
//         await chrome.storage.sync.set({
//             enabled: settings.enabled,
//             keepOpen: settings.keepOpen,
//             previewLength: settings.previewLength
//         });
//     } catch (error) {
//         console.error('ChatFocus: Error saving settings', error);
//     }
// }

// function saveMessageState(msgId, isExpanded) {
//     messageStates.set(msgId, isExpanded);
//     clearTimeout(saveStateTimeout);
//     saveStateTimeout = setTimeout(async () => {
//         try {
//             await chrome.storage.local.set({
//                 messageStates: Object.fromEntries(messageStates)
//             });
//         } catch (error) {
//             console.error('ChatFocus: Error saving message state', error);
//         }
//     }, 1000);
// }

// async function saveTocState() {
//     try {
//         await chrome.storage.local.set({ tocVisible });
//     } catch (error) {
//         console.error('ChatFocus: Error saving TOC state', error);
//     }
// }

// async function saveControlsPosition(position) {
//     try {
//         await chrome.storage.local.set({ controlsPosition: position });
//     } catch (error) {
//         console.error('ChatFocus: Error saving controls position', error);
//     }
// }

// // ==================== MESSAGE PROCESSING ====================
// function extractPreviewText(msgRow) {
//     let previewText = "Collapsed Message";
//     for (const selector of CONFIG.SELECTORS.textContent) {
//         const textDiv = safeQuerySelector([selector], msgRow);
//         if (textDiv) {
//             const text = textDiv.innerText || textDiv.textContent || '';
//             if (text.trim()) {
//                 previewText = text
//                     .replace(/[\n\r]+/g, " ")
//                     .replace(/\s+/g, " ")
//                     .trim()
//                     .substring(0, settings.previewLength);
//                 if (text.length > settings.previewLength) {
//                     previewText += "...";
//                 }
//                 break;
//             }
//         }
//     }
//     return previewText;
// }

// function extractFullText(msgRow) {
//     for (const selector of CONFIG.SELECTORS.textContent) {
//         const textDiv = safeQuerySelector([selector], msgRow);
//         if (textDiv) {
//             const text = textDiv.innerText || textDiv.textContent || '';
//             if (text.trim()) return text.trim();
//         }
//     }
//     return "";
// }

// function determineMessageType(msgRow) {
//     // Try to detect from DOM attributes
//     for (const selector of CONFIG.SELECTORS.authorRole) {
//         const authorNode = safeQuerySelector([selector], msgRow);
//         if (authorNode) {
//             const role = authorNode.getAttribute('data-message-author-role') ||
//                 authorNode.getAttribute('data-author-role') ||
//                 authorNode.getAttribute('role') || '';

//             if (role.toLowerCase().includes('user')) {
//                 return 'user';
//             }
//             if (role.toLowerCase().includes('assistant') || role.toLowerCase().includes('ai')) {
//                 return 'ai';
//             }
//         }
//     }

//     // Check classes
//     const classes = msgRow.className.toLowerCase();
//     if (classes.includes('user')) return 'user';
//     if (classes.includes('assistant')) return 'ai';

//     // Check for avatar or icon indicators
//     const avatar = msgRow.querySelector('img[alt*="user" i], [data-testid*="user" i]');
//     if (avatar) return 'user';

//     const aiAvatar = msgRow.querySelector('img[alt*="assistant" i], [data-testid*="assistant" i], [data-testid*="ai" i]');
//     if (aiAvatar) return 'ai';

//     return 'unknown';
// }

// function determineFirstMessageType(articles) {
//     // Try to determine the first message type
//     if (articles.length === 0) return 'user';

//     const firstType = determineMessageType(articles[0]);
//     if (firstType !== 'unknown') return firstType;

//     // Default assumption: first message is from user
//     return 'user';
// }

// function processMessage(msgRow, msgId, turnIndex, shouldCollapse = true, msgType = null) {
//     try {
//         if (msgRow.classList.contains('chat-focus-processed')) return;

//         // If type not provided, try to determine it (fallback)
//         if (!msgType) {
//             msgType = determineMessageType(msgRow);
//         }

//         const isUser = msgType === 'user';
//         const previewText = extractPreviewText(msgRow);

//         msgRow.classList.add('chat-focus-processed');

//         // Store turn index as data attribute
//         msgRow.setAttribute('data-turn-index', turnIndex);

//         // Check saved state first, then use shouldCollapse parameter
//         const wasExpanded = messageStates.get(msgId);
//         if (wasExpanded === true) {
//             // User explicitly expanded this before, keep it expanded
//             shouldCollapse = false;
//         } else if (wasExpanded === false) {
//             // User explicitly collapsed this before, keep it collapsed
//             shouldCollapse = true;
//         }

//         // Add type-specific class (for styling only)
//         if (isUser) {
//             msgRow.classList.add('chat-focus-user-collapsed');
//         } else {
//             msgRow.classList.add('chat-focus-ai-collapsed');
//         }

//         // Apply collapsed state if needed
//         if (shouldCollapse) {
//             msgRow.classList.add('chat-focus-collapsed');
//         }

//         // Create fold bar label
//         const label = document.createElement('div');
//         label.className = 'chat-focus-label';
//         label.setAttribute('role', 'button');
//         label.setAttribute('tabindex', '0');
//         label.setAttribute('aria-label', `${isUser ? 'User' : 'AI'} message, turn ${turnIndex}. Click to expand: ${previewText}`);
//         label.innerHTML = `
//             <span class="chat-focus-icon"></span>
//             <span class="chat-focus-text">${escapeHtml(previewText)}</span>
//             <span class="chat-focus-turn-index">#${turnIndex}</span>
//         `;

//         // Show label only if message is collapsed
//         if (!shouldCollapse) {
//             label.style.display = 'none';
//         }

//         msgRow.prepend(label);

//         // Create refold button
//         const refoldBtn = document.createElement('div');
//         refoldBtn.className = 'chat-focus-refold-btn';
//         refoldBtn.setAttribute('role', 'button');
//         refoldBtn.setAttribute('tabindex', '0');
//         refoldBtn.setAttribute('aria-label', 'Collapse this message');
//         refoldBtn.setAttribute('title', 'Collapse');
//         refoldBtn.textContent = 'Fold';
//         msgRow.appendChild(refoldBtn);

//         // Store message data
//         const fullText = extractFullText(msgRow);
//         msgRow._chatFocusData = {
//             id: msgId,
//             type: msgType,
//             previewText: previewText,
//             fullText: fullText,
//             element: msgRow,
//             turnIndex: turnIndex
//         };

//         updateTableOfContents();

//         // Event handlers
//         const expandMessage = (e) => {
//             e?.stopPropagation();
//             msgRow.classList.remove('chat-focus-collapsed');
//             label.style.display = 'none';
//             saveMessageState(msgId, true);
//             checkExpandCollapseState();

//             // Update code mode classes if in code mode
//             if (isCodeMode) {
//                 updateCodeModeClasses();
//             }
//         };

//         const collapseMessage = (e) => {
//             e?.stopPropagation();
//             msgRow.classList.add('chat-focus-collapsed');
//             label.style.display = 'flex';
//             saveMessageState(msgId, false);
//             checkExpandCollapseState();

//             // Update code mode classes if in code mode
//             if (isCodeMode) {
//                 updateCodeModeClasses();
//             }
//         };

//         label.addEventListener('click', expandMessage);
//         refoldBtn.addEventListener('click', collapseMessage);

//         label.addEventListener('keydown', (e) => {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 expandMessage(e);
//             }
//         });

//         refoldBtn.addEventListener('keydown', (e) => {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 collapseMessage(e);
//             }
//         });

//         msgRow._chatFocusHandlers = { expandMessage, collapseMessage };

//         // Add double-click to collapse/expand
//         msgRow.addEventListener('dblclick', (e) => {
//             // Don't trigger if double-clicking on buttons, links, or inputs
//             if (e.target.closest('button, a, input, textarea, select, .chat-focus-label, .chat-focus-refold-btn')) {
//                 return;
//             }

//             const isCollapsed = msgRow.classList.contains('chat-focus-collapsed');
//             if (isCollapsed) {
//                 expandMessage(e);
//             } else {
//                 collapseMessage(e);
//             }
//         });
//     } catch (error) {
//         console.error('ChatFocus: Error processing message', error);
//     }
// }

// function foldOldMessages() {
//     if (!isEnabled) return;

//     try {
//         const articles = safeQuerySelectorAll(CONFIG.SELECTORS.articles);
//         if (articles.length === 0) return;

//         const keepOpenCount = Math.max(1, settings.keepOpen);

//         // Determine first message type, then alternate
//         const firstType = determineFirstMessageType(articles);

//         // Process ALL messages so they all have handlers
//         articles.forEach((msgRow, index) => {
//             const msgId = getMessageId(msgRow);
//             const turnIndex = index + 1;
//             const shouldCollapse = index < articles.length - keepOpenCount;

//             // Alternate message types: if first is 'user', pattern is user, ai, user, ai...
//             // If first is 'ai', pattern is ai, user, ai, user...
//             let msgType;
//             if (firstType === 'user') {
//                 msgType = index % 2 === 0 ? 'user' : 'ai';
//             } else {
//                 msgType = index % 2 === 0 ? 'ai' : 'user';
//             }

//             processMessage(msgRow, msgId, turnIndex, shouldCollapse, msgType);
//         });

//         // Update toggle button state after processing
//         checkExpandCollapseState();

//         // Update code mode classes if code mode is active
//         if (isCodeMode) {
//             updateCodeModeClasses();
//         }
//     } catch (error) {
//         console.error('ChatFocus: Error in foldOldMessages', error);
//     }
// }

// // ==================== SEARCH HIGHLIGHTING ====================
// function highlightSearchTerm(element, searchTerm) {
//     if (!searchTerm || searchTerm.trim() === '') return;

//     // Remove any existing highlights first
//     clearSearchHighlights(element);

//     // Find all text nodes and highlight matching terms
//     const textContent = CONFIG.SELECTORS.textContent;
//     for (const selector of textContent) {
//         const contentElements = element.querySelectorAll(selector);

//         contentElements.forEach(contentEl => {
//             highlightInElement(contentEl, searchTerm);
//         });
//     }

//     // Scroll to first highlight (centered for better visibility of the highlighted term)
//     const firstHighlight = element.querySelector('.chat-focus-highlight');
//     if (firstHighlight) {
//         firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
// }

// function highlightInElement(element, searchTerm) {
//     const searchLower = searchTerm.toLowerCase();

//     // Walk through text nodes
//     const walker = document.createTreeWalker(
//         element,
//         NodeFilter.SHOW_TEXT,
//         null,
//         false
//     );

//     const nodesToReplace = [];
//     let node;

//     while (node = walker.nextNode()) {
//         const text = node.textContent;
//         const textLower = text.toLowerCase();

//         if (textLower.includes(searchLower)) {
//             nodesToReplace.push(node);
//         }
//     }

//     // Replace text nodes with highlighted versions
//     nodesToReplace.forEach(node => {
//         const text = node.textContent;
//         const textLower = text.toLowerCase();
//         const searchLower = searchTerm.toLowerCase();

//         const fragment = document.createDocumentFragment();
//         let lastIndex = 0;
//         let index = textLower.indexOf(searchLower);

//         while (index !== -1) {
//             // Add text before match
//             if (index > lastIndex) {
//                 fragment.appendChild(
//                     document.createTextNode(text.substring(lastIndex, index))
//                 );
//             }

//             // Add highlighted match
//             const mark = document.createElement('mark');
//             mark.className = 'chat-focus-highlight';
//             mark.textContent = text.substring(index, index + searchTerm.length);
//             fragment.appendChild(mark);

//             lastIndex = index + searchTerm.length;
//             index = textLower.indexOf(searchLower, lastIndex);
//         }

//         // Add remaining text
//         if (lastIndex < text.length) {
//             fragment.appendChild(
//                 document.createTextNode(text.substring(lastIndex))
//             );
//         }

//         node.parentNode.replaceChild(fragment, node);
//     });
// }

// function clearSearchHighlights(element) {
//     const highlights = element.querySelectorAll('.chat-focus-highlight');
//     highlights.forEach(highlight => {
//         const text = document.createTextNode(highlight.textContent);
//         highlight.parentNode.replaceChild(text, highlight);
//     });

//     // Normalize to merge adjacent text nodes
//     element.normalize();
// }

// function clearAllSearchHighlights() {
//     const allMessages = document.querySelectorAll('.chat-focus-processed');
//     allMessages.forEach(msg => clearSearchHighlights(msg));
// }

// // ==================== TABLE OF CONTENTS ====================
// function createTableOfContents() {
//     if (document.getElementById('chat-focus-toc')) return;

//     // Create TOC sidebar
//     const toc = document.createElement('div');
//     toc.id = 'chat-focus-toc';
//     toc.className = `chat-focus-toc ${tocVisible ? '' : 'hidden'}`;

//     toc.innerHTML = `
//         <div class="chat-focus-toc-header">
//             <div class="chat-focus-toc-header-top">
//                 <h3 class="chat-focus-toc-title">Contents</h3>
//                 <button class="chat-focus-toc-close" aria-label="Close">&times;</button>
//             </div>
//             <div class="chat-focus-toc-search">
//                 <div class="chat-focus-toc-search-wrapper">
//                     <span class="chat-focus-toc-search-icon">${ICONS.search}</span>
//                     <input
//                         type="text"
//                         class="chat-focus-toc-search-input"
//                         placeholder="Search messages..."
//                         aria-label="Search messages"
//                     />
//                     <button class="chat-focus-toc-search-clear" aria-label="Clear search">&times;</button>
//                 </div>
//             </div>
//         </div>
//         <div class="chat-focus-toc-content" id="chat-focus-toc-content"></div>
//     `;

//     document.body.appendChild(toc);

//     // Create toggle button
//     const toggle = document.createElement('button');
//     toggle.id = 'chat-focus-toc-toggle';
//     toggle.className = `chat-focus-toc-toggle ${tocVisible ? 'hidden' : ''}`;
//     toggle.innerHTML = '≡';
//     toggle.setAttribute('aria-label', 'Toggle Table of Contents');
//     document.body.appendChild(toggle);

//     // Event listeners
//     toc.querySelector('.chat-focus-toc-close').addEventListener('click', toggleTOC);
//     toggle.addEventListener('click', toggleTOC);

//     const searchInput = toc.querySelector('.chat-focus-toc-search-input');
//     const searchClear = toc.querySelector('.chat-focus-toc-search-clear');

//     searchInput.addEventListener('input', (e) => {
//         tocSearchQuery = e.target.value.toLowerCase().trim();
//         searchClear.classList.toggle('visible', tocSearchQuery.length > 0);
//         filterTOCItems();

//         // Clear highlights when search changes
//         if (tocSearchQuery === '') {
//             clearAllSearchHighlights();
//         }
//     });

//     searchClear.addEventListener('click', () => {
//         searchInput.value = '';
//         tocSearchQuery = '';
//         searchClear.classList.remove('visible');
//         filterTOCItems();
//         clearAllSearchHighlights();
//         searchInput.focus();
//     });
// }

// function toggleTOC() {
//     tocVisible = !tocVisible;
//     const toc = document.getElementById('chat-focus-toc');
//     const toggle = document.getElementById('chat-focus-toc-toggle');

//     if (toc) toc.classList.toggle('hidden', !tocVisible);
//     if (toggle) toggle.classList.toggle('hidden', tocVisible);

//     if (tocVisible) {
//         updateTableOfContents();
//         updateTOCTitle();
//         updateActiveTOCItem();
//     } else {
//         // Clear highlights when TOC is closed
//         clearAllSearchHighlights();
//     }

//     saveTocState();
// }

// function updateSearchResultCount(count) {
//     const searchContainer = document.querySelector('.chat-focus-toc-search');
//     if (!searchContainer) return;

//     // Remove existing count badge
//     const existingBadge = searchContainer.querySelector('.chat-focus-search-count');
//     if (existingBadge) existingBadge.remove();

//     // Add count badge if there's a search query
//     if (tocSearchQuery && tocSearchQuery.trim() !== '') {
//         const badge = document.createElement('div');
//         badge.className = 'chat-focus-search-count';

//         if (count === 0) {
//             badge.textContent = 'No matches found';
//             badge.style.color = 'var(--cf-color-text-tertiary)';
//         } else {
//             badge.textContent = `${count} ${count === 1 ? 'result' : 'results'}`;
//             badge.style.color = 'var(--cf-color-accent)';
//         }

//         searchContainer.appendChild(badge);
//     }
// }

// function filterTOCItems() {
//     const content = document.getElementById('chat-focus-toc-content');
//     if (!content) return;

//     const items = content.querySelectorAll('.chat-focus-toc-item');
//     let matchCount = 0;

//     items.forEach(item => {
//         const msgId = item.getAttribute('data-msg-id');

//         // Find the corresponding message element
//         const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));
//         const msgElement = messages.find(msg => msg._chatFocusData && msg._chatFocusData.id === msgId);

//         let matches = false;
//         let matchInPreview = false;

//         if (msgElement && msgElement._chatFocusData) {
//             // Search in the full text content
//             const fullText = msgElement._chatFocusData.fullText || '';
//             const previewText = msgElement._chatFocusData.previewText || '';

//             matches = fullText.toLowerCase().includes(tocSearchQuery);
//             matchInPreview = previewText.toLowerCase().includes(tocSearchQuery);

//             // Add indicator if match is in full content but not in preview
//             if (matches && !matchInPreview && tocSearchQuery !== '') {
//                 item.classList.add('deep-match');
//                 item.setAttribute('data-match-hint', 'Match in message');
//             } else {
//                 item.classList.remove('deep-match');
//                 item.removeAttribute('data-match-hint');
//             }
//         } else {
//             // Fallback to preview text if full text not available
//             const text = item.querySelector('.chat-focus-toc-item-text').textContent.toLowerCase();
//             matches = text.includes(tocSearchQuery);
//             item.classList.remove('deep-match');
//         }

//         item.classList.toggle('hidden', !matches);
//         if (matches) matchCount++;
//     });

//     // Update search result count
//     updateSearchResultCount(matchCount);
// }

// function updateTableOfContents() {
//     const content = document.getElementById('chat-focus-toc-content');
//     if (!content) return;

//     const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));
//     let tocItems = messages
//         .map(msg => msg._chatFocusData)
//         .filter(data => data && data.element);

//     // Filter items based on code mode
//     if (isCodeMode) {
//         tocItems = tocItems.filter(data => {
//             const element = data.element;
//             // Show only messages that are visible in code mode
//             const isHidden = element.classList.contains('chat-focus-no-code') ||
//                            element.classList.contains('chat-focus-user-before-no-code');
//             return !isHidden;
//         });
//     }

//     if (tocItems.length === 0) {
//         const emptyMessage = isCodeMode
//             ? '<div class="chat-focus-toc-empty">No code blocks found</div>'
//             : '<div class="chat-focus-toc-empty">No messages yet</div>';
//         content.innerHTML = emptyMessage;
//         return;
//     }

//     content.innerHTML = tocItems.map((data, index) => {
//         const displayText = data.previewText || 'Message';
//         const typeClass = data.type === 'user' ? 'user' : 'ai';
//         const typeLabel = isCodeMode ? (data.type === 'user' ? 'Question' : 'Code') : '';
//         return `
//             <div class="chat-focus-toc-item ${isCodeMode ? 'code-mode-item' : ''}" data-msg-id="${data.id}" tabindex="0" role="button">
//                 <div class="chat-focus-toc-item-type ${typeClass}"></div>
//                 <div class="chat-focus-toc-item-content">
//                     <div class="chat-focus-toc-item-text">${escapeHtml(displayText)}</div>
//                     <div class="chat-focus-toc-item-meta">
//                         ${typeLabel ? `<span class="chat-focus-toc-item-label">${typeLabel}</span>` : ''}
//                         <span class="chat-focus-toc-item-index">Turn ${data.turnIndex}</span>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');

//     // Add click handlers
//     content.querySelectorAll('.chat-focus-toc-item').forEach(item => {
//         const msgId = item.getAttribute('data-msg-id');
//         const msgData = tocItems.find(d => d.id === msgId);

//         const handleClick = () => {
//             if (msgData && msgData.element) {
//                 // Clear previous highlights
//                 clearAllSearchHighlights();

//                 // Expand message if collapsed
//                 if (msgData.element.classList.contains('chat-focus-collapsed')) {
//                     if (msgData.element._chatFocusHandlers) {
//                         msgData.element._chatFocusHandlers.expandMessage();
//                     }
//                 }

//                 // Scroll to the top of the message
//                 msgData.element.scrollIntoView({ behavior: 'smooth', block: 'start' });

//                 // Highlight search term if there's an active search
//                 if (tocSearchQuery && tocSearchQuery.trim() !== '') {
//                     // Wait a bit for expand animation and scroll to complete
//                     setTimeout(() => {
//                         highlightSearchTerm(msgData.element, tocSearchQuery);
//                     }, 300);
//                 }

//                 // Update active state
//                 content.querySelectorAll('.chat-focus-toc-item').forEach(i => i.classList.remove('active'));
//                 item.classList.add('active');
//             }
//         };

//         item.addEventListener('click', handleClick);
//         item.addEventListener('keydown', (e) => {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 handleClick();
//             }
//         });
//     });

//     filterTOCItems();
//     updateActiveTOCItem();
// }

// function updateActiveTOCItem() {
//     const content = document.getElementById('chat-focus-toc-content');
//     if (!content) return;

//     const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));
//     if (messages.length === 0) return;

//     // Find the message that's most visible in the viewport
//     const viewportMiddle = window.innerHeight / 2;
//     let activeIndex = -1;
//     let closestDistance = Infinity;

//     messages.forEach((msg, index) => {
//         const rect = msg.getBoundingClientRect();

//         // Check if message is in viewport
//         if (rect.bottom > 0 && rect.top < window.innerHeight) {
//             // Calculate distance from viewport center
//             const msgCenter = rect.top + rect.height / 2;
//             const distance = Math.abs(msgCenter - viewportMiddle);

//             if (distance < closestDistance) {
//                 closestDistance = distance;
//                 activeIndex = index;
//             }
//         }
//     });

//     // Update active state on TOC items
//     content.querySelectorAll('.chat-focus-toc-item').forEach((item, index) => {
//         const wasActive = item.classList.contains('active');
//         const isActive = index === activeIndex;
//         item.classList.toggle('active', isActive);

//         // Scroll TOC item into view if it becomes active (and wasn't before)
//         if (isActive && !wasActive && tocVisible) {
//             // Use a small delay to ensure smooth scrolling
//             requestAnimationFrame(() => {
//                 item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
//             });
//         }
//     });
// }

// // ==================== FLOATING CONTROLS ====================
// let isAllExpanded = false; // Track expand/collapse state

// function createFloatingControls() {
//     if (document.getElementById('chat-focus-controls')) return;

//     const controls = document.createElement('div');
//     controls.id = 'chat-focus-controls';
//     controls.className = 'chat-focus-controls';

//     // Restore saved position
//     if (controlsPosition) {
//         controls.style.bottom = controlsPosition.bottom;
//         controls.style.right = controlsPosition.right;
//     }

//     // Create toggle expand/collapse button
//     const toggleBtn = createControlButton('toggle-expand', 'Expand All', ICONS.expand);
//     toggleBtn.addEventListener('click', toggleExpandCollapseAll);
//     controls.appendChild(toggleBtn);

//     // Divider
//     controls.appendChild(createDivider());

//     // Code mode button
//     const codeModeBtn = createControlButton('code-mode', 'Code Only', ICONS.code);
//     codeModeBtn.addEventListener('click', toggleCodeMode);
//     controls.appendChild(codeModeBtn);

//     // Divider
//     controls.appendChild(createDivider());

//     // TOC button
//     const tocBtn = createControlButton('toc', 'Contents', ICONS.list);
//     tocBtn.addEventListener('click', toggleTOC);
//     controls.appendChild(tocBtn);

//     // Settings button
//     const settingsBtn = createControlButton('settings', 'Toggle', ICONS.settings);
//     settingsBtn.addEventListener('click', toggleExtension);
//     controls.appendChild(settingsBtn);

//     document.body.appendChild(controls);

//     // Make draggable
//     makeDraggable(controls);

//     // Set initial state
//     updateToggleButton();
// }

// function createControlButton(id, label, iconSvg) {
//     const btn = document.createElement('button');
//     btn.className = `chat-focus-controls-btn ${id}`;
//     btn.setAttribute('aria-label', label);
//     btn.setAttribute('type', 'button');
//     btn.innerHTML = iconSvg;
//     return btn;
// }

// function createDivider() {
//     const div = document.createElement('div');
//     div.className = 'chat-focus-controls-divider';
//     return div;
// }

// function makeDraggable(element) {
//     let isDragging = false;
//     let startX, startY, startBottom, startRight;

//     element.addEventListener('mousedown', (e) => {
//         // Only drag if clicking on the background, not buttons
//         if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

//         isDragging = true;
//         startX = e.clientX;
//         startY = e.clientY;

//         const rect = element.getBoundingClientRect();
//         startBottom = window.innerHeight - rect.bottom;
//         startRight = window.innerWidth - rect.right;

//         element.classList.add('dragging');
//         e.preventDefault();
//     });

//     document.addEventListener('mousemove', (e) => {
//         if (!isDragging) return;

//         const deltaX = e.clientX - startX;
//         const deltaY = e.clientY - startY;

//         const newBottom = Math.max(0, startBottom - deltaY);
//         const newRight = Math.max(0, startRight - deltaX);

//         element.style.bottom = `${newBottom}px`;
//         element.style.right = `${newRight}px`;
//     });

//     document.addEventListener('mouseup', () => {
//         if (isDragging) {
//             isDragging = false;
//             element.classList.remove('dragging');

//             // Save position
//             saveControlsPosition({
//                 bottom: element.style.bottom,
//                 right: element.style.right
//             });
//         }
//     });
// }

// // ==================== CONTROL ACTIONS ====================
// function toggleExpandCollapseAll() {
//     if (isAllExpanded) {
//         collapseAllMessages();
//         isAllExpanded = false;
//     } else {
//         expandAllMessages();
//         isAllExpanded = true;
//     }
//     updateToggleButton();
// }

// function checkExpandCollapseState() {
//     // Check if most messages are expanded or collapsed
//     const collapsed = document.querySelectorAll('.chat-focus-processed.chat-focus-collapsed').length;
//     const expanded = document.querySelectorAll('.chat-focus-processed:not(.chat-focus-collapsed)').length;

//     // Update state based on majority
//     isAllExpanded = expanded > collapsed;
//     updateToggleButton();
// }

// function updateToggleButton() {
//     const btn = document.querySelector('.chat-focus-controls-btn.toggle-expand');
//     if (!btn) return;

//     if (isAllExpanded) {
//         // Show collapse state
//         btn.innerHTML = ICONS.collapse;
//         btn.setAttribute('aria-label', 'Collapse All');
//     } else {
//         // Show expand state
//         btn.innerHTML = ICONS.expand;
//         btn.setAttribute('aria-label', 'Expand All');
//     }
// }

// function expandAllMessages() {
//     const processed = document.querySelectorAll('.chat-focus-processed.chat-focus-collapsed');
//     processed.forEach(msgRow => {
//         if (msgRow._chatFocusHandlers) {
//             msgRow._chatFocusHandlers.expandMessage();
//         }
//     });
//     isAllExpanded = true;
//     updateToggleButton();
// }

// function collapseAllMessages() {
//     const processed = document.querySelectorAll('.chat-focus-processed:not(.chat-focus-collapsed)');
//     const allMessages = Array.from(processed);

//     // Don't collapse the last message
//     if (allMessages.length > 0) {
//         allMessages.pop(); // Remove last message
//     }

//     allMessages.forEach(msgRow => {
//         if (msgRow._chatFocusHandlers) {
//             msgRow._chatFocusHandlers.collapseMessage();
//         }
//     });
//     isAllExpanded = false;
//     updateToggleButton();
// }

// let isCodeMode = false;

// function hasCodeBlocks(msgElement) {
//     // Check if message contains code blocks (various selectors for different platforms)
//     const codeBlockSelectors = [
//         'pre',
//         'pre code',
//         'code[class*="language-"]',
//         '.code-block',
//         '[class*="codeblock"]',
//         'div[class*="code"] pre',
//         '.markdown pre'
//     ];

//     for (const selector of codeBlockSelectors) {
//         try {
//             const blocks = msgElement.querySelectorAll(selector);
//             if (blocks.length > 0) {
//                 // Additional check: make sure it's not inline code
//                 for (const block of blocks) {
//                     const parent = block.parentElement;
//                     // If it's a pre tag or has multiple lines, it's a code block
//                     if (block.tagName === 'PRE' ||
//                         (block.textContent && block.textContent.includes('\n')) ||
//                         (parent && parent.tagName === 'PRE')) {
//                         return true;
//                     }
//                 }
//             }
//         } catch (e) {
//             // Skip invalid selectors
//         }
//     }

//     return false;
// }

// function updateCodeModeClasses() {
//     const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));

//     messages.forEach((msg, index) => {
//         const msgData = msg._chatFocusData;
//         if (!msgData) return;

//         const hasCode = hasCodeBlocks(msg);

//         // Mark messages without code
//         msg.classList.toggle('chat-focus-no-code', !hasCode);

//         // If this is a user message, check if next AI message has code
//         if (msgData.type === 'user') {
//             let nextAiHasCode = false;

//             // Find next AI message
//             for (let i = index + 1; i < messages.length; i++) {
//                 const nextMsg = messages[i];
//                 const nextData = nextMsg._chatFocusData;

//                 if (nextData && nextData.type === 'ai') {
//                     nextAiHasCode = hasCodeBlocks(nextMsg);
//                     break;
//                 }
//             }

//             // Mark user message if next AI has no code
//             msg.classList.toggle('chat-focus-user-before-no-code', !nextAiHasCode);
//         }

//         // Add turn indicator for visible messages in code mode
//         const shouldShowIndicator = msgData.type === 'user'
//             ? !msg.classList.contains('chat-focus-user-before-no-code')
//             : hasCode;

//         if (shouldShowIndicator) {
//             let indicator = msg.querySelector('.chat-focus-turn-indicator');
//             if (!indicator) {
//                 indicator = document.createElement('div');
//                 indicator.className = 'chat-focus-turn-indicator';
//                 indicator.textContent = `Turn ${msgData.turnIndex}`;
//                 msg.insertBefore(indicator, msg.firstChild);
//             }
//         } else {
//             // Remove indicator if exists
//             const indicator = msg.querySelector('.chat-focus-turn-indicator');
//             if (indicator) indicator.remove();
//         }
//     });

//     // Update TOC to reflect code mode visibility
//     if (isCodeMode) {
//         updateTableOfContents();
//     }
// }

// function updateTOCTitle() {
//     const tocTitle = document.querySelector('.chat-focus-toc-title');
//     if (!tocTitle) return;

//     if (isCodeMode) {
//         const visibleCount = document.querySelectorAll('.chat-focus-toc-item').length;
//         const totalCount = document.querySelectorAll('.chat-focus-processed').length;
//         const badge = `<span class="chat-focus-toc-mode-badge">Code Only</span>`;
//         const count = visibleCount > 0 ? `<span class="chat-focus-toc-count">${visibleCount}/${totalCount}</span>` : '';
//         tocTitle.innerHTML = `Contents ${badge}${count}`;
//     } else {
//         tocTitle.textContent = 'Contents';
//     }
// }

// function toggleCodeMode() {
//     isCodeMode = !isCodeMode;
//     document.body.classList.toggle('chat-focus-code-mode', isCodeMode);

//     const btn = document.querySelector('.chat-focus-controls-btn.code-mode');
//     if (btn) btn.classList.toggle('active', isCodeMode);

//     if (isCodeMode) {
//         expandAllMessages();
//         updateCodeModeClasses();
//         updateTableOfContents();
//         updateTOCTitle();
//         updateActiveTOCItem();
//         showNotification("Code-Only Mode: Active");
//     } else {
//         // Remove code mode classes and indicators when disabling
//         const messages = document.querySelectorAll('.chat-focus-processed');
//         messages.forEach(msg => {
//             msg.classList.remove('chat-focus-no-code', 'chat-focus-user-before-no-code');
//             const indicator = msg.querySelector('.chat-focus-turn-indicator');
//             if (indicator) indicator.remove();
//         });
//         updateTableOfContents();
//         updateTOCTitle();
//         updateActiveTOCItem();
//         showNotification("Code-Only Mode: Disabled");
//     }
// }

// async function toggleExtension() {
//     isEnabled = !isEnabled;
//     settings.enabled = isEnabled;
//     await saveSettings();

//     if (isEnabled) {
//         foldOldMessages();
//         showNotification('ChatFocus enabled');
//     } else {
//         expandAllMessages();
//         showNotification('ChatFocus disabled');
//     }
// }

// function showNotification(message) {
//     const notification = document.createElement('div');
//     notification.className = 'chat-focus-notification';
//     notification.textContent = message;
//     document.body.appendChild(notification);

//     setTimeout(() => notification.classList.add('show'), 10);
//     setTimeout(() => {
//         notification.classList.remove('show');
//         setTimeout(() => notification.remove(), 200);
//     }, 2000);
// }

// // ==================== KEYBOARD SHORTCUTS ====================
// function setupKeyboardShortcuts() {
//     document.addEventListener('keydown', async (e) => {
//         if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
//             e.preventDefault();
//             expandAllMessages();
//         }
//         if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
//             e.preventDefault();
//             collapseAllMessages();
//         }
//         // Toggle expand/collapse with Space when controls focused
//         if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === ' ') {
//             e.preventDefault();
//             toggleExpandCollapseAll();
//         }
//         if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
//             e.preventDefault();
//             await toggleExtension();
//         }
//         if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
//             e.preventDefault();
//             toggleTOC();
//         }
//     });
// }

// // ==================== OBSERVER ====================
// function initObserver() {
//     if (observer) observer.disconnect();

//     const targetNode = document.body;
//     if (!targetNode) {
//         setTimeout(initObserver, 500);
//         return;
//     }

//     const config = {
//         childList: true,
//         subtree: true,
//         attributes: false,
//         characterData: false
//     };

//     observer = new MutationObserver(() => {
//         if (window.foldTimer) cancelAnimationFrame(window.foldTimer);
//         window.foldTimer = requestAnimationFrame(() => {
//             setTimeout(foldOldMessages, settings.debounceDelay || CONFIG.DEBOUNCE_DELAY);
//         });
//     });

//     try {
//         observer.observe(targetNode, config);
//         console.log('ChatFocus: Observer initialized');
//     } catch (error) {
//         console.error('ChatFocus: Error initializing observer', error);
//     }
// }

// function cleanup() {
//     if (observer) {
//         observer.disconnect();
//         observer = null;
//     }
//     if (window.foldTimer) {
//         cancelAnimationFrame(window.foldTimer);
//         window.foldTimer = null;
//     }

//     ['chat-focus-toc', 'chat-focus-toc-toggle', 'chat-focus-controls']
//         .forEach(id => document.getElementById(id)?.remove());
// }

// // ==================== INITIALIZATION ====================
// async function init() {
//     try {
//         await loadSettings();

//         if (!isEnabled) {
//             console.log('ChatFocus: Extension is disabled');
//             return;
//         }

//         const initDelay = () => {
//             initObserver();
//             foldOldMessages();
//         };

//         if (document.readyState === 'loading') {
//             document.addEventListener('DOMContentLoaded', () => {
//                 setTimeout(initDelay, CONFIG.INIT_DELAY);
//             });
//         } else {
//             setTimeout(initDelay, CONFIG.INIT_DELAY);
//         }

//         setupKeyboardShortcuts();
//         createTableOfContents();
//         createFloatingControls();

//         // Update active TOC item on scroll (live tracking)
//         let scrollTimeout;
//         let ticking = false;

//         window.addEventListener('scroll', () => {
//             if (!ticking) {
//                 window.requestAnimationFrame(() => {
//                     updateActiveTOCItem();
//                     ticking = false;
//                 });
//                 ticking = true;
//             }
//         }, { passive: true });

//         // Also update on resize
//         window.addEventListener('resize', () => {
//             clearTimeout(scrollTimeout);
//             scrollTimeout = setTimeout(updateActiveTOCItem, 150);
//         }, { passive: true });

//         // Listen for settings changes
//         chrome.storage.onChanged.addListener((changes) => {
//             if (changes.enabled) {
//                 isEnabled = changes.enabled.newValue;
//                 isEnabled ? foldOldMessages() : expandAllMessages();
//             }
//             if (changes.keepOpen) {
//                 settings.keepOpen = changes.keepOpen.newValue;
//                 document.querySelectorAll('.chat-focus-processed').forEach(el => {
//                     el.classList.remove('chat-focus-processed');
//                 });
//                 foldOldMessages();
//             }
//             if (changes.previewLength) {
//                 settings.previewLength = changes.previewLength.newValue;
//             }
//         });

//         // Listen for messages from popup/background
//         chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//             if (message.action === 'toggle') {
//                 isEnabled = message.enabled;
//                 settings.enabled = message.enabled;
//                 isEnabled ? foldOldMessages() : expandAllMessages();
//                 sendResponse({ success: true });
//             } else if (message.action === 'expandAll') {
//                 expandAllMessages();
//                 sendResponse({ success: true });
//             } else if (message.action === 'collapseAll') {
//                 collapseAllMessages();
//                 sendResponse({ success: true });
//             } else if (message.action === 'settingsUpdated') {
//                 if (message.settings) {
//                     Object.assign(settings, message.settings);
//                     isEnabled = settings.enabled;
//                 }
//                 document.querySelectorAll('.chat-focus-processed').forEach(el => {
//                     el.classList.remove('chat-focus-processed');
//                 });
//                 foldOldMessages();
//                 sendResponse({ success: true });
//             }
//             return true;
//         });

//         console.log('ChatFocus: Extension loaded successfully');
//     } catch (error) {
//         console.error('ChatFocus: Initialization error', error);
//     }
// }

// window.addEventListener('beforeunload', cleanup);
// init();
