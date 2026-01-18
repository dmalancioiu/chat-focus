import { ICONS } from '../../core/icons.js';
import { controlsPosition } from '../../core/state.js';
import { saveControlsPosition } from '../../storage/settings.js';
import { toggleExpandCollapseAll, checkExpandCollapseState } from './actions.js';
import { toggleCodeMode } from '../code-mode/code-mode.js';
import { toggleTOC } from '../table-of-contents/toc.js';
import { toggleExtension } from '../../main.js'; // You will export this from main

export function createFloatingControls() {
    if (document.getElementById('chat-focus-controls')) return;

    const controls = document.createElement('div');
    controls.id = 'chat-focus-controls';
    controls.className = 'chat-focus-controls';

    if (controlsPosition.value) {
        controls.style.bottom = controlsPosition.value.bottom;
        controls.style.right = controlsPosition.value.right;
    }

    const toggleBtn = createButton('toggle-expand', 'Expand All', ICONS.expand, toggleExpandCollapseAll);
    const codeBtn = createButton('code-mode', 'Code Only', ICONS.code, toggleCodeMode);
    const tocBtn = createButton('toc', 'Contents', ICONS.list, toggleTOC);
    const settingsBtn = createButton('settings', 'Toggle Extension', ICONS.settings, toggleExtension);

    controls.append(toggleBtn, createDivider(), codeBtn, createDivider(), tocBtn, settingsBtn);
    document.body.appendChild(controls);

    makeDraggable(controls);
    checkExpandCollapseState(); // Update button icon initially
}

function createButton(cls, label, icon, handler) {
    const btn = document.createElement('button');
    btn.className = `chat-focus-controls-btn ${cls}`;
    btn.ariaLabel = label;
    btn.innerHTML = icon;
    btn.addEventListener('click', handler);
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