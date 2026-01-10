# User Management System - Frontend

A modern, responsive React frontend application for managing users, built with Tailwind CSS and integrated with a serverless backend API.

## ✨ Features

- **User Management**: Create, read, update, and delete users
- **Real-time Validation**: Form validation with error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Success and error notifications using react-hot-toast
- **Empty States**: Helpful messages when no users are found
- **Accessibility**: ARIA labels and semantic HTML for screen readers
- **Modern UI**: Beautiful gradient navbar, card-based layout, and smooth animations

## 🛠️ Tech Stack

- **React 18+**: Modern React with hooks (functional components only)
- **Tailwind CSS v3**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **react-hot-toast**: Toast notification library
- **date-fns**: Date formatting utility
- **Vite**: Fast build tool and dev server

## 📋 Prerequisites

- Node.js 16+ (recommended: 18+)
- npm or yarn package manager
- Backend API running and accessible

## 🚀 Installation

1. **Clone the repository** (if applicable) or navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional for local development):
   ```bash
   # Create .env file (optional - defaults to http://localhost:3000)
   ```
   
   For local development, the frontend defaults to `http://localhost:3000` (matching backend).
   
   For production, create `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
   ```
   
   **Note:** Vite uses `VITE_` prefix for environment variables (not `REACT_APP_`).

## 🔌 Connecting Frontend to Backend

### Quick Start (Local Development)

The frontend and backend are **pre-configured to work together** out of the box:

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm install
   npm run offline
   ```
   Backend runs on: `http://localhost:3000`

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on: `http://localhost:5173`

3. **Open Browser**: Navigate to `http://localhost:5173`

The frontend will automatically connect to the backend at `http://localhost:3000`.

> 📖 **For detailed connection setup and troubleshooting, see [CONNECTION_SETUP.md](./CONNECTION_SETUP.md)**

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm start
# or
npm run dev
```

The application will open at `http://localhost:5173` (Vite default port) or the port shown in the terminal.

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── UserList.jsx    # User list with grid layout
│   │   ├── UserCard.jsx    # Individual user card
│   │   ├── UserForm.jsx    # Create/Edit user form modal
│   │   ├── DeleteConfirmModal.jsx  # Delete confirmation modal
│   │   └── LoadingSpinner.jsx       # Reusable loading spinner
│   ├── services/
│   │   └── api.js          # API service with Axios
│   ├── utils/
│   │   └── validation.js     # Form validation utilities
│   ├── App.jsx            # Main application component
│   ├── App.css            # App-specific styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔌 API Integration

The frontend expects the backend API to follow this structure:

### Endpoints

- `GET /users` - List all users (with pagination support)
- `POST /users` - Create a new user
- `GET /users/{UserID}` - Get user by ID
- `PUT /users/{UserID}` - Update user
- `DELETE /users/{UserID}` - Delete user

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional details"],
  "statusCode": 400
}
```

### CORS Configuration

Ensure your backend API has CORS enabled to allow requests from the frontend domain.

## 🎨 Styling

The application uses Tailwind CSS utility classes exclusively. Key design elements:

- **Color Scheme**: Blue (primary), Green (success), Red (danger), Gray (neutral)
- **Responsive Breakpoints**: `sm:`, `md:`, `lg:` prefixes
- **Spacing**: Consistent padding and margins (`p-4`, `p-6`, `mb-4`, `gap-4`)
- **Shadows**: `shadow`, `shadow-lg`, `shadow-xl` for depth
- **Transitions**: `transition-all duration-200` for smooth interactions
- **Hover Effects**: Applied to buttons and cards

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: Single column layout (< 768px)
- **Tablet**: Two columns (768px - 1024px)
- **Desktop**: Three columns (> 1024px)

## ✅ Form Validation

The form includes real-time validation for:

- **Name**: Required, 2-100 characters
- **Email**: Required, valid email format
- **Date of Birth**: Required, must be 18+ years old, not in future
- **Phone**: Optional, but if provided must be 10-15 digits
- **Address**: Optional, no validation

## 🔒 Error Handling

- Network errors are caught and displayed as user-friendly messages
- Validation errors are shown inline below form fields
- API errors are displayed as toast notifications
- Retry functionality for failed requests

## 🧪 Testing

To test the application:

1. Ensure your backend API is running and accessible
2. Set the correct `REACT_APP_API_BASE_URL` in `.env`
3. Start the development server
4. Test all CRUD operations:
   - Create a new user
   - View user list
   - Edit an existing user
   - Delete a user

## 🐛 Troubleshooting

### Common Issues

**Issue**: API calls failing with CORS error
- **Solution**: Ensure backend has CORS enabled and allows your frontend origin

**Issue**: Environment variables not working
- **Solution**: Restart the dev server after changing `.env` file. Variables must start with `REACT_APP_`

**Issue**: Tailwind styles not applying
- **Solution**: Ensure `tailwind.config.js` includes all source files in the `content` array

**Issue**: Build fails
- **Solution**: Check Node.js version (16+ required), clear `node_modules` and reinstall

## 📸 Screenshots

_Add screenshots of your application here_

- Home page with user list
- Create user form
- Edit user form
- Delete confirmation modal
- Mobile responsive view

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React and Tailwind CSS**

