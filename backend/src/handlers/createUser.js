// /**
//  * Batch Create Users Handler
//  * POST /users/batch
//  * Creates multiple users in a single request
//  * @module handlers/batchCreateUsers
//  */

// const userService = require('../services/userService');
// const { validateUser } = require('../utils/validator');
// const { success, error } = require('../utils/response');
// const httpStatus = require('../constants/httpStatusCodes');

// /**
//  * Lambda handler for batch creating users
//  * @param {Object} event - API Gateway event
//  * @returns {Promise<Object>} API Gateway response
//  */
// const handler = async (event) => {
//   try {
//     // Parse request body
//     let requestData;
//     try {
//       requestData = JSON.parse(event.body || '{}');
//     } catch (parseError) {
//       return error('Invalid JSON in request body', [], httpStatus.BAD_REQUEST);
//     }

//     const { users } = requestData;

//     // Validate input
//     if (!Array.isArray(users)) {
//       return error('Invalid request', ['users must be an array'], httpStatus.BAD_REQUEST);
//     }

//     if (users.length === 0) {
//       return error('Invalid request', ['users array cannot be empty'], httpStatus.BAD_REQUEST);
//     }

//     if (users.length > 25) {
//       return error('Invalid request', ['Cannot create more than 25 users in a single batch'], httpStatus.BAD_REQUEST);
//     }

//     // Validate each user
//     const validationErrors = [];
//     users.forEach((userData, index) => {
//       const validation = validateUser(userData, false);
//       if (!validation.isValid) {
//         validationErrors.push({
//           index,
//           errors: validation.errors
//         });
//       }
//     });

//     if (validationErrors.length > 0) {
//       return error('Validation failed', validationErrors, httpStatus.BAD_REQUEST);
//     }

//     // Batch create users
//     const result = await userService.batchCreateUsers(users);

//     const statusCode = result.failed.length === 0 
//       ? httpStatus.CREATED 
//       : httpStatus.MULTI_STATUS; // 207

//     return success(
//       {
//         successful: result.successful,
//         failed: result.failed,
//         summary: {
//           total: users.length,
//           successful: result.successful.length,
//           failed: result.failed.length
//         }
//       },
//       `Batch create completed: ${result.successful.length} successful, ${result.failed.length} failed`,
//       statusCode
//     );
//   } catch (err) {
//     console.error('Error batch creating users:', err);

//     // Handle known errors
//     if (err.message && err.message.includes('already exist')) {
//       return error('Email conflict', [err.message], httpStatus.CONFLICT);
//     }

//     if (err.message && err.message.includes('Duplicate emails')) {
//       return error('Duplicate emails in batch', [err.message], httpStatus.BAD_REQUEST);
//     }

//     // Handle unexpected errors
//     return error(
//       'Internal server error',
//       ['An unexpected error occurred while batch creating users'],
//       httpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// };

// module.exports = { handler };

const {
  DynamoDBClient,
  BatchWriteItemCommand
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.USERS_TABLE;

/**
 * Batch create users using DynamoDB BatchWriteItem
 * @param {Array<Object>} users
 * @returns {Promise<Object>}
 */
const handler= async (users) => {
  const result  = JSON.parse(users.body)
  console.log('=============>>',result,typeof result)
  const params = {
    RequestItems: {
      [TABLE_NAME]: result['users'].map(user => ({
        PutRequest: {
          Item: marshall({
            ...user,
            createdAt: new Date().toISOString()
          })
        }
      }))
    }
  };

  const command = new BatchWriteItemCommand(params);
  const response = await client.send(command);

  const unprocessed = response.UnprocessedItems?.[TABLE_NAME] || [];

  return {
    successful: result['users'].slice(0, result['users'].length - unprocessed.length),
    failed: unprocessed.map(item => ({
      item: item.PutRequest.Item,
      reason: 'Unprocessed by DynamoDB'
    }))
  };
};

module.exports = {
  handler
};
