 
# CollabDesk Frontend

CollabDesk Frontend is a modern, user-friendly interface designed to facilitate seamless collaboration within workspaces. It integrates with the CollabDesk Backend to provide features such as video calling, file management, public file sharing, payment integrations, and an intuitive admin dashboard.

---

## Features

### 1. **Video Calling**
   - Powered by [LiveKit](https://livekit.io/) for real-time communication.
   - Users can initiate and join video calls directly from their workspace.
   - Supports features like screen sharing, muting/unmuting audio/video, and participant management.

### 2. **File and Folder Management**
   - Intuitive drag-and-drop interface for organizing files and folders.
   - **Trash System**: Files moved to the trash are recoverable for 7 days before permanent deletion.
   - Easy navigation with breadcrumb trails and folder previews.

### 3. **Public File Sharing**
   - Generate shareable URLs for files with read-only access.
   - Share files externally without compromising data integrity.
   - Option to revoke access to shared links.

### 4. **Payment Integration**
   - Secure payment processing via [Stripe](https://stripe.com/).
   - Subscription plans displayed clearly with pricing details.
   - Notifications for upcoming subscription renewals or expirations.

### 5. **Admin Dashboard**
   - Comprehensive revenue filtering and reporting tools.
   - Manage payment plans and subscription tiers.
   - Monitor user activity and platform health metrics.

---

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Access to the CollabDesk Backend API

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/collabdesk-frontend.git
   cd collabdesk-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   REACT_APP_LIVEKIT_URL=your_livekit_url
   REACT_APP_LIVEKIT_TOKEN=your_livekit_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## Application Structure

The frontend is built using React and follows a modular structure:
- **Components**: Reusable UI components like buttons, modals, and cards.
- **Pages**: Main views such as Dashboard, File Manager, and Admin Panel.
- **Services**: API utilities for interacting with the backend.
- **Contexts**: State management for user authentication and global settings.
- **Assets**: Static files like images, icons, and stylesheets.

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions, feel free to open an issue on GitHub or contact us at prajwalmadikai@gmail.com

---

## Functionalities Overview

### Video Calling Interface
- Real-time video conferencing with LiveKit integration.
- User-friendly controls for managing participants and settings.

### File Management Interface
- Drag-and-drop functionality for uploading files.
- Trash system with restore and delete options.
- Folder hierarchy visualization for easy navigation.

### Public File Sharing
- Generate shareable URLs with a single click.
- Preview shared files without downloading.

### Payment Plans
- Clear display of available subscription tiers.
- Secure payment processing with Stripe.
- Automatic notifications for subscription renewals.

### Admin Dashboard
- Revenue tracking and filtering tools.
- Tools for adding or modifying payment plans.
- User activity logs and analytics.
