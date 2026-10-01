<script setup lang="ts">
import type { User } from "../services/api";

defineProps<{
  currentUser: User | null;
  isAdmin: boolean;
}>();

const emit = defineEmits(["logout"]);
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="brand">
        <svg class="brand-stain" viewBox="0 0 40 40" aria-hidden="true">
          <ellipse cx="20" cy="20" rx="17" ry="16" fill="none" stroke="var(--stain)" stroke-width="2" opacity=".5"/>
          <ellipse cx="22" cy="21" rx="13" ry="12" fill="none" stroke="var(--gold)" stroke-width="1.2" opacity=".4"/>
        </svg>
        <span class="brand-name">The Coffee&#8209;Stain Library</span>
      </div>

      <div class="nav-right">
        <span class="user-pill">
          <span class="user-role-dot" :class="isAdmin ? 'admin' : 'member'" />
          {{ currentUser?.email }}
          <span class="user-role-label">{{ isAdmin ? "Admin" : "Member" }}</span>
        </span>
        <button class="btn-logout" @click="emit('logout')">Sign out</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--ink);
  color: var(--paper);
  border-bottom: 2px solid var(--stain-dark);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
}

.brand-stain {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.brand-name {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 1.05rem;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #c8c0ae;
}

.user-role-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.user-role-dot.admin  { background: var(--gold); }
.user-role-dot.member { background: var(--stain); }

.user-role-label {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.btn-logout {
  padding: 0.45rem 1rem;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--paper);
  background: transparent;
  border: 1.5px solid rgba(247,241,228,.25);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color .18s, background .18s;
}
.btn-logout:hover { border-color: var(--gold); background: rgba(201,166,107,.08); }

@media (max-width: 700px) {
  .navbar-inner { padding: 0 1rem; }
  .brand-name   { font-size: 0.9rem; }
  .user-pill    { display: none; }
}
</style>