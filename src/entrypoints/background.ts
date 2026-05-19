// Listeners are registered as top-level side effects in @/background, which is
// what MV3 service workers require. The proper restructure into defineBackground
// happens in the "move background + content scripts to wxt entrypoints" subtask.
import '@/background';

export default defineBackground(() => {});
