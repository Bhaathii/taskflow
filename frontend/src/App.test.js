import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('axios');

test('renders TaskFlow title', () => {
  render(<App />);
  const titleElement = screen.getByText(/TaskFlow/i);
  expect(titleElement).toBeInTheDocument();
});
