/**
 * Tests for getUser handler
 * @module tests/getUser.test
 */

const { handler } = require('../src/handlers/getUser');
const userService = require('../src/services/userService');

describe('getUser Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent = (userID) => ({
    pathParameters: { UserID: userID },
    queryStringParameters: {}
  });

  test('should get a user successfully', async () => {
    const mockUser = {
      UserID: 'test-uuid',
      Name: 'John Doe',
      Email: 'john@example.com',
      DOB: '1990-01-01',
      CreatedAt: '2024-01-01T00:00:00.000Z',
      UpdatedAt: '2024-01-01T00:00:00.000Z'
    };

    jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);

    const event = mockEvent('test-uuid');
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.UserID).toBe(mockUser.UserID);
    expect(body.data.Name).toBe(mockUser.Name);
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
    jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

    const event = mockEvent('non-existent-id');
    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('User not found');
  });

  test('should return 500 for server errors', async () => {
    jest.spyOn(userService, 'getUserById').mockRejectedValue(new Error('Database error'));

    const event = mockEvent('test-uuid');
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
  });
});

