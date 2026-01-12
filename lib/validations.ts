import { z } from 'zod'

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed']).optional(),
})

// Drawing validation schemas
export const uploadDrawingSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(1, 'Drawing name is required'),
  category: z.enum(['plan', 'elevation', 'section', 'structural']).optional(),
})

// BOQ validation schemas
export const generateBOQSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  drawingIds: z.array(z.string().uuid()).min(1, 'At least one drawing is required'),
  rateSource: z.enum(['cpwd', 'pwd', 'custom']).default('cpwd'),
})

// Timeline validation schemas
export const generateTimelineSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  boqId: z.string().uuid('Invalid BOQ ID').optional(),
})

// Payment validation schemas
export const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  planType: z.enum(['pro_monthly', 'pro_yearly']),
})

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
})

// Profile validation schemas
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
})

// Preferences validation schemas
export const updatePreferencesSchema = z.object({
  rateSource: z.enum(['cpwd', 'pwd', 'custom']).optional(),
  currencyFormat: z.enum(['rupee', 'dollar', 'euro']).optional(),
  numberFormat: z.enum(['indian', 'international']).optional(),
  lengthUnit: z.enum(['meters', 'feet']).optional(),
  areaUnit: z.enum(['sqm', 'sqft']).optional(),
  volumeUnit: z.enum(['cum', 'cuft']).optional(),
  weightUnit: z.enum(['kg', 'lb']).optional(),
  dateFormat: z.enum(['ddmmyyyy', 'mmddyyyy', 'yyyymmdd']).optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  timezone: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['en', 'hi']).optional(),
  compactView: z.boolean().optional(),
})

// Notification preferences validation schemas
export const updateNotificationPreferencesSchema = z.object({
  projectUpdates: z.boolean().optional(),
  timelineComplete: z.boolean().optional(),
  boqComplete: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 50 * 1024 * 1024, {
    message: 'File size must be less than 50MB',
  }),
})
