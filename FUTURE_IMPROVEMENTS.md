# Future Improvements Roadmap

## 1. Authentication & Security
- **Server-Side Verification:** currently, the backend accepts the `x-user-id` header without cryptographic verification. Implement proper JWT validation (verify Google ID tokens) on the server to prevent spoofing.
- **Session Management:** specific session expiration and refresh token logic.

## 2. Infrastructure & Database
- **Production Database:** The current setup falls back to an in-memory database (`mongodb-memory-server`) if a local instance is missing. Configure a stable connection string (e.g., MongoDB Atlas) for production persistence.
- **Environment Variables:** standardizing `.env` usage across frontend and backend for deployment.

## 3. Notifications & Reminders
- **Server-Side Job:** Move reminder logic to the backend using a scheduler (e.g., `node-cron`). Currently, the frontend polls for due dates, meaning notifications only appear if the tab is open.
- **State Persistence:** Store "notified" state in the database to prevent notifications from re-triggering if the user refreshes the page.
- **Push Notifications:** Implement Service Workers and Web Push API for notifications even when the browser is closed.

## 4. Timezone Handling
- **Robust Conversion:** Ensure that when a user edits a task, the stored UTC date is correctly converted back to their local time for the `datetime-local` input.
- **User Settings:** Allow users to set a preferred timezone in their profile.

## 5. Testing
- **Frontend Unit Tests:** Add `jest` and `react-testing-library` tests for React components (`TaskForm`, `TaskItem`).
- **CI/CD:** Automate the test suite (Backend + E2E) on pull requests.
