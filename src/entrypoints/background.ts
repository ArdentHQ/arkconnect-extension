// MV3 requires the service worker to register its listeners synchronously on
// startup, so the background logic stays a top-level side-effect module
// (see @/background). A side-effect import is also what keeps wxt's DOM-less
// config loader from evaluating the heavy app graph. This is the canonical
// background entrypoint — the definition wxt builds from.
import '@/background';

export default defineBackground(() => {});
