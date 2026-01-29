"use client";

import Modal from "./Modal";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--sidebar)] transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-[var(--radius)] bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </Modal>
  );
}
