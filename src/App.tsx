import React, { useState } from 'react';
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
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  // E-Commerce & Core Business States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  // Switch Persona Role Handler
  const handleSwitchRole = (role: UserRole) => {
    const found = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr_${role}`,
      name: `${role.toUpperCase()} User`,
      email: `${role}@connectbd.com`,
      role: role,
      verified: true
    };
    setCurrentUser(found);
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

  // Complete Order
  const handleCompleteOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setCheckoutModalOpen(false);
    
    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userEmail: currentUser.email,
      role: currentUser.role,
      action: 'New Order Placed',
      details: `Placed order ${newOrder.orderNumber} valued at ${newOrder.totalBDT.toLocaleString()} BDT`,
      ipAddress: '103.114.172.5'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Navigate to Customer Dashboard
    setActiveTab('customer-dashboard');
  };

  // Submit Custom Quote Request
  const handleSubmitQuote = (quoteData: Partial<QuoteRequest>) => {
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
    setQuoteModalOpen(false);

    // Audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userEmail: currentUser.email,
      role: currentUser.role,
      action: 'Quote Request Submitted',
      details: `Quote #${newQuote.quoteNumber} for ${newQuote.organizationName}`,
      ipAddress: '103.114.172.5'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setActiveTab('customer-dashboard');
  };

  // Admin / Operations Handlers
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateJobStatus = (jobId: string, status: TechnicianJob['status'], report?: string) => {
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
  };

  const handleCreateSupportTicket = (subject: string, category: SupportTicket['category'], text: string) => {
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
            <ProblemSolution setActiveTab={setActiveTab} />
            <TrustSection certificates={certificates} setActiveTab={setActiveTab} />
          </main>
        );

      case 'solutions':
        return (
          <SolutionsPage 
            setActiveTab={setActiveTab} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
            onSelectPackage={(pkg) => handleAddToCart(pkg, 'package')} 
          />
        );

      case 'packages':
        return (
          <PackagesPage 
            packages={INITIAL_PACKAGES} 
            onSelectPackage={(pkg) => handleAddToCart(pkg, 'package')} 
            onOpenQuote={() => setQuoteModalOpen(true)} 
          />
        );

      case 'products':
        return (
          <ProductsPage 
            products={INITIAL_PRODUCTS} 
            onAddToCart={(product) => handleAddToCart(product, 'product')} 
          />
        );

      case 'services':
        return (
          <ServicesPage 
            setActiveTab={setActiveTab} 
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
        return <SupplyChainPage setActiveTab={setActiveTab} />;

      case 'compliance':
        return <ComplianceCenter certificates={certificates} currentUser={currentUser} setActiveTab={setActiveTab} />;

      case 'impact':
        return <CommunityImpactPage setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />;

      case 'support':
        return (
          <SupportCenter 
            tickets={supportTickets} 
            onCreateTicket={handleCreateSupportTicket} 
          />
        );

      case 'about':
        return <AboutUs setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />;

      case 'how-it-works':
        return <HowItWorks setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />;

      case 'business-model':
        return <BusinessModelPage setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />;

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
        return (
          <AdminDashboard 
            currentUser={currentUser}
            orders={orders} 
            quotes={quoteRequests} 
            jobs={technicianJobs} 
            products={INITIAL_PRODUCTS}
            certificates={certificates} 
            auditLogs={auditLogs} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
          />
        );

      default:
        return (
          <main>
            <Hero setActiveTab={setActiveTab} onOpenQuote={() => setQuoteModalOpen(true)} />
            <ProblemSolution setActiveTab={setActiveTab} />
            <TrustSection certificates={certificates} setActiveTab={setActiveTab} />
          </main>
        );
    }
  };

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
      />

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
          items={cartItems} 
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
          items={cartItems} 
          currentUser={currentUser} 
          onCompleteOrder={handleCompleteOrder} 
        />
      )}

      {quoteModalOpen && (
        <QuoteModal 
          isOpen={quoteModalOpen} 
          onClose={() => setQuoteModalOpen(false)} 
          currentUser={currentUser} 
          onSubmitQuote={handleSubmitQuote} 
        />
      )}
    </div>
  );
}
