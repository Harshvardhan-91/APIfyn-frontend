import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const { user, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (planId, interval) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load Razorpay script
      await loadRazorpay();

      // Get a fresh token before making the request
      const freshToken = await refreshToken();

      // Create subscription on backend
      console.log('Creating subscription with:', {
        planId,
        interval,
        userToken: freshToken ? 'Fresh token obtained' : 'No token',
        userEmail: user?.email
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshToken}`
        },
        body: JSON.stringify({ planId, interval })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Subscription creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to create subscription: ${response.status} ${response.statusText}`);
      }

      const { subscription, razorpayKey } = await response.json();

      // Initialize Razorpay
      const options = {
        key: razorpayKey,
        subscription_id: subscription.razorpaySubId,
        name: 'APIfyn',
        description: `${interval} subscription to APIfyn ${subscription.plan.name} plan`,
        image: '/logo.png',
        prefill: {
          email: user?.email,
          name: user?.displayName
        },
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/payment/success`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.idToken}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Update current plan
            setCurrentPlan(subscription.plan);
          } catch (error) {
            setError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled');
          }
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(error?.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.idToken}`
        },
        body: JSON.stringify({ subscriptionId })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      setCurrentPlan(null);
    } catch (error) {
      setError(error?.message || 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{
      isLoading,
      error,
      initiatePayment,
      cancelSubscription,
      currentPlan
    }}>
      {children}
    </PaymentContext.Provider>
  );
};