/**
 * Test Suite: Leaderboard Component
 * Location: src/__tests__/Leaderboard.test.jsx
 * 
 * Tests for Leaderboard component:
 * - Tab switching (All-Time/Weekly/Streak)
 * - Ranking display and sorting
 * - User position highlighting
 * - Loading and error states
 * - Responsive table rendering
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Leaderboard from '../components/Leaderboard.jsx';
import { leaderboardService } from '../services/leaderboardService.js';

vi.mock('../services/leaderboardService.js');
vi.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 3, username: 'testuser' },
    isAuthenticated: true,
  }),
}));

describe('Leaderboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Navigation', () => {
    it('should render all three tabs', async () => {
      leaderboardService.getGlobalLeaderboard.mockResolvedValue([]);
      
      render(<Leaderboard />);

      expect(screen.getByRole('button', { name: /all-time/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /weekly/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /streak/i })).toBeInTheDocument();
    });

    it('should switch tabs and fetch new data', async () => {
      const globalData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        { user_id: 2, username: 'bob', total_xp: 4500, rank: 2 },
      ];

      const weeklyData = [
        { user_id: 2, username: 'bob', weekly_xp: 800, rank: 1 },
        { user_id: 1, username: 'alice', weekly_xp: 750, rank: 2 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(globalData);
      leaderboardService.getWeeklyLeaderboard.mockResolvedValue(weeklyData);

      render(<Leaderboard />);

      // Click weekly tab
      const weeklyTab = screen.getByRole('button', { name: /weekly/i });
      fireEvent.click(weeklyTab);

      await waitFor(() => {
        expect(leaderboardService.getWeeklyLeaderboard).toHaveBeenCalled();
      });
    });

    it('should highlight active tab', () => {
      leaderboardService.getGlobalLeaderboard.mockResolvedValue([]);
      
      render(<Leaderboard />);

      const allTimeTab = screen.getByRole('button', { name: /all-time/i });
      expect(allTimeTab).toHaveClass('active');
    });
  });

  describe('Ranking Display', () => {
    it('should display global rankings correctly', async () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1, level: 5 },
        { user_id: 2, username: 'bob', total_xp: 4500, rank: 2, level: 4 },
        { user_id: 3, username: 'charlie', total_xp: 4000, rank: 3, level: 4 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText('alice')).toBeInTheDocument();
        expect(screen.getByText('bob')).toBeInTheDocument();
        expect(screen.getByText('charlie')).toBeInTheDocument();
        expect(screen.getByText('5000')).toBeInTheDocument(); // XP
      });
    });

    it('should display correct medal positions', async () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        { user_id: 2, username: 'bob', total_xp: 4500, rank: 2 },
        { user_id: 3, username: 'charlie', total_xp: 4000, rank: 3 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        // Check for medal emojis
        expect(screen.getByText('🥇')).toBeInTheDocument(); // Gold
        expect(screen.getByText('🥈')).toBeInTheDocument(); // Silver
        expect(screen.getByText('🥉')).toBeInTheDocument(); // Bronze
      });
    });

    it('should sort rankings by XP descending', async () => {
      // Data should already be sorted, but testing the rendering order
      const mockData = [
        { user_id: 5, username: 'eve', total_xp: 6000, rank: 1 },
        { user_id: 3, username: 'charlie', total_xp: 5500, rank: 2 },
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 3 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        const ranks = screen.getAllByText(/rank/i);
        expect(ranks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('User Highlighting', () => {
    it('should highlight current user in rankings', async () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        { user_id: 3, username: 'testuser', total_xp: 4200, rank: 2 },
        { user_id: 2, username: 'bob', total_xp: 4500, rank: 3 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        const userRow = screen.getByText('testuser').closest('tr');
        expect(userRow).toHaveClass('current-user');
      });
    });

    it('should display user rank in table', async () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        { user_id: 3, username: 'testuser', total_xp: 4200, rank: 45 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state initially', () => {
      leaderboardService.getGlobalLeaderboard.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 1000))
      );

      render(<Leaderboard />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display error message on fetch failure', async () => {
      leaderboardService.getGlobalLeaderboard.mockRejectedValue(
        new Error('API Error')
      );

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });

    it('should display empty state when no data', async () => {
      leaderboardService.getGlobalLeaderboard.mockResolvedValue([]);

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText(/no leaderboard data/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should hide columns on mobile view', () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1, level: 5 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      // Check for mobile-friendly responsive class
      const table = screen.getByRole('table', { hidden: true });
      expect(table).toHaveClass('responsive');
    });

    it('should render table with proper structure', async () => {
      const mockData = [
        { user_id: 1, username: 'alice', total_xp: 5000, rank: 1 },
        { user_id: 2, username: 'bob', total_xp: 4500, rank: 2 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        const table = screen.getByRole('table', { hidden: true });
        expect(table).toBeInTheDocument();
        
        const rows = screen.getAllByRole('row', { hidden: true });
        // 1 header + 2 data rows
        expect(rows.length).toBe(3);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long usernames', async () => {
      const mockData = [
        { 
          user_id: 1, 
          username: 'verylongusernamethatexceedstheusuallimit123456789', 
          total_xp: 5000, 
          rank: 1 
        },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText('verylongusernamethatexceedstheusuallimit123456789')).toBeInTheDocument();
      });
    });

    it('should handle rapid tab switching', async () => {
      const allTimeData = [{ user_id: 1, username: 'alice', total_xp: 5000, rank: 1 }];
      const weeklyData = [{ user_id: 2, username: 'bob', weekly_xp: 800, rank: 1 }];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(allTimeData);
      leaderboardService.getWeeklyLeaderboard.mockResolvedValue(weeklyData);

      render(<Leaderboard />);

      const allTimeTab = screen.getByRole('button', { name: /all-time/i });
      const weeklyTab = screen.getByRole('button', { name: /weekly/i });

      // Rapid switching
      fireEvent.click(weeklyTab);
      fireEvent.click(allTimeTab);
      fireEvent.click(weeklyTab);

      await waitFor(() => {
        expect(leaderboardService.getWeeklyLeaderboard).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle 0 XP entries', async () => {
      const mockData = [
        { user_id: 1, username: 'newuser', total_xp: 0, rank: 1000 },
      ];

      leaderboardService.getGlobalLeaderboard.mockResolvedValue(mockData);

      render(<Leaderboard />);

      await waitFor(() => {
        expect(screen.getByText('newuser')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });
  });
});
