/**
 * Batch Delete Users Handler
 * DELETE /users/batch
 * Deletes multiple users in a single request
 * @module handlers/batchDeleteUsers
 */

const userService = require('../services/userService');
const { success, error } = require('../utils/response');
const httpStatus = require('../constants/httpStatusCodes');

/**
 * Lambda handler for batch deleting users
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

    const { userIds } = requestData;

    // Validate input
    if (!Array.isArray(userIds)) {
      return error('Invalid request', ['userIds must be an array'], httpStatus.BAD_REQUEST);
    }

    if (userIds.length === 0) {
      return error('Invalid request', ['userIds array cannot be empty'], httpStatus.BAD_REQUEST);
    }

    if (userIds.length > 25) {
      return error('Invalid request', ['Cannot delete more than 25 users in a single batch'], httpStatus.BAD_REQUEST);
    }

    // Validate each UserID
    const validationErrors = [];
    userIds.forEach((userId, index) => {
      if (!userId || typeof userId !== 'string') {
        validationErrors.push({
          index,
          error: 'UserID must be a non-empty string'
        });
      }
    });

    if (validationErrors.length > 0) {
      return error('Validation failed', validationErrors, httpStatus.BAD_REQUEST);
    }

    // Batch delete users
    const result = await userService.batchDeleteUsers(userIds);

    const statusCode = result.failed.length === 0 
      ? httpStatus.OK 
      : httpStatus.MULTI_STATUS; // 207

    return success(
      {
        successful: result.successful,
        failed: result.failed,
        summary: {
          total: userIds.length,
          successful: result.successful.length,
          failed: result.failed.length
        }
      },
      `Batch delete completed: ${result.successful.length} successful, ${result.failed.length} failed`,
      statusCode
    );
  } catch (err) {
    console.error('Error batch deleting users:', err);

    // Handle unexpected errors
    return error(
      'Internal server error',
      ['An unexpected error occurred while batch deleting users'],
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { handler };