import {
  FhirContextImpl,
  MemoryLoader,
} from 'fhir-runtime';
import type { StructureDefinition } from 'fhir-runtime';

let _ctx: FhirContextImpl | null = null;
let _initPromise: Promise<FhirContextImpl> | null = null;

/**
 * Get or initialize the singleton FhirContextImpl.
 * Loads core definitions on first call.
 * Spec bundles (R4, US Core) are loaded lazily by each module as needed.
 */
export async function getFhirContext(): Promise<FhirContextImpl> {
  if (_ctx) return _ctx;
  if (_initPromise) return _initPromise;

  _initPromise = _initContext();
  _ctx = await _initPromise;
  return _ctx;
}

async function _initContext(): Promise<FhirContextImpl> {
  const loader = new MemoryLoader(new Map());
  const ctx = new FhirContextImpl({ loaders: [loader] });
  await ctx.preloadCoreDefinitions();
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
