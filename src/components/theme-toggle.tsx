"use client";

import { useEffect, useState } from "react";

import { Dark, Icon, Light } from "@/components/glaze/icon";
import { Button } from "@/components/glaze/ui/button";

type Theme = "dark" | "light";

/** Alterna entre o tema escuro (por omissão) e o claro, persistindo a escolha. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    if (initial === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", next);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
      }
    >
      <Icon icon={theme === "dark" ? Light : Dark} />
    </Button>
  );
}
