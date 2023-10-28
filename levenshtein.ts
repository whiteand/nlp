let v0 = new Uint32Array(0);
let v1 = new Uint32Array(0);

function acquirev0(n: number) {
  if (v0.length < n) {
    v0 = new Uint32Array(n);
  }
  return v0;
}
function acquirev1(n: number) {
  if (v1.length < n) {
    v1 = new Uint32Array(n);
  }
  return v1;
}

// Description: Given two strings, returns the Levenshtein distance between them.
export function levenshtein(s: string, t: string): number {
  const m = s.length;
  const n = t.length;
  let v0 = acquirev0(n + 1);
  let v1 = acquirev1(n + 1);
  for (let i = 0; i <= n; i++) {
    v0[i] = i;
  }
  for (let i = 0; i < m; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < n; j++) {
      const deletionCost = v0[j + 1] + 1;
      const insertionCost = v1[j] + 1;
      const substitutionCost = s[i] === t[j] ? v0[j] : v0[j] + 1;
      v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
    }
    let temp = v0;
    v0 = v1;
    v1 = temp;
  }
  return v0[n];
}
