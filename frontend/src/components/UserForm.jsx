/**
 * UserForm Component
 * Modal form for creating and editing users
 * @module components/UserForm
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Object|null} user - User object to edit (null for create mode)
 * @param {boolean} isLoading - Loading state during submission
 * @param {Function} onClose - Callback function to close the modal
 * @param {Function} onSubmit - Callback function when form is submitted
 */

import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const UserForm = ({ isOpen, user, isLoading, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    DOB: '',
    Phone: '',
    Address: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditMode = !!user;

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Edit mode: populate form with user data
        setFormData({
          Name: user.Name || '',
          Email: user.Email || '',
          DOB: user.DOB || '',
          Phone: user.Phone || '',
          Address: user.Address || ''
        });
      } else {
        // Create mode: reset form
        setFormData({
          Name: '',
          Email: '',
          DOB: '',
          Phone: '',
          Address: ''
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    const errorKey = name === 'DOB' ? 'dob' : name === 'Phone' ? 'phone' : name?.toLowerCase();
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const touchedKey = name === 'DOB' ? 'dob' : name === 'Phone' ? 'phone' : name?.toLowerCase();
    
    setTouched((prev) => ({
      ...prev,
      [touchedKey]: true
    }));

    // Validate field on blur using full form validation
    const validation = validateForm(formData);
    const errorKey = name === 'DOB' ? 'dob' : name === 'Phone' ? 'phone' : name?.toLowerCase();
    
    if (!validation.isValid && validation.errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: validation.errors[errorKey]
      }));
    } else {
      // Clear error for this field if valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors (use lowercase keys to match error keys)
    setTouched({
      name: true,
      email: true,
      dob: true,
      phone: true,
      address: true
    });

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors); // Debug log
      setErrors(validation.errors);
      
      // Scroll to first error field
      const firstErrorKey = Object.keys(validation.errors)[0];
      if (firstErrorKey) {
        let fieldId = '';
        if (firstErrorKey === 'name') fieldId = 'Name';
        else if (firstErrorKey === 'email') fieldId = 'Email';
        else if (firstErrorKey === 'dob') fieldId = 'DOB';
        else if (firstErrorKey === 'phone') fieldId = 'Phone';
        else fieldId = firstErrorKey;
        
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    console.log('Form is valid, submitting:', formData); // Debug log
    // Submit form
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="form-title" className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit User' : 'Create User'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              aria-label="Close form"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name && touched.name
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter full name"
                aria-invalid={errors.name && touched.name}
                aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              />
              {errors.name && touched.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email && touched.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter email address"
                aria-invalid={errors.email && touched.email}
                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              />
              {errors.email && touched.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="DOB"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dob && touched.dob
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                aria-invalid={errors.dob && touched.dob}
                aria-describedby={errors.dob && touched.dob ? 'dob-error' : undefined}
              />
              {errors.dob && touched.dob && (
                <p id="dob-error" className="mt-1 text-sm text-red-500">
                  {errors.dob}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="Phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="Phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone && touched.phone
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter phone number (optional)"
                aria-invalid={errors.phone && touched.phone}
                aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
              />
              {errors.phone && touched.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="Address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="Address"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter address (optional)"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="w-5 h-5" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  isEditMode ? 'Update User' : 'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

