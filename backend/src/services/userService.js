/**
 * User service for DynamoDB operations
 * @module services/userService
 */

const { v4: uuidv4 } = require('uuid');
const { dynamoDB, getTableName } = require('../config/dynamodb');

/**
 * Creates a new user in DynamoDB
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If user creation fails
 */
const createUser = async (userData) => {
  const UserID = uuidv4();
  const now = new Date().toISOString();

  const user = {
    UserID,
    Name: userData.Name.trim(),
    Email: userData.Email.trim().toLowerCase(),
    DOB: userData.DOB,
    Phone: userData.Phone ? userData.Phone.trim() : null,
    Address: userData.Address ? userData.Address.trim() : null,
    CreatedAt: now,
    UpdatedAt: now
  };

  const params = {
    TableName: getTableName(),
    Item: user
  };

  try {
    await dynamoDB.put(params).promise();
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets a user by UserID
 * @param {string} UserID - User ID to retrieve
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If retrieval fails
 */
const getUserById = async (UserID) => {
  const params = {
    TableName: getTableName(),
    Key: { UserID }
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets a user by email (for duplicate checking)
 * @param {string} email - Email to search for
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If retrieval fails
 */
const getUserByEmail = async (email) => {
  const params = {
    TableName: getTableName(),
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': email.trim().toLowerCase()
    }
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Lists users with pagination support
 * @param {Object} options - Pagination options
 * @param {number} options.limit - Number of items per page (default: 10)
 * @param {string} options.lastEvaluatedKey - Last evaluated key for pagination
 * @returns {Promise<Object>} Object containing users array and pagination info
 * @throws {Error} If listing fails
 */
const listUsers = async (options = {}) => {
  const { limit = 10, lastEvaluatedKey } = options;

  const params = {
    TableName: getTableName(),
    Limit: Math.min(limit, 100) // Max 100 items per page
  };

  if (lastEvaluatedKey) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(lastEvaluatedKey, 'base64').toString());
  }

  try {
    const result = await dynamoDB.scan(params).promise();
    
    return {
      users: result.Items || [],
      lastEvaluatedKey: result.LastEvaluatedKey 
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : null,
      count: result.Items ? result.Items.length : 0
    };
  } catch (error) {
    throw error;
  }
};


/**
 * Updates an existing user
 * @param {string} UserID - User ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If update fails or user not found
 */
const updateUser = async (UserID, updateData) => {
  const existingUser = await getUserById(UserID);
  
  if (!existingUser) {
    const notFoundError = new Error('User not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  // Build update expression
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (updateData.Name !== undefined) {
    updateExpressions.push('#name = :name');
    expressionAttributeNames['#name'] = 'Name';
    expressionAttributeValues[':name'] = updateData.Name.trim();
  }

  if (updateData.Email !== undefined) {
    updateExpressions.push('#email = :email');
    expressionAttributeNames['#email'] = 'Email';
    expressionAttributeValues[':email'] = updateData.Email.trim().toLowerCase();
  }

  if (updateData.DOB !== undefined) {
    updateExpressions.push('#dob = :dob');
    expressionAttributeNames['#dob'] = 'DOB';
    expressionAttributeValues[':dob'] = updateData.DOB;
  }

  if (updateData.Phone !== undefined) {
    updateExpressions.push('#phone = :phone');
    expressionAttributeNames['#phone'] = 'Phone';
    expressionAttributeValues[':phone'] = updateData.Phone ? updateData.Phone.trim() : null;
  }

  if (updateData.Address !== undefined) {
    updateExpressions.push('#address = :address');
    expressionAttributeNames['#address'] = 'Address';
    expressionAttributeValues[':address'] = updateData.Address ? updateData.Address.trim() : null;
  }

  // Always update UpdatedAt
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'UpdatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const params = {
    TableName: getTableName(),
    Key: { UserID },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  // If email is being updated, check for duplicates
  if (updateData.Email !== undefined && updateData.Email.trim().toLowerCase() !== existingUser.Email) {
    const emailUser = await getUserByEmail(updateData.Email);
    if (emailUser && emailUser.UserID !== UserID) {
      const conflictError = new Error('Email already exists');
      conflictError.statusCode = 409;
      throw conflictError;
    }
  }

  try {
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a user by UserID
 * @param {string} UserID - User ID to delete
 * @returns {Promise<boolean>} True if user was deleted, false if not found
 * @throws {Error} If deletion fails
 */
const deleteUser = async (UserID) => {
  const existingUser = await getUserById(UserID);
  
  if (!existingUser) {
    const notFoundError = new Error('User not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  const params = {
    TableName: getTableName(),
    Key: { UserID }
  };

  try {
    await dynamoDB.delete(params).promise();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  listUsers,
  updateUser,
  deleteUser
};

