export const isPreview = () => {
    return false;
};

export const isE2E = () =>
    !!['true', '1'].includes(process.env.REACT_APP_IS_E2E?.toLowerCase() || '');

export const isUnit = () =>
    !!['true', '1'].includes(process.env.REACT_APP_IS_UNIT?.toLowerCase() || '');
