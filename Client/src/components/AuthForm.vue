<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { authApi } from "../services/api";
import AuthTabs from "./AuthTabs.vue";
import AuthFields from "./AuthFields.vue";

const emit = defineEmits(["authenticated"]);
type AuthMode = "login" | "signup";
const MinPasswordLength = 6;
const mode = ref<AuthMode>("login");
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
  const validationErrors: Record<string, string> = {};

  if (mode.value === "signup" && !fields.name.trim()) {
    validationErrors.name = "Enter your name.";
  }

  if (!fields.email.trim()) {
    validationErrors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    validationErrors.email = "Enter a valid email address.";
  }

  if (!fields.password) {
    validationErrors.password = "Enter your password.";
  } else if (mode.value === "signup" && fields.password.length < MinPasswordLength) {
    validationErrors.password = `Use at least ${MinPasswordLength} characters.`;
  }

  if (mode.value === "signup" && fields.confirmPassword !== fields.password) {
    validationErrors.confirmPassword = "Passwords don\u2019t match.";
  }

  return validationErrors;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

function touchAll() {
  Object.keys(touched).forEach((key) => {
    touched[key as keyof typeof touched] = true;
  });
}

const changeMode = (next: AuthMode) => {
  if (mode.value === next) return;
  mode.value = next;
  serverError.value = "";
  Object.keys(touched).forEach((key) => (touched[key as keyof typeof touched] = false));
};

async function submit() {
  serverError.value = "";
  touchAll();
  if (!isValid.value) return;

  loading.value = true;
  try {
    const data =
      mode.value === "login"
        ? await authApi.login({ email: fields.email, password: fields.password })
        : await authApi.signup({ name: fields.name, email: fields.email, password: fields.password });

    emit("authenticated", data.user);
  } catch (error: unknown) {
    serverError.value = error instanceof Error ? error.message : "Something went wrong. Try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="form-panel">
    <div class="card">
      <AuthTabs :mode="mode" @update:mode="changeMode" />

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

          <AuthFields
            :mode="mode"
            :fields="fields"
            :touched="touched"
            :errors="errors"
            @updateField="(key, val) => (fields[key as keyof typeof fields] = val)"
            @blurField="(key) => (touched[key as keyof typeof touched] = true)"
          />

          <p v-if="serverError" class="server-error" role="alert">
            {{ serverError }}
          </p>

          <button type="submit" class="submit" :disabled="loading">
            <span v-if="!loading">{{ mode === "login" ? "Sign in" : "Create account" }}</span>
            <span v-else class="spinner" aria-hidden="true" />
          </button>
        </form>
      </transition>
    </div>
  </section>
</template>

<style scoped>
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
  transition: background 0.2s ease, transform 0.15s ease;
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
  to { transform: rotate(360deg); }
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.swap-enter-from { opacity: 0; transform: translateY(4px); }
.swap-leave-to { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  .submit, .swap-enter-active, .swap-leave-active, .spinner {
    transition: none;
    animation-duration: 0.01ms !important;
  }
}

@media (max-width: 860px) {
  .form-panel {
    padding: 2rem 1.25rem 3rem;
  }
}
</style>