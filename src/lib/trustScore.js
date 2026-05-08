/**
 * Calculates a trust score (0-100) for a property listing
 * based on completeness and verification status.
 */
export function calculateTrustScore(property) {
  let score = 0;

  // 1. Basic Verification (40 points)
  if (property.isVerified) score += 40;

  // 2. Photos (20 points)
  if (property.images && property.images.length > 5) score += 20;
  else if (property.images && property.images.length > 0) score += 10;

  // 3. Description Depth (15 points)
  if (property.description && property.description.length > 200) score += 15;
  else if (property.description && property.description.length > 50) score += 5;

  // 4. Coordinates (10 points)
  if (property.location?.coordinates?.lat) score += 10;

  // 5. Owner Info (15 points)
  if (property.owner?.name && property.owner?.mobile) score += 15;

  return score;
}

export function getTrustLabel(score) {
  if (score >= 80) return { label: "EXCELLENT", color: "text-emerald-500", bg: "bg-emerald-50" };
  if (score >= 60) return { label: "VERY GOOD", color: "text-blue-500", bg: "bg-blue-50" };
  if (score >= 40) return { label: "GOOD", color: "text-amber-500", bg: "bg-amber-50" };
  return { label: "LOW", color: "text-gray-400", bg: "bg-gray-50" };
}
