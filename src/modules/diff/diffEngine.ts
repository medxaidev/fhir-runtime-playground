/**
 * Element-level diff engine for comparing two StructureDefinition snapshots.
 */

interface RawElement {
  id?: string;
  path?: string;
  min?: number;
  max?: string;
  short?: string;
  type?: Array<{ code?: string }>;
  constraint?: Array<{ key?: string; expression?: string }>;
}

export type DiffType =
  | 'UNCHANGED'
  | 'NEW'
  | 'REMOVED'
  | 'CHANGED_CARDINALITY'
  | 'CHANGED_TYPE'
  | 'CHANGED_CONSTRAINT';

export interface ElementDiff {
  path: string;
  diffType: DiffType;
  base?: RawElement;
  target?: RawElement;
}

export function computeElementDiff(
  baseElements: RawElement[],
  targetElements: RawElement[],
): ElementDiff[] {
  const baseMap = new Map<string, RawElement>();
  const targetMap = new Map<string, RawElement>();

  for (const el of baseElements) {
    const key = el.id ?? el.path ?? '';
    baseMap.set(key, el);
  }
  for (const el of targetElements) {
    const key = el.id ?? el.path ?? '';
    targetMap.set(key, el);
  }

  const diffs: ElementDiff[] = [];

  for (const [path, target] of targetMap) {
    const base = baseMap.get(path);
    if (!base) {
      diffs.push({ path, diffType: 'NEW', target });
      continue;
    }

    const cardinalityChanged = base.min !== target.min || base.max !== target.max;
    const typeChanged =
      JSON.stringify(base.type ?? []) !== JSON.stringify(target.type ?? []);
    const constraintChanged =
      JSON.stringify(base.constraint ?? []) !== JSON.stringify(target.constraint ?? []);

    if (cardinalityChanged) {
      diffs.push({ path, diffType: 'CHANGED_CARDINALITY', base, target });
    } else if (typeChanged) {
      diffs.push({ path, diffType: 'CHANGED_TYPE', base, target });
    } else if (constraintChanged) {
      diffs.push({ path, diffType: 'CHANGED_CONSTRAINT', base, target });
    }
  }

  for (const [path, base] of baseMap) {
    if (!targetMap.has(path)) {
      diffs.push({ path, diffType: 'REMOVED', base });
    }
  }

  diffs.sort((a, b) => a.path.localeCompare(b.path));
  return diffs;
}

export function fmtCardinality(min?: number, max?: string): string {
  return `${min ?? 0}..${max ?? '*'}`;
}

export function fmtTypes(el?: RawElement): string {
  if (!el?.type) return '—';
  return el.type.map((t) => t.code ?? '').filter(Boolean).join(', ') || '—';
}
