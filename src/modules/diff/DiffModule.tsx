import { useState, useCallback } from 'react';
import { Grid, Stack, Button, Text, SegmentedControl, Select, Textarea, Loader, Alert } from '@mantine/core';
import { GitCompareArrows, AlertCircle } from 'lucide-react';
import { DiffTreePanel } from './DiffTreePanel';
import { computeElementDiff } from './diffEngine';
import { FHIR_R4_RESOURCES, US_CORE_RESOURCES } from '@/lib/specResources';
import type { SpecResource } from '@/lib/specResources';
import type { ElementDiff } from './diffEngine';

type SourceMode = 'builtin' | 'uscore' | 'custom';

interface ProfilePanelState {
  mode: SourceMode;
  selectedBuiltin: string | null;
  selectedUsCore: string | null;
  customJson: string;
}

function createDefaultState(defaultLabel: string | null): ProfilePanelState {
  return {
    mode: 'builtin',
    selectedBuiltin: defaultLabel,
    selectedUsCore: US_CORE_RESOURCES[0].label,
    customJson: '',
  };
}

async function fetchProfileJson(state: ProfilePanelState): Promise<string> {
  let spec: SpecResource | undefined;
  if (state.mode === 'builtin') {
    spec = FHIR_R4_RESOURCES.find((r) => r.label === state.selectedBuiltin);
  } else if (state.mode === 'uscore') {
    spec = US_CORE_RESOURCES.find((r) => r.label === state.selectedUsCore);
  } else {
    return state.customJson;
  }
  if (!spec) return '';
  const resp = await fetch(spec.filePath);
  if (!resp.ok) throw new Error(`Failed to fetch ${spec.filePath}`);
  return resp.text();
}

function ProfilePanel({
  label,
  state,
  onChange,
}: {
  label: string;
  state: ProfilePanelState;
  onChange: (s: ProfilePanelState) => void;
}) {
  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">{label}</Text>
      <SegmentedControl
        size="xs"
        value={state.mode}
        onChange={(v) => onChange({ ...state, mode: v as SourceMode })}
        data={[
          { label: 'FHIR R4', value: 'builtin' },
          { label: 'US Core', value: 'uscore' },
          { label: 'Custom', value: 'custom' },
        ]}
      />
      {state.mode === 'builtin' && (
        <Select
          size="xs"
          data={FHIR_R4_RESOURCES.map((r) => r.label)}
          value={state.selectedBuiltin}
          onChange={(v) => onChange({ ...state, selectedBuiltin: v })}
          allowDeselect={false}
        />
      )}
      {state.mode === 'uscore' && (
        <Select
          size="xs"
          data={US_CORE_RESOURCES.map((r) => r.label)}
          value={state.selectedUsCore}
          onChange={(v) => onChange({ ...state, selectedUsCore: v })}
          allowDeselect={false}
        />
      )}
      {state.mode === 'custom' && (
        <Textarea
          placeholder="Paste StructureDefinition JSON..."
          autosize
          minRows={10}
          maxRows={18}
          value={state.customJson}
          onChange={(e) => onChange({ ...state, customJson: e.currentTarget.value })}
          styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
        />
      )}
    </Stack>
  );
}

export function DiffModule() {
  const [baseState, setBaseState] = useState<ProfilePanelState>(
    createDefaultState(FHIR_R4_RESOURCES[0].label),
  );
  const [targetState, setTargetState] = useState<ProfilePanelState>(() => ({
    mode: 'uscore',
    selectedBuiltin: FHIR_R4_RESOURCES[0].label,
    selectedUsCore: US_CORE_RESOURCES[0].label,
    customJson: '',
  }));
  const [diffs, setDiffs] = useState<ElementDiff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDiff = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDiffs([]);
    try {
      const [baseJson, targetJson] = await Promise.all([
        fetchProfileJson(baseState),
        fetchProfileJson(targetState),
      ]);

      if (!baseJson || !targetJson) {
        setError('Both base and target profiles are required');
        return;
      }

      const baseSd = JSON.parse(baseJson);
      const targetSd = JSON.parse(targetJson);

      const baseElements = baseSd.snapshot?.element ?? [];
      const targetElements = targetSd.snapshot?.element ?? [];

      if (baseElements.length === 0) {
        setError('Base profile has no snapshot elements');
        return;
      }
      if (targetElements.length === 0) {
        setError('Target profile has no snapshot elements');
        return;
      }

      const result = computeElementDiff(baseElements, targetElements);
      setDiffs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [baseState, targetState]);

  return (
    <Stack gap="md">
      <Grid gutter="md">
        <Grid.Col span={6}>
          <ProfilePanel label="Base Profile" state={baseState} onChange={setBaseState} />
        </Grid.Col>
        <Grid.Col span={6}>
          <ProfilePanel label="Target Profile" state={targetState} onChange={setTargetState} />
        </Grid.Col>
      </Grid>

      <Button
        leftSection={<GitCompareArrows size={16} />}
        onClick={handleGenerateDiff}
        loading={loading}
      >
        Generate Diff
      </Button>

      {loading && <Loader size="sm" />}

      {error && (
        <Alert color="red" icon={<AlertCircle size={16} />} title="Diff Error">
          {error}
        </Alert>
      )}

      {!loading && !error && diffs.length > 0 && <DiffTreePanel diffs={diffs} />}
    </Stack>
  );
}
