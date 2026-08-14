"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Modal (centered) ─────────────────────────── */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const width = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" }[size];
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-hairline-strong bg-surface-2 shadow-pop data-[state=open]:animate-slide-up",
            width,
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-4 border-b border-hairline px-4 py-3">
              <div>
                {title && (
                  <DialogPrimitive.Title className="text-md font-semibold text-content">
                    {title}
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description className="mt-0.5 text-2xs text-content-faint">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close className="rounded-control p-1 text-content-faint hover:bg-surface-3 hover:text-content">
                <X size={14} />
              </DialogPrimitive.Close>
            </div>
          )}
          <div className="px-4 py-3.5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-hairline px-4 py-3">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ─────────────────────────── Sheet (side / bottom drawer) ─────────────────────────── */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "bottom";
}) {
  const sideClass =
    side === "right"
      ? "right-0 top-0 h-full w-[min(30rem,calc(100vw-2rem))] border-l data-[state=open]:animate-slide-in-right"
      : "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-card border-t data-[state=open]:animate-slide-in-up";
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex flex-col border-hairline-strong bg-surface-2 shadow-pop outline-none",
            sideClass,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-hairline px-4 py-3">
            <div>
              {title && (
                <DialogPrimitive.Title className="text-md font-semibold text-content">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-2xs text-content-faint">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="rounded-control p-1 text-content-faint hover:bg-surface-3 hover:text-content">
              <X size={14} />
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3.5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-hairline px-4 py-3">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ─────────────────────────── Tooltip ─────────────────────────── */
export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className="z-50 max-w-[16rem] rounded-control border border-hairline-strong bg-surface-3 px-2 py-1 text-2xs text-content-2 shadow-pop data-[state=delayed-open]:animate-fade-in"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[var(--surface-3)]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
