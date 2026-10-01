import { ref, computed } from "vue";
import { booksApi } from "../services/api";
import type { Book, ToastType } from "../types/book";

export function useBooks(
  showToast: (message: string, type: ToastType) => void,
  currentUserId: string | number | undefined
) {
  const books = ref<Book[]>([]);
  const filter = ref("all");
  const loading = ref(true);
  const actionLoading = ref<string | number | null>(null);

  const myBorrowedBooks = computed(() =>
    books.value.filter(
      (book) => book.borrowed && book.userHoldingBook === currentUserId
    )
  );

  const myBorrowedCount = computed(() => myBorrowedBooks.value.length);

  const filteredBooks = computed(() => {
    if (filter.value === "available") return books.value.filter((b) => !b.borrowed);
    if (filter.value === "borrowed") return books.value.filter((b) => b.borrowed);
    return books.value;
  });

  async function loadBooks() {
    loading.value = true;
    try {
      books.value = await booksApi.findAll();
    } catch (e: any) {
      showToast(e.message || "Failed to load books.", "err");
    } finally {
      loading.value = false;
    }
  }

  async function borrow(bookId: string | number) {
    actionLoading.value = bookId;
    try {
      await booksApi.borrow(bookId);
      await loadBooks();
      showToast("Book borrowed. Enjoy the read!", "ok");
    } catch (e: any) {
      showToast(e.message || "Could not borrow book.", "err");
    } finally {
      actionLoading.value = null;
    }
  }

  async function returnBook(bookId: string | number) {
    actionLoading.value = bookId;
    try {
      await booksApi.returnBook(bookId);
      await loadBooks();
      showToast("Book returned. Thanks!", "ok");
    } catch (e: any) {
      showToast(e.message || "Could not return book.", "err");
    } finally {
      actionLoading.value = null;
    }
  }

  async function deleteBook(book: Book) {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    actionLoading.value = book.bookId;
    try {
      await booksApi.remove(book.bookId);
      await loadBooks();
      showToast(`"${book.title}" deleted.`, "ok");
    } catch (e: any) {
      showToast(e.message || "Could not delete book.", "err");
    } finally {
      actionLoading.value = null;
    }
  }

  function isMyBook(book: Book) {
    return book.borrowed && book.userHoldingBook === currentUserId;
  }

  return {
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
  };
}