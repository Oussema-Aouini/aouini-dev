// Easing functions for smooth animations
// All functions take t (0-1) and return eased value (0-1)

export const easing = {
  // Cubic easing
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};

// Linear interpolation
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
