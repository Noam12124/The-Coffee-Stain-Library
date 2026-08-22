<script setup>
import { ref } from "vue";
import { authApi } from "./services/api";
import AuthView from "./components/AuthView.vue";

// Single source of truth for "are we authenticated". Starts from
// whatever's already in localStorage (e.g. a refreshed page).
const isAuthenticated = ref(authApi.isAuthenticated());

function handleAuthenticated() {
  // Token is already written to localStorage inside authApi by this
  // point. Flipping this ref is what swaps the whole screen to blank —
  // no intermediate "welcome" state, no layout chrome, per spec.
  isAuthenticated.value = true;
}
</script>

<template>
  <!--
    Not authenticated -> AuthView (login/signup).
    Authenticated     -> nothing but an empty container. Build your real
    authenticated app inside this div later; for now it's intentionally
    blank, exactly as specified.
  -->
  <AuthView v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  <div v-else class="authenticated-shell" />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  max-width: none;
}

.authenticated-shell {
  min-height: 100vh;
  width: 100%;
}
</style>
