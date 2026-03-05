import { Select } from '@mantine/core';
import type { SpecResource } from '@/lib/specResources';

interface ResourceSelectorProps {
  resources: SpecResource[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ResourceSelector({ resources, value, onChange }: ResourceSelectorProps) {
  const data = resources.map((r) => ({ value: r.label, label: r.label }));

  return (
    <Select
      label="Resource"
      placeholder="Select a resource"
      data={data}
      value={value}
      onChange={onChange}
      allowDeselect={false}
      w={260}
    />
  );
}
