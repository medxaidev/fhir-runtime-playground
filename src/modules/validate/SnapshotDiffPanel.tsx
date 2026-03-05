import { Box, Table, Badge, Text, Stack } from '@mantine/core';

interface RawElement {
  id?: string;
  path?: string;
  min?: number;
  max?: string;
  type?: Array<{ code?: string }>;
  constraint?: Array<{ key?: string }>;
}

export type DiffType = 'NEW' | 'REMOVED' | 'CHANGED_CARDINALITY' | 'CHANGED_TYPE' | 'CHANGED_CONSTRAINT';

export interface ElementDiff {
  path: string;
  diffType: DiffType;
  base?: RawElement;
  target?: RawElement;
}

export function computeSnapshotDiff(
  baseElements: RawElement[],
  targetElements: RawElement[],
): ElementDiff[] {
  const baseMap = new Map(baseElements.map((e) => [e.id ?? e.path ?? '', e]));
  const targetMap = new Map(targetElements.map((e) => [e.id ?? e.path ?? '', e]));
  const diffs: ElementDiff[] = [];

  for (const [path, target] of targetMap) {
    const base = baseMap.get(path);
    if (!base) {
      diffs.push({ path, diffType: 'NEW', target });
      continue;
    }
    if (base.min !== target.min || base.max !== target.max) {
      diffs.push({ path, diffType: 'CHANGED_CARDINALITY', base, target });
    } else if (JSON.stringify(base.type ?? []) !== JSON.stringify(target.type ?? [])) {
      diffs.push({ path, diffType: 'CHANGED_TYPE', base, target });
    } else if (JSON.stringify(base.constraint ?? []) !== JSON.stringify(target.constraint ?? [])) {
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

const DIFF_COLORS: Record<DiffType, string> = {
  NEW: 'green',
  REMOVED: 'red',
  CHANGED_CARDINALITY: 'yellow',
  CHANGED_TYPE: 'yellow',
  CHANGED_CONSTRAINT: 'blue',
};

function fmtCardinality(el?: RawElement): string {
  if (!el) return '—';
  return `${el.min ?? 0}..${el.max ?? '*'}`;
}

function fmtTypes(el?: RawElement): string {
  if (!el?.type) return '—';
  return el.type.map((t) => t.code ?? '').filter(Boolean).join(', ') || '—';
}

interface SnapshotDiffPanelProps {
  diffs: ElementDiff[];
}

export function SnapshotDiffPanel({ diffs }: SnapshotDiffPanelProps) {
  if (diffs.length === 0) {
    return <Text size="sm" c="dimmed">No differences found</Text>;
  }

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm">Snapshot Diff ({diffs.length} changes)</Text>
      <Box style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
        <Table striped highlightOnHover withTableBorder withColumnBorders fz="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Path</Table.Th>
              <Table.Th>Change</Table.Th>
              <Table.Th>Base</Table.Th>
              <Table.Th>Profile</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {diffs.map((d) => (
              <Table.Tr key={d.path}>
                <Table.Td ff="monospace">{d.path}</Table.Td>
                <Table.Td>
                  <Badge size="xs" color={DIFF_COLORS[d.diffType]} variant="light">
                    {d.diffType}
                  </Badge>
                </Table.Td>
                <Table.Td ff="monospace" fz={11}>
                  {d.diffType === 'CHANGED_CARDINALITY'
                    ? fmtCardinality(d.base)
                    : d.diffType === 'CHANGED_TYPE'
                      ? fmtTypes(d.base)
                      : d.diffType === 'REMOVED'
                        ? `${fmtCardinality(d.base)} ${fmtTypes(d.base)}`
                        : '—'}
                </Table.Td>
                <Table.Td ff="monospace" fz={11}>
                  {d.diffType === 'CHANGED_CARDINALITY'
                    ? fmtCardinality(d.target)
                    : d.diffType === 'CHANGED_TYPE'
                      ? fmtTypes(d.target)
                      : d.diffType === 'NEW'
                        ? `${fmtCardinality(d.target)} ${fmtTypes(d.target)}`
                        : '—'}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
}
