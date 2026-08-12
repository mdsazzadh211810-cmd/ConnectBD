import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { SolutionsPage } from './components/SolutionsPage';
import { PackagesPage } from './components/PackagesPage';
import { ProductsPage } from './components/ProductsPage';
import { ServicesPage } from './components/ServicesPage';
import { SmartNetworkPlanner } from './components/SmartNetworkPlanner';
import { SupplyChainPage } from './components/SupplyChainPage';
import { ComplianceCenter } from './components/ComplianceCenter';
import { CommunityImpactPage } from './components/CommunityImpactPage';
import { SupportCenter } from './components/SupportCenter';
import { AboutUs } from './components/AboutUs';
import { HowItWorks } from './components/HowItWorks';
import { BusinessModelPage } from './components/BusinessModelPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { QuoteModal } from './components/QuoteModal';
import { AuthModal } from './components/AuthModal';
import { LandingPortal } from './components/LandingPortal';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';

import { 
  UserProfile, 
  UserRole, 
  CartItem, 
  Product, 
  ConnectivityPackage, 
  Order, 
  QuoteRequest, 
  TechnicianJob, 
  ComplianceCertificate, 
  SupportTicket, 
  AuditLog 
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_PACKAGES, 
  INITIAL_ORDERS, 
  INITIAL_QUOTES, 
  INITIAL_TECHNICIAN_JOBS, 
  INITIAL_CERTIFICATES, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_AUDIT_LOGS 
} from './data/initialData';

