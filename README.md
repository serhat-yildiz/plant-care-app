# Plant Care App

A modern application to help you track and care for your plants.

## Features

- User authentication with Clerk
- Track plant watering schedules
- Monitor plant health
- Organize plants by location
- View plant care history

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Clerk Authentication
- React Router
- Chart.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/plant-care-app.git
   cd plant-care-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Clerk API keys:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Setting Up Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)

2. Create a new application in the Clerk dashboard

3. Get your API keys from the Clerk dashboard:
   - Go to API Keys in your Clerk dashboard
   - Copy the "Publishable Key"

4. Add the key to your `.env.local` file:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

5. Configure your application URLs in the Clerk dashboard:
   - Add your application URL (e.g., `http://localhost:5173`) to the allowed URLs
   - Set up redirect URLs in the Clerk dashboard:
     - Sign In URL: `/login`
     - Sign Up URL: `/register`
     - After Sign In URL: `/`
     - After Sign Up URL: `/`

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Application pages/routes
  - `/lib`: Utilities and helpers
  - `/types`: TypeScript type definitions

## Authentication Flow

The application uses Clerk for authentication with the following flow:

1. Users can sign up or sign in through Clerk's secure UI
2. Protected routes require authentication
3. User profile and session management is handled by Clerk
4. Sign-out functionality is provided in the header and profile page

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
