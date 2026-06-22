export interface JarvisVoiceSupport {
  supported: boolean;
  reason: string | null;
}

export function getJarvisVoiceSupport(): JarvisVoiceSupport {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      supported: false,
      reason: 'Voice input is niet beschikbaar buiten de VS Code webview.',
    };
  }

  if (window.isSecureContext === false) {
    return {
      supported: false,
      reason: 'Microfoontoegang vereist een secure webview-context.',
    };
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      reason: 'Deze VS Code webview biedt geen microfoon-API.',
    };
  }

  if (!window.MediaRecorder) {
    return {
      supported: false,
      reason: 'Deze VS Code webview ondersteunt audio-opname niet.',
    };
  }

  return {
    supported: true,
    reason: null,
  };
}

export function mapJarvisMediaError(error: unknown) {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Microfoonrechten geweigerd. Geef Visual Studio Code toegang tot de microfoon en probeer opnieuw.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Geen microfoon gevonden op dit systeem.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'De microfoon is bezet of niet leesbaar door VS Code.';
  }
  if (name === 'SecurityError') {
    return 'Microfoontoegang is door de webview-beveiliging geblokkeerd.';
  }
  return 'Audio-opname kon niet worden gestart.';
}
