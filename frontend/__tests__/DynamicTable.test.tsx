import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicTable } from '../src/components/DynamicTable';
import { TableColumn } from '../src/types';

describe('DynamicTable Component', () => {
  const mockOnSort = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnPageChange = jest.fn();

  const mockColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button onClick={() => console.log('Edit', row.id)}>Edit</button>
      ),
    },
  ];

  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ];

  const mockPagination = {
    page: 1,
    limit: 10,
    total: 2,
    pages: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with data correctly', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        onSort={mockOnSort}
        onSearch={mockOnSearch}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={[]}
        loading={false}
      />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const user = userEvent.setup();
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'john');

    expect(mockOnSearch).toHaveBeenCalledWith('john');
  });

  it('handles column sorting', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('renders custom cell content', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(2);
  });

  it('displays pagination information', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        pagination={mockPagination}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Showing 1 to 2 of 2 results')).toBeInTheDocument();
  });

  it('handles page changes', () => {
    const paginationWithMultiplePages = {
      ...mockPagination,
      pages: 3,
    };

    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        pagination={paginationWithMultiplePages}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables pagination buttons appropriately', () => {
    render(
      <DynamicTable
        columns={mockColumns}
        data={mockData}
        pagination={mockPagination}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});