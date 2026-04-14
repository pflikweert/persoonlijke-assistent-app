import { Text, TextStyle, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';
import { ThemedText } from '@/components/themed-text';

export type InlineDiffSegment = {
  kind: 'unchanged' | 'removed' | 'added';
  text: string;
};

function tokenizeDiffUnits(text: string): string[] {
  return text.match(/\n+|\S+|[ \t]+/g) ?? [];
}

export function buildInlineDiffSegments(beforeText: string, afterText: string): InlineDiffSegment[] {
  const a = tokenizeDiffUnits(beforeText);
  const b = tokenizeDiffUnits(afterText);
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  type UnitOp = { kind: 'unchanged' | 'removed' | 'added'; unit: string };
  const rawOps: UnitOp[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      rawOps.push({ kind: 'unchanged', unit: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawOps.push({ kind: 'added', unit: b[j - 1] });
      j--;
    } else {
      rawOps.push({ kind: 'removed', unit: a[i - 1] });
      i--;
    }
  }
  rawOps.reverse();

  const segments: InlineDiffSegment[] = [];
  for (let k = 0; k < rawOps.length; k++) {
    const op = rawOps[k];
    const last = segments[segments.length - 1];
    if (last?.kind === op.kind) {
      last.text += op.unit;
    } else {
      segments.push({ kind: op.kind, text: op.unit });
    }
  }

  return segments;
}

/**
 * Split segments into paragraph groups at \n\n boundaries.
 * Any segment containing \n\n acts as a paragraph separator in the rendered output.
 */
function groupSegmentsByParagraph(segments: InlineDiffSegment[]): InlineDiffSegment[][] {
  const paragraphs: InlineDiffSegment[][] = [[]];

  for (const segment of segments) {
    if (!segment.text.includes('\n\n')) {
      paragraphs[paragraphs.length - 1].push(segment);
      continue;
    }

    // Split on \n\n+ sequences; treat each as a paragraph boundary
    const parts = segment.text.split(/(\n\n+)/);
    for (const part of parts) {
      if (/\n\n/.test(part)) {
        paragraphs.push([]);
      } else if (part.length > 0) {
        paragraphs[paragraphs.length - 1].push({ kind: segment.kind, text: part });
      }
    }
  }

  return paragraphs.filter((group) => group.length > 0);
}

export function InlineWordDiffText({ beforeText, afterText }: { beforeText: string; afterText: string }) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const segments = buildInlineDiffSegments(beforeText, afterText);
  const paragraphs = groupSegmentsByParagraph(segments);

  return (
    <View style={{ gap: spacing.sm }}>
      {paragraphs.map((paragraphSegments, pIndex) => (
        <ThemedText key={pIndex} type="bodySecondary" style={{ color: palette.text }}>
          {paragraphSegments.map((segment, index) => {
            let style: TextStyle | undefined;
            if (segment.kind === 'removed') {
              style = { textDecorationLine: 'line-through', color: palette.error };
            } else if (segment.kind === 'added') {
              style = { color: palette.success, fontWeight: '600' };
            }
            return (
              <Text key={`${segment.kind}-${index}`} style={style}>
                {segment.text}
              </Text>
            );
          })}
        </ThemedText>
      ))}
    </View>
  );
}
