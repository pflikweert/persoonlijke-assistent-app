import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const hasExplicitBackground = typeof lightColor === 'string' || typeof darkColor === 'string';
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <View
      // Layout wrappers stay transparent by default. Only opt into a fill for real surfaces.
      style={[hasExplicitBackground ? { backgroundColor } : null, style]}
      {...otherProps}
    />
  );
}
