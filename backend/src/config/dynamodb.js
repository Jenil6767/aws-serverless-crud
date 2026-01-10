/**
 * DynamoDB configuration and client setup
 * @module config/dynamodb
 */

const AWS = require('aws-sdk');

/**
 * DynamoDB DocumentClient instance
 * Uses environment variable for table name
 */
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Gets the users table name from environment variables
 * @returns {string} Table name
 */
const getTableName = () => {
  return process.env.USERS_TABLE;
};

module.exports = {
  dynamoDB,
  getTableName
};

