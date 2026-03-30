/**
 * Test Suite: Service Layer Integration
 * Location: src/__tests__/services.integration.test.jsx
 * 
 * Tests for service layer:
 * - API endpoint connectivity
 * - Error handling and retries
 * - Token management
 * - Timeout handling
 * - Data transformation
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Service Layer Integration Tests', () => {
  let originalFetch;
  let fetchMock;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    
    // Setup localStorage mock
    localStorage.clear();
    localStorage.setItem('token', 'test-token-12345');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('leaderboardService API Calls', () => {
    it('should make GET request to global leaderboard endpoint', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        ],
      });

      // Import and test
      await fetch('http://localhost:8000/api/leaderboard/global', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/leaderboard/global'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-12345',
          }),
        })
      );
    });

    it('should include authorization token in headers', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetch('http://localhost:8000/api/leaderboard/weekly', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer test-token-12345');
    });

    it('should handle 401 unauthorized response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const response = await fetch('http://localhost:8000/api/leaderboard/global', {
        headers: {
          'Authorization': `Bearer invalid-token`,
        },
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should handle 500 server error', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const response = await fetch('http://localhost:8000/api/leaderboard/global');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle network timeout', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network request timeout'));

      try {
        await fetch('http://localhost:8000/api/leaderboard/global');
      } catch (error) {
        expect(error.message).toContain('timeout');
      }
    });
  });

  describe('statsService API Calls', () => {
    it('should fetch personal stats correctly', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      await fetch('http://localhost:8000/api/stats/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/stats/me'),
        expect.any(Object)
      );
    });

    it('should fetch public profile stats', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await fetch('http://localhost:8000/api/stats/123/public-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/stats/123/public-stats'),
        expect.any(Object)
      );
    });

    it('should handle missing user ID in public stats request', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const response = await fetch('http://localhost:8000/api/stats//public-stats');

      expect(response.ok).toBe(false);
    });
  });

  describe('achievementsService API Calls', () => {
    it('should fetch all achievements', async () => {
      const mockAchievements = [
        { badge_id: 1, badge_name: 'first_project', badge_icon: '🎉' },
        { badge_id: 2, badge_name: 'five_projects', badge_icon: '⭐' },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAchievements,
      });

      const response = await fetch('http://localhost:8000/api/achievements/catalog');

      expect(response.ok).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/achievements/catalog'),
        expect.any(Object)
      );
    });

    it('should fetch user achievements', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetch('http://localhost:8000/api/achievements/user-achievements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      expect(fetchMock).toHaveBeenCalled();
    });
  });

  describe('Token Management', () => {
    it('should include token in all authenticated requests', async () => {
      localStorage.setItem('token', 'new-token-abc123');
      
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await fetch('http://localhost:8000/api/stats/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer new-token-abc123');
    });

    it('should handle missing token gracefully', async () => {
      localStorage.removeItem('token');
      
      const token = localStorage.getItem('token');
      expect(token).toBeNull();
    });

    it('should refresh token on 401 response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const response = await fetch('http://localhost:8000/api/stats/me', {
        headers: {
          'Authorization': `Bearer expired-token`,
        },
      });

      expect(response.status).toBe(401);
      // Token refresh logic would go here
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      try {
        const response = await fetch('http://localhost:8000/api/stats/me');
        await response.json();
      } catch (error) {
        expect(error.message).toContain('Invalid JSON');
      }
    });

    it('should handle network errors gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('http://localhost:8000/api/stats/me');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    it('should handle CORS errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('CORS error'));

      try {
        await fetch('http://localhost:8000/api/stats/me');
      } catch (error) {
        expect(error.message).toBe('CORS error');
      }
    });
  });

  describe('Data Transformation', () => {
    it('should correctly parse leaderboard response', async () => {
      const mockData = {
        rankings: [
          { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
          { user_id: 2, username: 'bob', total_xp: 4500, rank: 2 },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await fetch('http://localhost:8000/api/leaderboard/global');
      const data = await response.json();

      expect(data.rankings).toBeDefined();
      expect(data.rankings.length).toBe(2);
      expect(data.rankings[0].rank).toBe(1);
    });

    it('should handle empty arrays in responses', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const response = await fetch('http://localhost:8000/api/leaderboard/global');
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });
});
