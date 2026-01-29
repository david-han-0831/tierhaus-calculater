"use client";

import { useEffect } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow-md)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[var(--card-border)] px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer != null && (
          <div className="border-t border-[var(--card-border)] px-6 py-4 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
