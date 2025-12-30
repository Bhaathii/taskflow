import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios and google oauth
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => children,
  GoogleLogin: () => <div>Google Login Mock</div>,
}));

test('renders login page by default', () => {
  render(<App />);
  const loginTitle = screen.getByText(/TaskFlow/i);
  expect(loginTitle).toBeInTheDocument();
});
