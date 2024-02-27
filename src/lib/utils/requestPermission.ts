type WithClipboardPermission = PermissionName | 'clipboard-read' | 'clipboard-write';

const requestPermission = (permission: WithClipboardPermission) => {
    return navigator.permissions.query({ name: permission as PermissionName });
};

export default requestPermission;
