import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { UserDBRecord } from './db.js';
import { Order, QuoteRequest, SupportTicket, Product, AuditLog } from '../types.js';

let firestoreDb: any = null;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (config.projectId && config.apiKey) {
      const app = getApps().length > 0 ? getApp() : initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
      firestoreDb = getFirestore(app, config.firestoreDatabaseId || '(default)');
      console.log('✅ Firestore Database Initialized for Cloud Data Persistence.');
    }
  }
} catch (err) {
  console.warn('Firestore initialization notice:', err);
}

export async function checkAdminRoleInFirestore(userId: string, email: string): Promise<boolean> {
  if (!firestoreDb) {
    console.warn('[Firestore Check] Database not initialized, falling back to local verification.');
    return true;
  }
  try {
    const cleanEmail = (email || '').toLowerCase().trim();

    // 1. Try fetching document by userId
    if (userId) {
      const userRef = doc(firestoreDb, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`[Firestore Admin Check] Checked userId (${userId}): role = ${data?.role}`);
        return data?.role === 'admin';
      }
    }

    // 2. Try fetching document by sanitized email doc ID
    const sanitizedEmailId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const emailRef = doc(firestoreDb, 'users', sanitizedEmailId);
    const emailSnap = await getDoc(emailRef);
    if (emailSnap.exists()) {
      const data = emailSnap.data();
      console.log(`[Firestore Admin Check] Checked email doc (${sanitizedEmailId}): role = ${data?.role}`);
      return data?.role === 'admin';
    }

    // 3. Fallback query by email property in 'users' collection
    const usersColl = collection(firestoreDb, 'users');
    const q = query(usersColl, where('email', '==', cleanEmail));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const docData = querySnap.docs[0].data();
      console.log(`[Firestore Admin Check] Queried email (${cleanEmail}): role = ${docData?.role}`);
      return docData?.role === 'admin';
    }

    console.warn(`[Firestore Admin Check] No user document found in Firestore for ${email}`);
    return false;
  } catch (err) {
    console.error('[Firestore Admin Check] Error querying Firestore user document:', err);
    return false;
  }
}

export async function syncUserToCloud(user: UserDBRecord) {
  if (!firestoreDb) return;
  try {
    const safeUser = { ...user };
    const userRef = doc(firestoreDb, 'users', user.id || user.email.replace(/[^a-zA-Z0-9]/g, '_'));
    await setDoc(userRef, safeUser, { merge: true });
    console.log(`[Cloud Database] User synced: ${user.email}`);
  } catch (err) {
    console.error('Cloud Database user sync error:', err);
  }
}

export async function syncOrderToCloud(order: Order) {
  if (!firestoreDb) return;
  try {
    const orderRef = doc(firestoreDb, 'orders', order.id);
    await setDoc(orderRef, order, { merge: true });
    console.log(`[Cloud Database] Order synced: ${order.id}`);
  } catch (err) {
    console.error('Cloud Database order sync error:', err);
  }
}

export async function syncQuoteToCloud(quote: QuoteRequest) {
  if (!firestoreDb) return;
  try {
    const quoteRef = doc(firestoreDb, 'quotes', quote.id);
    await setDoc(quoteRef, quote, { merge: true });
    console.log(`[Cloud Database] Quote synced: ${quote.id}`);
  } catch (err) {
    console.error('Cloud Database quote sync error:', err);
  }
}

export async function syncTicketToCloud(ticket: SupportTicket) {
  if (!firestoreDb) return;
  try {
    const ticketRef = doc(firestoreDb, 'tickets', ticket.id);
    await setDoc(ticketRef, ticket, { merge: true });
    console.log(`[Cloud Database] Ticket synced: ${ticket.id}`);
  } catch (err) {
    console.error('Cloud Database ticket sync error:', err);
  }
}

export async function syncAuditLogToCloud(log: AuditLog) {
  if (!firestoreDb) return;
  try {
    const logRef = doc(firestoreDb, 'auditLogs', log.id);
    await setDoc(logRef, log, { merge: true });
  } catch (err) {
    console.error('Cloud Database audit log sync error:', err);
  }
}

export async function syncAllInitialDataToCloud(data: {
  users: UserDBRecord[];
  orders: Order[];
  quotes: QuoteRequest[];
  tickets: SupportTicket[];
}) {
  if (!firestoreDb) return;
  try {
    for (const u of data.users) {
      await syncUserToCloud(u);
    }
    for (const o of data.orders) {
      await syncOrderToCloud(o);
    }
    for (const q of data.quotes) {
      await syncQuoteToCloud(q);
    }
    for (const t of data.tickets) {
      await syncTicketToCloud(t);
    }
    console.log('✅ Initial Customer & Operational Data seeded to Firestore Cloud Storage.');
  } catch (err) {
    console.error('Cloud Database bulk sync error:', err);
  }
}
