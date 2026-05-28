import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useCartStore();

  return (
    <div className="bg-background-base text-on-surface min-h-screen font-sans">
      <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant shadow-sm h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max-width mx-auto">
          <span className="font-headline-lg text-headline-lg font-black text-primary cursor-pointer" onClick={() => navigate('/')}>PizzaRally</span>
          <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </header>

      <main className="pt-24 w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="bg-surface-white border border-outline-variant rounded-[24px] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-on-surface-variant uppercase tracking-[0.2em] font-bold">Your Cart</p>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-black">Review your order</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-on-surface-variant">Items</p>
                <p className="font-bold text-on-surface">{cart.items.reduce((sum, item) => sum + item.quantity, 0)} total</p>
              </div>
            </div>

            {cart.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-outline-variant p-10 text-center">
                <p className="text-on-surface-variant mb-4">Your cart is empty.</p>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-full font-bold hover:brightness-110 transition-all" onClick={() => navigate('/shop')}>
                  Browse Menu
                  <span className="material-symbols-outlined">restaurant_menu</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.selectedVariantId || 'default'}`} className="rounded-3xl border border-outline-variant p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-bold text-base text-on-surface">{item.name}</h2>
                        {item.selectedVariantName && <p className="text-sm text-on-surface-variant">{item.selectedVariantName}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity - 1, item.selectedVariantId)}
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-bold text-on-surface">{item.quantity}</span>
                        <button
                          className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.selectedVariantId)}
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
                      <span>Unit price</span>
                      <span>€{item.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-bold text-on-surface">
                      <span>Total</span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="bg-surface-white border border-outline-variant rounded-[24px] shadow-sm p-6 flex flex-col gap-6">
            <div>
              <p className="text-sm text-on-surface-variant uppercase tracking-[0.2em] font-bold">Order Summary</p>
              <h2 className="mt-3 font-headline-md text-headline-md text-on-surface font-black">Ready to checkout</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>€{cart.getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery fee</span>
                <span>{cart.deliveryMode === 'delivery' ? '€1.50' : 'FREE'}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-success-green font-bold">
                  <span>Discount</span>
                  <span>-€{cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-outline-variant/30 pt-4 text-base font-bold text-on-surface">
              <span>Total</span>
              <span>€{cart.getTotal().toFixed(2)}</span>
            </div>

            <button
              className="w-full py-4 bg-primary text-on-primary rounded-3xl font-bold shadow-md hover:brightness-110 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => navigate('/checkout')}
              disabled={cart.items.length === 0}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
