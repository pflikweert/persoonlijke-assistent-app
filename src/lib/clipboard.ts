import { Platform } from 'react-native';

export type ClipboardCopyPayload = {
  plainText: string;
  htmlText?: string | null;
};

export async function copyToClipboard(payload: ClipboardCopyPayload): Promise<void> {
  const plainText = payload.plainText.trim();
  if (!plainText) {
    return;
  }

  const htmlText = payload.htmlText?.trim();

  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    if (htmlText && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
      const item = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([htmlText], { type: 'text/html' }),
      });
      await navigator.clipboard.write([item]);
      return;
    }

    if (navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(plainText);
      return;
    }
  }

  const clipboard = await import('expo-clipboard');
  await clipboard.setStringAsync(plainText);
}
