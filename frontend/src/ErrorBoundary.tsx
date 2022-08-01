/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorView } from './views/ErrorView/ErrorView';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Component used to render Error Boundary when an unexpected error occurs
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {}

  override render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorView />;
    }

    return this.props.children;
  }
}
