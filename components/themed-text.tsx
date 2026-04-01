import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, typography } from '@/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'screenTitle'
    | 'sectionTitle'
    | 'body'
    | 'bodySecondary'
    | 'caption'
    | 'meta'
    | 'ctaLabel';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const hasExplicitColor = Boolean(lightColor || darkColor);

  let roleColor = color;
  if (!hasExplicitColor) {
    if (type === 'bodySecondary') {
      roleColor = palette.muted;
    } else if (type === 'caption' || type === 'meta') {
      roleColor = palette.mutedSoft;
    } else if (type === 'link') {
      roleColor = palette.primary;
    }
  }

  return (
    <Text
      style={[
        { color: roleColor },
        type === 'default' || type === 'body' ? styles.body : undefined,
        type === 'title' || type === 'screenTitle' ? styles.screenTitle : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' || type === 'sectionTitle' ? styles.sectionTitle : undefined,
        type === 'bodySecondary' ? styles.bodySecondary : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'meta' ? styles.meta : undefined,
        type === 'ctaLabel' ? styles.ctaLabel : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: typography.roles.body.size,
    lineHeight: typography.roles.body.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.body.weight,
    letterSpacing: typography.roles.body.letterSpacing,
  },
  defaultSemiBold: {
    fontSize: typography.roles.body.size,
    lineHeight: typography.roles.body.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.roles.body.letterSpacing,
  },
  screenTitle: {
    fontSize: typography.roles.screenTitle.size,
    lineHeight: typography.roles.screenTitle.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.screenTitle.weight,
    letterSpacing: typography.roles.screenTitle.letterSpacing,
  },
  sectionTitle: {
    fontSize: typography.roles.sectionTitle.size,
    lineHeight: typography.roles.sectionTitle.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.sectionTitle.weight,
    letterSpacing: typography.roles.sectionTitle.letterSpacing,
  },
  bodySecondary: {
    fontSize: typography.roles.bodySecondary.size,
    lineHeight: typography.roles.bodySecondary.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.bodySecondary.weight,
    letterSpacing: typography.roles.bodySecondary.letterSpacing,
  },
  caption: {
    fontSize: typography.roles.caption.size,
    lineHeight: typography.roles.caption.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.caption.weight,
    letterSpacing: typography.roles.caption.letterSpacing,
  },
  meta: {
    fontSize: typography.roles.meta.size,
    lineHeight: typography.roles.meta.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.meta.weight,
    letterSpacing: typography.roles.meta.letterSpacing,
    textTransform: 'uppercase',
  },
  ctaLabel: {
    fontSize: typography.roles.ctaLabel.size,
    lineHeight: typography.roles.ctaLabel.lineHeight,
    fontFamily: typography.families.sans,
    fontWeight: typography.roles.ctaLabel.weight,
    letterSpacing: typography.roles.ctaLabel.letterSpacing,
  },
  link: {
    lineHeight: typography.roles.body.lineHeight,
    fontSize: typography.roles.body.size,
    fontFamily: typography.families.sans,
  },
});
