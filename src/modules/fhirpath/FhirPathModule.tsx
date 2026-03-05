import { useState, useCallback } from 'react';
import {
  Grid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Button,
  Select,
  Alert,
  Table,
  Code,
  Group,
  Badge,
} from '@mantine/core';
import { Play, AlertCircle } from 'lucide-react';
import { evaluateFhirPath } from './fhirPathEvaluator';
import { EXAMPLE_RESOURCES, getExampleJson } from '@/lib/examples';
import type { EvalResult } from './fhirPathEvaluator';

const EXAMPLE_EXPRESSIONS: Record<string, string[]> = {
  'Patient (valid US Core)': [
    'Patient.name.given',
    'Patient.name.where(use=\'official\').family',
    'Patient.birthDate',
    'Patient.identifier.value',
    'Patient.name.exists()',
    'Patient.name.count()',
  ],
  'Observation (Lab)': [
    'Observation.status',
    'Observation.code.coding.code',
    'Observation.value.exists()',
    'Observation.subject.reference',
  ],
  'Condition': [
    'Condition.code.coding.display',
    'Condition.clinicalStatus.coding.code',
    'Condition.subject.reference',
  ],
  'Encounter': [
    'Encounter.status',
    'Encounter.class.code',
    'Encounter.type.coding.display',
  ],
};

export function FhirPathModule() {
  const [selectedExample, setSelectedExample] = useState<string | null>(EXAMPLE_RESOURCES[0].label);
  const [resourceJson, setResourceJson] = useState(() => getExampleJson(EXAMPLE_RESOURCES[0].label));
  const [expression, setExpression] = useState('Patient.name.given');
  const [result, setResult] = useState<EvalResult | null>(null);

  const handleExampleChange = useCallback((label: string | null) => {
    setSelectedExample(label);
    if (label) {
      setResourceJson(getExampleJson(label));
      const exprs = EXAMPLE_EXPRESSIONS[label];
      if (exprs && exprs.length > 0) {
        setExpression(exprs[0]);
      }
      setResult(null);
    }
  }, []);

  const handleEvaluate = useCallback(() => {
    const res = evaluateFhirPath(resourceJson, expression);
    setResult(res);
  }, [resourceJson, expression]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleEvaluate();
      }
    },
    [handleEvaluate],
  );

  const exampleExpressions = selectedExample ? EXAMPLE_EXPRESSIONS[selectedExample] ?? [] : [];

  return (
    <Grid gutter="md">
      {/* Left — Resource JSON */}
      <Grid.Col span={6}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={600} size="sm">Resource JSON</Text>
            <Select
              size="xs"
              w={220}
              data={EXAMPLE_RESOURCES.map((r) => r.label)}
              value={selectedExample}
              onChange={handleExampleChange}
              allowDeselect={false}
            />
          </Group>
          <Textarea
            autosize
            minRows={20}
            maxRows={30}
            value={resourceJson}
            onChange={(e) => setResourceJson(e.currentTarget.value)}
            styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
          />
        </Stack>
      </Grid.Col>

      {/* Right — Expression + Result */}
      <Grid.Col span={6}>
        <Stack gap="sm">
          <Text fw={600} size="sm">FHIRPath Expression</Text>

          <TextInput
            placeholder="Patient.name.given"
            value={expression}
            onChange={(e) => setExpression(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            styles={{ input: { fontFamily: 'monospace', fontSize: 13 } }}
            rightSection={
              <Button size="compact-xs" onClick={handleEvaluate} variant="filled">
                <Play size={12} />
              </Button>
            }
            rightSectionWidth={40}
          />

          <Button
            leftSection={<Play size={16} />}
            onClick={handleEvaluate}
            disabled={!expression.trim() || !resourceJson.trim()}
          >
            Evaluate
          </Button>

          {/* Example expressions */}
          {exampleExpressions.length > 0 && (
            <Stack gap={4}>
              <Text size="xs" c="dimmed">Try an example:</Text>
              <Group gap={4}>
                {exampleExpressions.map((expr) => (
                  <Badge
                    key={expr}
                    size="sm"
                    variant="outline"
                    style={{ cursor: 'pointer', textTransform: 'none' }}
                    onClick={() => setExpression(expr)}
                  >
                    {expr}
                  </Badge>
                ))}
              </Group>
            </Stack>
          )}

          {/* Result */}
          {result && (
            <Stack gap="sm">
              {result.error ? (
                <Alert color="red" icon={<AlertCircle size={16} />} title="Evaluation Error">
                  {result.error}
                </Alert>
              ) : (
                <>
                  {/* Raw values */}
                  <Stack gap={4}>
                    <Text fw={600} size="sm">Values ({result.values.length})</Text>
                    <Code block style={{ maxHeight: 200, overflow: 'auto' }}>
                      {JSON.stringify(result.values, null, 2)}
                    </Code>
                  </Stack>

                  {/* Typed values table */}
                  {result.typed.length > 0 && (
                    <Stack gap={4}>
                      <Text fw={600} size="sm">Typed Values</Text>
                      <Table striped highlightOnHover withTableBorder fz="xs">
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th w={30}>#</Table.Th>
                            <Table.Th w={100}>Type</Table.Th>
                            <Table.Th>Value</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {result.typed.map((tv, idx) => (
                            <Table.Tr key={idx}>
                              <Table.Td>{idx}</Table.Td>
                              <Table.Td>
                                <Badge size="xs" variant="light">{tv.type}</Badge>
                              </Table.Td>
                              <Table.Td ff="monospace" fz={11}>
                                {typeof tv.value === 'object'
                                  ? JSON.stringify(tv.value)
                                  : String(tv.value)}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          )}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
