import { useMemo } from 'react';
import {
  Linking,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borders, colorTokens, radius, spacing, typography } from '@/theme';

type MarkdownDisplayVariant = 'body' | 'narrative' | 'summary';

type MarkdownDisplayProps = {
  markdown: string;
  variant?: MarkdownDisplayVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] };

type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'emphasis'; children: InlineNode[] }
  | { type: 'code'; value: string }
  | { type: 'link'; label: string; url: string };

type InlinePattern = {
  type: 'strong' | 'emphasis' | 'code' | 'link';
  regex: RegExp;
  build: (match: RegExpMatchArray) => InlineNode;
};

const INLINE_PATTERNS: InlinePattern[] = [
  {
    type: 'link',
    regex: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,
    build: (match) => ({
      type: 'link',
      label: match[1] ?? '',
      url: match[2] ?? '',
    }),
  },
  {
    type: 'code',
    regex: /`([^`\n]+)`/,
    build: (match) => ({
      type: 'code',
      value: match[1] ?? '',
    }),
  },
  {
    type: 'strong',
    regex: /\*\*([^*][\s\S]*?)\*\*/,
    build: (match) => ({
      type: 'strong',
      children: parseInline(match[1] ?? ''),
    }),
  },
  {
    type: 'strong',
    regex: /__([^_][\s\S]*?)__/,
    build: (match) => ({
      type: 'strong',
      children: parseInline(match[1] ?? ''),
    }),
  },
  {
    type: 'emphasis',
    regex: /\*([^*\n]+)\*/,
    build: (match) => ({
      type: 'emphasis',
      children: parseInline(match[1] ?? ''),
    }),
  },
  {
    type: 'emphasis',
    regex: /_([^_\n]+)_/,
    build: (match) => ({
      type: 'emphasis',
      children: parseInline(match[1] ?? ''),
    }),
  },
];

function normalizeMarkdown(input: string): string {
  return String(input ?? '').replace(/\r\n?/g, '\n').trim();
}

function parseBlocks(markdown: string): MarkdownBlock[] {
  const normalized = normalizeMarkdown(markdown);
  if (!normalized) {
    return [];
  }

  const lines = normalized.split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: Math.min(3, headingMatch[1]?.length ?? 1) as 1 | 2 | 3,
        text: headingMatch[2]?.trim() ?? '',
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const nextLine = (lines[index] ?? '').trim();
        if (!nextLine || !/^>\s?/.test(nextLine)) {
          break;
        }
        quoteLines.push(nextLine.replace(/^>\s?/, '').trimEnd());
        index += 1;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join('\n').trim() });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length) {
        const nextLine = (lines[index] ?? '').trim();
        if (!nextLine || !/^[-*]\s+/.test(nextLine)) {
          break;
        }
        items.push(nextLine.replace(/^[-*]\s+/, '').trim());
        index += 1;
      }
      blocks.push({ type: 'unordered-list', items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length) {
        const nextLine = (lines[index] ?? '').trim();
        if (!nextLine || !/^\d+\.\s+/.test(nextLine)) {
          break;
        }
        items.push(nextLine.replace(/^\d+\.\s+/, '').trim());
        index += 1;
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const nextLine = lines[index] ?? '';
      const nextTrimmed = nextLine.trim();
      if (!nextTrimmed) {
        break;
      }
      if (
        /^(#{1,3})\s+/.test(nextTrimmed) ||
        /^>\s?/.test(nextTrimmed) ||
        /^[-*]\s+/.test(nextTrimmed) ||
        /^\d+\.\s+/.test(nextTrimmed)
      ) {
        break;
      }
      paragraphLines.push(nextLine.trimEnd());
      index += 1;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n').trim() });
  }

  return blocks;
}

function parseInline(input: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let remaining = input;

  while (remaining.length > 0) {
    let earliestMatch: RegExpMatchArray | null = null;
    let earliestPattern: InlinePattern | null = null;

    for (const pattern of INLINE_PATTERNS) {
      const match = remaining.match(pattern.regex);
      if (!match || typeof match.index !== 'number') {
        continue;
      }
      if (!earliestMatch || match.index < earliestMatch.index!) {
        earliestMatch = match;
        earliestPattern = pattern;
      }
    }

    if (!earliestMatch || !earliestPattern || typeof earliestMatch.index !== 'number') {
      nodes.push({ type: 'text', value: remaining });
      break;
    }

    if (earliestMatch.index > 0) {
      nodes.push({ type: 'text', value: remaining.slice(0, earliestMatch.index) });
    }

    nodes.push(earliestPattern.build(earliestMatch));
    remaining = remaining.slice(earliestMatch.index + earliestMatch[0].length);
  }

  return nodes;
}

function renderInlineNodes(input: {
  nodes: InlineNode[];
  textType: ThemedTextProps['type'];
  baseTextStyle?: StyleProp<TextStyle>;
  codeTextStyle?: StyleProp<TextStyle>;
  keyPrefix: string;
}) {
  const { nodes, textType, baseTextStyle, codeTextStyle, keyPrefix } = input;

  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (node.type === 'text') {
      return (
        <ThemedText key={key} type={textType} style={baseTextStyle}>
          {node.value}
        </ThemedText>
      );
    }

    if (node.type === 'code') {
      return (
        <ThemedText key={key} type={textType} style={[baseTextStyle, codeTextStyle]}>
          {node.value}
        </ThemedText>
      );
    }

    if (node.type === 'link') {
      return (
        <ThemedText
          key={key}
          type="link"
          style={baseTextStyle}
          onPress={() => {
            void Linking.openURL(node.url);
          }}
        >
          {node.label}
        </ThemedText>
      );
    }

    if (node.type === 'strong') {
      return (
        <ThemedText key={key} type={textType} style={[baseTextStyle, styles.strongText]}>
          {renderInlineNodes({
            nodes: node.children,
            textType,
            baseTextStyle,
            codeTextStyle,
            keyPrefix: key,
          })}
        </ThemedText>
      );
    }

    return (
      <ThemedText key={key} type={textType} style={[baseTextStyle, styles.emphasisText]}>
        {renderInlineNodes({
          nodes: node.children,
          textType,
          baseTextStyle,
          codeTextStyle,
          keyPrefix: key,
        })}
      </ThemedText>
    );
  });
}

export function MarkdownDisplay({
  markdown,
  variant = 'body',
  style,
  textStyle,
}: MarkdownDisplayProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const blocks = useMemo(() => parseBlocks(markdown), [markdown]);

  if (blocks.length === 0) {
    return null;
  }

  const textType: ThemedTextProps['type'] = variant === 'summary' ? 'defaultSemiBold' : 'body';
  const baseTextStyle = [
    variant === 'narrative' ? styles.narrativeText : null,
    variant === 'summary' ? styles.summaryText : null,
    { color: palette.text },
    textStyle,
  ];
  const codeTextStyle = [
    styles.inlineCode,
    {
      backgroundColor: palette.surfaceLow,
      borderColor: palette.separator,
    },
  ];

  return (
    <ThemedView lightColor="transparent" darkColor="transparent" style={[styles.blockStack, style]}>
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === 'heading') {
          const headingType: ThemedTextProps['type'] =
            block.level === 1 ? 'screenTitle' : block.level === 2 ? 'sectionTitle' : 'defaultSemiBold';
          return (
            <ThemedText
              key={key}
              type={headingType}
              style={[
                styles.headingBase,
                block.level === 1 ? styles.headingLevelOne : null,
                block.level === 2 ? styles.headingLevelTwo : null,
                block.level === 3 ? styles.headingLevelThree : null,
                { color: palette.text },
              ]}
            >
              {block.text}
            </ThemedText>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <ThemedText key={key} type={textType} style={baseTextStyle}>
              {renderInlineNodes({
                nodes: parseInline(block.text),
                textType,
                baseTextStyle,
                codeTextStyle,
                keyPrefix: key,
              })}
            </ThemedText>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <ThemedView
              key={key}
              lightColor="transparent"
              darkColor="transparent"
              style={[
                styles.quoteWrap,
                {
                  borderLeftColor: palette.primary,
                },
              ]}
            >
              <ThemedText type={textType} style={baseTextStyle}>
                {renderInlineNodes({
                  nodes: parseInline(block.text),
                  textType,
                  baseTextStyle,
                  codeTextStyle,
                  keyPrefix: key,
                })}
              </ThemedText>
            </ThemedView>
          );
        }

        const isOrdered = block.type === 'ordered-list';
        return (
          <ThemedView key={key} lightColor="transparent" darkColor="transparent" style={styles.listWrap}>
            {block.items.map((item, itemIndex) => (
              <ThemedView
                key={`${key}-${itemIndex}`}
                lightColor="transparent"
                darkColor="transparent"
                style={styles.listRow}
              >
                <ThemedView lightColor="transparent" darkColor="transparent" style={styles.listMarkerWrap}>
                  <ThemedText type="defaultSemiBold" style={[styles.listMarker, { color: palette.primary }]}>
                    {isOrdered ? `${itemIndex + 1}.` : '•'}
                  </ThemedText>
                </ThemedView>
                <ThemedText type={textType} style={[baseTextStyle, styles.listItemText]}>
                  {renderInlineNodes({
                    nodes: parseInline(item),
                    textType,
                    baseTextStyle,
                    codeTextStyle,
                    keyPrefix: `${key}-${itemIndex}`,
                  })}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  blockStack: {
    gap: spacing.md,
  },
  headingBase: {
    color: '#000000',
  },
  headingLevelOne: {
    marginTop: spacing.xs,
  },
  headingLevelTwo: {
    marginTop: spacing.xs,
  },
  headingLevelThree: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.15,
    marginTop: spacing.xs,
  },
  narrativeText: {
    fontSize: 20,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  summaryText: {
    fontStyle: 'italic',
    fontSize: 21,
    lineHeight: 33,
  },
  quoteWrap: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listWrap: {
    gap: spacing.sm,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  listMarkerWrap: {
    minWidth: 20,
    paddingTop: 2,
  },
  listMarker: {
    minWidth: 20,
  },
  listItemText: {
    flex: 1,
  },
  strongText: {
    fontWeight: '700',
  },
  emphasisText: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: typography.families.mono,
    fontSize: 15,
    lineHeight: 24,
    borderWidth: borders.hairline,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
  },
});
