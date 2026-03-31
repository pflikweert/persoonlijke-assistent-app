import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { typography } from '@/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.families.sans,
  },
  defaultSemiBold: {
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontFamily: typography.families.sans,
    fontWeight: typography.weight.semibold,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    lineHeight: typography.lineHeight.title,
    fontFamily: typography.families.rounded,
  },
  subtitle: {
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.bold,
    fontFamily: typography.families.sans,
  },
  link: {
    lineHeight: 30,
    fontSize: typography.size.body,
    color: '#0a7ea4',
    fontFamily: typography.families.sans,
  },
});
