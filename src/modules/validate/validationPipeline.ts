import {
  parseStructureDefinition,
  SnapshotGenerator,
  buildCanonicalProfile,
  parseFhirJson,
  StructureValidator,
} from 'fhir-runtime';
import type {
  FhirContext,
  SnapshotResult,
  ValidationResult,
  CanonicalProfile,
  StructureDefinition,
  Resource,
} from 'fhir-runtime';

export interface PipelineResult {
  snapshot: SnapshotResult | null;
  validation: ValidationResult | null;
  canonical: CanonicalProfile | null;
  parsedSd: StructureDefinition | null;
  parsedResource: Resource | null;
  error: string | null;
}

export async function runValidationPipeline(
  ctx: FhirContext,
  profileJson: string,
  resourceJson: string,
): Promise<PipelineResult> {
  const result: PipelineResult = {
    snapshot: null,
    validation: null,
    canonical: null,
    parsedSd: null,
    parsedResource: null,
    error: null,
  };

  // Step 1: Parse StructureDefinition
  let profileObj: Record<string, unknown>;
  try {
    profileObj = JSON.parse(profileJson) as Record<string, unknown>;
  } catch {
    result.error = 'Profile is not valid JSON';
    return result;
  }
  const sdResult = parseStructureDefinition(profileObj, '');
  if (!sdResult.success) {
    result.error = `Profile parse failed: ${sdResult.issues.map((i) => i.message).join('; ')}`;
    return result;
  }
  result.parsedSd = sdResult.data;

  // Step 2: Generate snapshot
  try {
    const generator = new SnapshotGenerator(ctx, { generateCanonical: true });
    result.snapshot = await generator.generate(sdResult.data);
    if (!result.snapshot.success) {
      result.error = `Snapshot generation failed: ${result.snapshot.issues.map((i) => i.message).join('; ')}`;
      return result;
    }
  } catch (err) {
    result.error = `Snapshot generation error: ${err instanceof Error ? err.message : String(err)}`;
    return result;
  }

  // Step 3: Build CanonicalProfile
  result.canonical = result.snapshot.canonical ?? buildCanonicalProfile(result.snapshot.structureDefinition);

  // Step 4: Parse resource
  const resourceResult = parseFhirJson(resourceJson);
  if (!resourceResult.success) {
    result.error = `Resource parse failed: ${resourceResult.issues.map((i) => i.message).join('; ')}`;
    return result;
  }
  result.parsedResource = resourceResult.data;

  // Step 5: Validate
  try {
    const validator = new StructureValidator({ skipInvariants: false });
    result.validation = validator.validate(resourceResult.data, result.canonical);
  } catch (err) {
    result.error = `Validation error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return result;
}
