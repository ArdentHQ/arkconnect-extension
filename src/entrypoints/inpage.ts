// Injected into the page by the content script. Made web-accessible properly
// in the "move inpage script over" subtask.
export default defineUnlistedScript(() => {
    import('@/inpage');
});
