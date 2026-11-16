// Shared confirm dialog state. One <ConfirmDialog /> is mounted in app.vue.
// confirm({ title, message, confirmLabel, cancelLabel }) -> Promise<boolean>
let resolver = null;

export const useConfirm = () => {
  const { t } = useLocale();

  // Labels default to the current locale at the time confirm() is called.
  const defaults = () => ({
    title: "",
    message: "",
    confirmLabel: t("common.remove"),
    cancelLabel: t("common.cancel"),
  });

  const state = useState("confirm-dialog", () => ({
    open: false,
    ...defaults(),
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
    state.value = { ...defaults(), ...options, open: true };
    return new Promise((resolve) => {
      resolver = resolve;
    });
  };

  return { state, confirm, settle };
};
