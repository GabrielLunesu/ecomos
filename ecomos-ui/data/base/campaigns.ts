/**
 * Marketing fixtures: ad accounts, campaign hierarchy, creatives, audiences.
 * Meta prospecting (CAMP-Meta-Prospecting) is the inefficient spender in the
 * attention/incident scenarios.
 */

import type { AdAccount, Audience, Campaign, Creative, Freshness } from "@/data/schema";
import { hoursAgo, money, seededFloat } from "@/data/base/_seed";

const fresh = (h: number, status: Freshness["status"] = "healthy", sources = 1): Freshness => ({
  updatedAt: hoursAgo(h),
  sourceCount: sources,
  status,
});

export const AD_ACCOUNTS: AdAccount[] = [
  { id: "acc-meta", platform: "meta", name: "Northstar — Meta", currency: "EUR", status: "connected", lastSyncAt: hoursAgo(3) },
  { id: "acc-google", platform: "google", name: "Northstar — Google", currency: "EUR", status: "connected", lastSyncAt: hoursAgo(1.5) },
];

type Seed = {
  id: string;
  accountId: string;
  name: string;
  status: Campaign["status"];
  spend: number;
  attributedRevenue: number;
  marginRate: number; // contribution margin as fraction of attributed revenue
  cac: number;
  conversionRate: number;
  frequency: number;
  trend: Campaign["trend"];
};

const SEEDS: Seed[] = [
  { id: "CAMP-Meta-Prospecting", accountId: "acc-meta", name: "Meta · Prospecting", status: "declining", spend: 8420, attributedRevenue: 16240, marginRate: 0.04, cac: 41.2, conversionRate: 1.4, frequency: 3.8, trend: { direction: "down", deltaPct: -12.6 } },
  { id: "CAMP-Meta-Retargeting", accountId: "acc-meta", name: "Meta · Retargeting", status: "active", spend: 3120, attributedRevenue: 18960, marginRate: 0.31, cac: 14.8, conversionRate: 4.9, frequency: 2.1, trend: { direction: "up", deltaPct: 6.3 } },
  { id: "CAMP-Meta-Lookalike", accountId: "acc-meta", name: "Meta · Lookalike 2%", status: "learning", spend: 2010, attributedRevenue: 5400, marginRate: 0.12, cac: 28.0, conversionRate: 2.2, frequency: 1.6, trend: { direction: "flat", deltaPct: 0.4 } },
  { id: "CAMP-Google-Brand", accountId: "acc-google", name: "Google · Brand search", status: "active", spend: 1240, attributedRevenue: 14880, marginRate: 0.42, cac: 8.1, conversionRate: 9.4, frequency: 1.1, trend: { direction: "up", deltaPct: 3.1 } },
  { id: "CAMP-Google-Shopping", accountId: "acc-google", name: "Google · Shopping", status: "active", spend: 4360, attributedRevenue: 19200, marginRate: 0.27, cac: 19.7, conversionRate: 3.6, frequency: 1.4, trend: { direction: "up", deltaPct: 8.2 } },
  { id: "CAMP-Google-PMax", accountId: "acc-google", name: "Google · Performance Max", status: "fatigued", spend: 3680, attributedRevenue: 9100, marginRate: 0.09, cac: 33.5, conversionRate: 2.0, frequency: 2.7, trend: { direction: "down", deltaPct: -7.8 } },
  { id: "CAMP-Meta-Summer", accountId: "acc-meta", name: "Meta · Summer offer", status: "paused", spend: 1560, attributedRevenue: 6200, marginRate: 0.18, cac: 22.4, conversionRate: 2.8, frequency: 2.0, trend: { direction: "flat", deltaPct: -1.2 } },
  { id: "CAMP-Google-Display", accountId: "acc-google", name: "Google · Display retarget", status: "active", spend: 980, attributedRevenue: 4100, marginRate: 0.21, cac: 17.0, conversionRate: 1.9, frequency: 3.0, trend: { direction: "up", deltaPct: 2.0 } },
];

export const CAMPAIGNS: Campaign[] = SEEDS.map((s) => {
  const contributionMargin = money(s.attributedRevenue * s.marginRate);
  const roas = money(s.attributedRevenue / s.spend);
  return {
    id: s.id,
    accountId: s.accountId,
    name: s.name,
    level: "campaign",
    parentId: null,
    status: s.status,
    spend: money(s.spend),
    attributedRevenue: money(s.attributedRevenue),
    contributionMargin,
    currency: "EUR",
    roas,
    mer: money(roas * 1.35),
    cac: s.cac,
    conversionRate: s.conversionRate,
    frequency: s.frequency,
    trend: s.trend,
    freshness: fresh(s.accountId === "acc-meta" ? 3 : 1.5),
    attributionCaveat: "Last-click attribution from the ad platform; cross-channel overlap not deduplicated.",
    productIds: [],
    orderIds: [],
  };
});

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export const CREATIVES: Creative[] = CAMPAIGNS.slice(0, 6).flatMap((c, ci) =>
  Array.from({ length: 3 }, (_, i) => {
    const idx = ci * 3 + i;
    const spend = money(seededFloat(idx + 1, 200, 1800));
    const roas = money(seededFloat(idx + 7, 0.8, 5.2));
    const fatigues: Creative["fatigue"][] = ["fresh", "stable", "fatiguing", "fatigued"];
    return {
      id: `CRE-${100 + idx}`,
      name: `${c.name} · v${i + 1}`,
      hook: ["Free 30-day returns", "Loved by 12,000 homes", "Summer linen, 20% off", "The vase everyone asks about"][idx % 4],
      format: (["image", "video", "carousel", "image"] as Creative["format"][])[idx % 4],
      platform: c.accountId === "acc-meta" ? "meta" : "google",
      campaignIds: [c.id],
      spend,
      revenue: money(spend * roas),
      roas,
      thumbStopRate: money(seededFloat(idx + 3, 18, 42)),
      clickThroughRate: money(seededFloat(idx + 5, 0.6, 3.2)),
      fatigue: fatigues[idx % 4],
      status: i === 2 && ci % 2 === 0 ? "paused" : "active",
    };
  }),
);

export const AUDIENCES: Audience[] = [
  { id: "AUD-1", name: "Home decor enthusiasts", platform: "meta", kind: "interest", size: 1_900_000, spend: money(3120), revenue: money(14200), overlapPct: 18, freshness: fresh(3) },
  { id: "AUD-2", name: "Past purchasers 180d", platform: "meta", kind: "retargeting", size: 24_500, spend: money(2010), revenue: money(18960), overlapPct: 9, freshness: fresh(3) },
  { id: "AUD-3", name: "Lookalike 2% — buyers", platform: "meta", kind: "lookalike", size: 2_400_000, spend: money(2400), revenue: money(6100), overlapPct: 31, freshness: fresh(3) },
  { id: "AUD-4", name: "Brand search intent", platform: "google", kind: "custom", size: null, spend: money(1240), revenue: money(14880), overlapPct: null, freshness: fresh(1.5) },
];
