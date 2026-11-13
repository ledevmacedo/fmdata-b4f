"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * One smooth-scroll engine for the page. Lenis respects prefers-reduced-motion
 * on its own and hands anchor links back to the browser when motion is reduced.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -80 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
