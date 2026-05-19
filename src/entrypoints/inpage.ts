export default defineUnlistedScript(async () => {
    // Dynamic import keeps the provider module out of wxt's DOM-less config
    // loader (vite-node), same reason as the content script entrypoint.
    const { startInpage } = await import('@/inpage');
    startInpage();
});
