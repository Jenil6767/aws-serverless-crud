/**
 * Validation utility functions for user data
 * @module utils/validator
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MIN_AGE = 18;

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmailFormat = (email) => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates date of birth format and age requirement
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateDOB = (dob) => {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  if (!DATE_REGEX.test(dob)) {
    return { isValid: false, error: 'Date of birth must be in YYYY-MM-DD format' };
  }

  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    const actualAge = age - 1;
    if (actualAge < MIN_AGE) {
      return { isValid: false, error: `User must be at least ${MIN_AGE} years old` };
    }
  } else if (age < MIN_AGE) {
    return { isValid: false, error: `User must be at least ${MIN_AGE} years old` };
  }

  if (dobDate > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  return { isValid: true };
};

/**
 * Validates user data for create/update operations
 * @param {Object} userData - User data to validate
 * @param {boolean} isUpdate - Whether this is an update operation (default: false)
 * @returns {Object} Validation result with isValid flag and errors array
 */
const validateUser = (userData, isUpdate = false) => {
  const errors = [];

  // Name validation
  if (!isUpdate || userData.Name !== undefined) {
    if (!userData.Name || typeof userData.Name !== 'string') {
      errors.push('Name is required and must be a string');
    } else if (userData.Name.trim().length < 2 || userData.Name.trim().length > 100) {
      errors.push('Name must be between 2 and 100 characters');
    }
  }

  // Email validation
  if (!isUpdate || userData.Email !== undefined) {
    if (!userData.Email || typeof userData.Email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!isValidEmailFormat(userData.Email)) {
      errors.push('Email must be in a valid format');
    }
  }

  // DOB validation
  if (!isUpdate || userData.DOB !== undefined) {
    if (!userData.DOB || typeof userData.DOB !== 'string') {
      errors.push('Date of birth is required and must be a string');
    } else {
      const dobValidation = validateDOB(userData.DOB);
      if (!dobValidation.isValid) {
        errors.push(dobValidation.error);
      }
    }
  }

  // Phone validation (optional)
  if (userData.Phone !== undefined && userData.Phone !== null && userData.Phone !== '') {
    if (typeof userData.Phone !== 'string') {
      errors.push('Phone must be a string');
    }
  }

  // Address validation (optional)
  if (userData.Address !== undefined && userData.Address !== null && userData.Address !== '') {
    if (typeof userData.Address !== 'string') {
      errors.push('Address must be a string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateUser,
  isValidEmailFormat,
  validateDOB
};

