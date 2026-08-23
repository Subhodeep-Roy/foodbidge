import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '2rem auto', background: '#fff1f2', border: '2px solid #fecdd3', borderRadius: '12px' }}>
          <h2 style={{ color: '#be123c', fontSize: '1.5rem', fontWeight: '800' }}>⚠️ Application Render Error</h2>
          <p style={{ color: '#9f1239', margin: '0.5rem 0 1rem', fontWeight: '600' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #fda4af', overflowX: 'auto', fontSize: '0.8rem', color: '#881337', marginBottom: '1rem' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack info available'}
            </pre>
          </div>
          <button 
            onClick={() => { window.location.reload(); }}
            style={{ padding: '0.65rem 1.25rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
