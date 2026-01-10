/**
 * Tests for updateUser handler
 * @module tests/updateUser.test
 */

const { handler } = require('../src/handlers/updateUser');
const userService = require('../src/services/userService');

describe('updateUser Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent = (userID, body) => ({
    pathParameters: { UserID: userID },
    body: JSON.stringify(body),
    queryStringParameters: {}
  });

  test('should update a user successfully', async () => {
    const updateData = {
      Name: 'John Updated',
      Phone: '9876543210'
    };

    const updatedUser = {
      UserID: 'test-uuid',
      Name: 'John Updated',
      Email: 'john@example.com',
      DOB: '1990-01-01',
      Phone: '9876543210',
      UpdatedAt: '2024-01-02T00:00:00.000Z'
    };

    jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser);

    const event = mockEvent('test-uuid', updateData);
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.Name).toBe(updateData.Name);
    expect(body.data.Phone).toBe(updateData.Phone);
  });

  test('should return 400 for missing UserID', async () => {
    const event = {
      pathParameters: {},
      body: JSON.stringify({ Name: 'John Updated' }),
      queryStringParameters: {}
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('UserID is required');
  });

  test('should return 400 for invalid JSON', async () => {
    const event = {
      pathParameters: { UserID: 'test-uuid' },
      body: 'invalid json',
      queryStringParameters: {}
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid JSON in request body');
  });

  test('should return 400 for empty update data', async () => {
    const event = mockEvent('test-uuid', {});
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('No update data provided');
  });

  test('should return 400 for invalid email format', async () => {
    const updateData = {
      Email: 'invalid-email'
    };

    const event = mockEvent('test-uuid', updateData);
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
  });

  test('should return 404 for non-existent user', async () => {
    const updateData = { Name: 'John Updated' };
    const notFoundError = new Error('User not found');
    notFoundError.statusCode = 404;

    jest.spyOn(userService, 'updateUser').mockRejectedValue(notFoundError);

    const event = mockEvent('non-existent-id', updateData);
    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('User not found');
  });

  test('should return 409 for duplicate email', async () => {
    const updateData = { Email: 'existing@example.com' };
    const conflictError = new Error('Email already exists');
    conflictError.statusCode = 409;

    jest.spyOn(userService, 'updateUser').mockRejectedValue(conflictError);

    const event = mockEvent('test-uuid', updateData);
    const response = await handler(event);

    expect(response.statusCode).toBe(409);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Email already exists');
  });

  test('should return 500 for server errors', async () => {
    const updateData = { Name: 'John Updated' };
    jest.spyOn(userService, 'updateUser').mockRejectedValue(new Error('Database error'));

    const event = mockEvent('test-uuid', updateData);
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
  });
});

