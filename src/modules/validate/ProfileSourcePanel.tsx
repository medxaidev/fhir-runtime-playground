import { useState, useEffect, useCallback } from 'react';
import { Stack, SegmentedControl, Select, Textarea, Text, Loader } from '@mantine/core';
import { FHIR_R4_RESOURCES, US_CORE_RESOURCES } from '@/lib/specResources';
import type { SpecResource } from '@/lib/specResources';

type SourceMode = 'builtin' | 'uscore' | 'custom';

interface ProfileSourcePanelProps {
  onProfileChange: (json: string) => void;
}

export function ProfileSourcePanel({ onProfileChange }: ProfileSourcePanelProps) {
  const [mode, setMode] = useState<SourceMode>('builtin');
  const [selectedBuiltin, setSelectedBuiltin] = useState<string | null>(FHIR_R4_RESOURCES[0].label);
  const [selectedUsCore, setSelectedUsCore] = useState<string | null>(US_CORE_RESOURCES[0].label);
  const [customJson, setCustomJson] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (spec: SpecResource) => {
    setLoading(true);
    try {
      const resp = await fetch(spec.filePath);
      if (!resp.ok) throw new Error(`Failed to fetch ${spec.filePath}`);
      const text = await resp.text();
      onProfileChange(text);
    } catch (err) {
      onProfileChange('');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onProfileChange]);

  useEffect(() => {
    if (mode === 'builtin' && selectedBuiltin) {
      const spec = FHIR_R4_RESOURCES.find((r) => r.label === selectedBuiltin);
      if (spec) fetchProfile(spec);
    } else if (mode === 'uscore' && selectedUsCore) {
      const spec = US_CORE_RESOURCES.find((r) => r.label === selectedUsCore);
      if (spec) fetchProfile(spec);
    } else if (mode === 'custom') {
      onProfileChange(customJson);
    }
  }, [mode, selectedBuiltin, selectedUsCore, fetchProfile, customJson, onProfileChange]);

  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">Profile Source</Text>

      <SegmentedControl
        size="xs"
        value={mode}
        onChange={(v) => setMode(v as SourceMode)}
        data={[
          { label: 'Built-in', value: 'builtin' },
          { label: 'US Core', value: 'uscore' },
          { label: 'Custom', value: 'custom' },
        ]}
      />

      {mode === 'builtin' && (
        <Select
          size="xs"
          data={FHIR_R4_RESOURCES.map((r) => r.label)}
          value={selectedBuiltin}
          onChange={setSelectedBuiltin}
          allowDeselect={false}
        />
      )}

      {mode === 'uscore' && (
        <Select
          size="xs"
          data={US_CORE_RESOURCES.map((r) => r.label)}
          value={selectedUsCore}
          onChange={setSelectedUsCore}
          allowDeselect={false}
        />
      )}

      {mode === 'custom' && (
        <Textarea
          placeholder="Paste StructureDefinition JSON..."
          autosize
          minRows={12}
          maxRows={20}
          value={customJson}
          onChange={(e) => setCustomJson(e.currentTarget.value)}
          styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
        />
      )}

      {loading && <Loader size="xs" />}
    </Stack>
  );
}
