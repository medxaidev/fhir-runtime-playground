import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Grid,
  ThemeIcon,
  Anchor,
  List,
  Divider,
  Code,
} from '@mantine/core';
import {
  Stethoscope,
  ShieldCheck,
  GitCompareArrows,
  Terminal,
  Globe,
  Cpu,
  FileJson,
  Layers,
} from 'lucide-react';

const MODULES = [
  {
    icon: Stethoscope,
    color: 'blue',
    title: 'Explore',
    tab: 'explore',
    description:
      'Browse FHIR R4 base resources and US Core profiles as interactive element trees. Inspect cardinality, types, constraints, and descriptions for every element in a StructureDefinition.',
  },
  {
    icon: ShieldCheck,
    color: 'green',
    title: 'Validate',
    tab: 'validate',
    description:
      'Validate a FHIR resource instance against any profile. The pipeline runs: parse profile → generate snapshot → build canonical → parse resource → structural validation. View issues by severity, path, and code.',
  },
  {
    icon: GitCompareArrows,
    color: 'orange',
    title: 'Diff',
    tab: 'diff',
    description:
      'Compare two StructureDefinition snapshots element-by-element. See what changed between a base FHIR R4 resource and a derived profile (e.g. US Core): new elements, removed elements, cardinality/type/constraint changes.',
  },
  {
    icon: Terminal,
    color: 'violet',
    title: 'FHIRPath',
    tab: 'fhirpath',
    description:
      'Evaluate FHIRPath expressions against any FHIR resource. See both raw values and typed results. Includes clickable example expressions for common queries.',
  },
];

