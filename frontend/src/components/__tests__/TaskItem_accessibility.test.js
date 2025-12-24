import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';

describe('TaskItem Accessibility', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    priority: 'medium',
    reminder: false
  };

  const mockHandlers = {
    onToggleComplete: jest.fn(),
    onDeleteTask: jest.fn(),
    onUpdateTask: jest.fn()
  };

  test('edit inputs have accessible labels', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    // Click edit button to enter edit mode.
    // The button has text "Edit" inside it.
    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    // Now check for accessible names on inputs.
    // We expect these to fail initially.

    // Title input
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();

    // Description textarea
    expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();

    // Due date input
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();

    // Priority select
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });
});
