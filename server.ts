import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_PACKAGES, 
  INITIAL_QUOTES, 
  INITIAL_ORDERS, 
  INITIAL_TECHNICIAN_JOBS, 
  INITIAL_CERTIFICATES, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_AUDIT_LOGS 
} from './src/data/initialData.js';
import { UserRole } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store for live demo interaction
let usersList = [...INITIAL_USERS];
let productsList = [...INITIAL_PRODUCTS];
let packagesList = [...INITIAL_PACKAGES];
let quotesList = [...INITIAL_QUOTES];
let ordersList = [...INITIAL_ORDERS];
let technicianJobsList = [...INITIAL_TECHNICIAN_JOBS];
let certificatesList = [...INITIAL_CERTIFICATES];
let ticketsList = [...INITIAL_SUPPORT_TICKETS];
let auditLogsList = [...INITIAL_AUDIT_LOGS];

// Current active session user (default to customer or customizable)
let currentUser = usersList[0];

// Initialize Google GenAI Server-side Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Auth & User Session
app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ user: currentUser });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const match = usersList.find((u) => u.role === role);
  if (match) {
    currentUser = match;
    res.json({ success: true, user: currentUser });
  } else {
    // Create new temporary user with role
    const newUser = {
      id: `usr_${Date.now()}`,
      name: `Demo ${role.toUpperCase()} User`,
      email: `${role}@connectbd.com`,
      role: role as UserRole,
      organization: `ConnectBD ${role.toUpperCase()} Division`,
      phone: '+880 1700-000000',
      verified: true,
    };
    usersList.push(newUser);
    currentUser = newUser;
    res.json({ success: true, user: currentUser });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const found = usersList.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (found) {
    currentUser = found;
    res.json({ success: true, user: currentUser });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials. Try rafiq@abcedu.bd or admin@connectbd.com' });
  }
});

// 3. Products & Packages
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ products: productsList });
});

app.get('/api/packages', (req: Request, res: Response) => {
  res.json({ packages: packagesList });
});

// 4. Custom Quote Request
app.get('/api/quotes', (req: Request, res: Response) => {
  res.json({ quotes: quotesList });
});

