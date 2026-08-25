<script setup>
import { ref, computed, onMounted } from "vue";
import { booksApi } from "../services/api";

// ── Props & emits ─────────────────────────────────────────────────────────────
const props = defineProps({
  currentUser: { type: Object, required: true },
});
const emit = defineEmits(["logout"]);

// ── State ─────────────────────────────────────────────────────────────────────
const books       = ref([]);
const filter      = ref("all"); 
const loading     = ref(true);
const actionLoading = ref(null); 
const toast       = ref(null);   
let toastTimer    = null;

// Admin modal state
const modal = ref(null); 
const modalFields = ref({ title: "", author: "", imageUrl: "" });
const modalLoading = ref(false);
const modalError  = ref("");

// ── Derived ───────────────────────────────────────────────────────────────────
const isAdmin = computed(() => props.currentUser?.role === "admin");

const filteredBooks = computed(() => {
  if (filter.value === "available") return books.value.filter((b) => !b.borrowed);
  if (filter.value === "borrowed")  return books.value.filter((b) =>  b.borrowed);
  return books.value;
});

const myBorrowedCount = computed(() => {
  if (!props.currentUser) return 0;
  return books.value.filter(
    (b) => b.borrowed && b.userHoldingBook === props.currentUser.userId
  ).length;
});

const myBorrowedBooks = computed(() =>
  books.value.filter(
    (b) => b.borrowed && b.userHoldingBook === props.currentUser?.userId
  )
);

// ── Data loading ──────────────────────────────────────────────────────────────
async function loadBooks() {
  loading.value = true;
  try {
    books.value = await booksApi.findAll();
  } catch (e) {
    showToast(e.message || "Failed to load books.", "err");
  } finally {
    loading.value = false;
  }
}

onMounted(loadBooks);

