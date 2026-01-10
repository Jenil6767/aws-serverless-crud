/**
 * Batch Update Users Handler
 * PUT /users/batch
 * Updates multiple users in a single request
 * @module handlers/batchUpdateUsers
 */

const userService = require('../services/userService');
const { validateUser } = require('../utils/validator');
const { success, error } = require('../utils/response');
const httpStatus = require('../constants/httpStatusCodes');

/**
 * Lambda handler for batch updating users
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} API Gateway response
 */
const handler = async (event) => {
  try {
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return error('Invalid JSON in request body', [], httpStatus.BAD_REQUEST);
    }

    const { updates } = requestData;

    // Validate input
    if (!Array.isArray(updates)) {
      return error('Invalid request', ['updates must be an array'], httpStatus.BAD_REQUEST);
    }

    if (updates.length === 0) {
      return error('Invalid request', ['updates array cannot be empty'], httpStatus.BAD_REQUEST);
    }

    if (updates.length > 25) {
      return error('Invalid request', ['Cannot update more than 25 users in a single batch'], httpStatus.BAD_REQUEST);
    }

    // Validate each update
    const validationErrors = [];
    updates.forEach((update, index) => {
      if (!update.UserID) {
        validationErrors.push({
          index,
          errors: ['UserID is required']
        });
      }

      if (!update.updateData || Object.keys(update.updateData).length === 0) {
        validationErrors.push({
          index,
          errors: ['updateData is required and cannot be empty']
        });
      } else {
        const validation = validateUser(update.updateData, true);
        if (!validation.isValid) {
          validationErrors.push({
            index,
            UserID: update.UserID,
            errors: validation.errors
          });
        }
      }
    });

    if (validationErrors.length > 0) {
      return error('Validation failed', validationErrors, httpStatus.BAD_REQUEST);
    }

    // Batch update users
    const result = await userService.batchUpdateUsers(updates);

    const statusCode = result.failed.length === 0 
      ? httpStatus.OK 
      : httpStatus.MULTI_STATUS; // 207

    return success(
      {
        successful: result.successful,
        failed: result.failed,
        summary: {
          total: updates.length,
          successful: result.successful.length,
          failed: result.failed.length
        }
      },
      `Batch update completed: ${result.successful.length} successful, ${result.failed.length} failed`,
      statusCode
    );
  } catch (err) {
    console.error('Error batch updating users:', err);

    // Handle unexpected errors
    return error(
      'Internal server error',
      ['An unexpected error occurred while batch updating users'],
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { handler };