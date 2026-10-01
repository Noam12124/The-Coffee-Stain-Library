<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Book, ModalState } from "../types/book";
import type { User } from "../types/user";

import { useToast } from "../composables/useToast";
import { useBooks } from "../composables/useBooks";

import NavBar from "../components/NavBar.vue";
import QuotaBar from "../components/QuotaBar.vue";
import BookCard from "../components/BookCard.vue";
import BookAdminModal from "../components/BookAdminModal.vue";
import ToastNotification from "../components/ToastNotification.vue";

const props = defineProps<{
  currentUser: User | null;
}>();
const emit = defineEmits(["logout"]);

const isAdmin = computed(() => props.currentUser?.role === "admin");

const { toast, showToast } = useToast();

const {
  books,
  filter,
  loading,
  actionLoading,
  filteredBooks,
  myBorrowedCount,
  loadBooks,
  borrow,
  returnBook,
  deleteBook,
  isMyBook,
} = useBooks(showToast, props.currentUser?.userId);

onMounted(loadBooks);

const modal = ref<ModalState>(null);

function openAdd() {
  modal.value = { mode: "add" };
}

function openEdit(book: Book) {
  modal.value = { mode: "edit", book };
}

function closeModal() {
  modal.value = null;
}

async function handleModalSuccess(message: string) {
  showToast(message, "ok");
  await loadBooks();
  closeModal();
}
</script>

<template>
  <div class="home">
    <NavBar
      :current-user="currentUser"
      :is-admin="isAdmin"
      @logout="emit('logout')"
    />

    <main class="main-content">
      <QuotaBar v-if="!isAdmin" :my-borrowed-count="myBorrowedCount" />


      <div class="controls">
        <div class="filter-tabs" role="tablist" aria-label="Filter books">
          <button
            v-for="tab in [
              { key: 'all',       label: 'All books' },
              { key: 'available', label: 'Available' },
              { key: 'borrowed',  label: 'On loan' },
            ]"
            :key="tab.key"
            class="filter-tab"
            :class="{ active: filter === tab.key }"
            role="tab"
            :aria-selected="filter === tab.key"
            @click="filter = tab.key"
          >
            {{ tab.label }}
            <span class="tab-count">
              {{
                tab.key === 'all'       ? books.length :
                tab.key === 'available' ? books.filter(b => !b.borrowed).length :
                                          books.filter(b =>  b.borrowed).length
              }}
            </span>
          </button>
        </div>

        <button v-if="isAdmin" class="btn-add" @click="openAdd">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
          </svg>
          Add book
        </button>
      </div>


      <div v-if="loading" class="book-grid">
        <div v-for="n in 8" :key="n" class="book-card skeleton" aria-hidden="true">
          <div class="cover-skeleton" />
          <div class="card-body">
            <div class="skel-line wide" /><div class="skel-line narrow" />
          </div>
        </div>
      </div>

      <div v-else-if="filteredBooks.length === 0" class="empty-state">
        <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="var(--stain)" stroke-width="1.5">
          <rect x="10" y="8" width="44" height="52" rx="4"/>
          <line x1="22" y1="22" x2="42" y2="22"/>
          <line x1="22" y1="32" x2="42" y2="32"/>
          <line x1="22" y1="42" x2="34" y2="42"/>
        </svg>
        <p>No books match this filter.</p>
      </div>

      <div v-else class="book-grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.bookId"
          :book="book"
          :is-admin="isAdmin"
          :is-my-book="isMyBook(book)"
          :action-loading="actionLoading"
          :my-borrowed-count="myBorrowedCount"
          @borrow="borrow"
          @return-book="returnBook"
          @edit="openEdit"
          @delete-book="deleteBook"
        />
      </div>
    </main>

    <ToastNotification :toast="toast" />

    <BookAdminModal
      :modal="modal"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap");

.home {
  --ink:        #1e2a22;
  --ink-soft:   #2b3a30;
  --paper:      #f7f1e4;
  --paper-dim:  #efe6d3;
  --stain:      #a9713f;
  --stain-dark: #6f4a2b;
  --gold:       #c9a66b;
  --error:      #b3452f;
  --ok:         #3a7d52;
  --border:     #e2d6b8;

  min-height: 100vh;
  background: var(--paper);
  font-family: "Inter", system-ui, sans-serif;
  color: var(--ink);
}

* { box-sizing: border-box; }

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.35rem;
  background: var(--paper-dim);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.28rem;
}

.filter-tab {
  padding: 0.5rem 1.1rem;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 600;
  color: #6b6350;
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: background .2s, color .2s;
}

.filter-tab:hover { color: var(--ink); }

.filter-tab.active {
  background: var(--ink);
  color: var(--paper);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
}

.filter-tab:not(.active) .tab-count {
  background: rgba(30,42,34,.1);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.3rem;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--paper);
  background: var(--stain);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background .2s, transform .15s;
}
.btn-add:hover  { background: var(--stain-dark); }
.btn-add:active { transform: translateY(1px); }

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.skeleton { pointer-events: none; }

.cover-skeleton {
  aspect-ratio: 2 / 3;
  background: linear-gradient(90deg, var(--paper-dim) 25%, #e8dcc6 50%, var(--paper-dim) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skel-line {
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--paper-dim) 25%, #e8dcc6 50%, var(--paper-dim) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  margin-bottom: 0.5rem;
}
.skel-line.wide   { width: 80%; }
.skel-line.narrow { width: 55%; }

@keyframes shimmer {
  to { background-position: -200% 0; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 0;
  color: #9a8c78;
  font-size: 0.95rem;
}
.empty-state p { margin: 0; }

@media (max-width: 700px) {
  .main-content { padding: 1.25rem 1rem 3rem; }
  .book-grid    { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .controls     { flex-direction: column; align-items: stretch; }
  .filter-tabs  { justify-content: center; }
  .btn-add      { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .btn-add { transition: none; }
  .cover-skeleton, .skel-line { animation-duration: 0.01ms !important; }
}
</style>