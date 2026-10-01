import { createRouter, createWebHistory } from "vue-router";
import AuthView from "./components/AuthView.vue";
import HomeView from "./components/HomeView.vue";
import { authApi } from "./services/api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: AuthView, meta: { guestOnly: true } },
    {
      path: "/",
      component: HomeView,
      props: () => ({ currentUser: authApi.getUser() }),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const loggedIn = authApi.isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) return "/login";
  if (to.meta.guestOnly && loggedIn) return "/";
});

export default router;