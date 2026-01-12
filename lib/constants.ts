// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly' as const,
    features: [
      '1 Project',
      '5 Drawings per project',
      'Basic BOQ Generation',
      'Basic Timeline',
      'Email Support',
    ],
    limits: {
      projects: 1,
      drawings: 5,
      boq: 1,
      timeline: 1,
    },
  },
  PRO_MONTHLY: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 1999,
    interval: 'monthly' as const,
    features: [
      'Unlimited Projects',
      'Unlimited Drawings',
      'Advanced BOQ with CPWD Rates',
      'Detailed Timeline with Gantt',
      'Priority Support',
      'Export to Excel/PDF',
      'API Access',
    ],
    limits: {
      projects: -1, // unlimited
      drawings: -1,
      boq: -1,
      timeline: -1,
    },
  },
  PRO_YEARLY: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 19990,
    interval: 'yearly' as const,
    features: [
      'Unlimited Projects',
      'Unlimited Drawings',
      'Advanced BOQ with CPWD Rates',
      'Detailed Timeline with Gantt',
      'Priority Support',
      'Export to Excel/PDF',
      'API Access',
      '2 Months Free',
    ],
    limits: {
      projects: -1,
      drawings: -1,
      boq: -1,
      timeline: -1,
    },
  },
}

// CPWD Rates (Sample rates - should be updated with actual rates)
export const CPWD_RATES = {
  // Earthwork
  'Excavation in foundation': { unit: 'cum', rate: 150 },
  'Filling available earth': { unit: 'cum', rate: 100 },
  'Sand filling': { unit: 'cum', rate: 250 },
  
  // Concrete
  'PCC 1:2:4': { unit: 'cum', rate: 6500 },
  'RCC M20': { unit: 'cum', rate: 8500 },
  'RCC M25': { unit: 'cum', rate: 9000 },
  
  // Masonry
  'Brick work in CM 1:6': { unit: 'cum', rate: 5500 },
  'Stone masonry': { unit: 'cum', rate: 4500 },
  
  // Plastering
  'Plastering CM 1:4': { unit: 'sqm', rate: 180 },
  'Plastering CM 1:6': { unit: 'sqm', rate: 150 },
  
  // Flooring
  'Ceramic tile flooring': { unit: 'sqm', rate: 650 },
  'Marble flooring': { unit: 'sqm', rate: 1200 },
  'Vitrified tile flooring': { unit: 'sqm', rate: 800 },
  
  // Painting
  'Oil paint': { unit: 'sqm', rate: 85 },
  'Emulsion paint': { unit: 'sqm', rate: 65 },
  'Distemper': { unit: 'sqm', rate: 45 },
  
  // Steel
  'TMT steel bars': { unit: 'kg', rate: 75 },
  'MS steel': { unit: 'kg', rate: 65 },
  
  // Doors and Windows
  'Wooden door frame': { unit: 'rmt', rate: 450 },
  'Wooden door shutter': { unit: 'sqm', rate: 2500 },
  'Aluminum window': { unit: 'sqm', rate: 1800 },
  'UPVC window': { unit: 'sqm', rate: 1500 },
  
  // Electrical
  'Electrical wiring': { unit: 'point', rate: 350 },
  'Light fitting': { unit: 'point', rate: 250 },
  'Fan point': { unit: 'point', rate: 300 },
  
  // Plumbing
  'CPVC piping': { unit: 'rmt', rate: 180 },
  'PVC piping': { unit: 'rmt', rate: 120 },
  'Sanitary fittings': { unit: 'each', rate: 5000 },
}

// BOQ Categories
export const BOQ_CATEGORIES = [
  'Earthwork',
  'Concrete',
  'Masonry',
  'Plastering',
  'Flooring',
  'Painting',
  'Steel Work',
  'Doors and Windows',
  'Electrical',
  'Plumbing',
  'Miscellaneous',
]

// Timeline Phases
export const TIMELINE_PHASES = [
  'Site Preparation',
  'Foundation',
  'Structure',
  'Masonry',
  'Plastering',
  'Flooring',
  'Electrical',
  'Plumbing',
  'Painting',
  'Finishing',
]

// File upload constraints
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['.dwg', '.dxf', '.pdf'],
  ALLOWED_MIME_TYPES: [
    'application/acad',
    'application/x-acad',
    'application/x-autocad',
    'application/dxf',
    'application/pdf',
    'image/vnd.dwg',
    'image/x-dwg',
  ],
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    CALLBACK: '/api/auth/callback',
  },
  PROJECTS: '/api/projects',
  DRAWINGS: '/api/drawings',
  BOQ: '/api/boq/generate',
  TIMELINE: '/api/timeline/generate',
  PAYMENTS: {
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payments/verify',
  },
}
