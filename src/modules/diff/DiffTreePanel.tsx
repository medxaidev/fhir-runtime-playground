import { useState } from 'react';
import { Box, Table, Badge, Text, Stack, UnstyledButton, Collapse, Group } from '@mantine/core';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { fmtCardinality, fmtTypes } from './diffEngine';
import type { ElementDiff, DiffType } from './diffEngine';

const DIFF_COLORS: Record<DiffType, string> = {
  UNCHANGED: 'gray',
  NEW: 'green',
  REMOVED: 'red',
  CHANGED_CARDINALITY: 'yellow',
  CHANGED_TYPE: 'yellow',
  CHANGED_CONSTRAINT: 'blue',
};

const DIFF_LABELS: Record<DiffType, string> = {
  UNCHANGED: 'Unchanged',
  NEW: 'New',
  REMOVED: 'Removed',
  CHANGED_CARDINALITY: 'Cardinality',
  CHANGED_TYPE: 'Type',
  CHANGED_CONSTRAINT: 'Constraint',
};

interface DiffTreePanelProps {
  diffs: ElementDiff[];
}

export function DiffTreePanel({ diffs }: DiffTreePanelProps) {
  if (diffs.length === 0) {
    return <Text size="sm" c="dimmed">No differences found</Text>;
  }

  return (
    <Stack gap="xs">
      <Group gap="md">
        <Text fw={600} size="sm">Diff Result — {diffs.length} changes</Text>
        <Group gap={4}>
          <Badge size="xs" color="green" variant="light">New</Badge>
          <Badge size="xs" color="red" variant="light">Removed</Badge>
          <Badge size="xs" color="yellow" variant="light">Cardinality/Type</Badge>
          <Badge size="xs" color="blue" variant="light">Constraint</Badge>
        </Group>
      </Group>

      <Box style={{ overflowX: 'auto' }}>
        <Table striped highlightOnHover withTableBorder fz="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={30}></Table.Th>
              <Table.Th>Path</Table.Th>
              <Table.Th w={100}>Change</Table.Th>
              <Table.Th>Base</Table.Th>
              <Table.Th>Target</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {diffs.map((d) => (
              <DiffRow key={d.path} diff={d} />
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
}

function DiffRow({ diff }: { diff: ElementDiff }) {
  const [expanded, setExpanded] = useState(false);

  const baseCard = diff.base ? fmtCardinality(diff.base.min, diff.base.max) : '—';
  const targetCard = diff.target ? fmtCardinality(diff.target.min, diff.target.max) : '—';
  const baseType = fmtTypes(diff.base);
  const targetType = fmtTypes(diff.target);

  return (
    <>
      <Table.Tr
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Table.Td>
          <UnstyledButton>
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </UnstyledButton>
        </Table.Td>
        <Table.Td ff="monospace" fz={11}>{diff.path}</Table.Td>
        <Table.Td>
          <Badge size="xs" color={DIFF_COLORS[diff.diffType]} variant="light">
            {DIFF_LABELS[diff.diffType]}
          </Badge>
        </Table.Td>
        <Table.Td ff="monospace" fz={11}>
          {diff.diffType === 'NEW' ? '—' : `${baseCard}  ${baseType}`}
        </Table.Td>
        <Table.Td ff="monospace" fz={11}>
          {diff.diffType === 'REMOVED' ? '—' : `${targetCard}  ${targetType}`}
        </Table.Td>
      </Table.Tr>

      {expanded && (
        <Table.Tr>
          <Table.Td colSpan={5} p={0}>
            <Collapse in={expanded}>
              <Box px="md" py="xs" bg="gray.0">
                <Group gap="xl" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={600}>Base</Text>
                    {diff.base ? (
                      <>
                        <Text size="xs" ff="monospace">Cardinality: {baseCard}</Text>
                        <Text size="xs" ff="monospace">Types: {baseType}</Text>
                        <Text size="xs" ff="monospace">Description: {diff.base.short ?? '—'}</Text>
                        {diff.base.constraint && diff.base.constraint.length > 0 && (
                          <Text size="xs" ff="monospace">
                            Constraints: {diff.base.constraint.map((c) => c.key).join(', ')}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text size="xs" c="dimmed">Not present in base</Text>
                    )}
                  </Stack>
                  <Stack gap={2}>
                    <Text size="xs" fw={600}>Target</Text>
                    {diff.target ? (
                      <>
                        <Text size="xs" ff="monospace">Cardinality: {targetCard}</Text>
                        <Text size="xs" ff="monospace">Types: {targetType}</Text>
                        <Text size="xs" ff="monospace">Description: {diff.target.short ?? '—'}</Text>
                        {diff.target.constraint && diff.target.constraint.length > 0 && (
                          <Text size="xs" ff="monospace">
                            Constraints: {diff.target.constraint.map((c) => c.key).join(', ')}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text size="xs" c="dimmed">Not present in target</Text>
                    )}
                  </Stack>
                </Group>
              </Box>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
}
