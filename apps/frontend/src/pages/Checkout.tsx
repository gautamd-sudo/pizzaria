import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { usePlaceOrder, useOrderTracking } from '../hooks/useApi';
import { useSocket } from '../hooks/useSocket';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCartStore();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: 'Friedrichstraße 101', zipCode: '10117', city: 'Berlin', note: '' });
  const [contact, setContact] = useState({ firstName: 'Lukas', lastName: 'Weber', phone: '+49 123 456789' });
  const [payment, setPayment] = useState('credit_card');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Connect Socket.IO to receive live updates if tracking an order
  useSocket(activeOrderId ? { type: 'order', orderId: activeOrderId } : undefined);
  const { data: trackedOrder } = useOrderTracking(activeOrderId || '');

  const handleSubmitOrder = () => {
    const orderData = {
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedVariantId: item.selectedVariantId,
      })),
      paymentMethod: payment,
      deliveryAddress: {
        street: address.street,
        zipCode: address.zipCode,
        city: address.city,
        note: address.note,
      },
    };

    placeOrder.mutate(orderData, {
      onSuccess: (data) => {
        cart.clearCart();
        setActiveOrderId(data.id);
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Failed to place order');
      },
    });
  };

  const getStepStatusIndex = (status: string) => {
    switch (status) {
      case 'new': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  // If tracking an order, show live tracker screen
  if (activeOrderId && trackedOrder) {
    const currentStepIndex = getStepStatusIndex(trackedOrder.status);
    const trackingSteps = [
      { label: 'Received', icon: 'receipt', desc: 'Order created' },
      { label: 'Confirmed', icon: 'check_circle', desc: 'Kitchen accepted' },
      { label: 'Preparing', icon: 'local_pizza', desc: 'Baking and packing' },
      { label: 'Out for Delivery', icon: 'delivery_dining', desc: 'Driver is on the way' },
      { label: 'Delivered', icon: 'home_work', desc: 'Enjoy your meal!' }
    ];

    return (
      <div className="bg-background-base text-on-surface min-h-screen flex flex-col font-sans pt-24">
        <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant shadow-sm h-20">
          <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max-width mx-auto">
            <span className="font-headline-lg text-headline-lg font-black text-primary cursor-pointer" onClick={() => navigate('/')}>
              PizzaRally
            </span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile py-8 space-y-8">
          <div className="bg-surface-white border border-outline-variant rounded-2xl shadow-lg p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-success-green animate-bounce">check_circle</span>
            <h2 className="font-headline-lg text-2xl font-black text-on-surface">Order Tracking</h2>
            <p className="text-on-surface-variant text-sm">
              Order Number: <span className="font-bold text-on-surface">#{trackedOrder.orderNumber}</span>
            </p>
            <div className="text-xs inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Tracking Enabled
            </div>
          </div>

          {/* Stepper Status UI */}
          <div className="bg-surface-white border border-outline-variant rounded-2xl shadow-md p-8">
            <div className="space-y-8 relative">
              {/* Stepper Vertical Line for Mobile */}
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-surface-container-highest md:hidden z-0"></div>

              {trackingSteps.map((s, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={s.label} className="flex items-start md:items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-primary border-primary text-on-primary shadow-md scale-110' : isCompleted ? 'bg-success-green border-success-green text-white' : 'bg-surface-white border-outline-variant text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-xl">{s.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm ${isActive ? 'text-primary text-base' : 'text-on-surface'}`}>
                        {s.label}
                      </h4>
                      <p className="text-xs text-on-surface-variant">{s.desc}</p>
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wide text-primary bg-primary/10 px-2.5 py-0.5 rounded-full animate-pulse">
                        Active Step
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details */}
          {trackedOrder.driverName && (
            <div className="bg-surface-white border border-outline-variant rounded-2xl shadow-md p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">sports_motorsports</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">Your Courier</h4>
                <p className="text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface">{trackedOrder.driverName}</span> is delivering your order.
                </p>
              </div>
            </div>
          )}

          {/* Details & Back button */}
          <div className="flex justify-between items-center pt-4">
            <span className="font-bold text-sm text-on-surface-variant">
              Total Amount: <span className="text-primary font-headline-md text-base">€{trackedOrder.total.toFixed(2)}</span>
            </span>
            <button className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Regular Checkout Form
  return (
    <div className="bg-background-base text-on-surface min-h-screen flex flex-col font-sans pt-24">
      <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant shadow-sm h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max-width mx-auto">
          <span className="font-headline-lg text-headline-lg font-black text-primary cursor-pointer" onClick={() => navigate('/')}>
            PizzaRally
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter py-8">
        {/* Left Form Column */}
        <section className="lg:col-span-8 space-y-6">
          {/* Step 1 Address */}
          <div className="bg-surface-white p-6 rounded-xl border border-outline-variant">
            <h2 className="font-headline-md text-headline-md font-bold mb-4 font-black text-primary">1. Delivery Address</h2>
            {step === 1 ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={address.street} 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Street and Number"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={address.zipCode} 
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="ZIP Code"
                  />
                  <input 
                    type="text" 
                    value={address.city} 
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="City"
                  />
                </div>
                <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md" onClick={() => setStep(2)}>
                  Continue
                </button>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">{address.street}, {address.zipCode} {address.city}</p>
            )}
          </div>

          {/* Step 2 Contact Details */}
          <div className="bg-surface-white p-6 rounded-xl border border-outline-variant">
            <h2 className="font-headline-md text-headline-md font-bold mb-4 font-black text-primary">2. Contact Details</h2>
            {step === 2 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={contact.firstName} 
                    onChange={(e) => setContact({ ...contact, firstName: e.target.value })} 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="First Name"
                  />
                  <input 
                    type="text" 
                    value={contact.lastName} 
                    onChange={(e) => setContact({ ...contact, lastName: e.target.value })} 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Last Name"
                  />
                </div>
                <input 
                  type="text" 
                  value={contact.phone} 
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })} 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Phone Number"
                />
                <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md" onClick={() => setStep(3)}>
                  Continue
                </button>
              </div>
            ) : (
              step > 2 && <p className="text-sm text-on-surface-variant">{contact.firstName} {contact.lastName} - {contact.phone}</p>
            )}
          </div>

          {/* Step 3 Payment */}
          <div className="bg-surface-white p-6 rounded-xl border border-outline-variant">
            <h2 className="font-headline-md text-headline-md font-bold mb-4 font-black text-primary">3. Payment Method</h2>
            {step === 3 && (
              <div className="space-y-4">
                {[
                  { id: 'credit_card', label: 'Credit / Debit Card', icon: 'credit_card' },
                  { id: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
                  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: 'payments' }
                ].map((pay) => (
                  <label key={pay.id} className="flex items-center gap-3 p-4 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      value={pay.id} 
                      checked={payment === pay.id} 
                      onChange={(e) => setPayment(e.target.value)} 
                    />
                    <span className="material-symbols-outlined text-on-surface-variant">{pay.icon}</span>
                    <span className="font-bold text-sm text-on-surface">{pay.label}</span>
                  </label>
                ))}
                <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold text-base shadow-md hover:brightness-110 active:scale-95 transition-all" onClick={handleSubmitOrder} disabled={placeOrder.isPending}>
                  {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Summary Column */}
        <aside className="lg:col-span-4">
          <div className="bg-surface-white rounded-xl p-6 border border-outline-variant space-y-6">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface border-b border-outline-variant/30 pb-4">Order Summary</h3>
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={`${item.productId}-${item.selectedVariantId}`} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-on-surface">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>€{cart.getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Fee</span>
                <span>€{cart.deliveryMode === 'delivery' ? '1.50' : '0.00'}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-success-green font-bold">
                  <span>Discount</span>
                  <span>-€{cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/30">
                <span>Total</span>
                <span>€{cart.getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
