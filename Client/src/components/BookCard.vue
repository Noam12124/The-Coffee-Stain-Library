<script setup lang="ts">
import type { Book } from "../types/book";

defineProps<{
  book: Book;
  isAdmin: boolean;
  isMyBook: boolean;
  actionLoading: string | number | null;
  myBorrowedCount: number;
}>();

const emit = defineEmits(["borrow", "returnBook", "edit", "deleteBook"]);

function fallbackCover(error: Event) {
  const target = error.target as HTMLImageElement | null;
  if (target) {
    target.style.display = "none";
    target.nextElementSibling?.classList.add("visible");
  }
}
</script>

<template>
  <article
    class="book-card"
    :class="{ borrowed: book.borrowed, mine: isMyBook }"
  >
    <div class="cover-wrap">
      <img
        v-if="book.imageUrl"
        :src="book.imageUrl"
        :alt="`Cover of ${book.title}`"
        class="cover-img"
        loading="lazy"
        @error="fallbackCover"
      />
      <div class="cover-placeholder" :class="{ visible: !book.imageUrl }">
        <span>{{ book.title.charAt(0) }}</span>
      </div>

      <div class="status-stamp" :class="book.borrowed ? 'out' : 'in'">
        {{ book.borrowed ? "On loan" : "Available" }}
      </div>

      <div v-if="isMyBook" class="my-ribbon" aria-label="You have this book">
        Mine
      </div>
    </div>

    <div class="card-body">
      <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>

      <div class="card-actions">
        <template v-if="!isAdmin">
          <button
            v-if="isMyBook"
            class="btn-action return"
            :disabled="actionLoading === book.bookId"
            @click="emit('returnBook', book.bookId)"
          >
            <span v-if="actionLoading === book.bookId" class="btn-spin" />
            <span v-else>Return</span>
          </button>
          <button
            v-else-if="!book.borrowed"
            class="btn-action borrow"
            :disabled="actionLoading === book.bookId || myBorrowedCount >= 3"
            :title="myBorrowedCount >= 3 ? 'Return a book first' : ''"
            @click="emit('borrow', book.bookId)"
          >
            <span v-if="actionLoading === book.bookId" class="btn-spin" />
            <span v-else>Borrow</span>
          </button>
          <span v-else class="badge-borrowed">Borrowed by someone else</span>
        </template>

        <template v-else>
          <button
            class="btn-action edit"
            :disabled="actionLoading === book.bookId"
            @click="emit('edit', book)"
          >Edit</button>
          <button
            class="btn-action delete"
            :disabled="actionLoading === book.bookId || book.borrowed"
            :title="book.borrowed ? 'Cannot delete while on loan' : ''"
            @click="emit('deleteBook', book)"
          >
            <span v-if="actionLoading === book.bookId" class="btn-spin dark" />
            <span v-else>Delete</span>
          </button>
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .2s ease, box-shadow .2s ease;
}

.book-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(30,42,34,.1);
}

.book-card.borrowed { border-color: #d6c9aa; }
.book-card.mine     { border-color: var(--stain); box-shadow: 0 0 0 2px rgba(169,113,63,.18); }

.cover-wrap {
  position: relative;
  aspect-ratio: 2 / 3;
  background: var(--paper-dim);
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s ease;
}

.book-card:hover .cover-img { transform: scale(1.03); }

.cover-placeholder {
  display: none;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Fraunces", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--stain);
  background: linear-gradient(145deg, var(--paper-dim), #e8dcc6);
}
.cover-placeholder.visible { display: flex; }

.status-stamp {
  position: absolute;
  top: 10px;
  right: -28px;
  width: 100px;
  padding: 3px 0;
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  text-align: center;
  transform: rotate(45deg);
  transform-origin: center;
  pointer-events: none;
}

.status-stamp.in {
  background: var(--ok);
  color: #fff;
  right: -22px;
  top: 12px;
}

.status-stamp.out {
  background: var(--stain);
  color: #fff;
}

.my-ribbon {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: var(--ink);
  color: var(--gold);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  padding: 2px 8px;
  border-radius: 999px;
}

/* Card body */
.card-body {
  padding: 0.9rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.book-title {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.78rem;
  color: #7a7060;
  margin: 0 0 0.55rem;
}

.card-actions {
  margin-top: auto;
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.btn-action {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.6rem;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.2rem;
  transition: background .18s, opacity .18s, transform .12s;
}

.btn-action:active:not(:disabled) { transform: translateY(1px); }
.btn-action:disabled { opacity: .45; cursor: default; }

.btn-action.borrow { background: var(--ink); color: var(--paper); }
.btn-action.borrow:hover:not(:disabled) { background: var(--stain-dark); }

.btn-action.return { background: var(--paper-dim); color: var(--ink); border: 1.5px solid var(--border); }
.btn-action.return:hover:not(:disabled) { background: #e8dcc6; }

.btn-action.edit { background: var(--paper-dim); color: var(--ink); border: 1.5px solid var(--border); }
.btn-action.edit:hover:not(:disabled) { background: #e8dcc6; }

.btn-action.delete { background: rgba(179,69,47,.1); color: var(--error); }
.btn-action.delete:hover:not(:disabled) { background: rgba(179,69,47,.18); }

.badge-borrowed {
  font-size: 0.75rem;
  color: #9a8c78;
  font-style: italic;
  padding: 0.4rem 0;
}

.btn-spin {
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  border: 2px solid rgba(247,241,228,.3);
  border-top-color: var(--paper);
  animation: spin .7s linear infinite;
  display: inline-block;
}
.btn-spin.dark {
  border-color: rgba(30,42,34,.2);
  border-top-color: var(--ink);
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .book-card, .cover-img, .btn-action { transition: none; }
  .btn-spin { animation-duration: 0.01ms !important; }
}
</style>