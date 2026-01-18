import { isCodeMode } from '../../core/state.js';
import { updateTableOfContents, updateTOCTitle, updateActiveTOCItem } from '../table-of-contents/toc.js';
import { expandAllMessages } from '../controls/actions.js';
import { showNotification } from '../../core/utils.js'; // Assuming you extracted this to utils

export function toggleCodeMode() {
    isCodeMode.value = !isCodeMode.value;
    document.body.classList.toggle('chat-focus-code-mode', isCodeMode.value);

    const btn = document.querySelector('.chat-focus-controls-btn.code-mode');
    if (btn) btn.classList.toggle('active', isCodeMode.value);

    if (isCodeMode.value) {
        expandAllMessages();
        updateCodeModeClasses();
        showNotification("Code-Only Mode: Active");
    } else {
        document.querySelectorAll('.chat-focus-processed').forEach(msg => {
            msg.classList.remove('chat-focus-no-code', 'chat-focus-user-before-no-code');
            msg.querySelector('.chat-focus-turn-indicator')?.remove();
        });
        showNotification("Code-Only Mode: Disabled");
    }

    updateTableOfContents();
    updateTOCTitle();
    updateActiveTOCItem();
}

export function hasCodeBlocks(msgElement) {
    const selectors = ['pre', 'pre code', '.code-block', '.markdown pre'];
    return selectors.some(sel => msgElement.querySelectorAll(sel).length > 0);
}

export function updateCodeModeClasses() {
    const messages = Array.from(document.querySelectorAll('.chat-focus-processed'));

    messages.forEach((msg, index) => {
        const hasCode = hasCodeBlocks(msg);
        msg.classList.toggle('chat-focus-no-code', !hasCode);

        if (msg._chatFocusData?.type === 'user') {
            // Find next AI message to see if it has code
            let nextAiHasCode = false;
            for (let i = index + 1; i < messages.length; i++) {
                if (messages[i]._chatFocusData?.type === 'ai') {
                    nextAiHasCode = hasCodeBlocks(messages[i]);
                    break;
                }
            }
            msg.classList.toggle('chat-focus-user-before-no-code', !nextAiHasCode);
        }

        // Add Turn Indicators
        const shouldShow = msg._chatFocusData?.type === 'user'
            ? !msg.classList.contains('chat-focus-user-before-no-code')
            : hasCode;

        let indicator = msg.querySelector('.chat-focus-turn-indicator');
        if (shouldShow && !indicator) {
            indicator = document.createElement('div');
            indicator.className = 'chat-focus-turn-indicator';
            indicator.textContent = `Turn ${msg._chatFocusData?.turnIndex}`;
            msg.insertBefore(indicator, msg.firstChild);
        } else if (!shouldShow && indicator) {
            indicator.remove();
        }
    });
}