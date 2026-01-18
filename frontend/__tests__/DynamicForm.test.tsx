import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicForm } from '../src/components/DynamicForm';
import { FormField } from '../src/types';

describe('DynamicForm Component', () => {
  const mockOnSubmit = jest.fn();

  const mockFields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Enter name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself',
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it('shows required field indicators', () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockOnSubmit} />);

    const nameLabel = screen.getByText('Name');
    const emailLabel = screen.getByText('Email');
    
    expect(nameLabel.parentElement).toHaveTextContent('*');
    expect(emailLabel.parentElement).toHaveTextContent('*');
  });

  it('validates required fields on submit', async () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email pattern', async () => {
    const user = userEvent.setup();
    render(<DynamicForm fields={mockFields} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<DynamicForm fields={mockFields} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const roleSelect = screen.getByLabelText(/role/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.selectOptions(roleSelect, 'admin');
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        bio: '',
        active: false,
      });
    });
  });

  it('populates form with initial data', () => {
    const initialData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user',
    };

    render(
      <DynamicForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    
    // For select elements, check if the option is selected
    const roleSelect = screen.getByLabelText(/role/i) as HTMLSelectElement;
    expect(roleSelect.value).toBe('user');
  });
});