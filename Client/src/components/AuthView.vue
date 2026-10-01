<script setup lang="ts">
import BrandPanel from "./BrandPanel.vue";
import AuthForm from "./AuthForm.vue";

const emit = defineEmits(["authenticated"]);
</script>

<template>
  <div class="auth-screen">
    <BrandPanel />
    <AuthForm @authenticated="emit('authenticated', $event)" />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap");

* {
  box-sizing: border-box;
}

.auth-screen {
  --ink: #1e2a22;
  --ink-soft: #2b3a30;
  --paper: #f7f1e4;
  --paper-dim: #efe6d3;
  --stain: #a9713f;
  --stain-dark: #6f4a2b;
  --gold: #c9a66b;
  --error: #b3452f;

  min-height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  font-family: "Inter", system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
}

@media (max-width: 860px) {
  .auth-screen {
    grid-template-columns: 1fr;
  }
}
</style>