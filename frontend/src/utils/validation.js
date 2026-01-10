/**
 * Validation utility functions for user form data
 * @module utils/validation
 */

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates date of birth (not future date, 18+ years old)
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Object} Validation result with isValid and error message
 */
export const validateDOB = (dob) => {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const dobDate = new Date(dob);
  const today = new Date();
  
  // Check if date is invalid
  if (isNaN(dobDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }
  
  // Check if date is in the future
  if (dobDate > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Calculate age
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  
  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    actualAge = age - 1;
  }

  if (actualAge < 18) {
    return { isValid: false, error: 'You must be at least 18 years old. Please select a date that makes you 18 or older.' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates phone number (optional, but if present must be valid)
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: true, error: '' }; // Phone is optional
  }

  // Basic phone validation (allows digits, spaces, dashes, parentheses, plus)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone number contains invalid characters' };
  }

  // Remove non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length !== 10) {
    if (digitsOnly.length < 10) {
      return { isValid: false, error: 'Phone number must be exactly 10 digits (you entered ' + digitsOnly.length + ' digit' + (digitsOnly.length !== 1 ? 's' : '') + ')' };
    } else {
      return { isValid: false, error: 'Phone number must be exactly 10 digits (you entered ' + digitsOnly.length + ' digits)' };
    }
  }

  return { isValid: true, error: '' };
};

/**
 * Validates complete form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateForm = (formData) => {
  const errors = {};

  // Validate Name
  if (!formData.Name || formData.Name.trim() === '') {
    errors.name = 'Name is required';
  } else if (formData.Name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (formData.Name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  // Validate Email
  if (!formData.Email || formData.Email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.Email)) {
    errors.email = 'Email must be in a valid format';
  }

  // Validate DOB
  const dobValidation = validateDOB(formData.DOB);
  if (!dobValidation.isValid) {
    errors.dob = dobValidation.error;
  }

  // Validate Phone (optional)
  const phoneValidation = validatePhone(formData.Phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  // Address is optional, no validation needed

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

