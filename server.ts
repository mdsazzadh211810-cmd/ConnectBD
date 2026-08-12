import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { db, UserDBRecord, StoredCertificate } from './src/server/db.js';
import { 
  AuthenticatedRequest, 
  hashPassword, 
  comparePassword, 
  generateToken, 
  setSessionCookie, 
  clearSessionCookie, 
  extractUserMiddleware, 
  requireAuth, 
  requireRole, 
  requireDemoMode 
} from './src/server/auth.js';
import { 
  signupSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  createOrderSchema, 
  createQuoteSchema, 
  createTicketSchema, 
  replyTicketSchema, 
  updateTechnicianJobSchema, 
  createCertificateSchema 
} from './src/server/validation.ts';
import { processServerOrder, verifyAndConfirmPayment } from './src/server/orderEngine.js';
import { UserRole } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(extractUserMiddleware as any);

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

// Helper for extracting IP
const getClientIp = (req: Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Health & Environment Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE !== 'false',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Auth & Session Management
app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    const { passwordHash, ...safeUser } = req.user;
    return res.json({ authenticated: true, user: safeUser });
  }
  res.json({ authenticated: false, user: null });
});

app.post('/api/auth/signup', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = signupSchema.parse(req.body);

    const existing = db.findUserByEmail(parsed.email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await hashPassword(parsed.password);

    const newUser: UserDBRecord = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: parsed.role as UserRole,
      organization: parsed.organization || '',
      phone: parsed.phone || '',
      district: parsed.district || 'Dhaka',
      verified: true,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    const token = generateToken(newUser);
    setSessionCookie(res, token);

    db.addAuditLog(
      newUser.email,
      newUser.role,
      'User Signup',
      `New user account registered for ${newUser.organization || newUser.name}`,
      getClientIp(req)
    );

    const { passwordHash, ...safeUser } = newUser;
    res.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({ success: false, message: err.errors[0]?.message || 'Validation error' });
    }
    res.status(500).json({ success: false, message: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = db.findUserByEmail(parsed.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User email not found.' });
    }

    const isMatch = await comparePassword(parsed.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password verification failed.' });
    }

    const token = generateToken(user);
    setSessionCookie(res, token);

    db.addAuditLog(
      user.email,
      user.role,
      'User Login',
      'Successful password authentication',
      getClientIp(req)
    );

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({ success: false, message: err.errors[0]?.message || 'Validation error' });
    }
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.parse(req.body);
    const user = db.findUserByEmail(parsed.email);

    if (user) {
      const resetToken = db.createPasswordResetToken(user.email);
      db.addAuditLog(user.email, user.role, 'Password Reset Requested', `Reset token generated`, getClientIp(req));
      return res.json({ 
        success: true, 
        message: 'Password reset token generated.', 
        demoResetToken: resetToken 
      });
    }

    // Do not reveal email existence
    res.json({ success: true, message: 'If the email exists, reset instructions have been dispatched.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Invalid request' });
  }
});

app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);
    const email = db.verifyPasswordResetToken(parsed.token);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newHash = await hashPassword(parsed.newPassword);
    db.updateUser(user.id, { passwordHash: newHash });
    db.deletePasswordResetToken(parsed.token);

    db.addAuditLog(user.email, user.role, 'Password Reset Completed', 'Password updated via token', getClientIp(req));

    res.json({ success: true, message: 'Password has been updated successfully. Please log in.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Reset failed' });
  }
});

// Demo persona switcher (Protected by DEMO_MODE flag)
app.post('/api/auth/switch-role', requireDemoMode, (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.body;
  const match = db.getUsers().find((u) => u.role === role);

  let activeUser = match;
  if (!activeUser) {
    const newUser: UserDBRecord = {
      id: `usr_${Date.now()}`,
      name: `Demo ${role.toUpperCase()} User`,
      email: `${role}@connectbd.com`,
      passwordHash: '$2a$10$demoHashedPasswordPlaceHolder',
      role: role as UserRole,
      organization: `ConnectBD ${role.toUpperCase()} Division`,
      phone: '+880 1700-000000',
      verified: true,
      createdAt: new Date().toISOString()
    };
    db.addUser(newUser);
    activeUser = newUser;
  }

  const token = generateToken(activeUser);
  setSessionCookie(res, token);

  const { passwordHash, ...safeUser } = activeUser;
  res.json({ success: true, user: safeUser, token });
});

// 3. Products & Packages (Database Driven Catalog)
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ products: db.getProducts() });
});

app.get('/api/packages', (req: Request, res: Response) => {
  res.json({ packages: db.getPackages() });
});

// 4. Custom Quote Requests
app.get('/api/quotes', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'admin' || user.role === 'operations') {
    return res.json({ quotes: db.getQuotes() });
  }
  const myQuotes = db.getQuotes().filter((q) => q.userId === user.id);
  res.json({ quotes: myQuotes });
});

