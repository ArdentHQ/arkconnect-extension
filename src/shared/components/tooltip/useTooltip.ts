import { type Instance } from 'tippy.js';

export const useTooltip = (properties?: {
  hideAfter?: number;
}): {
  handleShow: (instance: Instance) => void;
} => {
  const handleShow = (instance: Instance): void => {
    if (!properties?.hideAfter) {
      return;
    }

    setTimeout(() => {
      instance.hide();
    }, properties.hideAfter);
  };

  return {
    handleShow,
  };
};
