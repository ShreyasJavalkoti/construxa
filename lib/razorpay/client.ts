import Razorpay from 'razorpay'
import { env, serverEnv } from '../env'

// Initialize Razorpay instance for server-side use
export const razorpay = new Razorpay({
  key_id: env.razorpayKeyId || process.env.RAZORPAY_KEY_ID || '',
  key_secret: serverEnv.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || '',
})

// Check if Razorpay is configured
export function isRazorpayConfigured(): boolean {
  const keyId = env.razorpayKeyId || process.env.RAZORPAY_KEY_ID
  const keySecret = serverEnv.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET
  return !!keyId && !!keySecret && keyId !== '' && keySecret !== ''
}

// Razorpay subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 3,
    features: [
      '3 AI analysis credits',
      'Basic BOQ generation',
      'Basic timeline',
      'Email support',
    ],
  },
  starter: {
    name: 'Starter',
    price: 999, // INR
    credits: 10,
    features: [
      '10 AI analysis credits',
      'Detailed BOQ with CPWD rates',
      'Advanced timeline with Gantt chart',
      'Export to PDF/Excel',
      'Priority email support',
    ],
  },
  professional: {
    name: 'Professional',
    price: 2999, // INR
    credits: 50,
    features: [
      '50 AI analysis credits',
      'Detailed BOQ with CPWD rates',
      'Advanced timeline with Gantt chart',
      'Export to PDF/Excel',
      'Multiple project management',
      'Collaboration features',
      'Phone & email support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 9999, // INR
    credits: -1, // Unlimited
    features: [
      'Unlimited AI analysis',
      'Detailed BOQ with CPWD rates',
      'Advanced timeline with Gantt chart',
      'Export to PDF/Excel',
      'Unlimited projects',
      'Team collaboration',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone & email support',
    ],
  },
}

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
