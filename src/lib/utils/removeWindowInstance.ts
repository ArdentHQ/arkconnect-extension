import browser from 'webextension-polyfill';

const removeWindowInstance = async (id?: number, delay?: number) => {
  if (!id) return;
  if (delay) {
    const timeout = setTimeout(async () => {
      await browser.windows.remove(id);
      clearTimeout(timeout);
    }, delay);
    return;
  }
  await browser.windows.remove(id);
};

export default removeWindowInstance;
