export default defineContentScript({
    matches: ['https://*/*'],
    runAt: 'document_start',
    async main() {
        // Dynamic import keeps the heavy app graph (axios/ledger) out of wxt's
        // config loader, which evaluates this file under vite-node (no DOM).
        const { startContentScript } = await import('@/content');
        startContentScript();
    },
});
