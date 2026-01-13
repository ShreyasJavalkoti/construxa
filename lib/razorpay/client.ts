import Razorpay from 'razorpay'
import { serverEnv } from '../env'

// Initialize Razorpay client
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || serverEnv.razorpayKeyId || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || serverEnv.razorpayKeySecret || '',
})

// Helper function to check if Razorpay is configured
export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || serverEnv.razorpayKeyId
  const keySecret = process.env.RAZORPAY_KEY_SECRET || serverEnv.razorpayKeySecret
  return !!(keyId && keySecret)
}

// Verify Razorpay payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const keySecret = process.env.RAZORPAY_KEY_SECRET || serverEnv.razorpayKeySecret
  
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  
  return generatedSignature === signature
}
