import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Mock dashboard data - replace with actual database queries
    const dashboardData = {
      workflows: {
        total: 12,
        active: 8,
        paused: 3,
        failed: 1
      },
      executions: {
        today: 156,
        thisWeek: 1234,
        thisMonth: 5678,
        successRate: 98.7
      },
      integrations: {
        connected: 6,
        available: 500
      },
      recentActivity: [
        {
          id: 1,
          type: 'workflow_executed',
          name: 'Customer Onboarding',
          status: 'success',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'integration_connected',
          name: 'Slack',
          status: 'success',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    // Mock settings data - replace with actual database queries
    const settings = {
      notifications: {
        email: true,
        push: false,
        workflowFailures: true,
        weeklyReports: true
      },
      preferences: {
        theme: 'light',
        timezone: 'UTC',
        language: 'en'
      },
      billing: {
        plan: 'Pro',
        status: 'active',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { notifications, preferences } = req.body;
    
    // Here you would update the settings in your database
    // For now, we'll just return success
    
    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      settings: { notifications, preferences }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
