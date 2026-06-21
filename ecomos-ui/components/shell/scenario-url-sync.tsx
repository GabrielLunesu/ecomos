"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SCENARIO_IDS, type ScenarioId } from "@/data/scenario";
import { useScenarioStore } from "@/data/scenario-store";

/**
 * Keeps the active scenario shareable via `?scenario=`.
 * On first load a present, valid `?scenario=` wins; thereafter changing the
 * scenario rewrites the query param so the URL can be copied for review.
 */
export function ScenarioUrlSync() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenario = useScenarioStore((s) => s.scenario);
  const setScenario = useScenarioStore((s) => s.setScenario);
  const initialized = React.useRef(false);

  // Apply ?scenario= from the URL once on mount.
  React.useEffect(() => {
    const param = searchParams.get("scenario");
    if (param && (SCENARIO_IDS as readonly string[]).includes(param)) {
      setScenario(param as ScenarioId);
    }
    initialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect store -> URL after init.
  React.useEffect(() => {
    if (!initialized.current) return;
    const current = searchParams.get("scenario");
    if (current === scenario) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("scenario", scenario);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  return null;
}
