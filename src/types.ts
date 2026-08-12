export type UserRole = 'customer' | 'business' | 'technician' | 'operations' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  verified: boolean;
  avatar?: string;
}

export type ProductCategory = 
  | 'Routers'
  | 'Wi-Fi Access Points'
  | 'Mesh Systems'
  | 'Outdoor Access Points'
  | 'Network Switches'
  | 'Optical Networking'
  | 'CPE / Antennas'
  | 'Power & Backup'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  manufacturer: string;
  origin: string; // e.g., Shenzhen, China
  priceBDT: number;
  stock: number;
  inStock: boolean;
  deliveryDays: string;
  warranty: string;
  rating: number;
  description: string;
  specs: Record<string, string>;
  image: string;
  downloadableSpecSheet?: string;
  recommendedPackageId?: string;
}

export interface ConnectivityPackage {
  id: string;
  name: string;
  category: 'Community' | 'Education' | 'Business' | 'Enterprise' | 'Remote';
  startingPriceBDT: number;
  monthlyServiceBDT: number;
  recommendedUsers: string;
  coverageArea: string;
  includedHardware: string[];
  deploymentTime: string;
  supportPeriod: string;
  warranty: string;
  highlights: string[];
  notIncluded: string[];
  complexity: 'Low' | 'Medium' | 'High';
  popular?: boolean;
}

export interface CartItem {
  type: 'product' | 'package';
  id: string;
  item: Product | ConnectivityPackage;
  quantity: number;
  includeInstallation: boolean;
}

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Supplier Procurement (China)'
  | 'In Transit'
  | 'Customs Clearance'
  | 'Bangladesh Warehouse'
  | 'Technician Assigned'
  | 'Installation In Progress'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  organizationName?: string;
  items: CartItem[];
  subtotalBDT: number;
  installationFeeBDT: number;
  estimatedTaxBDT: number;
  totalBDT: number;
  status: OrderStatus;
  deliveryAddress: {
    district: string;
    thana: string;
    address: string;
    contactPhone: string;
  };
  paymentStatus: 'Paid' | 'Pending' | 'Invoice Issued';
  paymentMethod: 'bKash/Nagad' | 'Bank Transfer' | 'Card' | 'Corporate Invoice';
  createdAt: string;
  estimatedDeliveryDate: string;
  technicianId?: string;
  trackingSteps: {
    title: string;
    date?: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export type QuoteStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Technical Assessment'
  | 'Quote Prepared'
  | 'Approved'
  | 'Rejected'
  | 'Converted to Order';

export interface QuoteRequest {
  id: string;
  quoteNumber: string;
  userId: string;
  customerName: string;
  customerType: 'Community' | 'Education' | 'Business' | 'Government' | 'Individual';
  organizationName: string;
  location: string;
  numberOfUsers: number;
  coverageAreaSqFt: number;
  desiredBandwidthMbps: number;
  numberOfBuildings: number;
  preferredBackhaul: 'Fiber' | 'Terrestrial Wireless' | 'Cellular Backhaul' | 'Satellite Hybrid';
  budgetRangeBDT: string;
  existingISP?: string;
  expectedDate: string;
  sitePlanUploaded?: boolean;
  additionalNotes?: string;
  status: QuoteStatus;
  estimatedCostBDT?: number;
  assignedEngineer?: string;
  createdAt: string;
}

export interface TechnicianJob {
  id: string;
  jobId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  organizationName?: string;
  address: string;
  district: string;
  serviceType: 'New Installation' | 'Site Survey' | 'Maintenance' | 'Device Replacement' | 'Network Optimization';
  status: 'Assigned' | 'En Route' | 'In Progress' | 'Evidence Uploaded' | 'Completed' | 'Reported Issue';
  scheduledDate: string;
  requirements: string[];
  equipmentList: { sku: string; name: string; quantity: number; serialNumber?: string }[];
  installedSerialNumbers?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  technicianReport?: string;
  customerSignatureDate?: string;
}

export interface ComplianceCertificate {
  id: string;
  title: string;
  category: 'Regulatory' | 'BTRC Credential' | 'Business Registration' | 'Import/Export' | 'Supplier Quality' | 'Security';
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Under Audit' | 'Not Applicable';
  verificationLink?: string;
  documentUrl?: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  customerName: string;
  subject: string;
  category: 'Hardware Issue' | 'Network Speed' | 'Billing & Subscription' | 'Technician Visit' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved';
  messages: {
    sender: 'customer' | 'agent';
    senderName: string;
    timestamp: string;
    text: string;
  }[];
  createdAt: string;
}

export interface NetworkPlanRecommendation {
  summary: string;
  recommendedPackageName: string;
  recommendedTopology: string;
  estimatedHardwareList: { item: string; quantity: number; approxPriceBDT: number }[];
  estimatedHardwareCostBDT: number;
  estimatedInstallationCostBDT: number;
  estimatedTotalBDT: number;
  recommendedBackhaul: string;
  coverageHighlights: string[];
  technicalConsiderations: string[];
  monthlyServiceEstimateBDT: number;
  disclaimer: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}
