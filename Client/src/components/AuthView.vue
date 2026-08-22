<script setup>
import { reactive, ref, computed } from "vue";
import { authApi } from "../services/api";

const emit = defineEmits(["authenticated"]);

const mode = ref("login"); // 'login' | 'signup'
const loading = ref(false);
const serverError = ref("");

const fields = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
});

const errors = computed(() => {
  const e = {};

  if (mode.value === "signup" && !fields.name.trim()) {
    e.name = "Enter your name.";
  }

  if (!fields.email.trim()) {
    e.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    e.email = "Enter a valid email address.";
  }

  if (!fields.password) {
    e.password = "Enter your password.";
  } else if (mode.value === "signup" && fields.password.length < 6) {
    e.password = "Use at least 6 characters.";
  }

  if (mode.value === "signup" && fields.confirmPassword !== fields.password) {
    e.confirmPassword = "Passwords don\u2019t match.";
  }

  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

function touchAll() {
  touched.name = true;
  touched.email = true;
  touched.password = true;
  touched.confirmPassword = true;
}

function switchMode(next) {
  if (mode.value === next) return;
  mode.value = next;
  serverError.value = "";
  touched.name = false;
  touched.email = false;
  touched.password = false;
  touched.confirmPassword = false;
}

async function submit() {
  serverError.value = "";
  touchAll();
  if (!isValid.value) return;

  loading.value = true;
  try {
    const data =
      mode.value === "login"
        ? await authApi.login({
            email: fields.email,
            password: fields.password,
          })
        : await authApi.signup({
            name: fields.name,
            email: fields.email,
            password: fields.password,
          });

    // Token is now in localStorage (handled inside authApi). Tell the
    // parent immediately so it can drop straight to the blank state.
    emit("authenticated", data.user);
  } catch (err) {
    serverError.value = err.message || "Something went wrong. Try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-screen">
    <section class="brand-panel">
      <div class="stain-mark" aria-hidden="true">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <path
            class="ring ring-a"
            d="M200 40c92 0 158 66 158 152s-70 158-158 158S46 278 46 192 108 40 200 40Z"
          />
          <path
            class="ring ring-b"
            d="M214 70c76 4 132 66 128 140s-70 128-146 122S66 260 70 186 138 66 214 70Z"
          />
        </svg>
      </div>

      <div class="brand-copy">
        <p class="eyebrow">Est. one spilled cup, and never the same since</p>
        <h1>The Coffee&#8209;Stain Library</h1>
        <p class="tagline">
          Every book has a home, and every home is tracked &mdash; even the ones
          currently out on loan.
        </p>
      </div>

      <p class="brand-footnote">
        A member account gets you borrowing privileges. Staff accounts manage
        the shelves.
      </p>
    </section>

    <section class="form-panel">
      <div class="card">
        <div class="tabs" role="tablist" aria-label="Choose sign in method">
          <button
            type="button"
            role="tab"
            :aria-selected="mode === 'login'"
            class="tab"
            :class="{ active: mode === 'login' }"
            @click="switchMode('login')"
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="mode === 'signup'"
            class="tab"
            :class="{ active: mode === 'signup' }"
            @click="switchMode('signup')"
          >
            New member
          </button>
          <span
            class="tab-thumb"
            :class="{ right: mode === 'signup' }"
            aria-hidden="true"
          />
        </div>

        <transition name="swap" mode="out-in">
          <form :key="mode" class="form" novalidate @submit.prevent="submit">
            <h2>{{ mode === "login" ? "Welcome back" : "Get your card" }}</h2>
            <p class="form-sub">
              {{
                mode === "login"
                  ? "Sign in to see what you\u2019ve got out and what\u2019s free to borrow."
                  : "A couple of details and you\u2019re ready to borrow."
              }}
            </p>

            <div v-if="mode === 'signup'" class="field">
              <label for="name">Name</label>
              <input
                id="name"
                v-model="fields.name"
                type="text"
                autocomplete="name"
                placeholder="Avi Katz"
                :class="{ invalid: touched.name && errors.name }"
                @blur="touched.name = true"
              />
              <p v-if="touched.name && errors.name" class="field-error">
                {{ errors.name }}
              </p>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="fields.email"
                type="email"
                autocomplete="email"
                placeholder="you@library.com"
                :class="{ invalid: touched.email && errors.email }"
                @blur="touched.email = true"
              />
              <p v-if="touched.email && errors.email" class="field-error">
                {{ errors.email }}
              </p>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="fields.password"
                type="password"
                :autocomplete="
                  mode === 'login' ? 'current-password' : 'new-password'
                "
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                :class="{ invalid: touched.password && errors.password }"
                @blur="touched.password = true"
              />
              <p v-if="touched.password && errors.password" class="field-error">
                {{ errors.password }}
              </p>
            </div>

            <div v-if="mode === 'signup'" class="field">
              <label for="confirm">Confirm password</label>
              <input
                id="confirm"
                v-model="fields.confirmPassword"
                type="password"
                autocomplete="new-password"
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                :class="{
                  invalid: touched.confirmPassword && errors.confirmPassword,
                }"
                @blur="touched.confirmPassword = true"
              />
              <p
                v-if="touched.confirmPassword && errors.confirmPassword"
                class="field-error"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>

            <p v-if="serverError" class="server-error" role="alert">
              {{ serverError }}
            </p>

            <button type="submit" class="submit" :disabled="loading">
              <span v-if="!loading">{{
                mode === "login" ? "Sign in" : "Create account"
              }}</span>
              <span v-else class="spinner" aria-hidden="true" />
            </button>
          </form>
        </transition>
      </div>
    </section>
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

/* ---------- brand panel ---------- */
.brand-panel {
  position: relative;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem 3.5rem;
  overflow: hidden;
}

.stain-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 640px;
  height: 640px;
  transform: translate(-42%, -55%);
  opacity: 0.9;
  pointer-events: none;
}

.stain-mark .ring {
  fill: none;
  stroke: var(--stain);
}

.ring-a {
  stroke-width: 3;
  opacity: 0.35;
}

.ring-b {
  stroke-width: 2;
  opacity: 0.22;
  stroke: var(--gold);
}

.brand-copy {
  position: relative;
  max-width: 30rem;
}

.eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0 0 1.1rem;
}

.brand-copy h1 {
  font-family: "Fraunces", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-size: clamp(2.2rem, 3.4vw, 3.1rem);
  line-height: 1.08;
  margin: 0 0 1.1rem;
}

.tagline {
  font-size: 1.02rem;
  line-height: 1.6;
  color: #d8d2c4;
  margin: 0;
}

.brand-footnote {
  position: relative;
  font-size: 0.86rem;
  color: #a49c8b;
  max-width: 24rem;
  line-height: 1.5;
  margin: 0;
}

/* ---------- form panel ---------- */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
}

