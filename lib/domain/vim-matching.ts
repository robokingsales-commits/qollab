/**
 * V.I.M (Value-Idle-Matching) 6-Axis Core Engine
 * Encapsulated exclusively in lib/domain/vim-matching.ts
 */

export interface VIM6AxisInput {
  v: number; // Volume (0.0 ~ 1.0)
  i: number; // Idle / Intensity (0.0 ~ 1.0)
  m: number; // Margin (0.0 ~ 1.0)
  c: number; // Category Cohesion (0.0 ~ 1.0)
  s: number; // Spatial Proximity (0.0 ~ 1.0)
  t: number; // Time Slot Alignment (0.0 ~ 1.0)
}

export interface ExternalVariableMultipliers {
  weatherIndex: number;
  trafficCongestion: number;
  regionalDensity: number;
  holidayIndex: number;
  peakHourShift: number;
  ticketSizeFactor: number;
  dayOfWeekWeight: number;
  seasonalityMultiplier: number;
  userHistoryAffinity: number;
  storePopularityScore: number;
  categoryDemandMultiplier: number;
  discountRateSensitivity: number;
  realtimeSearchVolume: number;
  distanceDecayFactor: number;
  slotUrgencyBonus: number;
  anchorStoreSynergy: number;
  riderStoreSynergy: number;
  bundleHeadcountScale: number;
  inventoryScarcityMultiplier: number;
  repurchaseProbability: number;
  cancellationRatePenalty: number;
  reviewRatingWeight: number;
  operatingHoursOverlap: number;
  transitConvenienceScore: number;
  footTrafficEstimate: number;
  commercialDistrictTier: number;
  competitorProximityFactor: number;
  marketingCampaignBoost: number;
  membershipTierMultiplier: number;
  paymentMethodPreference: number;
  avgStayDurationMatch: number;
  ageDemographicFit: number;
  genderDemographicFit: number;
  companionTypeAlignment: number;
  specialEventMultiplier: number;
  priceElasticityIndex: number;
  slotFlexibilityScore: number;
  settlementSpeedFactor: number;
  merchantTierMultiplier: number;
  platformCommissionTier: number;
  viralityCoefficient: number;
  algorithmConfidenceScore: number;
}

export const DEFAULT_42_MULTIPLIERS: ExternalVariableMultipliers = {
  weatherIndex: 1.0,
  trafficCongestion: 1.0,
  regionalDensity: 1.0,
  holidayIndex: 1.0,
  peakHourShift: 1.0,
  ticketSizeFactor: 1.0,
  dayOfWeekWeight: 1.0,
  seasonalityMultiplier: 1.0,
  userHistoryAffinity: 1.0,
  storePopularityScore: 1.0,
  categoryDemandMultiplier: 1.0,
  discountRateSensitivity: 1.0,
  realtimeSearchVolume: 1.0,
  distanceDecayFactor: 1.0,
  slotUrgencyBonus: 1.0,
  anchorStoreSynergy: 1.0,
  riderStoreSynergy: 1.0,
  bundleHeadcountScale: 1.0,
  inventoryScarcityMultiplier: 1.0,
  repurchaseProbability: 1.0,
  cancellationRatePenalty: 1.0,
  reviewRatingWeight: 1.0,
  operatingHoursOverlap: 1.0,
  transitConvenienceScore: 1.0,
  footTrafficEstimate: 1.0,
  commercialDistrictTier: 1.0,
  competitorProximityFactor: 1.0,
  marketingCampaignBoost: 1.0,
  membershipTierMultiplier: 1.0,
  paymentMethodPreference: 1.0,
  avgStayDurationMatch: 1.0,
  ageDemographicFit: 1.0,
  genderDemographicFit: 1.0,
  companionTypeAlignment: 1.0,
  specialEventMultiplier: 1.0,
  priceElasticityIndex: 1.0,
  slotFlexibilityScore: 1.0,
  settlementSpeedFactor: 1.0,
  merchantTierMultiplier: 1.0,
  platformCommissionTier: 1.0,
  viralityCoefficient: 1.0,
  algorithmConfidenceScore: 1.0,
};

/**
 * Dynamic weight decay formula
 * W(t) = W_base * exp(-lambda * deltaHours)
 */
export function calculateDynamicWeightDecay(
  baseWeight: number,
  deltaHours: number,
  lambda: number = 0.015
): number {
  return baseWeight * Math.exp(-lambda * Math.max(0, deltaHours));
}

/**
 * Core 6-Axis Matching Formula:
 * VIMSCT = 0.124*V + 0.199*I + 0.176*M + 0.146*C + 0.199*S + 0.156*T
 */
export function calculateVIMSCTScore(
  input: VIM6AxisInput,
  multipliers: Partial<ExternalVariableMultipliers> = {},
  elapsedHours: number = 0
): number {
  const mergedMultipliers = { ...DEFAULT_42_MULTIPLIERS, ...multipliers };

  // Combined external multiplier product across all 42 variables
  const externalProduct = Object.values(mergedMultipliers).reduce(
    (acc, val) => acc * val,
    1.0
  );

  // Dynamic weight decay for time sensitivity
  const decayedTWeight = calculateDynamicWeightDecay(0.156, elapsedHours);

  const rawScore =
    0.124 * input.v +
    0.199 * input.i +
    0.176 * input.m +
    0.146 * input.c +
    0.199 * input.s +
    decayedTWeight * input.t;

  return Math.min(100, Math.max(0, Math.round(rawScore * externalProduct * 100)));
}
