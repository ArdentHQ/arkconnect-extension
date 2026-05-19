// Thin wrapper around the existing content script. Proper restructure (and
// fixing the hardcoded src/inpage.js inject path) happens in later subtasks.
export default defineContentScript({
    matches: ['https://*/*'],
    runAt: 'document_start',
    main() {
        import('@/content');
    },
});