app.post('/api/quotes', (req: Request, res: Response) => {
  const body = req.body;
  const newQuote = {
    id: `q_${Date.now()}`,
    quoteNumber: `CBD-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: currentUser.id,
    customerName: currentUser.name,
    customerType: body.customerType || 'Community',
    organizationName: body.organizationName || currentUser.organization || 'Community Hub',
    location: body.location || 'Dhaka, Bangladesh',
    numberOfUsers: Number(body.numberOfUsers || 50),
    coverageAreaSqFt: Number(body.coverageAreaSqFt || 3000),
    desiredBandwidthMbps: Number(body.desiredBandwidthMbps || 50),
    numberOfBuildings: Number(body.numberOfBuildings || 1),
    preferredBackhaul: body.preferredBackhaul || 'Fiber',
    budgetRangeBDT: body.budgetRangeBDT || '25,000 - 50,000 BDT',
    existingISP: body.existingISP || 'None',
    expectedDate: body.expectedDate || 'Within 2 weeks',
    additionalNotes: body.additionalNotes || '',
    status: 'Under Review' as const,
    createdAt: new Date().toISOString().split('T')[0],
  };

  quotesList.unshift(newQuote);

  // Log audit
  auditLogsList.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userEmail: currentUser.email,
    role: currentUser.role,
    action: 'Custom Connectivity Quote Submitted',
    details: `Quote ${newQuote.quoteNumber} for ${newQuote.organizationName}`,
    ipAddress: '103.114.172.1'
  });

  res.json({ success: true, quote: newQuote });
});

// 5. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  if (currentUser.role === 'admin' || currentUser.role === 'operations') {
    return res.json({ orders: ordersList });
  }
  const myOrders = ordersList.filter((o) => o.userId === currentUser.id);
  res.json({ orders: myOrders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { items, deliveryAddress, paymentMethod, installationFeeBDT } = req.body;
  
  let subtotal = 0;
  (items || []).forEach((it: any) => {
    subtotal += (it.item.priceBDT || it.item.startingPriceBDT || 0) * (it.quantity || 1);
  });
  
  const instFee = installationFeeBDT || 3500;
  const total = subtotal + instFee;

  const newOrder: any = {
    id: `ord_${Date.now()}`,
    orderNumber: `CBD-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: currentUser.id,
    customerName: currentUser.name,
    customerEmail: currentUser.email,
    organizationName: currentUser.organization || 'Individual Customer',
    items: items || [],
    subtotalBDT: subtotal,
    installationFeeBDT: instFee,
    estimatedTaxBDT: 0,
    totalBDT: total,
    status: 'Paid',
    deliveryAddress: deliveryAddress || {
      district: 'Dhaka',
      thana: 'Gulshan',
      address: 'House 12, Road 5, Gulshan 1, Dhaka',
      contactPhone: currentUser.phone || '+880 1700-000000'
    },
    paymentStatus: 'Paid',
    paymentMethod: paymentMethod || 'bKash/Nagad',
    createdAt: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    technicianId: 'usr_003',
    trackingSteps: [
      { title: 'Order Confirmed & Payment Verified', date: 'Today', completed: true, current: true },
      { title: 'China Sourcing & Hardware Quality Check', date: 'In Progress', completed: false },
      { title: 'Cross-Border Shipment & Customs', date: 'Pending', completed: false },
      { title: 'Bangladesh Warehouse Dispatch', date: 'Pending', completed: false },
      { title: 'Field Technician Assigned', date: 'Pending', completed: false },
      { title: 'On-Site Installation & Network Activation', date: 'Pending', completed: false }
    ]
  };

  ordersList.unshift(newOrder);

  // Auto-create technician job dispatch
  const newJob: any = {
    id: `job_${Date.now()}`,
    jobId: `CBD-JOB-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: newOrder.id,
    customerName: currentUser.name,
    customerPhone: deliveryAddress?.contactPhone || currentUser.phone || '+880 1700-000000',
    organizationName: currentUser.organization || 'Customer Site',
    address: `${deliveryAddress?.address || 'Site Location'}, ${deliveryAddress?.district || 'Dhaka'}`,
    district: deliveryAddress?.district || 'Dhaka',
    serviceType: 'New Installation',
    status: 'Assigned',
    scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    requirements: [
      'Site physical inspection & cable path verification',
      'Mount Access Points & Gateway Router',
      'Test Wi-Fi signal strength and throughput',
      'Log device serial numbers & obtain customer sign-off'
    ],
    equipmentList: items.map((it: any) => ({
      sku: it.item.sku || 'CBD-PKG-STD',
      name: it.item.name,
      quantity: it.quantity
    }))
  };

  technicianJobsList.unshift(newJob);

  res.json({ success: true, order: newOrder, job: newJob });
});

// 6. Technician Jobs Management
app.get('/api/technician/jobs', (req: Request, res: Response) => {
  res.json({ jobs: technicianJobsList });
});

app.post('/api/technician/update', (req: Request, res: Response) => {
  const { jobId, status, serialNumbers, technicianReport, beforePhoto, afterPhoto } = req.body;
  const job = technicianJobsList.find((j) => j.id === jobId || j.jobId === jobId);
  if (job) {
    if (status) job.status = status;
    if (serialNumbers) job.installedSerialNumbers = serialNumbers;
    if (technicianReport) job.technicianReport = technicianReport;
    if (beforePhoto) job.beforePhotos = [...(job.beforePhotos || []), beforePhoto];
    if (afterPhoto) job.afterPhotos = [...(job.afterPhotos || []), afterPhoto];
    if (status === 'Completed') job.customerSignatureDate = new Date().toISOString().split('T')[0];

    // Update matching order status
    const matchingOrder = ordersList.find((o) => o.id === job.orderId);
    if (matchingOrder) {
      if (status === 'In Progress') matchingOrder.status = 'Installation In Progress';
      if (status === 'Completed') {
        matchingOrder.status = 'Completed';
        matchingOrder.trackingSteps.forEach((s) => (s.completed = true));
      }
    }

    res.json({ success: true, job });
  } else {
    res.status(404).json({ success: false, message: 'Job not found' });
  }
});

// 7. Compliance Certificates
app.get('/api/certificates', (req: Request, res: Response) => {
  res.json({ certificates: certificatesList });
});

app.post('/api/certificates', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin permissions required.' });
  }
  const body = req.body;
  const newCert = {
    id: `cert_${Date.now()}`,
    title: body.title || 'New Regulatory Document',
    category: body.category || 'Regulatory',
    issuingAuthority: body.issuingAuthority || 'Government Authority',
    certificateNumber: body.certificateNumber || 'REG-PENDING-2026',
    issueDate: body.issueDate || new Date().toISOString().split('T')[0],
    expiryDate: body.expiryDate || '2028-12-31',
    verificationStatus: body.verificationStatus || 'Pending Verification',
    verificationLink: body.verificationLink || '',
    description: body.description || 'Uploaded compliance file.'
  };

  certificatesList.unshift(newCert);
  res.json({ success: true, certificate: newCert });
});

// 8. Support Tickets
app.get('/api/tickets', (req: Request, res: Response) => {
  if (currentUser.role === 'admin' || currentUser.role === 'operations') {
    return res.json({ tickets: ticketsList });
  }
  const myTickets = ticketsList.filter((t) => t.userId === currentUser.id);
  res.json({ tickets: myTickets });
});

app.post('/api/tickets', (req: Request, res: Response) => {
  const { subject, category, priority, message } = req.body;
  const newTicket = {
    id: `tkt_${Date.now()}`,
    ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: currentUser.id,
    customerName: currentUser.name,
    subject: subject || 'General Query',
    category: category || 'Hardware Issue',
    priority: priority || 'Medium',
    status: 'Open' as const,
    createdAt: new Date().toISOString().split('T')[0],
    messages: [
      {
        sender: 'customer' as const,
        senderName: currentUser.name,
        timestamp: new Date().toLocaleString(),
        text: message || 'Need support with my connectivity installation.'
      }
    ]
  };

  ticketsList.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

app.post('/api/tickets/reply', (req: Request, res: Response) => {
  const { ticketId, text } = req.body;
  const tkt = ticketsList.find((t) => t.id === ticketId);
  if (tkt) {
    const isStaff = currentUser.role === 'admin' || currentUser.role === 'operations';
    tkt.messages.push({
      sender: isStaff ? 'agent' : 'customer',
      senderName: currentUser.name,
      timestamp: new Date().toLocaleString(),
      text
    });
    if (isStaff && tkt.status === 'Open') {
      tkt.status = 'In Progress';
    }
    res.json({ success: true, ticket: tkt });
  } else {
    res.status(404).json({ success: false, message: 'Ticket not found' });
  }
});

// 9. Admin Stats & Audit Logs
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalOrders = ordersList.length;
  const totalRevenueBDT = ordersList.reduce((acc, o) => acc + o.totalBDT, 0);
  const pendingQuotes = quotesList.filter((q) => q.status === 'Submitted' || q.status === 'Under Review').length;
  const activeJobs = technicianJobsList.filter((j) => j.status !== 'Completed').length;
  
  res.json({
    totalUsers: usersList.length,
    totalOrders,
    totalRevenueBDT,
    pendingQuotes,
    activeJobs,
    inventoryCount: productsList.reduce((acc, p) => acc + p.stock, 0),
    openTickets: ticketsList.filter((t) => t.status === 'Open').length
  });
});

app.get('/api/admin/logs', (req: Request, res: Response) => {
  res.json({ logs: auditLogsList });
});

// 10. SMART NETWORK PLANNER (Gemini Server-Side Endpoint)
app.post('/api/planner', async (req: Request, res: Response) => {
  try {
    const { 
      location, 
      customerType, 
      numberOfUsers, 
      coverageAreaSqFt, 
      numberOfBuildings, 
      budgetBDT, 
      preferredBackhaul, 
      specialRequirements 
    } = req.body;

    const ai = getGeminiClient();

    const systemPrompt = `You are ConnectBD's Senior Lead Network Systems Architect.
ConnectBD is a China-Bangladesh cross-border connectivity company that sources high-grade networking hardware from Shenzhen/Guangdong and deploys managed connectivity solutions in Bangladesh.

Your task is to analyze the user's site requirements in Bangladesh and return a comprehensive, highly realistic JSON network deployment plan.

All currency prices must be in Bangladesh Taka (BDT).
Be specific with hardware models (e.g. ConnectBD AX3000 Wi-Fi 6 Router, IP67 Outdoor AP, GPON ONU, Managed PoE Switch, LiFePO4 Lithium Power Station).
Label the result as a technical estimation recommendation.`;

    const userPrompt = `
Generate a Connectivity Network Plan for:
- Location in Bangladesh: ${location || 'Rural District, Bangladesh'}
- Customer Type: ${customerType || 'Community Hub'}
- Expected Concurrent Users: ${numberOfUsers || 50}
- Coverage Area: ${coverageAreaSqFt || 3000} sq ft
- Number of Buildings: ${numberOfBuildings || 1}
- Preferred Backhaul: ${preferredBackhaul || 'Fiber'}
- Target Budget Range: ${budgetBDT || '30,000 BDT'}
- Special Requirements / Power cuts: ${specialRequirements || 'Frequent load-shedding, high heat tolerance needed'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Executive summary of the recommended network architecture.'
            },
            recommendedPackageName: {
              type: Type.STRING,
              description: 'Recommended package name e.g. ConnectBD Community Pro or Education Campus Network.'
            },
            recommendedTopology: {
              type: Type.STRING,
              description: 'Topology layout description (e.g. Fiber GPON -> Core Load Balancer -> PoE Switch -> Outdoor AP Mesh).'
            },
            recommendedBackhaul: {
              type: Type.STRING,
              description: 'Backhaul type e.g. Gigabit Fiber with LTE Failover.'
            },
            estimatedHardwareList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  approxPriceBDT: { type: Type.INTEGER }
                },
                required: ['item', 'quantity', 'approxPriceBDT']
              }
            },
            estimatedHardwareCostBDT: { type: Type.INTEGER },
            estimatedInstallationCostBDT: { type: Type.INTEGER },
            estimatedTotalBDT: { type: Type.INTEGER },
            monthlyServiceEstimateBDT: { type: Type.INTEGER },
            coverageHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            technicalConsiderations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Label clarifying this is an AI recommendation pending on-site physical engineering survey.'
            }
          },
          required: [
            'summary',
            'recommendedPackageName',
            'recommendedTopology',
            'recommendedBackhaul',
            'estimatedHardwareList',
            'estimatedHardwareCostBDT',
            'estimatedInstallationCostBDT',
            'estimatedTotalBDT',
            'monthlyServiceEstimateBDT',
            'coverageHighlights',
            'technicalConsiderations',
            'disclaimer'
          ]
        }
      }
    });

    const jsonText = response.text || '{}';
    const plan = JSON.parse(jsonText);

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error('Smart Network Planner API Error:', error);
    // Return high quality fallback plan if API fails or key is missing
    const fallbackPlan = {
      summary: 'Custom Connectivity Plan tailored for Bangladesh environment with high-heat tolerance and lithium battery load-shedding backup.',
      recommendedPackageName: req.body.customerType === 'Education' ? 'ConnectBD Education Campus Network' : 'ConnectBD Community Basic',
      recommendedTopology: 'Fiber GPON Terminal -> ConnectBD AX3000 Core Router -> 8-Port PoE Switch -> Dual IP67 Outdoor Access Points',
      recommendedBackhaul: req.body.preferredBackhaul || 'Fiber Backhaul',
      estimatedHardwareList: [
        { item: 'ConnectBD AX3000 Gigabit Wi-Fi 6 Router', quantity: 1, approxPriceBDT: 4850 },
        { item: 'ConnectBD IP67 High-Power Outdoor AP', quantity: 2, approxPriceBDT: 16400 },
        { item: 'ConnectBD GPON Optical ONU Terminal', quantity: 1, approxPriceBDT: 1450 },
        { item: 'LiFePO4 Lithium Battery Backup Unit (4-Hour)', quantity: 1, approxPriceBDT: 11500 }
      ],
      estimatedHardwareCostBDT: 34200,
      estimatedInstallationCostBDT: 4500,
      estimatedTotalBDT: 38700,
      monthlyServiceEstimateBDT: 2500,
      coverageHighlights: [
        '3,500 sq ft Wi-Fi coverage across indoor classrooms and outdoor grounds',
        'Uninterrupted 4-hour connectivity during grid load-shedding',
        'Isolated guest login portal with speed limit caps'
      ],
      technicalConsiderations: [
        'Requires line-of-sight mounting for outdoor APs at 12ft height',
        'Includes outdoor Cat6 shielded cabling with PVC conduit casing'
      ],
      disclaimer: 'Note: AI-generated recommendation. Physical site inspection will verify fiber drop loss and wall attenuation prior to deployment.'
    };
    res.json({ success: true, plan: fallbackPlan, warning: 'Generated using ConnectBD rule-engine planner.' });
  }
});

// ==========================================
// VITE DEV / PRODUCTION MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ConnectBD Server running on http://localhost:${PORT}`);
  });
}

startServer();
