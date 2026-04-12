import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { buildPromptEditorHtml } from './prompt-editor-html';
import type { PromptEditorDocument, PromptEditorProps } from './prompt-editor-types';

export type { PromptEditorState } from './prompt-editor-types';

function parseMessage(raw: string): { type: string; payload: Record<string, unknown> } | null {
  try {
    const parsed = JSON.parse(raw) as { type?: unknown; payload?: unknown };
    if (typeof parsed.type !== 'string') return null;
    return {
      type: parsed.type,
      payload:
        parsed.payload && typeof parsed.payload === 'object' && !Array.isArray(parsed.payload)
          ? (parsed.payload as Record<string, unknown>)
          : {},
    };
  } catch {
    return null;
  }
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getTokenIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export function PromptEditor({
  value,
  placeholder,
  minHeight = 140,
  tokens,
  requestInsertTokenId,
  onInsertTokenHandled,
  onChangeText,
  onStateChange,
}: PromptEditorProps) {
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [latestText, setLatestText] = useState(value);

  const html = useMemo(
    () =>
      buildPromptEditorHtml({
        initialText: value,
        placeholder,
        tokens,
      }),
    // intentionally keep html stable during typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, placeholder]
  );

  useEffect(() => {
    if (!ready) return;
    if (value === latestText) return;

    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'set_content_text',
        payload: { text: value },
      })
    );
  }, [latestText, ready, value]);

  useEffect(() => {
    if (!ready || !requestInsertTokenId) return;
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'insert_token',
        payload: { id: requestInsertTokenId },
      })
    );
    onInsertTokenHandled?.();
  }, [onInsertTokenHandled, ready, requestInsertTokenId]);

  function handleMessage(event: WebViewMessageEvent) {
    const parsed = parseMessage(event.nativeEvent.data);
    if (!parsed) return;

    if (parsed.type === 'editor_ready') {
      setReady(true);
      return;
    }

    if (parsed.type === 'editor_update') {
      const nextText = getString(parsed.payload.text);
      setLatestText(nextText);
      onChangeText(nextText);

      const json = parsed.payload.json;
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        onStateChange?.({
          json: json as PromptEditorDocument,
          text: nextText,
          tokenIds: getTokenIds(parsed.payload.tokenIds),
        });
      }
    }
  }

  return (
    <View style={[styles.root, { minHeight }]}> 
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webView}
        scrollEnabled={false}
        hideKeyboardAccessoryView
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  webView: {
    backgroundColor: 'transparent',
    minHeight: 140,
  },
});
