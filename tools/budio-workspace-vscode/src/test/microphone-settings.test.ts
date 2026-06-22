import test from 'node:test';
import assert from 'node:assert/strict';
import { getMicrophoneSettingsTarget } from '../extension/host/microphone-settings';

test('microphone settings target resolves macOS privacy deep link', () => {
  const target = getMicrophoneSettingsTarget('darwin');

  assert.equal(target.uri, 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
  assert.match(target.fallbackMessage, /Privacy en beveiliging/);
});

test('microphone settings target resolves Windows privacy deep link', () => {
  const target = getMicrophoneSettingsTarget('win32');

  assert.equal(target.uri, 'ms-settings:privacy-microphone');
  assert.match(target.fallbackMessage, /Windows Instellingen/);
});

test('microphone settings target falls back on unsupported platforms', () => {
  const target = getMicrophoneSettingsTarget('linux');

  assert.equal(target.uri, null);
  assert.match(target.fallbackMessage, /systeeminstellingen/);
});
