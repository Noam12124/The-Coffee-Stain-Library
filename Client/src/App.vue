<script setup>
import { useRouter } from "vue-router";
import { authApi } from "./services/api";

const router = useRouter();

const handleAuthenticated = () => {
  router.push("/");
};

const handleLogout = () => {
  authApi.logout();
  router.push("/login");
}
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component
      :is="Component"
      @authenticated="handleAuthenticated"
      @logout="handleLogout"
    />
  </RouterView>
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