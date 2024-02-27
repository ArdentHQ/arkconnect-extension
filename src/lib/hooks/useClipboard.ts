import useToast from './useToast';
import { ToastPosition } from '@/components/toast/ToastContainer';
import requestPermission from '@/lib/utils/requestPermission';

const useClipboard = () => {
  const toast = useToast();
  const copy = (textToCopy: string, toastMessage?: string, toastPosition?: ToastPosition) => {
    navigator.clipboard.writeText(textToCopy);
    toast(
      'success',
      `${toastMessage || textToCopy} copied to clipboard`,
      toastPosition || ToastPosition.LOWER,
    );
  };

  const paste = async () => {
    try {
      const permissionStatus = await requestPermission('clipboard-read');
      if (permissionStatus.state === 'granted') {
        const clipboardData = await navigator.clipboard.readText();
        return clipboardData;
      } else {
        toast('danger', 'Unable to access clipboard. Paste manually.', ToastPosition.EXTRA_HIGH);
      }
    } catch {
      toast('danger', 'Unable to access clipboard. Paste manually.', ToastPosition.EXTRA_HIGH);
    }
  };

  return {
    copy,
    paste,
  };
};

export default useClipboard;
