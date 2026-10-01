<script setup lang="ts">
defineProps<{
  mode: "login" | "signup";
  fields: Record<string, string>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
}>();

defineEmits<{
  (e: "updateField", key: string, value: string): void;
  (e: "blurField", key: string): void;
}>();
</script>

<template>
  <div class="fields-container">
    <div v-if="mode === 'signup'" class="field">
      <label for="name">Name</label>
      <input
        id="name"
        :value="fields.name"
        @input="$emit('updateField', 'name', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blurField', 'name')"
        type="text"
        autocomplete="name"
        placeholder="Avi Katz"
        :class="{ invalid: touched.name && errors.name }"
      />
      <p v-if="touched.name && errors.name" class="field-error">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        :value="fields.email"
        @input="$emit('updateField', 'email', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blurField', 'email')"
        type="email"
        autocomplete="email"
        placeholder="you@library.com"
        :class="{ invalid: touched.email && errors.email }"
      />
      <p v-if="touched.email && errors.email" class="field-error">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input
        id="password"
        :value="fields.password"
        @input="$emit('updateField', 'password', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blurField', 'password')"
        type="password"
        :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
        :class="{ invalid: touched.password && errors.password }"
      />
      <p v-if="touched.password && errors.password" class="field-error">{{ errors.password }}</p>
    </div>

    <div v-if="mode === 'signup'" class="field">
      <label for="confirm">Confirm password</label>
      <input
        id="confirm"
        :value="fields.confirmPassword"
        @input="$emit('updateField', 'confirmPassword', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blurField', 'confirmPassword')"
        type="password"
        autocomplete="new-password"
        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
        :class="{ invalid: touched.confirmPassword && errors.confirmPassword }"
      />
      <p v-if="touched.confirmPassword && errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</p>
    </div>
  </div>
</template>

<style scoped>
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
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.field input::placeholder { color: #b7ad98; }

.field input:focus {
  border-color: var(--stain);
  box-shadow: 0 0 0 3px rgba(169, 113, 63, 0.15);
}

.field input.invalid { border-color: var(--error); }

.field input.invalid:focus {
  box-shadow: 0 0 0 3px rgba(179, 69, 47, 0.15);
}

.field-error {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: var(--error);
}
</style>