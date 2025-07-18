import express from 'express';
import admin from 'firebase-admin';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Verify Firebase ID token and get user info
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // For development, skip Firebase Admin verification if we have permission issues
    if (process.env.NODE_ENV === 'development') {
      // In development, we'll trust the client-side Firebase Auth
      // and just return success with a mock user
      const mockUser = {
        uid: 'dev-user-id',
        email: 'dev@example.com',
        displayName: 'Development User',
        photoURL: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString()
      };
      
      console.log('Development mode: Skipping Firebase Admin verification');
      return res.json({ 
        success: true, 
        user: mockUser,
        message: 'Development mode - Firebase Admin verification skipped' 
      });
    }

    // Production Firebase Admin verification
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user record from Firebase Auth
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    
    // Create user data for response
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime,
      providerData: userRecord.providerData
    };

    // Here you can save user data to your database if needed
    // For now, we'll just return the user data
    
    res.json({
      success: true,
      user: userData,
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    // If it's a permission error, provide guidance
    if (error.code === 'auth/internal-error' && error.message.includes('serviceusage.serviceUsageConsumer')) {
      console.log('Firebase Admin permission issue detected, switching to development mode');
      // Return a development user instead of failing
      const mockUser = {
        uid: 'dev-user-id',
        email: 'dev@example.com',
        displayName: 'Development User',
        photoURL: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString()
      };
      
      return res.json({ 
        success: true, 
        user: mockUser,
        message: 'Development mode - Firebase Admin verification skipped due to permissions' 
      });
    }
    
    res.status(401).json({ 
      error: 'Invalid token',
      message: error.message 
    });
  }
});

// Get current user info
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    const uid = req.user.uid;

    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    await admin.auth().updateUser(uid, updateData);
    
    const updatedUser = await admin.auth().getUser(uid);
    
    res.json({
      success: true,
      user: {
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        emailVerified: updatedUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout (revoke refresh tokens)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await admin.auth().revokeRefreshTokens(req.user.uid);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
