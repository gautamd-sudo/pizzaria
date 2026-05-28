import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts, useValidateCoupon } from '../hooks/useApi';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Shop() {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearSession } = useAuthStore();
  const { data: categories, isLoading: catsLoading } = useCategories();
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const { data: productsData, isLoading: prodsLoading } = useProducts(selectedCatId || undefined, true);

  const cart = useCartStore();
  const [promo, setPromo] = useState('');
  const validatePromo = useValidateCoupon();

  const handleApplyPromo = () => {
    if (!promo) return;
    validatePromo.mutate(
      { code: promo, orderAmount: cart.getSubtotal() },
      {
        onSuccess: (data) => {
          let discount = 0;
          if (data.discountType === 'percentage') {
            discount = cart.getSubtotal() * (data.value / 100);
          } else if (data.discountType === 'fixed_amount') {
            discount = data.value;
          }
          cart.applyCoupon(data.code, discount);
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Invalid coupon');
        },
      }
    );
  };

  const handleAddToCart = (product: any, variant?: any) => {
    cart.addItem({
      productId: product.id,
      name: product.name,
      price: product.price + (variant ? variant.priceDelta : 0),
      quantity: 1,
      selectedVariantId: variant?.variantId,
      selectedVariantName: variant?.name,
    });
  };

  return (
    <div className="bg-background-base text-on-surface min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant shadow-sm h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max-width mx-auto">
          <div className="flex items-center gap-8">
            <span className="font-headline-lg text-headline-lg font-black text-primary cursor-pointer" onClick={() => navigate('/')}>
              PizzaRally
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined">person</span>
                  Hi, {user?.name?.split(' ')[0] || 'Customer'}
                </span>
                <button
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface"
                  onClick={() => {
                    clearSession();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface"
                onClick={() => navigate('/login')}
              >
                <span className="material-symbols-outlined">person</span>
                Sign In
              </button>
            )}
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all" onClick={() => navigate('/cart')}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Cart ({cart.items.reduce((sum, i) => sum + i.quantity, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="pt-24 flex-1 flex w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop gap-gutter">
        {/* Left Sticky Categories Sidebar */}
        <aside className="hidden md:block w-64 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto no-scrollbar py-4">
          <h3 className="font-label-md text-on-surface uppercase tracking-wider mb-6 pl-4 font-bold">Categories</h3>
          <div className="space-y-1">
            <button 
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${!selectedCatId ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              onClick={() => setSelectedCatId('')}
            >
              <span className="material-symbols-outlined">restaurant_menu</span>
              All Products
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCatId === cat.id ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setSelectedCatId(cat.id)}
              >
                <span className="material-symbols-outlined">
                  {cat.name.toLowerCase().includes('pizza') ? 'local_pizza' : cat.name.toLowerCase().includes('pasta') ? 'dinner_dining' : 'restaurant'}
                </span>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Center Products Grid */}
        <section className="flex-1 pb-20">
          <div className="mb-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-black">
              {!selectedCatId ? 'Signature Dishes' : categories?.find(c => c.id === selectedCatId)?.name}
            </h1>
            <p className="text-on-surface-variant">Hand-stretched dough, stone-baked to perfection with premium European ingredients.</p>
          </div>

          {prodsLoading ? (
            <p>Loading catalog items...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {productsData?.data.map((product) => (
                <div key={product.id} className="bg-surface-white rounded-[16px] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="aspect-video overflow-hidden relative bg-surface-container-low">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40"><span className="material-symbols-outlined text-4xl">local_pizza</span></div>
                    )}
                    {product.tags.map(tag => (
                      <span key={tag} className="absolute top-4 left-4 bg-warning-gold text-white px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">star</span> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{product.name}</h3>
                      <span className="font-headline-md text-headline-md text-primary font-bold">€{product.price.toFixed(2)}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-2">{product.description}</p>
                    
                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-on-surface-variant font-bold mb-2">Select variant:</p>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((v) => (
                            <button 
                              key={v.variantId}
                              className="px-3 py-1 border border-outline-variant rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                              onClick={() => handleAddToCart(product, v)}
                            >
                              {v.name} (+€{v.priceDelta.toFixed(2)})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        <span>{product.prepTimeRange}</span>
                      </div>
                      <button 
                        className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-all"
                        onClick={() => handleAddToCart(product)}
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
