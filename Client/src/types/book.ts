export interface Book {
  bookId: string | number;
  title: string;
  author: string;
  imageUrl?: string;
  borrowed: boolean;
  userHoldingBook?: string | number | null;
}

export type ToastType = "ok" | "err";

export type ModalState = { mode: "add" } | { mode: "edit"; book: Book } | null;