.card {
  width: 100%;
  max-width: 26rem;
}

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

.form h2 {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 1.65rem;
  margin: 0 0 0.4rem;
}

.form-sub {
  font-size: 0.92rem;
  color: #6b6350;
  margin: 0 0 1.8rem;
  line-height: 1.5;
}

.field {
  margin-bottom: 1.15rem;
}

.field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--ink-soft);
}

.field input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  font-family: inherit;
  font-size: 0.96rem;
  color: var(--ink);
  background: #fff;
  border: 1.5px solid #e2d6b8;
  border-radius: 10px;
  outline: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.field input::placeholder {
  color: #b7ad98;
}

.field input:focus {
  border-color: var(--stain);
  box-shadow: 0 0 0 3px rgba(169, 113, 63, 0.15);
}

.field input.invalid {
  border-color: var(--error);
}

.field input.invalid:focus {
  box-shadow: 0 0 0 3px rgba(179, 69, 47, 0.15);
}

.field-error {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: var(--error);
}

.server-error {
  background: rgba(179, 69, 47, 0.09);
  border: 1px solid rgba(179, 69, 47, 0.25);
  color: var(--stain-dark);
  font-size: 0.86rem;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  margin: 0 0 1.15rem;
}

.submit {
  width: 100%;
  padding: 0.85rem;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--paper);
  background: var(--ink);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.1rem;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.submit:hover:not(:disabled) {
  background: var(--stain-dark);
}

.submit:active:not(:disabled) {
  transform: translateY(1px);
}

.submit:disabled {
  opacity: 0.75;
  cursor: default;
}

.spinner {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2.5px solid rgba(247, 241, 228, 0.35);
  border-top-color: var(--paper);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .submit,
  .tab-thumb,
  .swap-enter-active,
  .swap-leave-active,
  .spinner {
    transition: none;
    animation-duration: 0.01ms !important;
  }
}

@media (max-width: 860px) {
  .auth-screen {
    grid-template-columns: 1fr;
  }
  .brand-panel {
    padding: 3rem 2rem 2.5rem;
    min-height: 260px;
  }
  .stain-mark {
    width: 420px;
    height: 420px;
  }
  .form-panel {
    padding: 2rem 1.25rem 3rem;
  }
}
</style>
