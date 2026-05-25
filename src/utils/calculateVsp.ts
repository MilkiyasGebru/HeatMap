/**
 * Calculates the specified lateral earthquake force (Vsp) for specific
 * non-structural components (e.g., cantilever parapets) per NBC 2025.
 *
 * Formula: Vsp = 0.9 * Sa02 * Ie * Wp
 *
 * @param Sa02 - Spectral response acceleration at 0.2s for Site Class XD
 * @param Ie   - Earthquake Importance Factor (1.0, 1.3, or 1.5)
 * @param Wp   - Weight of the component (kN)
 * @returns      The calculated lateral earthquake force Vsp (kN)
 */
export default function calculateVsp(
  Sa02: number,
  Ie: number,
  Wp: number,
): number {
  if (Sa02 < 0 || Ie < 0 || Wp < 0) {
    throw new Error('Parameters must be non-negative values.');
  }
  return 0.9 * Sa02 * Ie * Wp;
}
