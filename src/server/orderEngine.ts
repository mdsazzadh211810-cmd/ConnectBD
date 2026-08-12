import { db } from './db.js';
import { UserDBRecord } from './db.js';
import { Order, CartItem, OrderStatus } from '../types.js';

interface CreateOrderInput {
  items: Array<{
    productId?: string;
    packageId?: string;
    quantity: number;
    includeInstallation?: boolean;
  }>;
  deliveryAddress: {
    district: string;
    thana: string;
    address: string;
    contactPhone: string;
  };
  paymentMethod: 'bKash/Nagad' | 'Bank Transfer' | 'Card' | 'Corporate Invoice';
  idempotencyKey?: string;
}

export function processServerOrder(
  user: UserDBRecord,
  input: CreateOrderInput
): { order: Order; job: any; isDuplicate?: boolean } {
  // Check Idempotency
  if (input.idempotencyKey) {
    const existing = db.getIdempotentResult(input.idempotencyKey);
    if (existing) {
      return { ...existing, isDuplicate: true };
    }
  }

  const resolvedCartItems: CartItem[] = [];
  let subtotalBDT = 0;
  let totalInstallationFeeBDT = 0;

  for (const rawItem of input.items) {
    if (rawItem.productId) {
      const prod = db.findProductById(rawItem.productId);
      if (!prod) {
        throw new Error(`Product with ID '${rawItem.productId}' was not found in catalog.`);
      }
      if (prod.stock < rawItem.quantity) {
        throw new Error(`Insufficient stock for '${prod.name}'. Requested: ${rawItem.quantity}, Available: ${prod.stock}`);
      }

      // Lock stock authoritatively
      db.updateProductStock(prod.id, rawItem.quantity);

      const itemSubtotal = prod.priceBDT * rawItem.quantity;
      subtotalBDT += itemSubtotal;

      const instFee = rawItem.includeInstallation ? 1500 * rawItem.quantity : 0;
      totalInstallationFeeBDT += instFee;

      resolvedCartItems.push({
        type: 'product',
        id: prod.id,
        item: prod,
        quantity: rawItem.quantity,
        includeInstallation: !!rawItem.includeInstallation
      });
    } else if (rawItem.packageId) {
      const pkg = db.findPackageById(rawItem.packageId);
      if (!pkg) {
        throw new Error(`Package with ID '${rawItem.packageId}' was not found in catalog.`);
      }

      const itemSubtotal = pkg.startingPriceBDT * rawItem.quantity;
      subtotalBDT += itemSubtotal;

      const instFee = rawItem.includeInstallation ? 3500 * rawItem.quantity : 0;
      totalInstallationFeeBDT += instFee;

      resolvedCartItems.push({
        type: 'package',
        id: pkg.id,
        item: pkg,
        quantity: rawItem.quantity,
        includeInstallation: !!rawItem.includeInstallation
      });
    }
  }

  // Location-based shipping estimation
  const isDhaka = input.deliveryAddress.district.toLowerCase().includes('dhaka');
  const shippingFeeBDT = isDhaka ? 500 : 1200;

  // 5% Government Tax/VAT
  const estimatedTaxBDT = Math.round(subtotalBDT * 0.05);

  const totalBDT = subtotalBDT + totalInstallationFeeBDT + shippingFeeBDT + estimatedTaxBDT;

  const orderId = `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const orderNumber = `CBD-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    organizationName: user.organization || 'Individual Customer',
    items: resolvedCartItems,
    subtotalBDT,
    installationFeeBDT: totalInstallationFeeBDT,
    estimatedTaxBDT,
    totalBDT,
    status: 'Pending',
    deliveryAddress: input.deliveryAddress,
    paymentStatus: 'Pending',
    paymentMethod: input.paymentMethod,
    createdAt: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    trackingSteps: [
      { title: 'Order Placed (Payment Pending)', date: 'Today', completed: true, current: true },
      { title: 'Payment Authorization & Verification', date: 'Pending', completed: false },
      { title: 'China Sourcing & Hardware Quality Inspection', date: 'Pending', completed: false },
      { title: 'Cross-Border Logistics & Customs Entry', date: 'Pending', completed: false },
      { title: 'Bangladesh Regional Dispatch', date: 'Pending', completed: false },
      { title: 'Field Technician Deployment & Network Sign-off', date: 'Pending', completed: false }
    ]
  };

  db.addOrder(newOrder);

  // Dispatch technician job draft
  const newJob = {
    id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    jobId: `CBD-JOB-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: newOrder.id,
    customerName: user.name,
    customerPhone: input.deliveryAddress.contactPhone || user.phone || '+880 1700-000000',
    organizationName: user.organization || 'Site Location',
    address: `${input.deliveryAddress.address}, ${input.deliveryAddress.thana}, ${input.deliveryAddress.district}`,
    district: input.deliveryAddress.district,
    serviceType: 'New Installation' as const,
    status: 'Assigned' as const,
    scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    requirements: [
      'Site physical inspection & RF spectrum scan',
      'Mount Access Points & Fiber ONU Gateway',
      'Conduct speed test & customer handoff sign-off'
    ],
    equipmentList: resolvedCartItems.map((ci) => ({
      sku: 'sku' in ci.item ? ci.item.sku : 'CBD-HARDWARE',
      name: ci.item.name,
      quantity: ci.quantity
    }))
  };

  db.addJob(newJob);

  const result = { order: newOrder, job: newJob };

  if (input.idempotencyKey) {
    db.saveIdempotentResult(input.idempotencyKey, result);
  }

  return result;
}

export function verifyAndConfirmPayment(orderId: string, paymentTransactionRef: string, user: UserDBRecord) {
  const order = db.findOrderById(orderId);
  if (!order) {
    throw new Error(`Order '${orderId}' not found.`);
  }

  order.paymentStatus = 'Paid';
  order.status = 'Paid';
  if (order.trackingSteps && order.trackingSteps.length > 1) {
    order.trackingSteps[0].completed = true;
    order.trackingSteps[0].current = false;
    order.trackingSteps[1].completed = true;
    order.trackingSteps[1].current = true;
    order.trackingSteps[1].title = `Payment Verified (Ref: ${paymentTransactionRef})`;
  }

  db.updateOrder(orderId, order);

  db.addAuditLog(
    user.email,
    user.role,
    'Payment Verified',
    `Payment ref '${paymentTransactionRef}' verified for Order ${order.orderNumber} (${order.totalBDT} BDT)`,
    '127.0.0.1'
  );

  return order;
}
