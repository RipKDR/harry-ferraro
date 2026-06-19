import type { Artwork } from '@/lib/artworks'

/** Typical portrait canvas when exact dimensions are unknown. */
export const DEFAULT_PREVIEW_WIDTH_CM = 60
export const PREVIEW_WIDTH_CM_MIN = 35
export const PREVIEW_WIDTH_CM_MAX = 140

/** width / height for layout (portrait-heavy portfolio). */
export const PREVIEW_ASPECT: Record<string, number> = {
  'ignition-i': 0.82,
  'ignition-ii': 0.8,
  'crimson-study': 0.78,
  'ascendant': 0.76,
  'tempest': 0.8,
  'radiance': 0.8,
  'dissolution': 0.72,
}

export function previewAspectFor(artwork: Artwork) {
  return PREVIEW_ASPECT[artwork.slug] ?? 0.8
}

/** Maps cm choice to vmin width at default viewing distance (heuristic, user-tunable via pinch). */
export function previewWidthVmin(widthCm: number) {
  return (widthCm / DEFAULT_PREVIEW_WIDTH_CM) * 58
}

export function previewHeightVmin(widthCm: number, aspect: number) {
  return previewWidthVmin(widthCm) / aspect
}