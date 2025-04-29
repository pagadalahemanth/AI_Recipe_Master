import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-start">
      <FaExclamationTriangle className="mr-2 mt-1 flex-shrink-0" />
      <div className="flex-grow">
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-2 text-red-500 hover:text-red-700"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;