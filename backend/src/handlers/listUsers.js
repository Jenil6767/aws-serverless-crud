/**
 * List Users Handler
 * GET /users
 * Lists users with pagination support
 * @module handlers/listUsers
 */

const userService = require('../services/userService');
const { success, error } = require('../utils/response');
const httpStatus = require('../constants/httpStatusCodes');

/**
 * Lambda handler for listing users with pagination
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} API Gateway response
 */
const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    
    // Parse pagination parameters
    const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
    const lastEvaluatedKey = queryParams.lastEvaluatedKey || null;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return error(
        'Invalid limit parameter',
        ['Limit must be a number between 1 and 100'],
        httpStatus.BAD_REQUEST
      );
    }

    const result = await userService.listUsers({ limit, lastEvaluatedKey });

    return success(
      {
        users: result.users,
        pagination: {
          count: result.count,
          limit,
          lastEvaluatedKey: result.lastEvaluatedKey
        }
      },
      'Users retrieved successfully'
    );
  } catch (err) {
    console.error('Error listing users:', err);

    return error(
      'Internal server error',
      ['An unexpected error occurred while listing users'],
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { handler };

