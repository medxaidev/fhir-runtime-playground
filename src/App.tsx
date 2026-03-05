import { useState } from 'react';
import { MantineProvider, AppShell, Tabs, Text, Group, ThemeIcon } from '@mantine/core';
import { Stethoscope, ShieldCheck, GitCompareArrows, Terminal, Home, BookOpen } from 'lucide-react';
import { HomeModule } from '@/modules/home/HomeModule';
import { ApiReferenceModule } from '@/modules/apiref/ApiReferenceModule';
import { ExploreModule } from '@/modules/explore/ExploreModule';
import { ValidateModule } from '@/modules/validate/ValidateModule';
import { DiffModule } from '@/modules/diff/DiffModule';
import { FhirPathModule } from '@/modules/fhirpath/FhirPathModule';

type TabValue = 'home' | 'apiref' | 'explore' | 'validate' | 'diff' | 'fhirpath';

export function App() {
  const [activeTab, setActiveTab] = useState<TabValue>('home');

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
              <Tabs.Tab value="home" leftSection={<Home size={16} />}>
                Home
              </Tabs.Tab>
              <Tabs.Tab value="apiref" leftSection={<BookOpen size={16} />}>
                API Reference
              </Tabs.Tab>
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

            <Tabs.Panel value="home">
              <HomeModule />
            </Tabs.Panel>

            <Tabs.Panel value="apiref">
              <ApiReferenceModule />
            </Tabs.Panel>

            <Tabs.Panel value="explore">
              <ExploreModule />
            </Tabs.Panel>

            <Tabs.Panel value="validate">
              <ValidateModule />
            </Tabs.Panel>

            <Tabs.Panel value="diff">
              <DiffModule />
            </Tabs.Panel>

            <Tabs.Panel value="fhirpath">
              <FhirPathModule />
            </Tabs.Panel>
          </Tabs>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
