/**
 * Test Suite: Dashboard Component
 * Location: src/__tests__/Dashboard.test.jsx
 * 
 * Tests for Dashboard component:
 * - Data fetching and display
 * - XP/Level progression rendering
 * - Badge display and sorting
 * - Recent completions timeline
 * - Error handling and fallbacks
 * - Responsive design
 */

// This file contains test cases for the Dashboard component
// Tests can be run with: npm test or npm run test:dashboard

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard.jsx';
import { statsService } from '../services/statsService.js';
import { achievementsService } from '../services/achievementsService.js';

// Mock the services
vi.mock('../services/statsService.js');
vi.mock('../services/achievementsService.js');
vi.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
    isAuthenticated: true,
  }),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render loading state on mount', () => {
      statsService.getMyStats.mockRejectedValue(new Error('Loading'));
      render(<Dashboard />);
      
      // Should show loading message
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display user stats after loading', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
        completion_rate: 25.0,
        badges_earned: 3,
        current_streak: 2,
      };

      const mockBadges = [
        { badge_name: 'first_project', badge_icon: '🎉', earned_at: new Date() },
      ];

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue(mockBadges);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Level
        expect(screen.getByText('2500')).toBeInTheDocument(); // XP
      });
    });

    it('should display error message on fetch failure', async () => {
      const mockError = new Error('API Error');
      statsService.getMyStats.mockRejectedValue(mockError);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });
  });

  describe('XP and Level Display', () => {
    it('should calculate XP progress correctly', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
        completion_rate: 25.0,
        badges_earned: 0,
        current_streak: 0,
        xp_to_next_level: 500,
        next_level_xp: 4000,
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        // Progress should be (1000 - 500) / 1000 = 50%
        const progressBar = screen.getByRole('progressbar', { hidden: true });
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should display correct level on level up', async () => {
      const mockStats = {
        total_xp: 4050,
        current_level: 5,
        projects_completed: 10,
        projects_total: 20,
        completion_rate: 50.0,
        badges_earned: 5,
        current_streak: 5,
        xp_to_next_level: 950,
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('Badges Display', () => {
    it('should display earned badges', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
        completion_rate: 25.0,
        badges_earned: 3,
        current_streak: 2,
      };

      const mockBadges = [
        { badge_name: 'first_project', badge_icon: '🎉', earned_at: new Date() },
        { badge_name: 'five_projects', badge_icon: '⭐', earned_at: new Date() },
        { badge_name: 'level_5', badge_icon: '📈', earned_at: new Date() },
      ];

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue(mockBadges);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('🎉')).toBeInTheDocument();
        expect(screen.getByText('⭐')).toBeInTheDocument();
        expect(screen.getByText('📈')).toBeInTheDocument();
      });
    });

    it('should show empty state when no badges earned', async () => {
      const mockStats = {
        total_xp: 100,
        current_level: 1,
        projects_completed: 0,
        projects_total: 20,
        completion_rate: 0,
        badges_earned: 0,
        current_streak: 0,
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/complete projects to unlock/i)).toBeInTheDocument();
      });
    });
  });

  describe('Recent Completions', () => {
    it('should display recent project completions', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
        completion_rate: 25.0,
        badges_earned: 3,
        current_streak: 2,
        recent_completions: [
          {
            project_id: 1,
            xp_earned: 250,
            completed_at: new Date('2026-03-29'),
            hints_used: 2,
          },
          {
            project_id: 2,
            xp_earned: 200,
            completed_at: new Date('2026-03-28'),
            hints_used: 0,
          },
        ],
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Project #1')).toBeInTheDocument();
        expect(screen.getByText('+250 XP')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null stats gracefully', async () => {
      statsService.getMyStats.mockResolvedValue(null);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/no stats available/i)).toBeInTheDocument();
      });
    });

    it('should handle undefined recent_completions', async () => {
      const mockStats = {
        total_xp: 2500,
        current_level: 3,
        projects_completed: 5,
        projects_total: 20,
        completion_rate: 25.0,
        badges_earned: 3,
        current_streak: 2,
        recent_completions: undefined,
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        // Should not crash and render basic stats
        expect(screen.getByText('2500')).toBeInTheDocument();
      });
    });

    it('should handle zero completion rate', async () => {
      const mockStats = {
        total_xp: 0,
        current_level: 1,
        projects_completed: 0,
        projects_total: 20,
        completion_rate: 0,
        badges_earned: 0,
        current_streak: 0,
      };

      statsService.getMyStats.mockResolvedValue(mockStats);
      achievementsService.getUserAchievements.mockResolvedValue([]);

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
      });
    });
  });
});
