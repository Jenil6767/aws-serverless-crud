/**
 * Tests for createUser handler
 * @module tests/createUser.test
 */

const { handler } = require('../src/handlers/createUser');
const userService = require('../src/services/userService');
const { validateUser } = require('../src/utils/validator');
const AWS = require('aws-sdk-mock');

describe('createUser Handler', () => {
  beforeEach(() => {
    AWS.restore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    AWS.restore();
  });

  const mockEvent = (body) => ({
    body: JSON.stringify(body),
    pathParameters: {},
    queryStringParameters: {}
  });

  test('should create a user successfully', async () => {
    const userData = {
      Name: 'John Doe',
      Email: 'john@example.com',
      DOB: '1990-01-01',
      Phone: '1234567890',
      Address: '123 Main St'
    };

    const mockUser = {
      UserID: 'test-uuid',
      ...userData,
      CreatedAt: '2024-01-01T00:00:00.000Z',
      UpdatedAt: '2024-01-01T00:00:00.000Z'
    };

    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, { Items: [] }); // No existing user
    });

    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {});
    });

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);
    jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.UserID).toBeDefined();
    expect(body.data.Name).toBe(userData.Name);
    expect(body.data.Email).toBe(userData.Email);
  });

  test('should return 400 for invalid JSON', async () => {
    const event = {
      body: 'invalid json',
      pathParameters: {},
      queryStringParameters: {}
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid JSON in request body');
  });

  test('should return 400 for missing required fields', async () => {
    const userData = {
      Name: 'John Doe'
      // Missing Email and DOB
    };

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
    expect(body.details.length).toBeGreaterThan(0);
  });

  test('should return 400 for invalid email format', async () => {
    const userData = {
      Name: 'John Doe',
      Email: 'invalid-email',
      DOB: '1990-01-01'
    };

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
  });

  test('should return 400 for invalid DOB (under 18)', async () => {
    const userData = {
      Name: 'John Doe',
      Email: 'john@example.com',
      DOB: '2010-01-01' // Under 18
    };

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
  });

  test('should return 409 for duplicate email', async () => {
    const userData = {
      Name: 'John Doe',
      Email: 'existing@example.com',
      DOB: '1990-01-01'
    };

    const existingUser = {
      UserID: 'existing-id',
      Email: 'existing@example.com'
    };

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(existingUser);

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(409);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Email already exists');
  });

  test('should return 500 for server errors', async () => {
    const userData = {
      Name: 'John Doe',
      Email: 'john@example.com',
      DOB: '1990-01-01'
    };

    jest.spyOn(userService, 'getUserByEmail').mockRejectedValue(new Error('Database error'));

    const event = mockEvent(userData);
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
  });
});

