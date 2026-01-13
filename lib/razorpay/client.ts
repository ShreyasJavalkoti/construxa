import Razorpay from 'razorpay'
import { serverEnv } from '../env'

let _razorpay: Razorpay | null = null

// Get Razorpay client instance (lazy initialization)
export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID || serverEnv.razorpayKeyId
    const keySecret = process.env.RAZORPAY_KEY_SECRET || serverEnv.razorpayKeySecret
    
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured')
    }
    
    _razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
  return _razorpay
}

// Export as razorpay for backwards compatibility
export const razorpay = new Proxy({} as Razorpay, {
  get(target, prop) {
    return (getRazorpay() as any)[prop]
  }
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
  
  if (!keySecret) {
    throw new Error('Razorpay key secret is not configured')
  }
  
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  
  return generatedSignature === signature
}
