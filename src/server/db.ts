import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  UserProfile, 
  Product, 
  ConnectivityPackage, 
  QuoteRequest, 
  Order, 
  TechnicianJob, 
  ComplianceCertificate, 
  SupportTicket, 
  AuditLog 
} from '../types.js';
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
} from '../data/initialData.js';
import { 
  syncUserToCloud, 
  syncOrderToCloud, 
  syncQuoteToCloud, 
  syncTicketToCloud, 
  syncAuditLogToCloud, 
  syncAllInitialDataToCloud 
} from './firestore.js';

export interface UserDBRecord extends UserProfile {
  passwordHash: string;
  createdAt: string;
  verificationToken?: string;
  emailVerified?: boolean;
}

export interface StoredCertificate extends ComplianceCertificate {
  lifecycleStatus: 'Draft' | 'Uploaded' | 'Under Review' | 'Verified' | 'Published' | 'Expired';
  uploadedBy?: string;
  reviewedBy?: string;
}

interface DatabaseSchema {
  users: UserDBRecord[];
  products: Product[];
  packages: ConnectivityPackage[];
  quotes: QuoteRequest[];
  orders: Order[];
  technicianJobs: TechnicianJob[];
  certificates: StoredCertificate[];
  tickets: SupportTicket[];
  auditLogs: AuditLog[];
  processedIdempotencyKeys: Record<string, any>;
  passwordResetTokens: Record<string, { email: string; expiresAt: number }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'connectbd_db.json');

// Helper to seed password hashes
function seedInitialUsers(): UserDBRecord[] {
  const defaultSalt = bcrypt.genSaltSync(10);
  // Default passwords:
  // rafiq@abcedu.bd => "password123"
  // karim@ruraltech.bd => "password123"
  // tech.hasan@connectbd.com => "tech123"
  // ops@connectbd.com => "ops123"
  // admin@connectbd.com => "admin123"
  
  return INITIAL_USERS.map((u) => {
    let plainPassword = 'password123';
    if (u.role === 'admin') plainPassword = 'admin123';
    if (u.role === 'technician') plainPassword = 'tech123';
    if (u.role === 'operations') plainPassword = 'ops123';

    return {
      ...u,
      passwordHash: bcrypt.hashSync(plainPassword, defaultSalt),
      createdAt: new Date().toISOString(),
      emailVerified: true
    };
  });
}

function seedInitialCertificates(): StoredCertificate[] {
  return INITIAL_CERTIFICATES.map((c) => ({
    ...c,
    lifecycleStatus: (c.verificationStatus === 'Verified' ? 'Published' : 'Under Review') as any,
    uploadedBy: 'admin@connectbd.com'
  }));
}

