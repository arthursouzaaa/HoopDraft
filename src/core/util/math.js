export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const z = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);

export function avgWithWeights(items, valueFn, weightFn) {
  let num = 0, den = 0;
  for (const it of items) {
    const w = weightFn(it);
    num += valueFn(it) * w;
    den += w;
  }
  return den === 0 ? 0 : num / den;
}

export function pickWeighted(items, weightFn, rand) {
  const weights = items.map(it => Math.max(0.0001, weightFn(it)));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}