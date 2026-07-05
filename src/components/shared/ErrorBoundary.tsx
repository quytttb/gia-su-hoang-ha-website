import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  errorType?: 'error' | 'warning' | 'info';
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay
          fullPage
          message="Đã có lỗi xảy ra"
          details={
            this.state.error?.message ||
            'Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.'
          }
          retryLabel="Tải lại trang"
          type={this.props.errorType || 'error'}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
