import { useState } from 'react';
import { MantineProvider, AppShell, Tabs, Text, Group, ThemeIcon } from '@mantine/core';
import { Stethoscope, ShieldCheck, GitCompareArrows, Terminal } from 'lucide-react';
import { ExploreModule } from '@/modules/explore/ExploreModule';

type TabValue = 'explore' | 'validate' | 'diff' | 'fhirpath';

export function App() {
  const [activeTab, setActiveTab] = useState<TabValue>('explore');

  return (
    <MantineProvider defaultColorScheme="light">
      <AppShell header={{ height: 56 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="xs">
              <ThemeIcon variant="filled" size="lg" color="blue">
                <Stethoscope size={20} />
              </ThemeIcon>
              <Text fw={700} size="lg">FHIR Runtime Playground</Text>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Tabs value={activeTab} onChange={(v) => setActiveTab(v as TabValue)}>
            <Tabs.List mb="md">
              <Tabs.Tab value="explore" leftSection={<Stethoscope size={16} />}>
                Explore
              </Tabs.Tab>
              <Tabs.Tab value="validate" leftSection={<ShieldCheck size={16} />}>
                Validate
              </Tabs.Tab>
              <Tabs.Tab value="diff" leftSection={<GitCompareArrows size={16} />}>
                Diff
              </Tabs.Tab>
              <Tabs.Tab value="fhirpath" leftSection={<Terminal size={16} />}>
                FHIRPath
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="explore">
              <ExploreModule />
            </Tabs.Panel>

            <Tabs.Panel value="validate">
              <Text c="dimmed" ta="center" py="xl">Validate module — coming in Stage 2</Text>
            </Tabs.Panel>

            <Tabs.Panel value="diff">
              <Text c="dimmed" ta="center" py="xl">Diff module — coming in Stage 3</Text>
            </Tabs.Panel>

            <Tabs.Panel value="fhirpath">
              <Text c="dimmed" ta="center" py="xl">FHIRPath module — coming in Stage 4</Text>
            </Tabs.Panel>
          </Tabs>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
