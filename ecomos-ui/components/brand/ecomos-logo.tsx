"use client";

import Link from "next/link";
import { useState } from "react";
import { type Colors, Liquid } from "@/components/uilayouts/liquid-gradient";

/**
 * Ecom-OS logo — the source-of-truth brand element (liquid-gradient button).
 * Reused in the sidebar and surfaces like the /chat header.
 *
 * Adapted from the uilayouts liquid button: same structure, with the link and
 * mark swapped to Ecom-OS.
 */

// Brand-blue liquid — tuned to the "Ask Ecom-OS" blue rather than indigo.
const COLORS: Colors = {
  color1: "#FFFFFF",
  color2: "#2563EB",
  color3: "#93C5FD",
  color4: "#FCFEFF",
  color5: "#F2F8FF",
  color6: "#BFD7FF",
  color7: "#1D4ED8",
  color8: "#2563EB",
  color9: "#3B82F6",
  color10: "#60A5FA",
  color11: "#1E40AF",
  color12: "#DBEAFE",
  color13: "#1746C4",
  color14: "#BFDBFE",
  color15: "#C7DCFF",
  color16: "#1E3A8A",
  color17: "#3E6AD0",
};

export function EcomOsLogo({ href = "/command-center" }: { href?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-label="ecomOS"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative block h-8 w-full overflow-hidden rounded-lg border border-border"
    >
      {/* Deep-blue base (not black) so the pill reads blue and white text stays legible. */}
      <span className="absolute inset-0 bg-[#0b1f6b]" />
      <Liquid isHovered={isHovered} colors={COLORS} />
      {/* Very light blue scrim only to tame the brightest highlights under the text. */}
      <span className="absolute inset-0 bg-[#0b1f6b]/25" />
      <span className="relative z-10 flex h-full items-center justify-center text-sm font-semibold tracking-wide text-white">
        ecomOS
      </span>
    </Link>
  );
}

export { COLORS as ECOMOS_LOGO_COLORS };
