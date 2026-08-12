import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').transform(s => s.trim()),
  email: z.string().transform(s => s.trim().toLowerCase()).pipe(z.string().email('Invalid email address format')),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  role: z.enum(['customer', 'business', 'technician', 'operations', 'admin']).default('customer'),
  organization: z.string().optional().nullable().transform(s => s?.trim() || ''),
  phone: z.string().optional().nullable().transform(s => s?.trim() || ''),
  district: z.string().optional().nullable().transform(s => s?.trim() || 'Dhaka')
});

export const loginSchema = z.object({
  email: z.string().transform(s => s.trim().toLowerCase()).pipe(z.string().email('Invalid email address format')),
  password: z.string().min(1, 'Password is required'),
  secretKey: z.string().optional().nullable(),
  verificationCode: z.string().optional().nullable()
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().default('Routers'),
  sku: z.string().optional(),
  manufacturer: z.string().default('ConnectBD Direct'),
  origin: z.string().default('Shenzhen / Dhaka'),
  priceBDT: z.number().min(0, 'Price must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(10),
  deliveryDays: z.string().default('2-4 Business Days'),
  warranty: z.string().default('1 Year Warranty'),
  description: z.string().min(5, 'Product description is required'),
  seoKeywords: z.string().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  image: z.string().optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export const orderItemSchema = z.object({
  productId: z.string().optional(),
  packageId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  includeInstallation: z.boolean().default(true)
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required in cart'),
  deliveryAddress: z.object({
    district: z.string().min(1, 'District is required'),
    thana: z.string().min(1, 'Thana is required'),
    address: z.string().min(5, 'Detailed delivery address is required'),
    contactPhone: z.string().min(10, 'Valid contact phone number is required')
  }),
  paymentMethod: z.enum(['bKash/Nagad', 'Bank Transfer', 'Card', 'Corporate Invoice']).default('bKash/Nagad')
});

export const createQuoteSchema = z.object({
  customerType: z.enum(['Community', 'Education', 'Business', 'Government', 'Individual']).default('Education'),
  organizationName: z.string().min(2, 'Organization name is required'),
  location: z.string().min(3, 'Site location is required'),
  numberOfUsers: z.number().int().min(1, 'Number of users must be at least 1').default(50),
  coverageAreaSqFt: z.number().int().min(100, 'Coverage area must be specified').default(3000),
  desiredBandwidthMbps: z.number().int().min(5, 'Desired bandwidth must be specified').default(50),
  numberOfBuildings: z.number().int().min(1).default(1),
  preferredBackhaul: z.enum(['Fiber', 'Terrestrial Wireless', 'Cellular Backhaul', 'Satellite Hybrid']).default('Fiber'),
  budgetRangeBDT: z.string().default('25,000 - 50,000 BDT'),
  existingISP: z.string().optional(),
  expectedDate: z.string().optional(),
  additionalNotes: z.string().optional()
});

export const createTicketSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  category: z.enum(['Hardware Issue', 'Network Speed', 'Billing & Subscription', 'Technician Visit', 'Other']).default('Hardware Issue'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  message: z.string().min(5, 'Message text is required')
});

export const replyTicketSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  text: z.string().min(1, 'Reply message cannot be empty')
});

export const updateTechnicianJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  status: z.enum(['Assigned', 'En Route', 'In Progress', 'Evidence Uploaded', 'Completed', 'Reported Issue']).optional(),
  installedSerialNumbers: z.array(z.string()).optional(),
  technicianReport: z.string().optional(),
  beforePhoto: z.string().optional(),
  afterPhoto: z.string().optional()
});

export const createCertificateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.enum(['Regulatory', 'BTRC Credential', 'Business Registration', 'Import/Export', 'Supplier Quality', 'Security']).default('Regulatory'),
  issuingAuthority: z.string().min(2, 'Issuing authority is required'),
  certificateNumber: z.string().min(2, 'Certificate number is required'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  documentUrl: z.string().optional()
});
