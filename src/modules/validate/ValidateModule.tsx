import { useState, useCallback } from 'react';
import { Grid, Stack, Button, Text } from '@mantine/core';
import { Play } from 'lucide-react';
import { ProfileSourcePanel } from './ProfileSourcePanel';
import { ResourceSourcePanel } from './ResourceSourcePanel';
import { ValidationResultPanel } from './ValidationResultPanel';
import { runValidationPipeline } from './validationPipeline';
import { getFhirContext } from '@/lib/fhirContext';
import type { PipelineResult } from './validationPipeline';

export function ValidateModule() {
  const [profileJson, setProfileJson] = useState('');
  const [resourceJson, setResourceJson] = useState('');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = useCallback(async () => {
    if (!profileJson || !resourceJson) return;
    setLoading(true);
    setResult(null);
    try {
      const ctx = await getFhirContext();
      const res = await runValidationPipeline(ctx, profileJson, resourceJson);
      setResult(res);
    } catch (err) {
      setResult({
        snapshot: null,
        validation: null,
        canonical: null,
        parsedSd: null,
        parsedResource: null,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  }, [profileJson, resourceJson]);

  return (
    <Stack gap="md">
      <Grid gutter="md">
        {/* Left column — Profile */}
        <Grid.Col span={4}>
          <ProfileSourcePanel onProfileChange={setProfileJson} />
        </Grid.Col>

        {/* Middle column — Resource */}
        <Grid.Col span={4}>
          <ResourceSourcePanel onResourceChange={setResourceJson} />
        </Grid.Col>

        {/* Right column — Result */}
        <Grid.Col span={4}>
          <ValidationResultPanel result={result} loading={loading} />
        </Grid.Col>
      </Grid>

      <Button
        leftSection={<Play size={16} />}
        onClick={handleRun}
        loading={loading}
        disabled={!profileJson || !resourceJson}
      >
        Run Validation
      </Button>

      {!profileJson && (
        <Text size="xs" c="dimmed">Select a profile to begin</Text>
      )}
    </Stack>
  );
}
