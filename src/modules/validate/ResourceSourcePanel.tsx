import { useState, useEffect } from 'react';
import { Stack, SegmentedControl, Select, Textarea, Text } from '@mantine/core';
import { EXAMPLE_RESOURCES, getExampleJson } from '@/lib/examples';

type SourceMode = 'example' | 'custom';

interface ResourceSourcePanelProps {
  onResourceChange: (json: string) => void;
}

export function ResourceSourcePanel({ onResourceChange }: ResourceSourcePanelProps) {
  const [mode, setMode] = useState<SourceMode>('example');
  const [selectedExample, setSelectedExample] = useState<string | null>(EXAMPLE_RESOURCES[0].label);
  const [customJson, setCustomJson] = useState('');

  useEffect(() => {
    if (mode === 'example' && selectedExample) {
      onResourceChange(getExampleJson(selectedExample));
    } else if (mode === 'custom') {
      onResourceChange(customJson);
    }
  }, [mode, selectedExample, customJson, onResourceChange]);

  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">Resource Source</Text>

      <SegmentedControl
        size="xs"
        value={mode}
        onChange={(v) => setMode(v as SourceMode)}
        data={[
          { label: 'Example', value: 'example' },
          { label: 'Paste JSON', value: 'custom' },
        ]}
      />

      {mode === 'example' && (
        <Select
          size="xs"
          data={EXAMPLE_RESOURCES.map((r) => r.label)}
          value={selectedExample}
          onChange={setSelectedExample}
          allowDeselect={false}
        />
      )}

      {mode === 'custom' && (
        <Textarea
          placeholder="Paste FHIR resource JSON..."
          autosize
          minRows={12}
          maxRows={20}
          value={customJson}
          onChange={(e) => setCustomJson(e.currentTarget.value)}
          styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
        />
      )}
    </Stack>
  );
}
