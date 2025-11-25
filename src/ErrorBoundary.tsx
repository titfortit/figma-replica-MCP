import React from 'react';

type ErrorBoundaryState = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Surface useful details in the console for debugging.
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui', color: '#1a1d1c' }}>
          <h1 style={{ fontSize: 18, margin: 0, marginBottom: 8 }}>Something went wrong.</h1>
          <div style={{ fontSize: 14 }}>Error: {this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}



