import Swal from "sweetalert2";

// One themed SweetAlert2 instance so every dialog matches the active theme.
const base = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: "tn-swal",
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-ghost",
  },
});

export const confirmAction = async ({
  title = "Are you sure?",
  text = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = "question",
  danger = false,
}) => {
  const result = await base.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: "tn-swal",
      confirmButton: danger ? "btn btn-error" : "btn btn-primary",
      cancelButton: "btn btn-ghost",
    },
  });
  return result.isConfirmed;
};

export const showSuccess = (title, text = "", options = {}) =>
  base.fire({ icon: "success", title, text, confirmButtonText: "Done", ...options });

export const showError = (title, text = "") =>
  base.fire({ icon: "error", title, text, confirmButtonText: "Close" });

export const showInfo = (title, text = "") =>
  base.fire({ icon: "info", title, text, confirmButtonText: "Got it" });

export const getErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;
