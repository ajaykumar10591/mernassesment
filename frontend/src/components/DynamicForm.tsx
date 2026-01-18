import React, { useState, useEffect } from 'react';
import { FormField } from '../types';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  initialData?: Record<string, any>;
  submitText?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  loading = false,
  initialData = {},
  submitText = 'Submit',
}) => {
  // Initialize form data with default values for all fields
  const getInitialFormData = () => {
    const data: Record<string, any> = {};
    fields.forEach(field => {
      if (initialData[field.name] !== undefined) {
        data[field.name] = initialData[field.name];
      } else if (field.type === 'checkbox') {
        data[field.name] = false;
      } else {
        data[field.name] = '';
      }
    });
    return data;
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData or fields change
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [JSON.stringify(initialData), JSON.stringify(fields.map(f => f.name))]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `Invalid ${field.label}`;
      }
    }
    
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : '';
    const error = errors[field.name];
    
    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      style: {
        width: '100%',
        padding: '8px 12px',
        border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
        borderRadius: '4px',
        fontSize: '14px',
      },
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...(commonProps as any)}
            placeholder={field.placeholder}
            value={value}
            onChange={(e: any) => handleChange(field.name, e.target.value)}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            {...(commonProps as any)}
            value={value}
            onChange={(e: any) => handleChange(field.name, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={!!value}
            onChange={(e: any) => handleChange(field.name, e.target.checked)}
            style={{ marginRight: '8px' }}
          />
        );
      
      default:
        return (
          <input
            {...(commonProps as any)}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e: any) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      {fields.map(field => (
        <div key={field.name} style={{ marginBottom: '16px' }}>
          <label
            htmlFor={field.name}
            style={{
              display: 'block',
              marginBottom: '4px',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            {field.label}
            {field.required && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          
          {field.type === 'checkbox' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderField(field)}
              <span style={{ fontSize: '14px' }}>{field.label}</span>
            </div>
          ) : (
            renderField(field)
          )}
          
          {errors[field.name] && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Submitting...' : submitText}
      </button>
    </form>
  );
};