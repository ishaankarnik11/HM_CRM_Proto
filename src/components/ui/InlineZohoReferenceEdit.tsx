import React, { useState, useEffect, useRef } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

interface InlineZohoReferenceEditProps {
  value?: string;
  onSave: (value: string) => Promise<{ success: boolean; error?: string }>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const InlineZohoReferenceEdit: React.FC<InlineZohoReferenceEditProps> = ({
  value = '',
  onSave,
  placeholder = 'Enter Zoho reference',
  disabled = false,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled && !isEditing) {
      setIsEditing(true);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await onSave(editValue.trim());
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (err) {
      setError('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="relative">
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-32 h-7 text-xs ${error ? 'border-red-500' : ''}`}
            placeholder={placeholder}
            disabled={isSaving}
          />
          {error && (
            <div className="absolute top-full left-0 mt-1 z-10 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-600 whitespace-nowrap">
              <AlertCircle className="inline w-3 h-3 mr-1" />
              {error}
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Check className="h-3 w-3 text-green-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-3 w-3 text-gray-500" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`inline-block min-w-[120px] px-2 py-1 text-xs cursor-pointer hover:bg-gray-50 rounded ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      } ${className}`}
      onClick={handleClick}
    >
      {value ? (
        <span className="text-blue-600 font-medium">{value}</span>
      ) : (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
    </div>
  );
};