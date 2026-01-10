/**
 * Tests for listUsers handler
 * @module tests/listUsers.test
 */

const { handler } = require('../src/handlers/listUsers');
const userService = require('../src/services/userService');

describe('listUsers Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent = (queryParams = {}) => ({
    pathParameters: {},
    queryStringParameters: queryParams
  });

  test('should list users successfully with default pagination', async () => {
    const mockUsers = [
      {
        UserID: 'uuid-1',
        Name: 'John Doe',
        Email: 'john@example.com',
        DOB: '1990-01-01'
      },
      {
        UserID: 'uuid-2',
        Name: 'Jane Doe',
        Email: 'jane@example.com',
        DOB: '1992-01-01'
      }
    ];

    jest.spyOn(userService, 'listUsers').mockResolvedValue({
      users: mockUsers,
      count: 2,
      lastEvaluatedKey: null
    });

    const event = mockEvent();
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.users).toHaveLength(2);
    expect(body.data.pagination.count).toBe(2);
  });

  test('should list users with custom limit', async () => {
    const mockUsers = [
      { UserID: 'uuid-1', Name: 'John Doe', Email: 'john@example.com', DOB: '1990-01-01' }
    ];

    jest.spyOn(userService, 'listUsers').mockResolvedValue({
      users: mockUsers,
      count: 1,
      lastEvaluatedKey: null
    });

    const event = mockEvent({ limit: '5' });
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(userService.listUsers).toHaveBeenCalledWith({ limit: 5, lastEvaluatedKey: null });
  });

  test('should list users with pagination', async () => {
    const mockUsers = [
      { UserID: 'uuid-1', Name: 'John Doe', Email: 'john@example.com', DOB: '1990-01-01' }
    ];

    const lastKey = Buffer.from(JSON.stringify({ UserID: 'last-key' })).toString('base64');

    jest.spyOn(userService, 'listUsers').mockResolvedValue({
      users: mockUsers,
      count: 1,
      lastEvaluatedKey: lastKey
    });

    const event = mockEvent({ limit: '10', lastEvaluatedKey: lastKey });
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.pagination.lastEvaluatedKey).toBe(lastKey);
  });

  test('should return 400 for invalid limit (too high)', async () => {
    const event = mockEvent({ limit: '150' });
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid limit parameter');
  });

  test('should return 400 for invalid limit (not a number)', async () => {
    const event = mockEvent({ limit: 'invalid' });
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
  });

  test('should return 500 for server errors', async () => {
    jest.spyOn(userService, 'listUsers').mockRejectedValue(new Error('Database error'));

    const event = mockEvent();
    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
  });
});

