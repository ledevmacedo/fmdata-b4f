import type { Metadata } from "next";
import { Showcase } from "@/components/design-system/showcase";

export const metadata: Metadata = {
  title: "Sistema de design | FMData",
  description: "Tokens e componentes Glaze usados no FMData.",
};

export default function DesignSystemPage() {
  return <Showcase />;
}
