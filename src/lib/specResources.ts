/**
 * Registry of available resources for the Explore module.
 * Maps display names to spec file paths under public/.
 */

export interface SpecResource {
  label: string;
  url: string;
  filePath: string;
}

export const FHIR_R4_RESOURCES: SpecResource[] = [
  {
    label: 'Patient',
    url: 'http://hl7.org/fhir/StructureDefinition/Patient',
    filePath: '/spec/r4/StructureDefinition-Patient.json',
  },
  {
    label: 'Observation',
    url: 'http://hl7.org/fhir/StructureDefinition/Observation',
    filePath: '/spec/r4/StructureDefinition-Observation.json',
  },
  {
    label: 'Encounter',
    url: 'http://hl7.org/fhir/StructureDefinition/Encounter',
    filePath: '/spec/r4/StructureDefinition-Encounter.json',
  },
  {
    label: 'Condition',
    url: 'http://hl7.org/fhir/StructureDefinition/Condition',
    filePath: '/spec/r4/StructureDefinition-Condition.json',
  },
];

export const US_CORE_RESOURCES: SpecResource[] = [
  {
    label: 'Patient',
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient',
    filePath: '/spec/us-core/package/StructureDefinition-us-core-patient.json',
  },
  {
    label: 'Observation (Lab)',
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab',
    filePath: '/spec/us-core/package/StructureDefinition-us-core-observation-lab.json',
  },
  {
    label: 'Encounter',
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter',
    filePath: '/spec/us-core/package/StructureDefinition-us-core-encounter.json',
  },
  {
    label: 'Condition',
    url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition-problems-health-concerns',
    filePath: '/spec/us-core/package/StructureDefinition-us-core-condition-problems-health-concerns.json',
  },
];
