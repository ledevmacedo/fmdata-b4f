import type { Metadata } from "next";
import { Showcase } from "@/components/design-system/showcase";

export const metadata: Metadata = {
  title: "Sistema visual | FMData",
  description: "Tokens, superfícies e componentes do sistema visual FMData.",
};

export default function DesignSystemPage() {
  return <Showcase />;
}
