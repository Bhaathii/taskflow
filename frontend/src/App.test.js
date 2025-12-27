import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to prevent ESM issues
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock Google OAuth
jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: () => <button>Login</button>,
}));

test('renders TaskFlow title', () => {
  // Mock localStorage to simulate logged in user
  const localStorageMock = (function() {
    let store = {
      user: JSON.stringify({ name: 'Test User', sub: '123' }),
      userId: '123'
    };
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      removeItem: function(key) {
        delete store[key];
      },
      clear: function() {
        store = {};
      }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  render(<App />);
  const titleElement = screen.getByText(/TaskFlow/i);
  expect(titleElement).toBeInTheDocument();
});