class Database {
  private data!: DatabaseSchema;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Migration check for missing fields
        if (!this.data.processedIdempotencyKeys) this.data.processedIdempotencyKeys = {};
        if (!this.data.passwordResetTokens) this.data.passwordResetTokens = {};
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = seedInitialUsers();
        }
      } catch (err) {
        console.error('Failed to load database file, re-initializing...', err);
        this.seedNewDatabase();
      }
    } else {
      this.seedNewDatabase();
    }

    // Trigger initial cloud sync for customer & operational records
    syncAllInitialDataToCloud({
      users: this.data.users,
      orders: this.data.orders,
      quotes: this.data.quotes,
      tickets: this.data.tickets
    });
  }

  private seedNewDatabase() {
    this.data = {
      users: seedInitialUsers(),
      products: [...INITIAL_PRODUCTS],
      packages: [...INITIAL_PACKAGES],
      quotes: [...INITIAL_QUOTES],
      orders: [...INITIAL_ORDERS],
      technicianJobs: [...INITIAL_TECHNICIAN_JOBS],
      certificates: seedInitialCertificates(),
      tickets: [...INITIAL_SUPPORT_TICKETS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      processedIdempotencyKeys: {},
      passwordResetTokens: {}
    };
    this.save();
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  // --- Collections Getters ---
  public getUsers(): UserDBRecord[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): UserDBRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserDBRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public addUser(user: UserDBRecord) {
    this.data.users.unshift(user);
    this.save();
    syncUserToCloud(user);
  }

  public updateUser(id: string, updates: Partial<UserDBRecord>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      syncUserToCloud(this.data.users[idx]);
      return this.data.users[idx];
    }
    return undefined;
  }

  public getProducts(): Product[] {
    return this.data.products;
  }

  public findProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public addProduct(product: Product) {
    this.data.products.unshift(product);
    this.save();
  }

  public updateProduct(id: string, updates: Partial<Product>) {
    const p = this.findProductById(id);
    if (p) {
      Object.assign(p, updates);
      if (updates.stock !== undefined) {
        p.inStock = p.stock > 0;
      }
      this.save();
      return p;
    }
    return undefined;
  }

  public deleteProduct(id: string) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }


  public updateProductStock(id: string, quantityToDeduct: number): boolean {
    const p = this.findProductById(id);
    if (p) {
      if (p.stock >= quantityToDeduct) {
        p.stock -= quantityToDeduct;
        p.inStock = p.stock > 0;
        this.save();
        return true;
      }
    }
    return false;
  }

  public getPackages(): ConnectivityPackage[] {
    return this.data.packages;
  }

  public findPackageById(id: string): ConnectivityPackage | undefined {
    return this.data.packages.find((p) => p.id === id);
  }

  public getQuotes(): QuoteRequest[] {
    return this.data.quotes;
  }

  public addQuote(quote: QuoteRequest) {
    this.data.quotes.unshift(quote);
    this.save();
    syncQuoteToCloud(quote);
  }

  public getOrders(): Order[] {
    return this.data.orders;
  }

  public findOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public addOrder(order: Order) {
    this.data.orders.unshift(order);
    this.save();
    syncOrderToCloud(order);
  }

  public updateOrder(id: string, updates: Partial<Order>) {
    const idx = this.data.orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
      this.save();
      syncOrderToCloud(this.data.orders[idx]);
      return this.data.orders[idx];
    }
    return undefined;
  }

  public getTechnicianJobs(): TechnicianJob[] {
    return this.data.technicianJobs;
  }

  public findJobById(id: string): TechnicianJob | undefined {
    return this.data.technicianJobs.find((j) => j.id === id || j.jobId === id);
  }

  public addJob(job: TechnicianJob) {
    this.data.technicianJobs.unshift(job);
    this.save();
  }

  public updateJob(id: string, updates: Partial<TechnicianJob>) {
    const idx = this.data.technicianJobs.findIndex((j) => j.id === id || j.jobId === id);
    if (idx !== -1) {
      this.data.technicianJobs[idx] = { ...this.data.technicianJobs[idx], ...updates };
      this.save();
      return this.data.technicianJobs[idx];
    }
    return undefined;
  }

  public getCertificates(allForAdmin = false): StoredCertificate[] {
    if (allForAdmin) {
      return this.data.certificates;
    }
    // Public site only shows verified & published documents
    return this.data.certificates.filter(
      (c) => c.verificationStatus === 'Verified' && c.lifecycleStatus === 'Published'
    );
  }

  public addCertificate(cert: StoredCertificate) {
    this.data.certificates.unshift(cert);
    this.save();
  }

  public getTickets(): SupportTicket[] {
    return this.data.tickets;
  }

  public addTicket(ticket: SupportTicket) {
    this.data.tickets.unshift(ticket);
    this.save();
    syncTicketToCloud(ticket);
  }

  public addTicketMessage(ticketId: string, message: { sender: 'customer' | 'agent'; senderName: string; timestamp: string; text: string }) {
    const tkt = this.data.tickets.find((t) => t.id === ticketId);
    if (tkt) {
      tkt.messages.push(message);
      this.save();
      syncTicketToCloud(tkt);
      return tkt;
    }
    return undefined;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(actorEmail: string, role: any, action: string, details: string, ip: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userEmail: actorEmail,
      role: role,
      action: action,
      details: details,
      ipAddress: ip
    };
    this.data.auditLogs.unshift(log);
    this.save();
    syncAuditLogToCloud(log);
  }

  // Idempotency Keys
  public getIdempotentResult(key: string): any | undefined {
    return this.data.processedIdempotencyKeys[key];
  }

  public saveIdempotentResult(key: string, result: any) {
    this.data.processedIdempotencyKeys[key] = result;
    this.save();
  }

  // Password Reset Tokens
  public createPasswordResetToken(email: string): string {
    const token = `rst_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = Date.now() + 3600000; // 1 hour
    this.data.passwordResetTokens[token] = { email, expiresAt };
    this.save();
    return token;
  }

  public verifyPasswordResetToken(token: string): string | null {
    const record = this.data.passwordResetTokens[token];
    if (record && record.expiresAt > Date.now()) {
      return record.email;
    }
    return null;
  }

  public deletePasswordResetToken(token: string) {
    delete this.data.passwordResetTokens[token];
    this.save();
  }
}

export const db = new Database();
