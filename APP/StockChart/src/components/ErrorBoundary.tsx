import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#12141c',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff4a4a', fontSize: '2rem', marginBottom: '1rem' }}>
            🚨 React 런타임 렌더링 오류 발생
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '600px', marginBottom: '2rem' }}>
            애플리케이션 실행 중 예기치 못한 에러가 발생하여 화면을 표시할 수 없습니다. 
            아래의 상세 정보를 확인해주세요.
          </p>
          <div style={{
            background: 'rgba(255, 74, 74, 0.1)',
            border: '1px solid #ff4a4a',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'left',
            maxWidth: '800px',
            width: '100%',
            overflowX: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            color: '#ffdddd'
          }}>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            <br /><br />
            <strong>Component Stack:</strong>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: '#00d2d3',
              border: 'none',
              borderRadius: '8px',
              color: 'black',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
