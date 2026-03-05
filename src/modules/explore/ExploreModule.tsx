import { useState, useEffect, useCallback } from 'react';
import { Tabs, Group, Alert, Loader, Stack, Text } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { ResourceSelector } from './ResourceSelector';
import { ResourceTreePanel } from './ResourceTreePanel';
import { buildElementTree } from './treeBuilder';
import { fetchStructureDefinition } from '@/lib/fhirContext';
import { FHIR_R4_RESOURCES, US_CORE_RESOURCES } from '@/lib/specResources';
import type { SpecResource } from '@/lib/specResources';
import type { TreeNode } from './treeBuilder';

type SpecMode = 'fhir-r4' | 'us-core';

export function ExploreModule() {
  const [mode, setMode] = useState<SpecMode>('fhir-r4');
  const [selectedR4, setSelectedR4] = useState<string | null>('Patient');
  const [selectedUsCore, setSelectedUsCore] = useState<string | null>('Patient');

  const resources = mode === 'fhir-r4' ? FHIR_R4_RESOURCES : US_CORE_RESOURCES;
  const selected = mode === 'fhir-r4' ? selectedR4 : selectedUsCore;
  const setSelected = mode === 'fhir-r4' ? setSelectedR4 : setSelectedUsCore;

  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdInfo, setSdInfo] = useState<{ name: string; url: string; elementCount: number } | null>(null);

  const loadResource = useCallback(async (spec: SpecResource) => {
    setLoading(true);
    setError(null);
    setSdInfo(null);
    try {
      const sd = await fetchStructureDefinition(spec.filePath);
      const elements = sd.snapshot?.element ?? [];
      const nodes = buildElementTree(elements);
      setTree(nodes);
      setSdInfo({
        name: sd.name ?? spec.label,
        url: sd.url ?? spec.url,
        elementCount: elements.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTree([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    const spec = resources.find((r) => r.label === selected);
    if (spec) {
      loadResource(spec);
    }
  }, [selected, mode, resources, loadResource]);

  return (
    <Stack gap="md">
      <Tabs value={mode} onChange={(v) => setMode(v as SpecMode)}>
        <Tabs.List>
          <Tabs.Tab value="fhir-r4">FHIR R4</Tabs.Tab>
          <Tabs.Tab value="us-core">US Core</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Group align="flex-end">
        <ResourceSelector
          resources={resources}
          value={selected}
          onChange={setSelected}
        />
        {sdInfo && (
          <Text size="xs" c="dimmed">
            {sdInfo.name} — {sdInfo.elementCount} elements — {sdInfo.url}
          </Text>
        )}
      </Group>

      {loading && <Loader size="sm" />}

      {error && (
        <Alert color="red" icon={<AlertCircle size={16} />} title="Error loading StructureDefinition">
          {error}
        </Alert>
      )}

      {!loading && !error && <ResourceTreePanel nodes={tree} />}
    </Stack>
  );
}
