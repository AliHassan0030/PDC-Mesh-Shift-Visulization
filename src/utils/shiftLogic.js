// src/utils/shiftLogic.js
// Pure circular shift algorithm for 2D mesh topology
// No UI dependencies — fully testable in isolation

/**
 * Validate inputs for mesh circular shift
 * @param {number} p - total nodes (must be perfect square, 4–64)
 * @param {number} q - shift amount (1 to p-1)
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateInputs(p, q) {
  if (!Number.isInteger(p) || p < 4 || p > 64)
    return { valid: false, error: "p must be an integer between 4 and 64." };
  const s = Math.sqrt(p);
  if (!Number.isInteger(s))
    return { valid: false, error: "p must be a perfect square (4, 9, 16, 25, 36, 49, 64)." };
  if (!Number.isInteger(q) || q < 1 || q > p - 1)
    return { valid: false, error: `q must be between 1 and ${p - 1}.` };
  return { valid: true, error: null };
}

/**
 * Compute row and column shift amounts from p and q
 * @param {number} p - total nodes
 * @param {number} q - shift amount
 * @returns {{ rowShift: number, colShift: number, sqrtP: number }}
 */
export function computeShiftParams(p, q) {
  const sqrtP = Math.sqrt(p);
  const rowShift = q % sqrtP;       // Stage 1: shift within row
  const colShift = Math.floor(q / sqrtP); // Stage 2: shift within column
  return { rowShift, colShift, sqrtP };
}

/**
 * Generate initial node data: node i holds value i
 * @param {number} p
 * @returns {number[]} flat array of node values
 */
export function initialNodeData(p) {
  return Array.from({ length: p }, (_, i) => i);
}

/**
 * Apply Stage 1: row-wise circular shift
 * Each row shifts right by rowShift positions
 * @param {number[]} data - flat array
 * @param {number} sqrtP
 * @param {number} rowShift
 * @returns {number[]} new flat array after row shift
 */
export function applyRowShift(data, sqrtP, rowShift) {
  const result = [...data];
  for (let r = 0; r < sqrtP; r++) {
    const row = data.slice(r * sqrtP, (r + 1) * sqrtP);
    for (let c = 0; c < sqrtP; c++) {
      result[r * sqrtP + ((c + rowShift) % sqrtP)] = row[c];
    }
  }
  return result;
}

/**
 * Apply Stage 2: column-wise circular shift
 * Each column shifts down by colShift positions
 * @param {number[]} data - flat array
 * @param {number} sqrtP
 * @param {number} colShift
 * @returns {number[]} new flat array after column shift
 */
export function applyColShift(data, sqrtP, colShift) {
  const result = [...data];
  for (let c = 0; c < sqrtP; c++) {
    const col = [];
    for (let r = 0; r < sqrtP; r++) col.push(data[r * sqrtP + c]);
    for (let r = 0; r < sqrtP; r++) {
      result[((r + colShift) % sqrtP) * sqrtP + c] = col[r];
    }
  }
  return result;
}

/**
 * Full circular shift: returns all three states
 * @param {number} p
 * @param {number} q
 * @returns {{ initial, afterRow, afterCol, rowShift, colShift, sqrtP }}
 */
export function computeFullShift(p, q) {
  const { rowShift, colShift, sqrtP } = computeShiftParams(p, q);
  const initial  = initialNodeData(p);
  const afterRow = applyRowShift(initial, sqrtP, rowShift);
  const afterCol = applyColShift(afterRow, sqrtP, colShift);
  return { initial, afterRow, afterCol, rowShift, colShift, sqrtP };
}

/**
 * Compute complexity comparison: Mesh steps vs Ring steps
 * @param {number} p
 * @param {number} q
 * @returns {{ meshSteps, ringSteps, rowShift, colShift }}
 */
export function computeComplexity(p, q) {
  const { rowShift, colShift } = computeShiftParams(p, q);
  const meshSteps = rowShift + colShift;
  const ringSteps = Math.min(q, p - q);
  return { meshSteps, ringSteps, rowShift, colShift };
}

/**
 * Get arrow directions for row shift animation
 * Returns array of { from, to } node index pairs
 */
export function getRowShiftArrows(p, sqrtP, rowShift) {
  const arrows = [];
  if (rowShift === 0) return arrows;
  for (let r = 0; r < sqrtP; r++) {
    for (let c = 0; c < sqrtP; c++) {
      const from = r * sqrtP + c;
      const to   = r * sqrtP + ((c + rowShift) % sqrtP);
      if (from !== to) arrows.push({ from, to, direction: 'row' });
    }
  }
  return arrows;
}

/**
 * Get arrow directions for column shift animation
 */
export function getColShiftArrows(p, sqrtP, colShift) {
  const arrows = [];
  if (colShift === 0) return arrows;
  for (let r = 0; r < sqrtP; r++) {
    for (let c = 0; c < sqrtP; c++) {
      const from = r * sqrtP + c;
      const to   = ((r + colShift) % sqrtP) * sqrtP + c;
      if (from !== to) arrows.push({ from, to, direction: 'col' });
    }
  }
  return arrows;
}
