declare const chrome: {
    runtime: { getManifest(): { action?: { default_popup?: string } } };
    action: {
        setPopup(details: { popup: string }): Promise<void>;
        openPopup?(details?: { windowId?: number }): Promise<void>;
    };
    sidePanel?: {
        setPanelBehavior(behavior: { openPanelOnActionClick: boolean }): Promise<void>;
        open(details: { windowId: number }): Promise<void>;
    };
};

const defaultPopupPath = chrome.runtime.getManifest().action?.default_popup ?? '';

export const applySidepanelMode = async (enabled: boolean): Promise<void> => {
    if (!chrome.sidePanel) {
        return;
    }

    if (enabled) {
        await chrome.action.setPopup({ popup: '' });
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } else {
        await chrome.action.setPopup({ popup: defaultPopupPath });
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
    }
};

export const openPopupForWindow = async (windowId: number): Promise<void> => {
    await chrome.action.openPopup?.({ windowId });
};

export const openSidepanel = async (windowId: number): Promise<void> => {
    await chrome.sidePanel?.open({ windowId });
};
