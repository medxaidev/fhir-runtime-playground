import { useState } from 'react';
import { Box, Group, Text, UnstyledButton, Badge, Collapse, Stack } from '@mantine/core';
import { ChevronRight, ChevronDown, Minus } from 'lucide-react';
import type { TreeNode } from './treeBuilder';

interface ResourceTreePanelProps {
  nodes: TreeNode[];
}

export function ResourceTreePanel({ nodes }: ResourceTreePanelProps) {
  if (nodes.length === 0) {
    return <Text c="dimmed">No elements to display</Text>;
  }

  return (
    <Box
      style={{
        fontFamily: 'monospace',
        fontSize: 13,
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 8,
        padding: 8,
        overflowX: 'auto',
      }}
    >
      {nodes.map((node) => (
        <TreeNodeRow key={node.id} node={node} level={0} />
      ))}
    </Box>
  );
}

interface TreeNodeRowProps {
  node: TreeNode;
  level: number;
}

function TreeNodeRow({ node, level }: TreeNodeRowProps) {
  const [expanded, setExpanded] = useState(level < 1);
  const hasChildren = node.children.length > 0;

  return (
    <Box>
      <UnstyledButton
        onClick={() => hasChildren && setExpanded((v) => !v)}
        w="100%"
        py={3}
        px={4}
        style={{
          borderRadius: 4,
          cursor: hasChildren ? 'pointer' : 'default',
          '&:hover': { backgroundColor: 'var(--mantine-color-gray-0)' },
        }}
      >
        <Group gap={4} wrap="nowrap" pl={level * 20}>
          {/* Expand/collapse icon */}
          <Box w={16} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {hasChildren ? (
              expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <Minus size={10} opacity={0.3} />
            )}
          </Box>

          {/* Element name */}
          <Text
            fw={hasChildren ? 600 : 400}
            size="sm"
            style={{ minWidth: 160, flexShrink: 0 }}
            ff="monospace"
          >
            {node.name}
          </Text>

          {/* Type badges */}
          <Group gap={4} style={{ flexShrink: 0 }}>
            {node.types.map((t) => (
              <Badge
                key={t}
                size="xs"
                variant="light"
                color={getTypeColor(t)}
                radius="sm"
              >
                {t}
              </Badge>
            ))}
          </Group>

          {/* Cardinality */}
          <Text size="xs" c="dimmed" ff="monospace" style={{ flexShrink: 0, minWidth: 48 }}>
            {node.cardinality}
          </Text>

          {/* Description */}
          <Text size="xs" c="dimmed" truncate="end" style={{ flex: 1 }}>
            {node.description}
          </Text>
        </Group>
      </UnstyledButton>

      {hasChildren && (
        <Collapse in={expanded}>
          <Stack gap={0}>
            {node.children.map((child) => (
              <TreeNodeRow key={child.id} node={child} level={level + 1} />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}

function getTypeColor(type: string): string {
  if (type === 'string' || type === 'code' || type === 'uri' || type === 'markdown' || type === 'id')
    return 'green';
  if (type === 'boolean') return 'orange';
  if (type === 'integer' || type === 'decimal' || type === 'positiveInt' || type === 'unsignedInt')
    return 'blue';
  if (type === 'date' || type === 'dateTime' || type === 'instant' || type === 'time')
    return 'violet';
  if (type === 'Reference') return 'cyan';
  if (type === 'BackboneElement') return 'grape';
  if (type === 'Extension') return 'pink';
  return 'gray';
}
