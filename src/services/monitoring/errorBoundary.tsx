import React, { Component, ErrorInfo } from 'react';
import { logger } from './logger';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
          <Alert variant="destructive" className="max-w-xl">
            <AlertTitle>Une erreur est survenue</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                Nous nous excusons pour ce désagrément. L'erreur a été enregistrée et sera examinée par notre équipe.
              </p>
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="w-full"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}