"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./ui-button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      data-modal
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />{" "}
      {/* Modal Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 glass-card bg-white/95 dark:bg-black/95 rounded-3xl shadow-2xl overflow-hidden modal-content !max-h-[calc(100vh-8rem)] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-white/10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>{" "}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-hover"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}{" "}
        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
