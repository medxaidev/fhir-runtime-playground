import { useState } from 'react';
import { Stack, Text, Badge, Table, Alert, Button, Group, Collapse, Box } from '@mantine/core';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { SnapshotDiffPanel, computeSnapshotDiff } from './SnapshotDiffPanel';
import type { ElementDiff } from './SnapshotDiffPanel';
import type { PipelineResult } from './validationPipeline';
import { publicUrl } from '../../lib/publicBaseUrl';

interface ValidationResultPanelProps {
  result: PipelineResult | null;
  loading: boolean;
}

export function ValidationResultPanel({ result, loading }: ValidationResultPanelProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [snapshotDiffs, setSnapshotDiffs] = useState<ElementDiff[]>([]);
  const [diffLoading, setDiffLoading] = useState(false);

  if (loading) {
    return <Text size="sm" c="dimmed">Running validation...</Text>;
  }

  if (!result) {
    return <Text size="sm" c="dimmed">Select a profile and resource, then click Run Validation</Text>;
  }

  if (result.error) {
    return (
      <Alert color="red" icon={<AlertCircle size={16} />} title="Pipeline Error">
        {result.error}
      </Alert>
    );
  }

  const validation = result.validation;
  if (!validation) return null;

  const errors = validation.issues.filter((i) => i.severity === 'error');
  const warnings = validation.issues.filter((i) => i.severity === 'warning');
  const infos = validation.issues.filter((i) => i.severity === 'information');

  const handleShowDiff = async () => {
    if (showDiff) {
      setShowDiff(false);
      return;
    }
    if (!result.snapshot || !result.parsedSd) return;

    setDiffLoading(true);
    try {
      const baseUrl = result.parsedSd.baseDefinition;
      if (baseUrl) {
        const baseName = baseUrl.split('/').pop() ?? '';
        const resp = await fetch(publicUrl(`spec/r4/StructureDefinition-${baseName}.json`));
        if (resp.ok) {
          const baseSd = await resp.json();
          const baseElements = baseSd.snapshot?.element ?? [];
          const profileElements = result.snapshot.structureDefinition.snapshot?.element ?? [];
          setSnapshotDiffs(computeSnapshotDiff(baseElements, profileElements));
        }
      }
    } catch {
      // silently fail — diff is optional
    } finally {
      setDiffLoading(false);
      setShowDiff(true);
    }
  };

  return (
    <Stack gap="md">
      <Text fw={600} size="sm">Validation Result</Text>

      {/* Status badge */}
      <Group gap="xs">
        {validation.valid ? (
          <Badge color="green" size="lg" leftSection={<CheckCircle size={14} />}>
            Valid
          </Badge>
        ) : (
          <Badge color="red" size="lg" leftSection={<XCircle size={14} />}>
            Invalid
          </Badge>
        )}
        <Text size="xs" c="dimmed">
          {errors.length} error{errors.length !== 1 ? 's' : ''} · {warnings.length} warning{warnings.length !== 1 ? 's' : ''} · {infos.length} info
        </Text>
      </Group>

      {/* Issues table */}
      {validation.issues.length > 0 && (
        <Box style={{ overflowX: 'auto', maxHeight: 300, overflowY: 'auto' }}>
          <Table striped highlightOnHover withTableBorder fz="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={60}>Severity</Table.Th>
                <Table.Th>Path</Table.Th>
                <Table.Th>Code</Table.Th>
                <Table.Th>Message</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {validation.issues.map((issue, idx) => (
                <Table.Tr key={idx}>
                  <Table.Td>
                    <Badge
                      size="xs"
                      color={issue.severity === 'error' ? 'red' : issue.severity === 'warning' ? 'yellow' : 'blue'}
                      variant="light"
                    >
                      {issue.severity}
                    </Badge>
                  </Table.Td>
                  <Table.Td ff="monospace" fz={11}>{issue.path ?? '—'}</Table.Td>
                  <Table.Td ff="monospace" fz={11}>{issue.code}</Table.Td>
                  <Table.Td fz={11}>{issue.message}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}

      {/* Snapshot issues */}
      {result.snapshot && result.snapshot.issues.length > 0 && (
        <Alert color="yellow" title={`Snapshot Issues (${result.snapshot.issues.length})`}>
          <Stack gap={4}>
            {result.snapshot.issues.map((si, idx) => (
              <Text key={idx} size="xs" ff="monospace">
                [{si.severity}] {si.path ? `${si.path}: ` : ''}{si.message}
              </Text>
            ))}
          </Stack>
        </Alert>
      )}

      {/* Show Snapshot Diff button */}
      <Button
        variant="subtle"
        size="xs"
        leftSection={showDiff ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        onClick={handleShowDiff}
        loading={diffLoading}
      >
        {showDiff ? 'Hide' : 'Show'} Snapshot Diff
      </Button>

      <Collapse in={showDiff}>
        <SnapshotDiffPanel diffs={snapshotDiffs} />
      </Collapse>
    </Stack>
  );
}
