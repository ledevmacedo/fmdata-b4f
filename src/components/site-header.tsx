"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/glaze/utils";

const SECTIONS = [
  { hash: "rankings", label: "Rankings" },
  { hash: "albuns", label: "Álbuns" },
  { hash: "padroes", label: "Padrões" },
];

/** The site's only navigation: a compact masthead over a hairline. */
export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const href = (hash: string) => (home ? `#${hash}` : `/#${hash}`);

  return (
    <header
      id="topo"
      className="sticky top-0 z-(--z-sticky) border-b border-line-faint bg-page"
    >
      <div className="mx-auto flex h-14 w-full max-w-(--page-width) items-center justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          aria-label="FMData, início"
          className="type-label text-text-1"
        >
          FM<span className="text-text-2">Data</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="Secções"
            className="flex items-center gap-1 sm:gap-2"
          >
            {SECTIONS.map(({ hash, label }) => (
              <Link
                key={hash}
                href={href(hash)}
                className={cn(
                  "-me-2 px-2 py-2 type-label-sm text-text-2",
                  "hover:text-text-1",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
