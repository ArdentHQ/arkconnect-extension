import browser from 'webextension-polyfill';

const keepServiceWorkerAlive = () => {
  const keepAliveInterval = setInterval(browser.runtime.getPlatformInfo, 20e3);
  const keepAlive = () => keepAliveInterval;

  browser.runtime.onStartup.addListener(() => {
    keepAlive();
  });

  browser.runtime.onSuspend.addListener(() => {
    clearInterval(keepAliveInterval);
  });

  keepAlive();
};

export default keepServiceWorkerAlive;
