import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ErrorState {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

interface ErrorContextValue {
  errors: ErrorState[];
  showError: (title: string, message: string, actions?: ErrorState['actions']) => void;
  showWarning: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  handleApiError: (error: any, context?: string) => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  const addError = (error: Omit<ErrorState, 'id' | 'timestamp'>) => {
    const newError: ErrorState = {
      ...error,
      id: `error-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setErrors(prev => [newError, ...prev.slice(0, 9)]); // Keep only last 10 errors

    // Show toast notification
    const icons = {
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      success: CheckCircle,
    };

    const Icon = icons[error.type];

    toast({
      variant: error.type === 'error' ? 'destructive' : 'default',
      title: (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {error.title}
        </div>
      ),
      description: error.message,
      duration: error.type === 'error' ? 10000 : 5000,
    });

    return newError.id;
  };

  const showError = (title: string, message: string, actions?: ErrorState['actions']) => {
    return addError({ type: 'error', title, message, actions });
  };

  const showWarning = (title: string, message: string) => {
    return addError({ type: 'warning', title, message });
  };

  const showSuccess = (title: string, message: string) => {
    return addError({ type: 'success', title, message });
  };

  const showInfo = (title: string, message: string) => {
    return addError({ type: 'info', title, message });
  };

  const clearError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  const handleApiError = (error: any, context?: string) => {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    let title = 'Something went wrong';
    let message = 'An unexpected error occurred. Please try again.';

    if (error?.response) {
      // HTTP error response
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          title = 'Invalid Request';
          message = data?.message || 'The request contains invalid data.';
          break;
        case 401:
          title = 'Authentication Required';
          message = 'Please log in to continue.';
          break;
        case 403:
          title = 'Access Denied';
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          title = 'Not Found';
          message = data?.message || 'The requested resource was not found.';
          break;
        case 409:
          title = 'Conflict';
          message = data?.message || 'This action conflicts with existing data.';
          break;
        case 422:
          title = 'Validation Error';
          message = data?.message || 'Please check your input and try again.';
          break;
        case 429:
          title = 'Too Many Requests';
          message = 'Please wait a moment before trying again.';
          break;
        case 500:
          title = 'Server Error';
          message = 'A server error occurred. Please try again later.';
          break;
        case 503:
          title = 'Service Unavailable';
          message = 'The service is temporarily unavailable. Please try again later.';
          break;
        default:
          title = `Error ${status}`;
          message = data?.message || `An error occurred (${status}).`;
      }
    } else if (error?.message) {
      // Network or other error
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        title = 'Connection Error';
        message = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        title = 'Request Timeout';
        message = 'The request took too long. Please try again.';
      } else {
        message = error.message;
      }
    }

    if (context) {
      title = `${title} - ${context}`;
    }

    showError(title, message, [
      {
        label: 'Retry',
        onClick: () => {
          // This would be implemented by the calling component
          window.location.reload();
        }
      }
    ]);
  };

  const value: ErrorContextValue = {
    errors,
    showError,
    showWarning,
    showSuccess,
    showInfo,
    clearError,
    clearAllErrors,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Hook for handling async operations with automatic error handling
export const useAsyncOperation = () => {
  const { handleApiError, showSuccess, showInfo } = useError();
  const [isLoading, setIsLoading] = useState(false);

  const execute = async <T,>(
    operation: () => Promise<T>,
    options?: {
      successMessage?: string;
      context?: string;
      showLoadingToast?: boolean;
    }
  ): Promise<T | null> => {
    const { successMessage, context, showLoadingToast } = options || {};
    
    setIsLoading(true);
    
    if (showLoadingToast) {
      showInfo('Loading...', 'Please wait while we process your request.');
    }

    try {
      const result = await operation();
      
      if (successMessage) {
        showSuccess('Success', successMessage);
      }
      
      return result;
    } catch (error) {
      handleApiError(error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading };
};

// Component for displaying error history
export const ErrorHistory: React.FC = () => {
  const { errors, clearError, clearAllErrors } = useError();

  if (errors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4" />
        <p>No recent errors</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Issues</h3>
        <button
          onClick={clearAllErrors}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear All
        </button>
      </div>
      
      {errors.map((error) => {
        const icons = {
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
          success: CheckCircle,
        };
        
        const Icon = icons[error.type];
        
        return (
          <div
            key={error.id}
            className={`p-4 rounded-lg border ${
              error.type === 'error' ? 'border-red-200 bg-red-50' :
              error.type === 'warning' ? 'border-orange-200 bg-orange-50' :
              error.type === 'success' ? 'border-green-200 bg-green-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 ${
                error.type === 'error' ? 'text-red-600' :
                error.type === 'warning' ? 'text-orange-600' :
                error.type === 'success' ? 'text-green-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium">{error.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {error.timestamp.toLocaleString()}
                </p>
                {error.actions && (
                  <div className="flex gap-2 mt-3">
                    {error.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => clearError(error.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};