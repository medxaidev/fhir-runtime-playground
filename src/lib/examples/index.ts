import patientValid from './patient-valid.json';
import patientInvalid from './patient-invalid.json';
import observationValid from './observation-valid.json';
import conditionValid from './condition-valid.json';
import encounterValid from './encounter-valid.json';

export interface ExampleResource {
  label: string;
  json: object;
}

export const EXAMPLE_RESOURCES: ExampleResource[] = [
  { label: 'Patient (valid US Core)', json: patientValid },
  { label: 'Patient (invalid — missing identifier)', json: patientInvalid },
  { label: 'Observation (Lab)', json: observationValid },
  { label: 'Condition', json: conditionValid },
  { label: 'Encounter', json: encounterValid },
];

export function getExampleJson(label: string): string {
  const ex = EXAMPLE_RESOURCES.find((e) => e.label === label);
  return ex ? JSON.stringify(ex.json, null, 2) : '';
}
