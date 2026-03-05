import {
  FhirContextImpl,
  MemoryLoader,
  parseStructureDefinition,
} from 'fhir-runtime';
import type { StructureDefinition } from 'fhir-runtime';

let _ctx: FhirContextImpl | null = null;
let _initPromise: Promise<FhirContextImpl> | null = null;

/**
 * Get or initialize the singleton FhirContextImpl.
 * Loads core definitions on first call via fetch (browser-compatible).
 *
 * NOTE: We cannot use ctx.preloadCoreDefinitions() because it relies on
 * Node-only APIs (fileURLToPath, readFileSync). Instead we fetch the
 * FHIR R4 bundles from public/spec/r4/ and register each SD manually.
 */
export async function getFhirContext(): Promise<FhirContextImpl> {
  if (_ctx) return _ctx;
  if (_initPromise) return _initPromise;

  _initPromise = _initContext();
  _ctx = await _initPromise;
  return _ctx;
}

/**
 * FHIR R4 bundle files that contain the core StructureDefinitions
 * (primitive types, complex types, and resource definitions).
 */
const CORE_BUNDLES = [
  '/spec/r4/profiles-types.json',
  '/spec/r4/profiles-resources.json',
];

async function _initContext(): Promise<FhirContextImpl> {
  const loader = new MemoryLoader(new Map());
  const ctx = new FhirContextImpl({ loaders: [loader] });

  // Fetch core R4 bundles and register each StructureDefinition
  const bundles = await Promise.all(
    CORE_BUNDLES.map(async (path) => {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`Failed to fetch ${path}: ${resp.statusText}`);
      return resp.json();
    }),
  );

  for (const bundle of bundles) {
    const entries = (bundle as { entry?: Array<{ resource?: Record<string, unknown> }> }).entry ?? [];
    for (const entry of entries) {
      const resource = entry.resource;
      if (!resource || resource.resourceType !== 'StructureDefinition') continue;
      try {
        const result = parseStructureDefinition(resource, '');
        if (result.success) {
          ctx.registerStructureDefinition(result.data);
        }
      } catch {
        // Skip definitions that fail to parse — partial loading is acceptable
      }
    }
  }

  return ctx;
}

/**
 * Fetch an individual StructureDefinition JSON from a URL path under public/.
 */
export async function fetchStructureDefinition(path: string): Promise<StructureDefinition> {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`Failed to fetch ${path}: ${resp.statusText}`);
  return resp.json() as Promise<StructureDefinition>;
}
