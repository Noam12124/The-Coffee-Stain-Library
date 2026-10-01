import { ref } from "vue";
import type { ToastType } from "../types/book";
const TOAST_DURATION_MS = 4000;
export function useToast() {
  const toast = ref<{ message: string; type: ToastType } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  function showToast(message: string, type: ToastType) {
    if (toastTimer !== null) clearTimeout(toastTimer);
    toast.value = { message, type };
    toastTimer = setTimeout(() => (toast.value = null), TOAST_DURATION_MS);
  }

  return { toast, showToast };
}