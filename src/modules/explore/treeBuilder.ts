/**
 * Builds a hierarchical tree from a flat array of StructureDefinition snapshot elements.
 */

export interface TreeNode {
  id: string;
  path: string;
  name: string;
  types: string[];
  cardinality: string;
  description: string;
  children: TreeNode[];
  depth: number;
}

interface RawElement {
  id?: string;
  path?: string;
  short?: string;
  definition?: string;
  min?: number;
  max?: string;
  type?: Array<{ code?: string }>;
}

function getElementName(el: RawElement): string {
  const path = el.path ?? el.id ?? '';
  const segments = path.split('.');
  return segments[segments.length - 1] ?? path;
}

function getTypes(el: RawElement): string[] {
  if (!el.type || el.type.length === 0) return [];
  return el.type.map((t) => t.code ?? '').filter(Boolean);
}

function getCardinality(el: RawElement): string {
  const min = el.min ?? 0;
  const max = el.max ?? '*';
  return `${min}..${max}`;
}

function pathDepth(path: string): number {
  return path.split('.').length - 1;
}

export function buildElementTree(elements: RawElement[]): TreeNode[] {
  if (!elements || elements.length === 0) return [];

  const nodes: TreeNode[] = elements.map((el) => ({
    id: el.id ?? el.path ?? '',
    path: el.path ?? el.id ?? '',
    name: getElementName(el),
    types: getTypes(el),
    cardinality: getCardinality(el),
    description: el.short ?? el.definition ?? '',
    children: [],
    depth: pathDepth(el.path ?? el.id ?? ''),
  }));

  // Build parent-child relationships using a stack-based approach
  const root: TreeNode[] = [];
  const stack: TreeNode[] = [];

  for (const node of nodes) {
    // Pop stack until we find the parent
    while (stack.length > 0 && !node.path.startsWith(stack[stack.length - 1].path + '.')) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return root;
}
