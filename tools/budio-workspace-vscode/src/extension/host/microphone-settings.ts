import { spawn } from 'node:child_process';

export interface MicrophoneSettingsTarget {
  uri: string | null;
  fallbackMessage: string;
}

export function getMicrophoneSettingsTarget(platform: NodeJS.Platform = process.platform): MicrophoneSettingsTarget {
  if (platform === 'darwin') {
    return {
      uri: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone',
      fallbackMessage: 'Open Systeeminstellingen > Privacy en beveiliging > Microfoon en geef Visual Studio Code toegang.',
    };
  }
  if (platform === 'win32') {
    return {
      uri: 'ms-settings:privacy-microphone',
      fallbackMessage: 'Open Windows Instellingen > Privacy en beveiliging > Microfoon en geef Visual Studio Code toegang.',
    };
  }
  return {
    uri: null,
    fallbackMessage: 'Open je systeeminstellingen en geef Visual Studio Code toegang tot de microfoon.',
  };
}

export function openMicrophoneSettingsWithSystemOpen(
  targetUri: string,
  platform: NodeJS.Platform = process.platform,
): Promise<void> {
  const command = platform === 'win32' ? 'cmd' : 'open';
  const args = platform === 'win32' ? ['/c', 'start', '', targetUri] : [targetUri];

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve();
    });
  });
}