// ── Toast helper ──────────────────────────────────────────────────────────────
function showToast(message, type = "ok") {
  clearTimeout(toastTimer);
  toast.value = { message, type };
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

// ── Book actions ──────────────────────────────────────────────────────────────
async function borrow(bookId) {
  actionLoading.value = bookId;
  try {
    await booksApi.borrow(bookId);
    await loadBooks();
    showToast("Book borrowed. Enjoy the read!", "ok");
  } catch (e) {
    showToast(e.message || "Could not borrow book.", "err");
  } finally {
    actionLoading.value = null;
  }
}

async function returnBook(bookId) {
  actionLoading.value = bookId;
  try {
    await booksApi.returnBook(bookId);
    await loadBooks();
    showToast("Book returned. Thanks!", "ok");
  } catch (e) {
    showToast(e.message || "Could not return book.", "err");
  } finally {
    actionLoading.value = null;
  }
}

async function deleteBook(book) {
  if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
  actionLoading.value = book.bookId;
  try {
    await booksApi.remove(book.bookId);
    await loadBooks();
    showToast(`"${book.title}" deleted.`, "ok");
  } catch (e) {
    showToast(e.message || "Could not delete book.", "err");
  } finally {
    actionLoading.value = null;
  }
}

// ── Admin modal ───────────────────────────────────────────────────────────────
function openAdd() {
  modalFields.value = { title: "", author: "", imageUrl: "" };
  modalError.value  = "";
  modal.value       = { mode: "add" };
}

function openEdit(book) {
  modalFields.value = { title: book.title, author: book.author, imageUrl: book.imageUrl || "" };
  modalError.value  = "";
  modal.value       = { mode: "edit", book };
}

function closeModal() {
  modal.value = null;
}

async function submitModal() {
  modalError.value = "";
  if (!modalFields.value.title.trim() || !modalFields.value.author.trim()) {
    modalError.value = "Title and author are required.";
    return;
  }
  modalLoading.value = true;
  try {
    if (modal.value.mode === "add") {
      await booksApi.create(modalFields.value);
      showToast("Book added to the catalog.", "ok");
    } else {
      await booksApi.update(modal.value.book.bookId, modalFields.value);
      showToast("Book updated.", "ok");
    }
    await loadBooks();
    closeModal();
  } catch (e) {
    modalError.value = e.message || "Something went wrong.";
  } finally {
    modalLoading.value = false;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isMyBook(book) {
  return book.borrowed && book.userHoldingBook === props.currentUser?.userId;
}

function fallbackCover(e) {
  e.target.style.display = "none";
  e.target.nextElementSibling?.classList.add("visible");
}
</script>

<template>
  <div class="home">
    <!-- ── Navbar ─────────────────────────────────────────────────────────── -->
    <header class="navbar">
      <div class="navbar-inner">
        <div class="brand">
          <svg class="brand-stain" viewBox="0 0 40 40" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="17" ry="16" fill="none" stroke="var(--stain)" stroke-width="2" opacity=".5"/>
            <ellipse cx="22" cy="21" rx="13" ry="12" fill="none" stroke="var(--gold)"  stroke-width="1.2" opacity=".4"/>
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

    <!-- ── Main ──────────────────────────────────────────────────────────── -->
    <main class="main-content">

      <!-- Quota bar (member only) -->
      <div v-if="!isAdmin" class="quota-bar">
        <div class="quota-label">
          <span>My borrowed books</span>
          <strong>{{ myBorrowedCount }} / 3</strong>
        </div>
        <div class="quota-track">
          <div
            class="quota-fill"
            :style="{ width: `${(myBorrowedCount / 3) * 100}%` }"
            :class="{ full: myBorrowedCount >= 3 }"
          />
        </div>
        <p v-if="myBorrowedCount >= 3" class="quota-warn">
          Quota reached — return a book before borrowing another.
        </p>
      </div>

      <!-- Controls row -->
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

      <!-- Loading skeleton -->
      <div v-if="loading" class="book-grid">
        <div v-for="n in 8" :key="n" class="book-card skeleton" aria-hidden="true">
          <div class="cover-skeleton" />
          <div class="card-body">
            <div class="skel-line wide" /><div class="skel-line narrow" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredBooks.length === 0" class="empty-state">
        <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="var(--stain)" stroke-width="1.5">
          <rect x="10" y="8" width="44" height="52" rx="4"/>
          <line x1="22" y1="22" x2="42" y2="22"/>
          <line x1="22" y1="32" x2="42" y2="32"/>
          <line x1="22" y1="42" x2="34" y2="42"/>
        </svg>
        <p>No books match this filter.</p>
      </div>

      <!-- Book grid -->
      <div v-else class="book-grid">
        <article
          v-for="book in filteredBooks"
          :key="book.bookId"
          class="book-card"
          :class="{ borrowed: book.borrowed, mine: isMyBook(book) }"
        >
          <!-- Cover -->
          <div class="cover-wrap">
            <img
              v-if="book.imageUrl"
              :src="book.imageUrl"
              :alt="`Cover of ${book.title}`"
              class="cover-img"
              loading="lazy"
              @error="fallbackCover"
            />
            <!-- Fallback when no image or image fails -->
            <div class="cover-placeholder" :class="{ visible: !book.imageUrl }">
              <span>{{ book.title.charAt(0) }}</span>
            </div>

            <!-- Status stamp -->
            <div class="status-stamp" :class="book.borrowed ? 'out' : 'in'">
              {{ book.borrowed ? "On loan" : "Available" }}
            </div>

            <!-- "My book" ribbon -->
            <div v-if="isMyBook(book)" class="my-ribbon" aria-label="You have this book">
              Mine
            </div>
          </div>

          <!-- Card body -->
          <div class="card-body">
            <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
            <p  class="book-author">{{ book.author }}</p>

            <!-- Action buttons -->
            <div class="card-actions">
              <!-- CLIENT actions -->
              <template v-if="!isAdmin">
                <button
                  v-if="isMyBook(book)"
                  class="btn-action return"
                  :disabled="actionLoading === book.bookId"
                  @click="returnBook(book.bookId)"
                >
                  <span v-if="actionLoading === book.bookId" class="btn-spin" />
                  <span v-else>Return</span>
                </button>
                <button
                  v-else-if="!book.borrowed"
                  class="btn-action borrow"
                  :disabled="actionLoading === book.bookId || myBorrowedCount >= 3"
                  :title="myBorrowedCount >= 3 ? 'Return a book first' : ''"
                  @click="borrow(book.bookId)"
                >
                  <span v-if="actionLoading === book.bookId" class="btn-spin" />
                  <span v-else>Borrow</span>
                </button>
                <span v-else class="badge-borrowed">Borrowed by someone else</span>
              </template>

              <!-- ADMIN actions -->
              <template v-else>
                <button
                  class="btn-action edit"
                  :disabled="actionLoading === book.bookId"
                  @click="openEdit(book)"
                >Edit</button>
                <button
                  class="btn-action delete"
                  :disabled="actionLoading === book.bookId || book.borrowed"
                  :title="book.borrowed ? 'Cannot delete while on loan' : ''"
                  @click="deleteBook(book)"
                >
                  <span v-if="actionLoading === book.bookId" class="btn-spin dark" />
                  <span v-else>Delete</span>
                </button>
              </template>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- ── Toast ─────────────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type" role="alert">
        <svg v-if="toast.type === 'ok'" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="2,9 6,13 14,4"/>
        </svg>
        <svg v-else viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- ── Admin modal ────────────────────────────────────────────────────── -->
    <Transition name="modal-fade">
      <div v-if="modal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal" role="dialog" :aria-label="modal.mode === 'add' ? 'Add book' : 'Edit book'">
          <div class="modal-header">
            <h2>{{ modal.mode === "add" ? "Add a book" : "Edit book" }}</h2>
            <button class="modal-close" aria-label="Close" @click="closeModal">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="field">
              <label for="m-title">Title</label>
              <input id="m-title" v-model="modalFields.title" type="text" placeholder="The Great Gatsby" />
            </div>
            <div class="field">
              <label for="m-author">Author</label>
              <input id="m-author" v-model="modalFields.author" type="text" placeholder="F. Scott Fitzgerald" />
            </div>
            <div class="field">
              <label for="m-img">Cover image URL <span class="optional">(optional)</span></label>
              <input id="m-img" v-model="modalFields.imageUrl" type="url" placeholder="https://…" />
              <div v-if="modalFields.imageUrl" class="img-preview-wrap">
                <img :src="modalFields.imageUrl" alt="Cover preview" class="img-preview" />
              </div>
            </div>

            <p v-if="modalError" class="modal-error">{{ modalError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-save" :disabled="modalLoading" @click="submitModal">
              <span v-if="modalLoading" class="btn-spin dark" />
              <span v-else>{{ modal.mode === "add" ? "Add book" : "Save changes" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap");

/* ── Tokens (mirror AuthView) ─────────────────────────────────────────────── */
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

/* ── Navbar ───────────────────────────────────────────────────────────────── */
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

/* ── Main ─────────────────────────────────────────────────────────────────── */
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

/* ── Quota bar ────────────────────────────────────────────────────────────── */
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

/* ── Controls ─────────────────────────────────────────────────────────────── */
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

/* ── Book grid ────────────────────────────────────────────────────────────── */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* ── Book card ────────────────────────────────────────────────────────────── */
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

/* Cover */
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

/* Status stamp (ink-stamp look) */
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

/* "Mine" ribbon */
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

.btn-action.borrow { background: var(--ink);  color: var(--paper); }
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

/* Spinner inside button */
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

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
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

/* ── Empty state ──────────────────────────────────────────────────────────── */
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

/* ── Toast ────────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.3rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
  z-index: 200;
  white-space: nowrap;
}

.toast.ok  { background: var(--ink); color: var(--paper); }
.toast.err { background: var(--error); color: #fff; }

.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s; }
.toast-enter-from  { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to    { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ── Modal ────────────────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30,42,34,.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 300;
}

.modal {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 18px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.6rem 0;
}

.modal-header h2 {
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: 1.35rem;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--paper-dim);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  transition: background .15s;
}
.modal-close:hover { background: var(--border); }

.modal-body {
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.field {
  margin-bottom: 1.1rem;
}

.field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--ink-soft);
}

.optional {
  font-weight: 400;
  color: #9a8c78;
}

.field input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  font-family: inherit;
  font-size: 0.94rem;
  color: var(--ink);
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
}

.field input:focus {
  border-color: var(--stain);
  box-shadow: 0 0 0 3px rgba(169,113,63,.15);
}

.img-preview-wrap {
  margin-top: 0.6rem;
}

.img-preview {
  max-height: 120px;
  border-radius: 8px;
  border: 1px solid var(--border);
  object-fit: cover;
}

.modal-error {
  background: rgba(179,69,47,.09);
  border: 1px solid rgba(179,69,47,.25);
  color: var(--stain-dark);
  font-size: 0.84rem;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  padding: 0 1.6rem 1.5rem;
}

.btn-cancel {
  padding: 0.65rem 1.3rem;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--ink-soft);
  background: var(--paper-dim);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: background .18s;
}
.btn-cancel:hover { background: var(--border); }

.btn-save {
  padding: 0.65rem 1.4rem;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--paper);
  background: var(--stain);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  min-height: 2.5rem;
  transition: background .18s;
}
.btn-save:hover:not(:disabled)  { background: var(--stain-dark); }
.btn-save:disabled { opacity: .7; cursor: default; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .22s; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 700px) {
  .navbar-inner { padding: 0 1rem; }
  .main-content { padding: 1.25rem 1rem 3rem; }
  .brand-name   { font-size: 0.9rem; }
  .user-pill    { display: none; }
  .book-grid    { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .controls     { flex-direction: column; align-items: stretch; }
  .filter-tabs  { justify-content: center; }
  .btn-add      { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .book-card, .cover-img, .btn-action, .btn-save, .btn-cancel,
  .quota-fill, .toast, .modal-backdrop { transition: none; }
  .btn-spin, .cover-skeleton, .skel-line { animation-duration: 0.01ms !important; }
}
</style>
