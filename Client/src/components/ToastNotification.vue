<script setup lang="ts">
import type { ToastType } from "../types/book";

defineProps<{
  toast: { message: string; type: ToastType } | null;
}>();
</script>

<template>
  <Transition name="toast">
    <div v-if="toast" class="toast" :class="toast.type" role="alert">
      <svg v-if="toast.type === 'ok'" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="2,9 6,13 14,4"/>
      </svg>
      <svg v-else viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>
      </svg>
      {{ toast.message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.3rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
  z-index: 200;
  white-space: nowrap;
}

.toast.ok  { background: var(--ink); color: var(--paper); }
.toast.err { background: var(--error); color: #fff; }

.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s; }
.toast-enter-from  { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to    { opacity: 0; transform: translateX(-50%) translateY(10px); }

@media (prefers-reduced-motion: reduce) {
  .toast { transition: none; }
}
</style>