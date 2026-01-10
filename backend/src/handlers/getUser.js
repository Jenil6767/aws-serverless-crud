/**
 * Get User Handler
 * GET /users/{UserID}
 * Retrieves a user by UserID
 * @module handlers/getUser
 */

const userService = require('../services/userService');
const { success, error } = require('../utils/response');
const httpStatus = require('../constants/httpStatusCodes');

/**
 * Lambda handler for getting a user by ID
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} API Gateway response
 */
const handler = async (event) => {
  try {
    const { UserID } = event.pathParameters || {};

    if (!UserID) {
      return error('UserID is required', [], httpStatus.BAD_REQUEST);
    }

    const user = await userService.getUserById(UserID);

    if (!user) {
      return error('User not found', [`User with ID ${UserID} does not exist`], httpStatus.NOT_FOUND);
    }

    return success(user, 'User retrieved successfully');
  } catch (err) {
    console.error('Error getting user:', err);

    return error(
      'Internal server error',
      ['An unexpected error occurred while retrieving the user'],
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { handler };

