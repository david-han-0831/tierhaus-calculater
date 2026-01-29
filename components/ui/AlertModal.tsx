"use client";

import Modal from "./Modal";

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
};

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "확인",
}: AlertModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-[var(--radius)] bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          {confirmLabel}
        </button>
      }
    >
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </Modal>
  );
}
