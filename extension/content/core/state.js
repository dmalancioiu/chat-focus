/**
 * ChatFocus - Shared State
 * Individual exports for modular access
 */

// We use objects { value: ... } for primitives so they are mutable by reference
export const messageStates = new Map();
export const pinnedMessages = new Set();
export const tocVisible = { value: false };
export const tocSearchQuery = { value: '' };
export const controlsPosition = { value: null };
export const isCodeMode = { value: false };
export const statsVisible = { value: false };