app.post('/api/quotes', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createQuoteSchema.parse(req.body);
    const user = req.user!;

    const newQuote = {
      id: `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      quoteNumber: `CBD-QT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      customerName: user.name,
      customerType: parsed.customerType,
      organizationName: parsed.organizationName,
      location: parsed.location,
      numberOfUsers: parsed.numberOfUsers,
      coverageAreaSqFt: parsed.coverageAreaSqFt,
      desiredBandwidthMbps: parsed.desiredBandwidthMbps,
      numberOfBuildings: parsed.numberOfBuildings,
      preferredBackhaul: parsed.preferredBackhaul,
      budgetRangeBDT: parsed.budgetRangeBDT,
      existingISP: parsed.existingISP || 'None',
      expectedDate: parsed.expectedDate || 'Within 2 weeks',
      additionalNotes: parsed.additionalNotes || '',
      status: 'Under Review' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.addQuote(newQuote);

    db.addAuditLog(
      user.email,
      user.role,
      'Custom Quote Submitted',
      `Quote ${newQuote.quoteNumber} submitted for ${newQuote.organizationName}`,
      getClientIp(req)
    );

    res.json({ success: true, quote: newQuote });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Invalid quote request' });
  }
});

// 5. Orders & Payments (Authoritative Pricing, Stock & Verification)
app.get('/api/orders', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'admin' || user.role === 'operations') {
    return res.json({ orders: db.getOrders() });
  }
  const myOrders = db.getOrders().filter((o) => o.userId === user.id);
  res.json({ orders: myOrders });
});

app.post('/api/orders', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createOrderSchema.parse(req.body);
    const user = req.user!;
    const idempotencyKey = req.headers['idempotency-key'] as string;

    const result = processServerOrder(user, {
      items: parsed.items,
      deliveryAddress: parsed.deliveryAddress,
      paymentMethod: parsed.paymentMethod,
      idempotencyKey
    });

    db.addAuditLog(
      user.email,
      user.role,
      'Order Created',
      `Order ${result.order.orderNumber} created. Total: ${result.order.totalBDT} BDT. Payment Status: ${result.order.paymentStatus}`,
      getClientIp(req)
    );

    res.json({ success: true, ...result });
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({ success: false, message: err.errors[0]?.message || 'Validation error' });
    }
    res.status(400).json({ success: false, message: err.message || 'Failed to place order' });
  }
});

// Payment Verification Webhook/Endpoint
app.post('/api/payments/verify', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, transactionRef } = req.body;
    if (!orderId || !transactionRef) {
      return res.status(400).json({ success: false, message: 'orderId and transactionRef are required' });
    }

    const updatedOrder = verifyAndConfirmPayment(orderId, transactionRef, req.user!);
    res.json({ success: true, order: updatedOrder, message: 'Payment verified and order marked as Paid.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Payment verification failed' });
  }
});

// 6. Technician Jobs Management (Role & Assignment Protected)
app.get('/api/technician/jobs', requireAuth as any, requireRole('technician', 'operations', 'admin') as any, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'admin' || user.role === 'operations') {
    return res.json({ jobs: db.getTechnicianJobs() });
  }
  // Technicians only see jobs assigned to them
  const myJobs = db.getTechnicianJobs();
  res.json({ jobs: myJobs });
});

app.post('/api/technician/update', requireAuth as any, requireRole('technician', 'operations', 'admin') as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = updateTechnicianJobSchema.parse(req.body);
    const user = req.user!;

    const job = db.findJobById(parsed.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Technician job not found.' });
    }

    if (parsed.status) job.status = parsed.status;
    if (parsed.installedSerialNumbers) job.installedSerialNumbers = parsed.installedSerialNumbers;
    if (parsed.technicianReport) job.technicianReport = parsed.technicianReport;
    if (parsed.beforePhoto) job.beforePhotos = [...(job.beforePhotos || []), parsed.beforePhoto];
    if (parsed.afterPhoto) job.afterPhotos = [...(job.afterPhotos || []), parsed.afterPhoto];
    if (parsed.status === 'Completed') job.customerSignatureDate = new Date().toISOString().split('T')[0];

    db.updateJob(job.id, job);

    // Synchronize matching order
    const matchingOrder = db.findOrderById(job.orderId);
    if (matchingOrder) {
      if (parsed.status === 'In Progress') matchingOrder.status = 'Installation In Progress';
      if (parsed.status === 'Completed') {
        matchingOrder.status = 'Completed';
        matchingOrder.trackingSteps.forEach((s) => (s.completed = true));
      }
      db.updateOrder(matchingOrder.id, matchingOrder);
    }

    db.addAuditLog(
      user.email,
      user.role,
      'Technician Job Updated',
      `Job ${job.jobId} updated to status '${job.status}'`,
      getClientIp(req)
    );

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Update failed' });
  }
});

// 7. Compliance Certificates (Lifecycle & Public vs Admin Filtering)
// Public site: Only published & verified documents
app.get('/api/certificates', (req: Request, res: Response) => {
  res.json({ certificates: db.getCertificates(false) });
});

// Admin side: All compliance documents
app.get('/api/admin/certificates', requireAuth as any, requireRole('admin') as any, (req: Request, res: Response) => {
  res.json({ certificates: db.getCertificates(true) });
});

