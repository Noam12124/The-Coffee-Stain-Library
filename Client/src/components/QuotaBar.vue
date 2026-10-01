<script setup lang="ts">
const MAX_BORROWED_BOOKS = 3;
defineProps<{
  myBorrowedCount: number;
}>();
</script>

<template>
  <div class="quota-bar">
    <div class="quota-label">
      <span>My borrowed books</span>
      <strong>{{ myBorrowedCount }} / {{ MAX_BORROWED_BOOKS }}</strong>
    </div>
    <div class="quota-track">
      <div
        class="quota-fill"
        :style="{ width: `${(myBorrowedCount / MAX_BORROWED_BOOKS) * 100}%` }"
        :class="{ full: myBorrowedCount >= MAX_BORROWED_BOOKS }"
      />
    </div>
    <p v-if="myBorrowedCount >= MAX_BORROWED_BOOKS" class="quota-warn">
      Quota reached — return a book before borrowing another.
    </p>
  </div>
</template>

<style scoped>
.quota-bar {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1rem 1.4rem;
  margin-bottom: 2rem;
  max-width: 380px;
}

.quota-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--ink-soft);
  margin-bottom: 0.5rem;
}

.quota-track {
  height: 6px;
  background: var(--paper-dim);
  border-radius: 999px;
  overflow: hidden;
}

.quota-fill {
  height: 100%;
  background: var(--stain);
  border-radius: 999px;
  transition: width 0.4s ease;
}
.quota-fill.full { background: var(--error); }

.quota-warn {
  margin: 0.55rem 0 0;
  font-size: 0.8rem;
  color: var(--error);
}

@media (prefers-reduced-motion: reduce) {
  .quota-fill { transition: none; }
}
</style>