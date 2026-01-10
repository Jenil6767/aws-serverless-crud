/**
 * Main App Component
 * User Management System Application
 * @module App
 */

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { fetchUsers, createUser, updateUser, deleteUser } from './services/api';
import toast from 'react-hot-toast';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Loads all users from the API
   */
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchUsers();
      
      // Handle paginated response - API returns {success, data, message}
      if (response && response.data) {
        if (response.data.users && Array.isArray(response.data.users)) {
          // Paginated response
          setUsers(response.data.users);
        } else if (Array.isArray(response.data)) {
          // Direct array response
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles opening the form for adding a new user
   */
  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  /**
   * Handles opening the form for editing an existing user
   * @param {Object} user - User object to edit
   */
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  /**
   * Handles opening the delete confirmation modal
   * @param {Object} user - User object to delete
   */
  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  /**
   * Handles form submission (create or update)
   * @param {Object} formData - Form data to submit
   */
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.UserID, formData);
        toast.success('User updated successfully!');
      } else {
        // Create new user
        await createUser(formData);
        toast.success('User created successfully!');
      }

      // Close form and reload users
      setShowForm(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      const errorMessage = err.message || 'Failed to save user';
      toast.error(errorMessage);
      // Don't close form on error so user can fix and retry
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles user deletion
   * @param {string} userId - User ID to delete
   */
  const handleConfirmDelete = async (userId) => {
    try {
      setIsDeleting(true);
      await deleteUser(userId);
      toast.success('User deleted successfully!');
      
      // Close modal and reload users
      setShowDeleteModal(false);
      setDeletingUser(null);
      await loadUsers();
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete user';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handles closing the form modal
   */
  const handleCloseForm = () => {
    if (!isSubmitting) {
      setShowForm(false);
      setEditingUser(null);
    }
  };

  /**
   * Handles closing the delete confirmation modal
   */
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar onAddUser={handleAddUser} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <UserList
          users={users}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onRetry={loadUsers}
        />
      </main>

      {/* User Form Modal */}
      <UserForm
        isOpen={showForm}
        user={editingUser}
        isLoading={isSubmitting}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        user={deletingUser}
        isLoading={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;

