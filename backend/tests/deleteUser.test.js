/**
 * Tests for deleteUser handler
 * @module tests/deleteUser.test
 */

const { handler } = require('../src/handlers/deleteUser');
const userService = require('../src/services/userService');

describe('deleteUser Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent = (userID) => ({
    pathParameters: { UserID: userID },
    queryStringParameters: {}
  });

  test('should delete a user successfully', async () => {
    jest.spyOn(userService, 'deleteUser').mockResolvedValue(true);

    const event = mockEvent('test-uuid');
    const response = await handler(event);

    expect(response.statusCode).toBe(204);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('User deleted successfully');
  });

  test('should return 400 for missing UserID', async () => {
    const event = {
      pathParameters: {},
      queryStringParameters: {}
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('UserID is required');
  });

  test('should return 404 for non-existent user', async () => {
    const notFoundError = new Error('User not found');
    notFoundError.statusCode = 404;

    jest.spyOn(userService, 'deleteUser').mockRejectedValue(notFoundError);

    const event = mockEvent('non-existent-id');
    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('User not found');
  });

  test('should return 500 for server errors', async () => {
    jest.spyOn(userService, 'deleteUser').mockRejectedValue(new Error('Database error'));

    const event = mockEvent('test-uuid');
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
  });
});

