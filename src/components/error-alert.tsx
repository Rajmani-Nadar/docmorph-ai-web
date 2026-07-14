"use client";

import { AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";

type ErrorAlertProps = {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
};

export function ErrorAlert({ error, onDismiss, onRetry }: ErrorAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-[1rem] border border-rose-400/30 bg-rose-400/10 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-rose-200">{error}</p>
          <p className="mt-1 text-sm text-rose-100/80">Please try again or contact support if the problem persists.</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-sm font-medium text-rose-200 transition hover:bg-rose-400/20"
            >
              Retry
            </button>
          )}
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 transition hover:bg-rose-400/20"
          >
            <X className="h-4 w-4 text-rose-200" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
