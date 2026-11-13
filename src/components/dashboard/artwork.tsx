import Image from "next/image";
import { cn } from "@/lib/glaze/utils";
import { isGif } from "@/lib/images";

const sizes = {
  xs: "size-6",
  sm: "size-10",
  md: "size-16",
  lg: "size-20",
  xl: "size-28",
} as const;

const pixels: Record<keyof typeof sizes, string> = {
  xs: "24px",
  sm: "40px",
  md: "64px",
  lg: "80px",
  xl: "112px",
};

// Glaze's initialsOf lives in a client module, so it cannot run here (this is a server component).
export function initials(name: string) {
  const words = name.split(/[\s._\-/]+/).filter(Boolean);
  if (!words.length) return "";
  const first = [...words[0]][0] ?? "";
  const last = [...words[words.length - 1]][0] ?? "";
  return (
    words.length === 1 ? first + (words[0][1] ?? "") : first + last
  ).toUpperCase();
}

interface ArtworkProps {
  name: string;
  src?: string | null;
  /** Fotografia de artista (redonda) ou capa de música/álbum (quadrada). */
  shape?: "circle" | "square";
  size?: keyof typeof sizes;
  className?: string;
}

/** Miniatura reutilizável de artista, música ou álbum; mostra as iniciais quando não há imagem. */
export function Artwork({
  name,
  src,
  shape = "square",
  size = "md",
  className,
}: ArtworkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-line bg-field text-text-2",
        size === "xl"
          ? "type-heading"
          : size === "xs" || size === "sm"
            ? "type-caption"
            : "type-heading-sm",
        shape === "circle" ? "rounded-pill" : "rounded-tag",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={pixels[size]}
          unoptimized={isGif(src)}
          className="object-cover"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </span>
  );
}
