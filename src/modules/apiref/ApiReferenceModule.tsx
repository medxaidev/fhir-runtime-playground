import {
  Stack,
  Title,
  Text,
  Code,
  Table,
  Divider,
  Card,
  Badge,
  Group,
  Anchor,
} from '@mantine/core';

interface ApiEntry {
  name: string;
  module: string;
  signature: string;
  description: string;
  returns: string;
}

const PARSER_APIS: ApiEntry[] = [
  {
    name: 'parseFhirJson',
    module: 'parser',
    signature: 'parseFhirJson(json: string): ParseResult<Resource>',
    description:
      'Parse a FHIR resource from a JSON string. Returns a typed Resource with full model structure. Used before validation.',
    returns: 'ParseResult<Resource> — { success, data, issues }',
  },
  {
    name: 'parseFhirObject',
    module: 'parser',
    signature: 'parseFhirObject(obj: unknown): ParseResult<Resource>',
    description:
      'Parse a FHIR resource from a plain JavaScript object. Same as parseFhirJson but skips the JSON.parse step.',
    returns: 'ParseResult<Resource>',
  },
  {
    name: 'parseStructureDefinition',
    module: 'parser',
    signature:
      'parseStructureDefinition(obj: Record<string, unknown>, path: string): ParseResult<StructureDefinition>',
    description:
      'Parse a raw JSON object into a typed StructureDefinition. The path parameter is used for error reporting (can be empty string).',
    returns: 'ParseResult<StructureDefinition>',
  },
  {
    name: 'serializeToFhirJson',
    module: 'parser',
    signature: 'serializeToFhirJson(resource: Resource): string',
    description: 'Serialize a typed Resource back to a FHIR JSON string.',
    returns: 'string',
  },
];

const CONTEXT_APIS: ApiEntry[] = [
  {
    name: 'FhirContextImpl',
    module: 'context',
    signature: 'new FhirContextImpl(options: FhirContextOptions)',
    description:
      'The central registry for StructureDefinitions. Manages loading, caching, and resolving inheritance chains. Accepts an array of loaders (e.g. MemoryLoader) for flexible definition sourcing.',
    returns: 'FhirContextImpl instance',
  },
  {
    name: 'registerStructureDefinition',
    module: 'context',
    signature: 'ctx.registerStructureDefinition(sd: StructureDefinition): void',
    description:
      'Register a StructureDefinition in the context registry. After registration, it can be resolved by URL for snapshot generation and validation.',
    returns: 'void',
  },
  {
    name: 'loadStructureDefinition',
    module: 'context',
    signature: 'ctx.loadStructureDefinition(url: string): Promise<StructureDefinition>',
    description:
      'Load a StructureDefinition by its canonical URL. Checks the registry first, then falls back to configured loaders.',
    returns: 'Promise<StructureDefinition>',
  },
  {
    name: 'resolveInheritanceChain',
    module: 'context',
    signature: 'ctx.resolveInheritanceChain(url: string): Promise<StructureDefinition[]>',
    description:
      'Resolve the full inheritance chain for a StructureDefinition URL, from the most derived to the base (e.g. USCorePatient → Patient → DomainResource → Resource).',
    returns: 'Promise<StructureDefinition[]>',
  },
  {
    name: 'MemoryLoader',
    module: 'context',
    signature: 'new MemoryLoader(map: Map<string, StructureDefinition>)',
    description:
      'An in-memory loader that serves StructureDefinitions from a Map. Useful for browser-based applications where definitions are fetched via HTTP.',
    returns: 'MemoryLoader instance',
  },
  {
    name: 'loadBundleFromObject',
    module: 'context',
    signature:
      'loadBundleFromObject(bundle: BundleShape, options?: BundleLoadOptions): BundleLoadResult',
    description:
      'Load a FHIR Bundle containing StructureDefinitions. Parses each entry and returns an array of CanonicalProfile objects. Supports partial failure tolerance.',
    returns: 'BundleLoadResult — { profiles, errors, statistics }',
  },
];

const PROFILE_APIS: ApiEntry[] = [
  {
    name: 'SnapshotGenerator',
    module: 'profile',
    signature: 'new SnapshotGenerator(context: FhirContext, options?: SnapshotGeneratorOptions)',
    description:
      'Expands a StructureDefinition\'s differential into a full snapshot by walking the inheritance chain and applying differential constraints. Detects circular dependencies.',
    returns: 'SnapshotGenerator instance',
  },
  {
    name: 'generate',
    module: 'profile',
    signature: 'generator.generate(sd: StructureDefinition): SnapshotResult',
    description:
      'Generate a snapshot for a StructureDefinition. Populates sd.snapshot.element with the fully expanded element list. Returns issues encountered during generation.',
    returns: 'SnapshotResult — { success, structureDefinition, canonical?, issues }',
  },
  {
    name: 'buildCanonicalProfile',
    module: 'profile',
    signature: 'buildCanonicalProfile(sd: StructureDefinition): CanonicalProfile',
    description:
      'Convert a StructureDefinition (with snapshot) into a CanonicalProfile, the format required by StructureValidator. Extracts constraints, types, cardinality rules.',
    returns: 'CanonicalProfile',
  },
];

