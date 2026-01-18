import { ChatGPTAdapter } from './sites/chatgpt/adapter.js';
import { loadSettings } from './storage/settings.js';
import { initMessageFolding } from './features/message-folding/folding.js';
import { initTOC } from './features/table-of-contents/toc.js';
import { initControls } from './features/controls/floating-controls.js';
import { initCodeMode } from './features/code-mode/code-mode.js';

// Detect site and load adapter
const adapter = ChatGPTAdapter; // Auto-detect in production

async function init() {
    await loadSettings();
    adapter.init();

    // Initialize features
    initMessageFolding(adapter);
    initTOC(adapter);
    initControls();
    initCodeMode();
}

init();