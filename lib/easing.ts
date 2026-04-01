// Easing functions for smooth animations
// All functions take t (0-1) and return eased value (0-1)

export const easing = {
  // Smooth step (Hermite)
  smooth: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  // Exponential easing
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // Cubic easing
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  // Quadratic
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  // Sine easing
  easeInOutSine: (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },

  // Elastic easing for bouncy feel
  easeInOutElastic: (t: number): number => {
    const c5 = (2 * Math.PI) / 4.5;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((t * 40 - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((t * 40 - 11.125) * c5)) / 2 + 1;
  },
};

// Linear interpolation
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Get scroll velocity (derivative of scroll position)
export function getScrollVelocity(
  prev: number,
  current: number,
  deltaTime: number,
): number {
  if (deltaTime <= 0) return 0;
  return (current - prev) / deltaTime;
}
