"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown, Icon } from "@/components/glaze/icon";
import type { DashboardSummary } from "@/lib/dashboard";
import { formatMesAno, formatNumber, formatScrobbles } from "@/lib/format";
import { isGif } from "@/lib/images";
import type { RankingItem } from "@/types";

const SLEEVE_POSITIONS = [
  "left-0 top-8 z-10 w-3/5",
  "right-0 top-0 z-20 w-1/2",
  "left-1/4 bottom-0 z-30 w-1/2",
  "right-0 bottom-10 z-20 w-2/5",
] as const;

const SLEEVE_ROTATIONS = [-8, 5, 2, -4] as const;

interface HeroProps {
  profile: DashboardSummary;
  /** Álbuns all-time: as capas são o material gráfico da abertura. */
  albums: RankingItem[];
}

/**
 * A abertura do arquivo: a frase, os três números que resumem o histórico e
 * um leque de capas. Só o GSAP move o que já está visível sem JavaScript.
 */
export function Hero({ profile, albums }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const topAlbum = albums[0];

  const seen = new Set<string>();
  const images = [...albums.map((album) => album.image), profile.cover]
    .filter((src): src is string => Boolean(src))
    .filter((src) => {
      if (seen.has(src)) return false;
      seen.add(src);
      return true;
    })
    .slice(0, 4);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context((self) => {
        const lines = el.querySelectorAll("[data-hero-line]");
        const copy = el.querySelector("[data-hero-copy]");
        const figures = el.querySelectorAll("[data-hero-figure]");
        const cta = el.querySelector("[data-hero-cta]");
        const sleeves = el.querySelectorAll("[data-sleeve]");
        const stack = el.querySelector<HTMLElement>("[data-sleeve-stack]");

        gsap.set(lines, { yPercent: 110 });
        gsap.set([copy, figures, cta], { autoAlpha: 0, y: 16 });
        gsap.set(sleeves, {
          autoAlpha: 0,
          y: 48,
          scale: 0.94,
          rotate: (index: number) => SLEEVE_ROTATIONS[index] ?? 0,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.1,
        });

        timeline
          .to(lines, { yPercent: 0, duration: 1, stagger: 0.09 }, 0)
          .to(
            sleeves,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 1.1,
              stagger: 0.08,
            },
            0.12,
          )
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
          .to(
            figures,
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
            0.5,
          )
          .to(cta, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.75);

        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count);
          if (!Number.isFinite(target)) return;
          const counter = { value: 0 };
          timeline.to(
            counter,
            {
              value: target,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = formatNumber(Math.round(counter.value));
              },
            },
            0.55,
          );
        });

        if (stack && window.matchMedia("(pointer: fine)").matches) {
          gsap.set(stack, { transformPerspective: 900 });
          const rotateX = gsap.quickTo(stack, "rotationX", {
            duration: 0.6,
            ease: "power3.out",
          });
          const rotateY = gsap.quickTo(stack, "rotationY", {
            duration: 0.6,
            ease: "power3.out",
          });

          const onMove = (event: PointerEvent) => {
            const rect = stack.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            rotateX(y * -5);
            rotateY(x * 7);
          };
          const onLeave = () => {
            rotateX(0);
            rotateY(0);
          };

          stack.addEventListener("pointermove", onMove);
          stack.addEventListener("pointerleave", onLeave);
          self.add(() => {
            stack.removeEventListener("pointermove", onMove);
            stack.removeEventListener("pointerleave", onLeave);
          });
        }
      }, el);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const figures = [
    { label: "Scrobbles", value: profile.totalScrobbles, lead: true },
    { label: "Artistas", value: profile.uniqueArtists, lead: false },
    { label: "Álbuns", value: profile.uniqueAlbums, lead: false },
  ];

  return (
    <section
      ref={root}
      className="grid gap-10 pb-12 pt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-16 lg:pt-16"
    >
      <div className="min-w-0 lg:col-span-7">
        <h1 className="type-display text-text-1">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              A tua vida em
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              modo repetição.
            </span>
          </span>
        </h1>

        <p data-hero-copy className="mt-6 max-w-measure type-body text-text-2">
          {profile.firstScrobble
            ? `Desde ${formatMesAno(profile.firstScrobble)}, o teu Last.fm em retrato: quem ouves, o que repetes e a que horas.`
            : "O teu Last.fm em retrato: quem ouves, o que repetes e a que horas."}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-faint pt-6">
          {figures.map(({ label, value, lead }) => (
            <div
              key={label}
              data-hero-figure
              className={lead ? "col-span-2 sm:col-span-1" : undefined}
            >
              <dt className="type-caption text-text-2">{label}</dt>
              <dd
                className={
                  lead
                    ? "type-figure text-text-1"
                    : "type-heading text-text-1 tabular-nums"
                }
              >
                <span aria-hidden data-count={value}>
                  {formatNumber(value)}
                </span>
                <span className="sr-only">{formatNumber(value)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <Link
          data-hero-cta
          href="#rankings"
          className="mt-8 inline-flex w-fit items-center gap-1.5 type-label text-text-2 hover:text-text-1"
        >
          Ver os rankings
          <Icon icon={ArrowDown} />
        </Link>
      </div>

      <div className="min-w-0 lg:col-span-5 lg:border-s lg:border-line-faint lg:ps-12">
        {images.length ? (
          <div
            data-sleeve-stack
            className="relative mx-auto aspect-square w-full max-w-md lg:me-0"
          >
            {images.map((src, index) => (
              <div
                key={src}
                data-sleeve
                className={`absolute ${SLEEVE_POSITIONS[index] ?? ""}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-shell border border-line-faint bg-field">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    priority={index === 2}
                    unoptimized={isGif(src)}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto grid aspect-square w-full max-w-md place-items-center rounded-shell border border-line-faint bg-shell lg:me-0">
            <span className="type-display text-text-3">FM</span>
          </div>
        )}

        {topAlbum ? (
          <p className="mt-5 flex min-w-0 flex-col gap-0.5">
            <span className="type-caption text-text-2">No topo do arquivo</span>
            <span className="truncate type-label text-text-1">
              {topAlbum.name}
            </span>
            <span className="truncate type-caption text-text-2">
              {topAlbum.subtitle} · {formatScrobbles(topAlbum.count)}
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