export default function App() {
  // Gateway Portal Initial Landing Page
  const [showGatewayPortal, setShowGatewayPortal] = useState<boolean>(true);

  // Navigation & User State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  // E-Commerce & Core Business States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [packages, setPackages] = useState<ConnectivityPackage[]>(INITIAL_PACKAGES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const [technicianJobs, setTechnicianJobs] = useState<TechnicianJob[]>(INITIAL_TECHNICIAN_JOBS);
  const [certificates, setCertificates] = useState<ComplianceCertificate[]>(INITIAL_CERTIFICATES);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch Session & Database State on Mount
  useEffect(() => {
    fetchSession();
    fetchBackendData();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        if (data.user.role !== 'admin' && activeTab === 'admin-dashboard') {
          setActiveTab('home');
        }
      }
    } catch (err) {
      console.warn('Session fetch failed, using default state.');
    }
  };

  const handlePortalLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowGatewayPortal(false);
    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('home');
    }
  };

  const fetchBackendData = async () => {
    try {
      const [prodRes, pkgRes, certRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/packages'),
        fetch('/api/certificates')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.products) setProducts(prodData.products);
      }
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        if (pkgData.packages) setPackages(pkgData.packages);
      }
      if (certRes.ok) {
        const certData = await certRes.json();
        if (certData.certificates) setCertificates(certData.certificates);
      }
    } catch (err) {
      console.warn('Backend data sync note:', err);
    }
  };

  const syncAuthenticatedData = async () => {
    try {
      const [ordRes, qteRes, tktRes, jobRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/quotes'),
        fetch('/api/tickets'),
        fetch('/api/technician/jobs')
      ]);

      if (ordRes.ok) {
        const data = await ordRes.json();
        if (data.orders) setOrders(data.orders);
      }
      if (qteRes.ok) {
        const data = await qteRes.json();
        if (data.quotes) setQuoteRequests(data.quotes);
      }
      if (tktRes.ok) {
        const data = await tktRes.json();
        if (data.tickets) setSupportTickets(data.tickets);
      }
      if (jobRes.ok) {
        const data = await jobRes.json();
        if (data.jobs) setTechnicianJobs(data.jobs);
      }
    } catch (err) {
      console.warn('Authenticated sync note:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      syncAuthenticatedData();
    }
  }, [currentUser]);

  // Switch Persona Role Handler via Backend Route
  const handleSwitchRole = async (role: UserRole) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
      } else {
        alert(data.message || 'Role switching disabled.');
      }
    } catch (err) {
      const found = INITIAL_USERS.find(u => u.role === role) || {
        id: `usr_${role}`,
        name: `${role.toUpperCase()} User`,
        email: `${role}@connectbd.com`,
        role: role,
        verified: true
      };
      setCurrentUser(found);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setCurrentUser(INITIAL_USERS[0]);
  };

  // Cart Functions
  const handleAddToCart = (item: Product | ConnectivityPackage, type: 'product' | 'package') => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { type, id: item.id, item, quantity: 1, includeInstallation: true }];
    });
    setCartModalOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleInstallation = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, includeInstallation: !item.includeInstallation } : item
    ));
  };

  const handleProceedToCheckout = () => {
    setCartModalOpen(false);
    setCheckoutModalOpen(true);
  };

  // Complete Order via Server Endpoint
  const handleCompleteOrder = async (deliveryAddressData: any) => {
    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random()}`;
      const payload = {
        items: cartItems.map(ci => ({
          productId: ci.type === 'product' ? ci.id : undefined,
          packageId: ci.type === 'package' ? ci.id : undefined,
          quantity: ci.quantity,
          includeInstallation: ci.includeInstallation
        })),
        deliveryAddress: deliveryAddressData.deliveryAddress || {
          district: 'Dhaka',
          thana: 'Gulshan',
          address: 'House 12, Road 5, Gulshan 1',
          contactPhone: currentUser.phone || '+880 1700-000000'
        },
        paymentMethod: deliveryAddressData.paymentMethod || 'bKash/Nagad'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order creation failed');
      }

      setOrders(prev => [data.order, ...prev]);
      if (data.job) setTechnicianJobs(prev => [data.job, ...prev]);
      setCartItems([]);
      setCheckoutModalOpen(false);
      
      // Sync products for stock update
      fetchBackendData();

      setActiveTab('customer-dashboard');
    } catch (err: any) {
      alert(`Order Processing Error: ${err.message}`);
    }
  };

  // Submit Custom Quote Request
  const handleSubmitQuote = async (quoteData: Partial<QuoteRequest>) => {
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setQuoteRequests(prev => [data.quote, ...prev]);
      }
    } catch (err) {
      // Fallback local update
      const newQuote: QuoteRequest = {
        id: `q_${Date.now()}`,
        quoteNumber: `CBD-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: currentUser.id,
        customerName: currentUser.name,
        customerType: quoteData.customerType || 'Community',
        organizationName: quoteData.organizationName || currentUser.organization || 'Local Community Center',
        location: quoteData.location || 'Dhaka, Bangladesh',
        numberOfUsers: quoteData.numberOfUsers || 50,
        coverageAreaSqFt: quoteData.coverageAreaSqFt || 2500,
        desiredBandwidthMbps: quoteData.desiredBandwidthMbps || 50,
        numberOfBuildings: quoteData.numberOfBuildings || 1,
        preferredBackhaul: quoteData.preferredBackhaul || 'Fiber',
        budgetRangeBDT: quoteData.budgetRangeBDT || '25,000 - 50,000 BDT',
        expectedDate: quoteData.expectedDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        additionalNotes: quoteData.additionalNotes || '',
        status: 'Submitted',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setQuoteRequests(prev => [newQuote, ...prev]);
    }
    setQuoteModalOpen(false);
    setActiveTab('customer-dashboard');
  };

  // Admin / Operations Handlers
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateJobStatus = async (jobId: string, status: TechnicianJob['status'], report?: string) => {
    try {
      const res = await fetch('/api/technician/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status, technicianReport: report })
      });
      const data = await res.json();
      if (data.success && data.job) {
        setTechnicianJobs(prev => prev.map(j => (j.id === jobId || j.jobId === jobId) ? data.job : j));
      }
    } catch (err) {
      setTechnicianJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return { 
            ...j, 
            status, 
            technicianReport: report || j.technicianReport,
            customerSignatureDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : j.customerSignatureDate
          };
        }
        return j;
      }));
    }
  };

  const handleCreateSupportTicket = async (subject: string, category: SupportTicket['category'], text: string) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, message: text })
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setSupportTickets(prev => [data.ticket, ...prev]);
        return;
      }
    } catch (err) {}

    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      customerName: currentUser.name,
      subject,
      category,
      priority: 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      messages: [
        {
          sender: 'customer',
          senderName: currentUser.name,
          timestamp: new Date().toLocaleString(),
          text
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Render Page Content based on Active Tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <main>
            <Hero setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />
            <ProblemSolution setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />
            <TrustSection certificates={certificates} setActiveTab={setActiveTab} />
          </main>
        );

      case 'solutions':
        return (
          <SolutionsPage 
            setActiveTab={setActiveTab} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
          />
        );

      case 'packages':
        return (
          <PackagesPage 
            packages={packages} 
            onSelectPackage={(pkg) => handleAddToCart(pkg, 'package')} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
            setActiveTab={setActiveTab}
          />
        );

      case 'products':
        return (
          <ProductsPage 
            products={products} 
            onAddToCart={(product) => handleAddToCart(product, 'product')} 
            onOpenQuote={() => setQuoteModalOpen(true)}
          />
        );

      case 'services':
        return (
          <ServicesPage 
            onOpenQuote={() => setQuoteModalOpen(true)} 
          />
        );

      case 'planner':
        return (
          <SmartNetworkPlanner 
            setActiveTab={setActiveTab} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
            onAddToCart={(product) => handleAddToCart(product, 'product')} 
          />
        );

      case 'supply-chain':
        return <SupplyChainPage />;

      case 'compliance':
        return <ComplianceCenter certificates={certificates} currentUser={currentUser} setActiveTab={setActiveTab} />;

      case 'impact':
        return <CommunityImpactPage />;

      case 'support':
        return (
          <SupportCenter 
            tickets={supportTickets} 
            onCreateTicket={handleCreateSupportTicket} 
          />
        );

      case 'about':
        return <AboutUs />;

      case 'how-it-works':
        return <HowItWorks setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />;

      case 'business-model':
        return <BusinessModelPage />;

      case 'customer-dashboard':
        return (
          <CustomerDashboard 
            currentUser={currentUser} 
            orders={orders.filter(o => o.userId === currentUser.id || currentUser.role === 'admin')} 
            quotes={quoteRequests.filter(q => q.userId === currentUser.id || currentUser.role === 'admin')} 
            tickets={supportTickets.filter(t => t.userId === currentUser.id || currentUser.role === 'admin')}
            jobs={technicianJobs}
            setActiveTab={setActiveTab} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
          />
        );

      case 'technician-dashboard':
        return (
          <TechnicianDashboard 
            currentUser={currentUser}
            jobs={technicianJobs} 
            onUpdateJobStatus={handleUpdateJobStatus} 
          />
        );

      case 'admin-dashboard':
        if (currentUser.role !== 'admin') {
          return (
            <div className="max-w-3xl mx-auto my-16 p-8 bg-slate-900 border border-rose-500/30 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
                🔒
              </div>
              <h2 className="text-2xl font-bold text-white">Access Denied - Admin Role Required</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                The Admin Control Tower is strictly restricted to authenticated users verified with the <strong className="text-cyan-400">admin</strong> role in the Firestore user document.
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                Return to Home Portal
              </button>
            </div>
          );
        }
        return (
          <AdminDashboard 
            currentUser={currentUser}
            orders={orders} 
            quotes={quoteRequests} 
            jobs={technicianJobs} 
            products={products}
            certificates={certificates} 
            auditLogs={auditLogs} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            onAddProductSuccess={(newProd) => setProducts(prev => [newProd, ...prev])}
          />
        );

      default:
        return (
          <main>
            <Hero setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />
            <ProblemSolution setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />
            <TrustSection certificates={certificates} setActiveTab={setActiveTab} />
          </main>
        );
    }
  };

  if (showGatewayPortal) {
    return (
      <LandingPortal 
        onLoginSuccess={handlePortalLoginSuccess} 
        onExplorePublicGuest={() => {
          setShowGatewayPortal(false);
          setActiveTab('home');
        }} 
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Main Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onSwitchRole={handleSwitchRole} 
        cartCount={totalCartCount} 
        onOpenCart={() => setCartModalOpen(true)} 
        onOpenQuote={() => setQuoteModalOpen(true)} 
        language={language} 
        setLanguage={setLanguage} 
        onShowGatewayPortal={() => setShowGatewayPortal(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal Trigger Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-1 px-4 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="text-slate-400">
            Authenticated Session: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
          </span>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="text-blue-400 hover:text-blue-300 font-bold underline ml-2"
          >
            Manage Auth / Login / Signup
          </button>
        </div>
      </div>

      {/* Main Page Render */}
      <div className="flex-1">
        {renderMainContent()}
      </div>

      {/* Global Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        onOpenQuote={() => setQuoteModalOpen(true)} 
      />

      {/* Modals */}
      {cartModalOpen && (
        <CartModal 
          isOpen={cartModalOpen} 
          onClose={() => setCartModalOpen(false)} 
          cartItems={cartItems} 
          onUpdateQuantity={handleUpdateCartQuantity} 
          onRemoveItem={handleRemoveCartItem} 
          onToggleInstallation={handleToggleInstallation} 
          onProceedToCheckout={handleProceedToCheckout} 
        />
      )}

      {checkoutModalOpen && (
        <CheckoutModal 
          isOpen={checkoutModalOpen} 
          onClose={() => setCheckoutModalOpen(false)} 
          cartItems={cartItems} 
          currentUser={currentUser} 
          onOrderCreated={handleCompleteOrder} 
        />
      )}

      {quoteModalOpen && (
        <QuoteModal 
          isOpen={quoteModalOpen} 
          onClose={() => setQuoteModalOpen(false)} 
          currentUser={currentUser} 
          onQuoteSubmitted={handleSubmitQuote} 
        />
      )}

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          currentUser={currentUser}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalOpen(false);
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

