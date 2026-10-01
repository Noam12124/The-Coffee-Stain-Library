<script setup lang="ts">
import { ref, watch } from "vue";
import { booksApi } from "../services/api";
import type { ModalState } from "../types/book";

const props = defineProps<{
  modal: ModalState;
}>();

const emit = defineEmits(["close", "success"]);

const modalFields = ref({ title: "", author: "", imageUrl: "" });
const modalLoading = ref(false);
const modalError = ref("");

watch(
  () => props.modal,
  (newVal) => {
    if (newVal?.mode === "edit") {
      modalFields.value = {
        title: newVal.book.title,
        author: newVal.book.author,
        imageUrl: newVal.book.imageUrl || "",
      };
    } else {
      modalFields.value = { title: "", author: "", imageUrl: "" };
    }
    modalError.value = "";
  },
  { immediate: true }
);

async function submitModal() {
  modalError.value = "";
  if (!modalFields.value.title.trim() || !modalFields.value.author.trim()) {
    modalError.value = "Title and author are required.";
    return;
  }
  modalLoading.value = true;
  try {
    if (props.modal?.mode === "add") {
      await booksApi.create(modalFields.value);
      emit("success", "Book added to the catalog.");
    } else if (props.modal?.mode === "edit") {
      await booksApi.update(props.modal.book.bookId, modalFields.value);
      emit("success", "Book updated.");
    }
  } catch (error: any) {
    modalError.value = error.message || "Something went wrong.";
  } finally {
    modalLoading.value = false;
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modal" class="modal-backdrop" @click.self="emit('close')">
      <div
        class="modal"
        role="dialog"
        :aria-label="modal.mode === 'add' ? 'Add book' : 'Edit book'"
      >
        <div class="modal-header">
          <h2>{{ modal.mode === "add" ? "Add a book" : "Edit book" }}</h2>
          <button class="modal-close" aria-label="Close" @click="emit('close')">
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
          <button class="btn-cancel" @click="emit('close')">Cancel</button>
          <button class="btn-save" :disabled="modalLoading" @click="submitModal">
            <span v-if="modalLoading" class="btn-spin dark" />
            <span v-else>{{ modal.mode === "add" ? "Add book" : "Save changes" }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.btn-spin {
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  border: 2px solid rgba(30,42,34,.2);
  border-top-color: var(--ink);
  animation: spin .7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .22s; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .btn-save, .btn-cancel, .modal-backdrop { transition: none; }
  .btn-spin { animation-duration: 0.01ms !important; }
}
</style>