export function HomeModule() {
  return (
    <Stack gap="lg">
      {/* Hero */}
      <Stack gap="xs">
        <Group gap="sm">
          <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size={48} radius="md">
            <Stethoscope size={28} />
          </ThemeIcon>
          <div>
            <Title order={2}>FHIR Runtime Playground</Title>
            <Text c="dimmed" size="sm">
              A browser-only interactive environment for the{' '}
              <Code>fhir-runtime</Code> engine
            </Text>
          </div>
        </Group>
      </Stack>

      <Divider />

      {/* What is this */}
      <Stack gap="sm">
        <Title order={4}>What is this?</Title>
        <Text size="sm">
          FHIR Runtime Playground is an interactive, browser-only showcase of the{' '}
          <Anchor href="https://github.com/nicktobey/fhir-runtime" target="_blank" rel="noopener">
            fhir-runtime
          </Anchor>{' '}
          engine (v0.2). All FHIR execution happens inside your browser — no backend, no network
          dependency, fully offline-capable.
        </Text>
        <Text size="sm">
          It lets you explore FHIR R4 StructureDefinitions, validate resources against profiles,
          diff two profiles side-by-side, and evaluate FHIRPath expressions — all powered by the
          same engine that runs in production.
        </Text>
      </Stack>

      {/* Key Features grid */}
      <Stack gap="sm">
        <Title order={4}>Modules</Title>
        <Text size="sm" c="dimmed">
          Click any tab above to jump to a module, or read the descriptions below:
        </Text>
        <Grid gutter="md">
          {MODULES.map((mod) => (
            <Grid.Col key={mod.tab} span={{ base: 12, sm: 6 }}>
              <Card withBorder padding="md" radius="md" h="100%">
                <Group gap="sm" mb="xs">
                  <ThemeIcon variant="light" color={mod.color} size="lg" radius="md">
                    <mod.icon size={18} />
                  </ThemeIcon>
                  <Text fw={600}>{mod.title}</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {mod.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>

      <Divider />

      {/* Architecture */}
      <Stack gap="sm">
        <Title order={4}>Architecture</Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <List size="sm" spacing="xs" icon={
              <ThemeIcon variant="light" color="blue" size={20} radius="xl">
                <Globe size={12} />
              </ThemeIcon>
            }>
              <List.Item><strong>Browser-only</strong> — no server, no database, works offline</List.Item>
              <List.Item><strong>FHIR R4</strong> — full R4 (4.0.1) spec loaded at runtime</List.Item>
              <List.Item><strong>US Core STU3</strong> — US Core profiles included</List.Item>
            </List>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <List size="sm" spacing="xs" icon={
              <ThemeIcon variant="light" color="green" size={20} radius="xl">
                <Cpu size={12} />
              </ThemeIcon>
            }>
              <List.Item><strong>fhir-runtime v0.2</strong> — all FHIR logic delegated to the engine</List.Item>
              <List.Item><strong>React + Vite</strong> — fast HMR, TypeScript, Mantine UI</List.Item>
              <List.Item><strong>Black-box</strong> — UI never implements FHIR logic directly</List.Item>
            </List>
          </Grid.Col>
        </Grid>
      </Stack>

      <Divider />

      {/* Tech Stack */}
      <Stack gap="sm">
        <Title order={4}>Technology Stack</Title>
        <Group gap="xs">
          {[
            { label: 'React', color: 'blue' },
            { label: 'TypeScript', color: 'blue' },
            { label: 'Vite', color: 'violet' },
            { label: 'Mantine', color: 'cyan' },
            { label: 'fhir-runtime v0.2', color: 'green' },
            { label: 'Lucide Icons', color: 'gray' },
            { label: 'FHIR R4', color: 'orange' },
            { label: 'US Core STU3', color: 'red' },
          ].map((t) => (
            <Badge key={t.label} color={t.color} variant="light" size="lg">
              {t.label}
            </Badge>
          ))}
        </Group>
      </Stack>

      <Divider />

      {/* Data Architecture */}
      <Stack gap="sm">
        <Title order={4}>Data Architecture</Title>
        <List size="sm" spacing="xs" icon={
          <ThemeIcon variant="light" color="orange" size={20} radius="xl">
            <FileJson size={12} />
          </ThemeIcon>
        }>
          <List.Item>
            <strong>Spec data</strong> served from <Code>public/spec/</Code> — fetched at runtime, not bundled
          </List.Item>
          <List.Item>
            <strong>profiles-types.json</strong> — all FHIR R4 primitive and complex type StructureDefinitions
          </List.Item>
          <List.Item>
            <strong>profiles-resources.json</strong> — all FHIR R4 resource StructureDefinitions
          </List.Item>
          <List.Item>
            <strong>Individual SDs</strong> — extracted for on-demand loading in the Explore module
          </List.Item>
          <List.Item>
            <strong>Example resources</strong> — Patient, Observation, Condition, Encounter in <Code>src/lib/examples/</Code>
          </List.Item>
        </List>
      </Stack>

      <Divider />

      {/* Engine Pipeline */}
      <Stack gap="sm">
        <Title order={4}>Engine Pipeline</Title>
        <List size="sm" spacing="xs" type="ordered" icon={
          <ThemeIcon variant="light" color="grape" size={20} radius="xl">
            <Layers size={12} />
          </ThemeIcon>
        }>
          <List.Item>
            <strong>Parse</strong> — <Code>parseStructureDefinition()</Code> / <Code>parseFhirJson()</Code> convert raw JSON into typed models
          </List.Item>
          <List.Item>
            <strong>Context</strong> — <Code>FhirContextImpl</Code> manages a registry of all known StructureDefinitions
          </List.Item>
          <List.Item>
            <strong>Snapshot</strong> — <Code>SnapshotGenerator.generate()</Code> expands a differential into a full snapshot
          </List.Item>
          <List.Item>
            <strong>Canonical</strong> — <Code>buildCanonicalProfile()</Code> creates a validation-ready profile
          </List.Item>
          <List.Item>
            <strong>Validate</strong> — <Code>StructureValidator.validate()</Code> checks resource against profile
          </List.Item>
          <List.Item>
            <strong>FHIRPath</strong> — <Code>evalFhirPath()</Code> evaluates expressions against resources
          </List.Item>
        </List>
      </Stack>
    </Stack>
  );
}
