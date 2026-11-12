import type { ReactNode } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/glaze/ui/alert";
import { Status } from "@/components/glaze/ui/status";

export type BlockStateKind = "loading" | "empty" | "error" | "not-found";

interface BlockStateProps {
  kind: BlockStateKind;
  title: string;
  description?: string;
  /** Botão ou link para sair do estado, por exemplo "tentar de novo". */
  action?: ReactNode;
}

/** Estado de um bloco ou de uma página: a carregar, vazio, erro ou não encontrado. */
export function BlockState({
  kind,
  title,
  description,
  action,
}: BlockStateProps) {
  if (kind === "loading") {
    return (
      <div className="flex min-h-32 items-center justify-center p-6">
        <Status status="running">{title}</Status>
      </div>
    );
  }

  return (
    <Alert status={kind === "error" ? "fail" : "neutral"}>
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {action ? <AlertAction>{action}</AlertAction> : null}
    </Alert>
  );
}
