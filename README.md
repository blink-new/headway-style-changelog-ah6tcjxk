# Headway-style Changelog App

A beautiful, interactive changelog application inspired by Headway. This app allows you to showcase your product updates in a clean, organized timeline with version numbers, emoji status labels, and user reactions.

## Features

- **Timeline Layout**: Chronological display of updates with version numbers
- **Status Labels**: Visual indicators for different update types (✨ New, 🐛 Fix, 🛠 Improve)
- **Category Badges**: Easily identify the type of update (UI, Performance, Security, etc.)
- **User Reactions**: Allow users to react to updates with emojis
- **Admin Dashboard**: Secure area for creating, editing, and deleting changelog entries

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Admin Access

To access the admin dashboard, use the following credentials:
- Username: `admin`
- Password: `password`

## Usage

### Public Changelog

The public changelog is accessible to all users at the root URL. It displays all updates in a timeline format, grouped by month and year. Users can react to updates using the emoji buttons.

### Admin Dashboard

The admin dashboard is accessible at `/admin` after logging in. It allows administrators to:

1. View all changelog entries
2. Create new entries
3. Edit existing entries
4. Delete entries

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- React Router
- React Hook Form
- Date-fns

## License

This project is licensed under the MIT License.