const VALIDATOR_APIS: ApiEntry[] = [
  {
    name: 'StructureValidator',
    module: 'validator',
    signature: 'new StructureValidator(options?: ValidationOptions)',
    description:
      'Validates a FHIR resource against a CanonicalProfile. Checks cardinality, type constraints, fixed values, patterns, and FHIRPath invariants.',
    returns: 'StructureValidator instance',
  },
  {
    name: 'validate',
    module: 'validator',
    signature:
      'validator.validate(resource: Resource, profile: CanonicalProfile, options?: ValidationOptions): ValidationResult',
    description:
      'Run structural validation. Returns all issues found: cardinality violations, type mismatches, pattern failures, invariant failures, etc.',
    returns: 'ValidationResult — { valid, issues }',
  },
];

const FHIRPATH_APIS: ApiEntry[] = [
  {
    name: 'evalFhirPath',
    module: 'fhirpath',
    signature: 'evalFhirPath(expression: string | FhirPathAtom, input: unknown): unknown[]',
    description:
      'Evaluate a FHIRPath expression against a FHIR resource (raw JSON object). Returns an array of unwrapped result values. The input can be a plain object with a resourceType field.',
    returns: 'unknown[] — array of result values',
  },
  {
    name: 'evalFhirPathTyped',
    module: 'fhirpath',
    signature:
      'evalFhirPathTyped(expression: string | FhirPathAtom, input: TypedValue[], variables?: Record<string, TypedValue>): TypedValue[]',
    description:
      'Evaluate a FHIRPath expression and return typed results. Each result includes its FHIR type (e.g. "string", "boolean", "Patient") and value. Input must be wrapped in TypedValue.',
    returns: 'TypedValue[] — array of { type, value }',
  },
  {
    name: 'evalFhirPathBoolean',
    module: 'fhirpath',
    signature:
      'evalFhirPathBoolean(expression: string | FhirPathAtom, input: unknown, variables?: Record<string, TypedValue>): boolean',
    description:
      'Evaluate a FHIRPath expression and return a boolean. Uses FHIRPath boolean semantics: empty → false, single truthy → true. Useful for invariant validation.',
    returns: 'boolean',
  },
  {
    name: 'evalFhirPathString',
    module: 'fhirpath',
    signature:
      'evalFhirPathString(expression: string | FhirPathAtom, input: unknown, variables?: Record<string, TypedValue>): string | undefined',
    description:
      'Evaluate a FHIRPath expression and return the first result as a string. Useful for extracting display values and identifiers.',
    returns: 'string | undefined',
  },
];

const MODULE_COLORS: Record<string, string> = {
  parser: 'blue',
  context: 'cyan',
  profile: 'green',
  validator: 'orange',
  fhirpath: 'violet',
};

