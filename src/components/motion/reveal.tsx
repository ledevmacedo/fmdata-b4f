"use client";

import type { ElementType, ReactNode, Ref } from "react";
import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/glaze/utils";

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  delay?: number;
}

/**
 * Revela o conteúdo quando entra no viewport (IntersectionObserver).
 * Sem JavaScript ou com reduced motion, o conteúdo fica visível de imediato.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  id,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("reveal-hidden");
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.remove("reveal-hidden");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const Component = Tag as React.ElementType;
  return (
    <Component
      id={id}
      ref={ref as unknown as Ref<HTMLElement>}
      className={cn("reveal-scroll", className)}
    >
      {children}
    </Component>
  );
}
