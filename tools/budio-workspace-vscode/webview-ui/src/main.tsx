import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { vscode } from './vscode';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

interface WebviewErrorBoundaryState {
  error: Error | null;
}

class WebviewErrorBoundary extends React.Component<React.PropsWithChildren, WebviewErrorBoundaryState> {
  state: WebviewErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): WebviewErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Budio Workspace webview render error', {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  render(): React.ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="webview-error-shell">
        <section className="webview-error-card">
          <p className="eyebrow">Budio Workspace</p>
          <h1>Detail kon niet worden gerenderd</h1>
          <p>
            De webview ving een renderfout op. Herlaad het board; als dit terugkomt blijft de fout zichtbaar in
            de webview-console.
          </p>
          <div className="webview-error-actions">
            <button
              className="primary-button"
              onClick={() => {
                this.setState({ error: null });
                vscode.postMessage({ type: 'refreshBoard' });
              }}
            >
              Herlaad board
            </button>
            <button className="ghost-button" onClick={() => window.location.reload()}>
              Herlaad plugin
            </button>
          </div>
        </section>
      </main>
    );
  }
}

createRoot(rootElement).render(
  <React.StrictMode>
    <WebviewErrorBoundary>
      <App />
    </WebviewErrorBoundary>
  </React.StrictMode>,
);