function ApiTable({ apis, title }: { apis: ApiEntry[]; title: string }) {
  return (
    <Stack gap="sm">
      <Title order={4}>{title}</Title>
      <Table striped highlightOnHover withTableBorder fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={180}>Function</Table.Th>
            <Table.Th>Signature</Table.Th>
            <Table.Th w={300}>Description</Table.Th>
            <Table.Th w={200}>Returns</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {apis.map((api) => (
            <Table.Tr key={api.name}>
              <Table.Td>
                <Group gap={4} wrap="nowrap">
                  <Badge size="xs" color={MODULE_COLORS[api.module]} variant="light">
                    {api.module}
                  </Badge>
                  <Code fz={11}>{api.name}</Code>
                </Group>
              </Table.Td>
              <Table.Td>
                <Code fz={10} block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {api.signature}
                </Code>
              </Table.Td>
              <Table.Td>
                <Text fz={11}>{api.description}</Text>
              </Table.Td>
              <Table.Td>
                <Code fz={10}>{api.returns}</Code>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

export function ApiReferenceModule() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Title order={2}>fhir-runtime API Reference</Title>
        <Text size="sm" c="dimmed">
          Complete reference for the{' '}
          <Anchor href="https://github.com/nicktobey/fhir-runtime" target="_blank" rel="noopener">
            fhir-runtime
          </Anchor>{' '}
          v0.2 public API. This engine provides all FHIR logic used by the playground.
        </Text>
      </Stack>

      <Divider />

      {/* Module chain */}
      <Card withBorder padding="md">
        <Text fw={600} size="sm" mb="xs">Module Chain</Text>
        <Code block fz={12}>
          {`model ← parser ← context ← profile ← validator
                                  ↑
                              fhirpath`}
        </Code>
        <Text size="xs" c="dimmed" mt="xs">
          Each module depends only on modules to its left. The fhirpath module is independent.
        </Text>
      </Card>

      <Divider />

      {/* Usage pattern */}
      <Stack gap="sm">
        <Title order={4}>Typical Usage Pattern</Title>
        <Code block fz={11}>
          {`// 1. Setup context
const ctx = new FhirContextImpl({ loaders: [new MemoryLoader(new Map())] });

// 2. Load core definitions (browser: fetch + register manually)
const bundle = await fetch('\\${import.meta.env.BASE_URL}spec/r4/profiles-types.json').then(r => r.json());
          for (const entry of bundle.entry) {
  const result = parseStructureDefinition(entry.resource, '');
          if (result.success) ctx.registerStructureDefinition(result.data);
}

          // 3. Generate snapshot for a profile
          const sd = parseStructureDefinition(profileJson, '').data;
          const generator = new SnapshotGenerator(ctx);
          const snapshot = generator.generate(sd);

          // 4. Build canonical + validate
          const canonical = buildCanonicalProfile(snapshot.structureDefinition);
          const resource = parseFhirJson(resourceJson).data;
          const validator = new StructureValidator();
          const result = validator.validate(resource, canonical);
// result.valid, result.issues

// 5. FHIRPath (standalone — no context needed)
const values = evalFhirPath('Patient.name.given', rawJsonObject);`}
        </Code>
      </Stack>

      <Divider />

      <ApiTable apis={PARSER_APIS} title="Parser APIs" />
      <Divider />
      <ApiTable apis={CONTEXT_APIS} title="Context APIs" />
      <Divider />
      <ApiTable apis={PROFILE_APIS} title="Profile / Snapshot APIs" />
      <Divider />
      <ApiTable apis={VALIDATOR_APIS} title="Validator APIs" />
      <Divider />
      <ApiTable apis={FHIRPATH_APIS} title="FHIRPath APIs" />

      <Divider />

      {/* Key types */}
      <Stack gap="sm">
        <Title order={4}>Key Types</Title>
        <Code block fz={11}>
          {`// Parse result — all parse functions return this
interface ParseResult<T> {
  success: boolean;
  data: T;               // The parsed object (available even on partial success)
  issues: ParseIssue[];   // Errors and warnings
}

// Snapshot generation result
interface SnapshotResult {
  success: boolean;
  structureDefinition: StructureDefinition;  // SD with populated snapshot
  canonical?: CanonicalProfile;               // If generateCanonical option was true
  issues: SnapshotIssue[];                    // Warnings from generation
}

// Validation result
interface ValidationResult {
  valid: boolean;                             // true if no error-level issues
  issues: ValidationIssue[];                  // All issues found
}

// Each validation issue
interface ValidationIssue {
  severity: 'error' | 'warning' | 'information';
  code: string;           // e.g. 'CARDINALITY_MIN_VIOLATION'
  path: string;           // e.g. 'Patient.identifier'
  message: string;
}

// FHIRPath typed value
interface TypedValue {
  readonly type: string;   // FHIR type name (e.g. 'string', 'Patient', 'boolean')
  readonly value: unknown; // The actual value
}

// Bundle shape for loadBundleFromObject
interface BundleShape {
  resourceType: string;
  entry?: Array<{ resource?: Record<string, unknown> }>;
}`}
        </Code>
      </Stack>

      <Divider />

      {/* Browser considerations */}
      <Stack gap="sm">
        <Title order={4}>Browser Considerations</Title>
        <Card withBorder padding="md">
          <Stack gap="xs">
            <Text size="sm">
              <strong>preloadCoreDefinitions()</strong> uses Node-only APIs (<Code>fileURLToPath</Code>,{' '}
              <Code>readFileSync</Code>) and <strong>cannot be used in the browser</strong>.
            </Text>
            <Text size="sm">
              Instead, fetch the FHIR R4 bundles via HTTP and register each StructureDefinition
              manually using <Code>parseStructureDefinition()</Code> +{' '}
              <Code>ctx.registerStructureDefinition()</Code>.
            </Text>
            <Text size="sm">
              <strong>evalFhirPath()</strong> accepts <strong>raw JSON objects</strong> (plain objects
              with a <Code>resourceType</Code> field), not parsed <Code>Resource</Code> instances from{' '}
              <Code>parseFhirJson()</Code>. The engine&apos;s internal <Code>toTypedValue()</Code>{' '}
              wraps raw objects automatically.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
