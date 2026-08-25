<script setup>
import { ref, computed } from "vue";
import { authApi } from "./services/api";
import AuthView from "./components/AuthView.vue";
import HomeView from "./components/HomeView.vue";

const isAuthenticated = ref(authApi.isAuthenticated());

const currentUser = computed(() => authApi.getUser());

function handleAuthenticated() {
  isAuthenticated.value = true;
}

function handleLogout() {
  authApi.logout();
  isAuthenticated.value = false;
}
</script>

<template>
  <AuthView v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  <HomeView
    v-else
    :current-user="currentUser"
    @logout="handleLogout"
  />
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
</style>
