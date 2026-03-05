import { evalFhirPath, evalFhirPathTyped } from 'fhir-runtime';

export interface TypedValue {
  readonly type: string;
  readonly value: unknown;
}

export interface EvalResult {
  values: unknown[];
  typed: TypedValue[];
  error: string | null;
}

export function evaluateFhirPath(resourceJson: string, expression: string): EvalResult {
  if (!expression.trim()) {
    return { values: [], typed: [], error: null };
  }

  // Step 1: Parse raw JSON — evalFhirPath expects plain objects with .resourceType
  let resource: Record<string, unknown>;
  try {
    resource = JSON.parse(resourceJson) as Record<string, unknown>;
  } catch {
    return { values: [], typed: [], error: 'Resource is not valid JSON' };
  }

  if (!resource.resourceType || typeof resource.resourceType !== 'string') {
    return { values: [], typed: [], error: 'JSON must have a "resourceType" field' };
  }

  // Step 2: Evaluate expression — pass the raw JSON object directly
  try {
    const values = evalFhirPath(expression, resource);
    const typed = evalFhirPathTyped(
      expression,
      [{ type: resource.resourceType, value: resource }],
    );
    return { values, typed: typed as TypedValue[], error: null };
  } catch (err) {
    return {
      values: [],
      typed: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
