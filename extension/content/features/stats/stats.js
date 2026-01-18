import { ICONS } from '../../core/icons.js';
import { CONFIG } from '../../core/config.js';
import { statsVisible } from '../../core/state.js';

// Helper to handle outside clicks
function handleClickOutside(event) {
    const stats = document.getElementById('chat-focus-stats');
    const statsBtn = document.querySelector('.chat-focus-controls-btn.stats');

    if (stats && !stats.classList.contains('hidden')) {
        // If click is NOT inside stats panel AND NOT inside the toggle button
        if (!stats.contains(event.target) && (!statsBtn || !statsBtn.contains(event.target))) {
            toggleStats();
        }
    }
}

export function createStatsPanel() {
    if (document.getElementById('chat-focus-stats')) return;

    const stats = document.createElement('div');
    stats.id = 'chat-focus-stats';
    stats.className = 'chat-focus-stats hidden';

    stats.innerHTML = `
        <div class="chat-focus-stats-header">
            <h4 class="chat-focus-stats-title">Session Stats</h4>
        </div>
        <div class="chat-focus-stats-content">
            <div class="chat-focus-stats-item">
                <span class="chat-focus-stats-label">Turns</span>
                <span class="chat-focus-stats-value" id="stats-turns">0</span>
            </div>
            <div class="chat-focus-stats-item">
                <span class="chat-focus-stats-label">Tokens</span>
                <span class="chat-focus-stats-value" id="stats-tokens">~0</span>
            </div>
            <div class="chat-focus-stats-item">
                <span class="chat-focus-stats-label">Code Blocks</span>
                <span class="chat-focus-stats-value" id="stats-code">0</span>
            </div>
        </div>
    `;

    document.body.appendChild(stats);
}

export function toggleStats() {
    // 1. Create panel if it doesn't exist yet
    if (!document.getElementById('chat-focus-stats')) {
        createStatsPanel();
    }

    statsVisible.value = !statsVisible.value;
    const stats = document.getElementById('chat-focus-stats');

    // CHANGED: Target the main toolbar, not the specific button
    const toolbar = document.getElementById('chat-focus-controls');

    if (stats && statsVisible.value && toolbar) {
        // === OPENING ===
        updateStats();

        // Calculate Position based on Toolbar
        const toolbarRect = toolbar.getBoundingClientRect();

        // Width matches the CSS value (220px)
        const statsWidth = 220;
        const gap = 15;

        // Center horizontally relative to the Toolbar
        let leftPos = toolbarRect.left + (toolbarRect.width / 2) - (statsWidth / 2);

        // Safety: Keep within screen margins
        const margin = 10;
        leftPos = Math.max(margin, Math.min(window.innerWidth - statsWidth - margin, leftPos));

        // Position above the toolbar
        const bottomPos = window.innerHeight - toolbarRect.top + gap;

        stats.style.left = `${leftPos}px`;
        stats.style.bottom = `${bottomPos}px`;

        // Ensure the "pop up" animation originates from the center
        stats.style.transformOrigin = 'bottom center';

        stats.classList.remove('hidden');

        // Add global click listener to close it
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

    } else if (stats) {
        // === CLOSING ===
        stats.classList.add('hidden');
        document.removeEventListener('click', handleClickOutside);
    }
}

export function updateStats() {
    const turnsEl = document.getElementById('stats-turns');
    const tokensEl = document.getElementById('stats-tokens');
    const codeEl = document.getElementById('stats-code');

    if (!turnsEl || !tokensEl || !codeEl) return;

    // Count turns
    const messages = document.querySelectorAll('.chat-focus-processed');
    const turnCount = messages.length;

    // Estimate tokens
    let totalChars = 0;
    messages.forEach(msg => {
        totalChars += msg.textContent.length;
    });
    const tokenEstimate = Math.round(totalChars / 4);

    // Count code blocks
    let codeBlockCount = 0;
    if (CONFIG.ADAPTER && CONFIG.ADAPTER.selectors.codeBlocks) {
        const codeSelectors = CONFIG.ADAPTER.selectors.codeBlocks;
        for (const selector of codeSelectors) {
            const blocks = document.querySelectorAll(selector);
            blocks.forEach(block => {
                if (block.tagName === 'PRE' ||
                    (block.parentElement && block.parentElement.tagName === 'PRE') ||
                    block.textContent.includes('\n')) {
                    codeBlockCount++;
                }
            });
            if (codeBlockCount > 0) break;
        }
    }

    // Update UI
    turnsEl.textContent = turnCount;
    tokensEl.textContent = `~${formatNumber(tokenEstimate)}`;
    codeEl.textContent = codeBlockCount;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}