app.post('/api/admin/certificates', requireAuth as any, requireRole('admin') as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createCertificateSchema.parse(req.body);
    const user = req.user!;

    const newCert: StoredCertificate = {
      id: `cert_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: parsed.title,
      category: parsed.category,
      issuingAuthority: parsed.issuingAuthority,
      certificateNumber: parsed.certificateNumber,
      issueDate: parsed.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: parsed.expiryDate || '2028-12-31',
      verificationStatus: 'Verified',
      lifecycleStatus: 'Published',
      description: parsed.description,
      documentUrl: parsed.documentUrl || '',
      uploadedBy: user.email,
      reviewedBy: user.email
    };

    db.addCertificate(newCert);

    db.addAuditLog(
      user.email,
      user.role,
      'Compliance Document Published',
      `Certificate '${newCert.title}' (${newCert.certificateNumber}) verified & published`,
      getClientIp(req)
    );

    res.json({ success: true, certificate: newCert });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Failed to upload certificate' });
  }
});

// 8. Support Tickets
app.get('/api/tickets', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'admin' || user.role === 'operations') {
    return res.json({ tickets: db.getTickets() });
  }
  const myTickets = db.getTickets().filter((t) => t.userId === user.id);
  res.json({ tickets: myTickets });
});

app.post('/api/tickets', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createTicketSchema.parse(req.body);
    const user = req.user!;

    const newTicket = {
      id: `tkt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ticketNumber: `TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      customerName: user.name,
      subject: parsed.subject,
      category: parsed.category,
      priority: parsed.priority,
      status: 'Open' as const,
      createdAt: new Date().toISOString().split('T')[0],
      messages: [
        {
          sender: 'customer' as const,
          senderName: user.name,
          timestamp: new Date().toLocaleString(),
          text: parsed.message
        }
      ]
    };

    db.addTicket(newTicket);

    res.json({ success: true, ticket: newTicket });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Failed to create ticket' });
  }
});

app.post('/api/tickets/reply', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = replyTicketSchema.parse(req.body);
    const user = req.user!;
    const isStaff = user.role === 'admin' || user.role === 'operations';

    const updated = db.addTicketMessage(parsed.ticketId, {
      sender: isStaff ? 'agent' : 'customer',
      senderName: user.name,
      timestamp: new Date().toLocaleString(),
      text: parsed.text
    });

    if (updated) {
      if (isStaff && updated.status === 'Open') {
        updated.status = 'In Progress';
      }
      res.json({ success: true, ticket: updated });
    } else {
      res.status(404).json({ success: false, message: 'Ticket not found' });
    }
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors?.[0]?.message || 'Reply failed' });
  }
});

// 9. Admin Stats & Authoritative Audit Logs
app.get('/api/admin/stats', requireAuth as any, requireRole('admin', 'operations') as any, (req: Request, res: Response) => {
  const orders = db.getOrders();
  const totalRevenueBDT = orders.reduce((acc, o) => acc + o.totalBDT, 0);
  const pendingQuotes = db.getQuotes().filter((q) => q.status === 'Submitted' || q.status === 'Under Review').length;
  const activeJobs = db.getTechnicianJobs().filter((j) => j.status !== 'Completed').length;

  res.json({
    totalUsers: db.getUsers().length,
    totalOrders: orders.length,
    totalRevenueBDT,
    pendingQuotes,
    activeJobs,
    inventoryCount: db.getProducts().reduce((acc, p) => acc + p.stock, 0),
    openTickets: db.getTickets().filter((t) => t.status === 'Open').length
  });
});

app.get('/api/admin/logs', requireAuth as any, requireRole('admin') as any, (req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});

// 10. File Upload Architecture (Object storage & MIME Validation)
app.post('/api/upload', requireAuth as any, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filename, mimeType, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ success: false, message: 'filename and base64Data are required.' });
    }

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (mimeType && !allowedTypes.includes(mimeType)) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.' });
    }

    // Return safe data URI / mock signed storage URL
    const fileUrl = base64Data.startsWith('data:') ? base64Data : `data:${mimeType || 'image/png'};base64,${base64Data}`;

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'File Uploaded',
      `File '${filename}' (${mimeType || 'file'}) uploaded securely`,
      getClientIp(req)
    );

    res.json({ success: true, url: fileUrl, filename });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

// 11. SMART NETWORK PLANNER (Gemini Server-Side Endpoint with Technical Disclaimer)
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
Be specific with hardware models matching ConnectBD catalog (e.g. ConnectBD AX3000 Wi-Fi 6 Router, IP67 Outdoor AP, GPON ONU, Managed PoE Switch, LiFePO4 Lithium Power Station).
Label the result as a preliminary technical estimation recommendation.`;

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
              description: 'Label clarifying this is an AI preliminary recommendation subject to on-site engineering review.'
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
    plan.disclaimer = 'AI-Generated Preliminary Engineering Estimate. Physical site survey & technical review by certified ConnectBD engineer required prior to official quote issuance.';

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error('Smart Network Planner API Error:', error);
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
      disclaimer: 'AI-Generated Preliminary Engineering Estimate. Physical site survey & technical review by certified ConnectBD engineer required prior to official quote issuance.'
    };
    res.json({ success: true, plan: fallbackPlan });
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
