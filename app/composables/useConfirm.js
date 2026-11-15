// Shared confirm dialog state. One <ConfirmDialog /> is mounted in app.vue.
// confirm({ title, message, confirmLabel, cancelLabel }) -> Promise<boolean>
let resolver = null;

const DEFAULTS = {
  title: "",
  message: "",
  confirmLabel: "ลบออก",
  cancelLabel: "ยกเลิก",
};

export const useConfirm = () => {
  const state = useState("confirm-dialog", () => ({
    open: false,
    ...DEFAULTS,
  }));

  const settle = (result) => {
    state.value.open = false;
    if (resolver) {
      const r = resolver;
      resolver = null;
      r(result);
    }
  };

  const confirm = (options = {}) => {
    // A new request cancels any pending one.
    if (resolver) settle(false);
    state.value = { ...DEFAULTS, ...options, open: true };
    return new Promise((resolve) => {
      resolver = resolve;
    });
  };

  return { state, confirm, settle };
};
