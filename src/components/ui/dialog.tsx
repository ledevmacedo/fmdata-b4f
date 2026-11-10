"use client";

import { CloseIcon } from "@solar-icons/react/linear/close";
import { type ReactNode, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Dialog({
  triggerLabel,
  title,
  children,
}: {
  triggerLabel: string;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()} variant="outline">
        {triggerLabel}
      </Button>
      <dialog
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,30rem)] rounded-xl bg-transparent p-0 backdrop:bg-black/45"
        ref={dialogRef}
      >
        <Card className="shadow-float" padding="md">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2
              className="text-heading-lg font-medium tracking-[-0.025em]"
              id={titleId}
            >
              {title}
            </h2>
            <form method="dialog">
              <Button
                aria-label="Fechar diálogo"
                className="shrink-0"
                size="icon"
                type="submit"
                variant="ghost"
              >
                <CloseIcon aria-hidden="true" size={20} />
              </Button>
            </form>
          </div>
          {children}
        </Card>
      </dialog>
    </>
  );
}
