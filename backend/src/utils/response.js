/**
 * Response utility functions for consistent API responses
 * @module utils/response
 */

const httpStatus = require('../constants/httpStatusCodes');

/**
 * Creates a successful response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */
const success = (data = {}, message = '', statusCode = httpStatus.OK) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success: true,
      data,
      message
    })
  };
};

/**
 * Creates an error response
 * @param {string} error - Error message
 * @param {Array} details - Additional error details
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {Object} Formatted error response
 */
const error = (error = 'An error occurred', details = [], statusCode = httpStatus.BAD_REQUEST) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      success: false,
      error,
      details,
      statusCode
    })
  };
};

module.exports = {
  success,
  error
};

