import React, { Component, ErrorInfo, ReactNode } from 'react';
import GlobalErrorFallback from './GlobalErrorFallback';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Here you would typically log to an error reporting service
    }

    public resetErrorBoundary = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError && this.state.error) {
            return (
                <GlobalErrorFallback 
                    error={this.state.error} 
                    resetErrorBoundary={this.resetErrorBoundary} 
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;