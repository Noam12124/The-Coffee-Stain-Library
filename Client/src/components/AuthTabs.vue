<script setup lang="ts">
defineProps<{
  mode: "login" | "signup";
}>();
defineEmits(["update:mode"]);
</script>

<template>
  <div class="tabs" role="tablist" aria-label="Choose sign in method">
    <button
      type="button"
      role="tab"
      :aria-selected="mode === 'login'"
      class="tab"
      :class="{ active: mode === 'login' }"
      @click="$emit('update:mode', 'login')"
    >
      Sign in
    </button>
    <button
      type="button"
      role="tab"
      :aria-selected="mode === 'signup'"
      class="tab"
      :class="{ active: mode === 'signup' }"
      @click="$emit('update:mode', 'signup')"
    >
      New member
    </button>
    <span
      class="tab-thumb"
      :class="{ right: mode === 'signup' }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--paper-dim);
  border: 1px solid #e2d6b8;
  border-radius: 999px;
  padding: 0.3rem;
  margin-bottom: 2.2rem;
}

.tab {
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  padding: 0.65rem 1rem;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  color: #6b6350;
  cursor: pointer;
  border-radius: 999px;
  transition: color 0.25s ease;
}

.tab.active {
  color: var(--paper);
}

.tab-thumb {
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  width: calc(50% - 0.3rem);
  height: calc(100% - 0.6rem);
  background: var(--ink);
  border-radius: 999px;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-thumb.right {
  transform: translateX(100%);
}
</style>