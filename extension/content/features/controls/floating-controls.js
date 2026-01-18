import { ICONS } from '../../core/icons.js';
import { controlsPosition } from '../../core/state.js';
import { saveControlsPosition } from '../../storage/settings.js';
import { toggleExpandCollapseAll, checkExpandCollapseState } from './actions.js';
import { toggleCodeMode } from '../code-mode/code-mode.js';
import { toggleTOC } from '../table-of-contents/toc.js';
import { toggleStats } from '../stats/stats.js';
import { openPopup } from '../../main.js';

// Detect OS for shortcuts
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export function createFloatingControls() {
    if (document.getElementById('chat-focus-controls')) return;

    const controls = document.createElement('div');
    controls.id = 'chat-focus-controls';
    controls.className = 'chat-focus-controls';

    if (controlsPosition.value) {
        controls.style.bottom = controlsPosition.value.bottom;
        controls.style.right = controlsPosition.value.right;
    }

    const toggleBtn = createButton('toggle-expand', 'Expand All', ICONS.expand, toggleExpandCollapseAll, 'Ctrl+Shift+Space');
    const codeBtn = createButton('code-mode', 'Code Only', ICONS.code, toggleCodeMode, 'Ctrl+Shift+C');
    const tocBtn = createButton('toc', 'Contents', ICONS.list, toggleTOC, 'Ctrl+Shift+O');
    const statsBtn = createButton('stats', 'Stats', ICONS.stats, toggleStats, 'Ctrl+Shift+S');
    const settingsBtn = createButton('settings', 'Settings', ICONS.settings, openPopup, null);

    controls.append(toggleBtn, createDivider(), codeBtn, createDivider(), tocBtn, statsBtn, createDivider(), settingsBtn);
    document.body.appendChild(controls);

    makeDraggable(controls);
    checkExpandCollapseState(); // Update button icon initially
}

function createButton(cls, label, icon, handler, shortcutKey) {
    const btn = document.createElement('button');
    btn.className = `chat-focus-controls-btn ${cls}`;
    btn.ariaLabel = label;

    // 1. Create a wrapper for the icon so we can update it safely
    const iconSpan = document.createElement('span');
    iconSpan.className = 'cf-btn-icon';
    iconSpan.innerHTML = icon;
    btn.appendChild(iconSpan);

    btn.addEventListener('click', handler);

    // 2. Create the Tooltip (Safe from innerHTML overwrites on the button itself)
    const tooltip = document.createElement('div');
    tooltip.className = 'cf-tooltip';

    let shortcutHtml = '';
    if (shortcutKey) {
        const fmtKey = isMac
            ? shortcutKey.replace('Ctrl', '⌘').replace('Shift', '⇧').replace('Space', 'Space').replace(/\+/g, ' ')
            : shortcutKey.replace(/\+/g, '+');

        shortcutHtml = `<span class="cf-tooltip-keys">${fmtKey}</span>`;
    }

    tooltip.innerHTML = `
        <span class="cf-tooltip-label">${label}</span>
        ${shortcutHtml}
    `;

    btn.appendChild(tooltip);

    return btn;
}

function createDivider() {
    const div = document.createElement('div');
    div.className = 'chat-focus-controls-divider';
    return div;
}

export function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startBottom, startRight;

    element.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        startBottom = window.innerHeight - rect.bottom;
        startRight = window.innerWidth - rect.right;
        element.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        element.style.bottom = `${Math.max(0, startBottom - deltaY)}px`;
        element.style.right = `${Math.max(0, startRight - deltaX)}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            saveControlsPosition({ bottom: element.style.bottom, right: element.style.right });
        }
    });
}