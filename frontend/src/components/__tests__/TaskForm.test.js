import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TaskForm from '../TaskForm';
import * as chrono from 'chrono-node';

// Mock chrono-node
jest.mock('chrono-node', () => {
  return {
    __esModule: true,
    parse: jest.fn(),
  };
});

describe('TaskForm Smart Add', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('toggles smart add input', () => {
    render(<TaskForm onAddTask={() => {}} />);

    // Initially hidden
    expect(screen.queryByPlaceholderText(/e\.g\., 'Call Mom/i)).not.toBeInTheDocument();

    // Click button
    fireEvent.click(screen.getByText(/Smart Add/i));

    // Should be visible
    expect(screen.getByPlaceholderText(/e\.g\., 'Call Mom/i)).toBeInTheDocument();
  });

  test('parses date from smart input', async () => {
    // Setup mock return value
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    chrono.parse.mockReturnValue([{
      start: {
        date: () => tomorrow
      }
    }]);

    render(<TaskForm onAddTask={() => {}} />);
    fireEvent.click(screen.getByText(/Smart Add/i));

    const input = screen.getByPlaceholderText(/e\.g\., 'Call Mom/i);

    // Type something with "tomorrow"
    await act(async () => {
        fireEvent.change(input, { target: { value: 'Buy milk tomorrow' } });
    });

    // Verify mock was called
    expect(chrono.parse).toHaveBeenCalledWith('Buy milk tomorrow');

    // The title field should update.
    // Note: If both the Smart Input and the Title Input have the same value,
    // getByDisplayValue might return multiple elements.
    const displayValues = screen.getAllByDisplayValue('Buy milk tomorrow');
    expect(displayValues.length).toBeGreaterThanOrEqual(1);

    // Verify that at least one of them is the title input
    const titleInput = screen.getByPlaceholderText(/What needs to be done/i);
    expect(titleInput).toHaveValue('Buy milk tomorrow');
  });
});
