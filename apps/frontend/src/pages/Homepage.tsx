import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Homepage() {
  const navigate = useNavigate();
  const cart = useCartStore();
  const [search, setSearch] = useState('');
  const { isAuthenticated, user, clearSession } = useAuthStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="bg-background-base text-on-surface font-sans selection:bg-primary/20 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 border-b border-outline-variant shadow-sm h-20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container-max-width mx-auto">
          <div className="flex items-center gap-8">
            <span className="font-headline-lg text-headline-lg font-black text-primary cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/')}>
              PizzaRally
            </span>
            <nav className="hidden md:flex gap-6">
              <span className="text-primary border-b-2 border-primary font-bold pb-1 font-body-md text-body-md cursor-pointer" onClick={() => navigate('/shop')}>
                Menu
              </span>
              <span className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer" onClick={() => navigate('/shop')}>
                Offers
              </span>
              <span className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer">
                Locations
              </span>
              <span className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer">
                Support
              </span>
            </nav>
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
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface" onClick={() => navigate('/login')}>
                <span className="material-symbols-outlined">person</span>
                Sign In
              </button>
            )}
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all" onClick={() => navigate('/cart')}>
              <span className="material-symbols-outlined">shopping_cart</span>
              Cart
              {cart.items.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-surface-white text-primary text-sm font-bold">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 flex-1">
        {/* Mobile Header (Location bar) */}
        <div className="md:hidden bg-surface-white px-margin-mobile py-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <div>
              <p className="text-label-sm font-bold text-on-surface">Berlin Mitte, 10115</p>
              <p className="text-[10px] text-on-surface-variant">Standard delivery zone</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">keyboard_arrow_right</span>
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Delicious Italian Pizza" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXl199LzWwcJfi6-2VVmls6annyY3KKvvg-xAohPEhtr15ROEZCP2e8IFlE3ltV_fCgfRDRF6J1Z7pAOHN9Rn0z6V18p8NoNOkBsbC-7HVUWDBcYuJWL354NkSjc6eJLRp0RE7KD67LuJsj0EoG2tlkxhRim4ghrWbR9E3x3xU4908hKemTkYRa_E9xPcR850LqPIUDAzaVk19Nf0Ov0H-QU3rKJGWmAx2iS8f4spofraXCNPS_Lx2ZSPQMs2dzlJHsSAsYAvSGpE"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="max-w-2xl space-y-6">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-green/20 text-success-green border border-success-green/30 rounded-full font-label-sm text-label-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                  Open Now
                </span>
                <div className="flex gap-4 p-3 rounded-xl bg-surface/10 backdrop-blur-xl border border-white/10 text-white">
                  <div className="flex flex-col text-xs">
                    <span className="opacity-70">Delivery</span>
                    <span className="font-bold">25-40 min</span>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="flex flex-col text-xs">
                    <span className="opacity-70">Pickup</span>
                    <span className="font-bold">15 min</span>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="flex flex-col text-xs">
                    <span className="opacity-70">Fee</span>
                    <span className="font-bold">€1.50</span>
                  </div>
                </div>
              </div>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
                Authentic Flavors,<br/><span className="text-secondary-container">Delivered Fast.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 max-w-lg">
                Savor the finest European pizzas, handmade pasta, and exotic Indian delights. Prepared fresh, delivered with care.
              </p>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">search</span>
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-surface-white border-none focus:ring-2 focus:ring-primary text-on-surface font-body-md placeholder:text-on-surface-variant/50" 
                    placeholder="Search menu..." 
                  />
                </div>
                <button type="submit" className="px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                  Order now
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-surface-container-low">
          <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-8">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Explore Categories</h2>
              <p className="text-on-surface-variant mt-1">What are you craving today?</p>
            </div>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
              {[
                { name: 'Pizza', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQQwl2-CEUelljv4fpqW7iHxnsjigiqw3BWMCwUw_qTNE2hFGhBkfHedbRZWuCkUchMW6t_nXPIesqVMN7fGCDhKC-yVJexuiw--R2qsUZAnWm8Ott36rdUrOrsrc-PklJC5w4Iv2xvwW0kQ33ZSBCoWT4LDevwpqZzDL73tHrMU27MTUUHNlBVN6_bnYxGQ1kQxT-ICUL-dz8M7m9AHneYB9JGVV1tjCFllVdg6KxzKyQJs2BccwCpDqONkfpB4GzngtFIlc1CQ' },
                { name: 'Pasta', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0SFIVtWvZWlsN0iQJWJ-aycGkZ00s6ADu9Qe7v-neKuVhY63a9IElV7QWX7Ki3q8YUH6J3mQARMSdJdmxnwLBfRZH1AuFcMcKzyo9Ydt0g0px2_xeTsz2m-zH0Hde1jffjYljXR8Ze2b62-IxOXqCqDK5MwtDIPVQB17HeE8CGbuiK7RxfqKjy6S-hL3AtxWpSzOEkzHjp9z8Lg0EXEaEyqn_l7evqAekaL94QJgVu1G9ebm7neudcUovmPZbal9YCJPN4TiJEc8' },
                { name: 'Indian', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMjchilVTUKlz7CtqRRwsZtqUy5lDOcVKMUYdWkL-jw1y0E3qVeNxX3l5PwUtt5Cs7dDZu0PWbkeocu2OKrkmA7E1WzWiGolzU9W3yaaZjDgTAMSFxoHesYHj-NXrbkPZHhUMypT2o8sqDtf3tpnq4fu2Ja26m5kiQ0xnD-QHqSsRiGiLefr_KhK8W4auK-21ZAR4hv-OufMAjO81fJf60A6xFgkbA_CtqOi8r1seXIdJEz_D5hM-jRRh3Np_yLFDdtqnnsJp22E' },
                { name: 'Salads', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOEjARmefz_UkSCh31NHLCnGtzae-CFGesf4POhtOnVLYbwsH6_XNl_jLqcB2Z3tjztWvncpgoepREc7Rr3lSaBmbefNumuEKM0jnjWIhaVVcfjjBOnCemhfqX3cZKgF-wkV4A28axHP-IibJSLqWyB5_x3_l4QX_1twhXQd6o0QhixPaqFcfeGYOXDDRJt8Q3fwbdkKdFbtgJXEMvI34csCd_dvbrvMsCc5eaC_BMMPzNiim_fRzi_E3EYia2IWviNj9ZoANA1JE' }
              ].map((cat) => (
                <div key={cat.name} className="group flex-shrink-0 cursor-pointer text-center" onClick={() => navigate('/shop')}>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-label-md text-label-md text-on-surface">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Deals Slider */}
        <section className="py-16 overflow-hidden">
          <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8">Featured Deals</h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
              {[
                { badge: 'HOT DEAL', title: '2-for-1 Tuesdays', desc: 'Order any large pizza and get the second one free!', color: 'bg-vibrant-lime text-black', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNKzr5iIcVUaEfajyFO0JrmVf3CP_fyzrSWWaU_Ba-RSvyRBZxDqnIjA0S07QbIjSH6_rtH00WglvpuNliANVd6JnPvRQ5Bolsz0yaZRfKczeEVc1OXGDQVTtTvsk4W6cK2INNegdcix8B6qNXebSkWGkdq1hM_A0MzQ7wiy_mklNo370KbUm1PKbvio3lVt_ENDpUnc1O5cTmxHwfUhHlqUds3N4j76EbH8TxbaL92m1jvz2D7DU_6fUjQjPkm2mZv2P68bNvPRw' },
                { badge: 'FAMILY SIZE', title: 'Weekend Bundle', desc: 'Family combo including 2 Pizzas, 1 Salad & 1.5L Coke.', color: 'bg-secondary-container text-white', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvf69j24pBfwTgt3Gi27LDXjEPWn3yf_RcjdQd7goa0gJ5HhG5_H7M3u1XY-55GELwU0xiKeQIrvxfZzbr7U_qV38z3a_3kAitNCZHsg0lCyMnv6uLffdRGcveEIQDZ3-rEhP0ExZQQp0hWqZwz239KEIFuusUG1bHUPUv3T2kTur3_fzs8Jwmi4onvSlDBo0pRU7xeulP1zUe96WfQQ5sTn8hRTAH4LPNP18AnsB9fZDYLjO6GXDGIFE_GEx9Uw_UYbLXsWwjCE8' },
                { badge: 'NEW', title: 'Lunch Special', desc: 'All pasta dishes only €9.90 between 11:00 - 14:00.', color: 'bg-tertiary text-white', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDflW_i8tPsrW7qewVaCH91ZpKcCZs7TlvZVoAYHsQe1sO1pSjYpaB5ZIaccJDbCzzsCEvc9W_BRAbr_S2TWB2TzU5R7aHu8X18iJ5bfOoiaIrIO-vKdd4gYhOZFjdmjEKO4oDVyG4mibsK5PoEdq3RBJsX8whFIepcpiQinJ6Hm3q2r3a5Dn1meviL0CCohRhWXaBUl678P1vscX03UZvkdpZ8D0L2qd2aminWCDgKhN73_HZNUN_q0d7YqoHDtfhcySxMPDxVivg' }
              ].map((deal) => (
                <div key={deal.title} className="flex-shrink-0 w-[300px] md:w-[450px] snap-start relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => navigate('/shop')}>
                  <img src={deal.img} alt={deal.title} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <span className={`${deal.color} font-bold px-3 py-1 rounded-full text-xs self-start mb-2`}>{deal.badge}</span>
                    <h3 className="text-white font-headline-md text-headline-md">{deal.title}</h3>
                    <p className="text-white/80 font-body-md text-body-md">{deal.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Dishes Grid */}
        <section className="py-16 bg-surface-white border-t border-outline-variant/30">
          <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Popular Dishes</h2>
                <p className="text-on-surface-variant">Top rated by our community</p>
              </div>
              <span className="text-primary font-label-md hover:underline flex items-center gap-1 cursor-pointer" onClick={() => navigate('/shop')}>
                View Menu
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Diavola Pizza', price: '€13.50', desc: 'Spicy salami, chili flakes, tomato sauce, mozzarella', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYB9wgplRpSgM-l5Yp6SRg3o64voq-br7TfG3yylChEyQfWikY9SfmZVSZqPX2spVqxc_FUKUTYgtt1i0rliEpPf9_6q4vg_C5TyILInhPQMMnxpI6oVR0Cpwt6DGSxy81y9gysZjb1JLm1rTXqbxGH0-JbduepKdtgJEcdbBuoweApZ-91o8TekVWGgEU06ueN7tsmxK4x8qPQuhB8dLqDT8du0tASt0yC2rOS5UxhKmYCBoC7wcVQydKtFauePBxWk8-5MBmfOk' },
                { name: 'Fettuccine Alfredo', price: '€12.90', desc: 'Rich parmesan cream sauce, garlic, and fresh parsley', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0SFIVtWvZWlsN0iQJWJ-aycGkZ00s6ADu9Qe7v-neKuVhY63a9IElV7QWX7Ki3q8YUH6J3mQARMSdJdmxnwLBfRZH1AuFcMcKzyo9Ydt0g0px2_xeTsz2m-zH0Hde1jffjYljXR8Ze2b62-IxOXqCqDK5MwtDIPVQB17HeE8CGbuiK7RxfqKjy6S-hL3AtxWpSzOEkzHjp9z8Lg0EXEaEyqn_l7evqAekaL94QJgVu1G9ebm7neudcUovmPZbal9YCJPN4TiJEc8' },
                { name: 'Chicken Tikka', price: '€14.50', desc: 'Tender chicken in a spiced tomato cream sauce with rice', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMjchilVTUKlz7CtqRRwsZtqUy5lDOcVKMUYdWkL-jw1y0E3qVeNxX3l5PwUtt5Cs7dDZu0PWbkeocu2OKrkmA7E1WzWiGolzU9W3yaaZjDgTAMSFxoHesYHj-NXrbkPZHhUMypT2o8sqDtf3tpnq4fu2Ja26m5kiQ0xnD-QHqSsRiGiLefr_KhK8W4auK-21ZAR4hv-OufMAjO81fJf60A6xFgkbA_CtqOi8r1seXIdJEz_D5hM-jRRh3Np_yLFDdtqnnsJp22E' },
                { name: 'Caesar Deluxe', price: '€11.50', desc: 'Romaine lettuce, garlic croutons, parmesan, Caesar dressing', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOEjARmefz_UkSCh31NHLCnGtzae-CFGesf4POhtOnVLYbwsH6_XNl_jLqcB2Z3tjztWvncpgoepREc7Rr3lSaBmbefNumuEKM0jnjWIhaVVcfjjBOnCemhfqX3cZKgF-wkV4A28axHP-IibJSLqWyB5_x3_l4QX_1twhXQd6o0QhixPaqFcfeGYOXDDRJt8Q3fwbdkKdFbtgJXEMvI34csCd_dvbrvMsCc5eaC_BMMPzNiim_fRzi_E3EYia2IWviNj9ZoANA1JE' }
              ].map((dish) => {
                const parsedPrice = Number(dish.price.replace(/[^0-9.]/g, ''));
                const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  cart.addItem({
                    productId: dish.name,
                    name: dish.name,
                    price: parsedPrice,
                    quantity: 1,
                  });
                };

                return (
                  <div key={dish.name} className="bg-surface-white rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => navigate('/shop')}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={dish.img} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button className="absolute bottom-3 right-3 bg-secondary text-white p-2.5 rounded-lg shadow-md hover:scale-110 active:scale-95 transition-all" onClick={handleAddToCart}>
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-label-md text-label-md text-on-surface font-bold">{dish.name}</h4>
                        <span className="text-primary font-bold">{dish.price}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{dish.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>


      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant py-12 px-margin-mobile md:px-margin-desktop mt-20">
        <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-headline-lg font-black text-primary">PizzaRally</span>
          <p className="text-xs text-on-surface-variant text-center md:text-right">
            © 2026 PizzaRally Premium Ordering Platform. All rights reserved. Built for modern restaurant standards.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface-white border-t border-outline-variant h-16 flex items-center justify-around px-2 shadow-lg">
        <button className="flex flex-col items-center justify-center text-primary text-xs font-bold" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined">home</span>
          Home
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-xs" onClick={() => navigate('/shop')}>
          <span className="material-symbols-outlined">restaurant_menu</span>
          Menu
        </button>
        <button className="relative flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-xs" onClick={() => navigate('/cart')}>
          <span className="material-symbols-outlined">shopping_basket</span>
          Cart
          {cart.items.length > 0 && (
            <span className="absolute top-1 right-4 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
        <button
          className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-xs"
          onClick={() => {
            if (isAuthenticated) {
              clearSession();
              navigate('/');
            } else {
              navigate('/login');
            }
          }}
        >
          <span className="material-symbols-outlined">person</span>
          {isAuthenticated ? 'Logout' : 'Profile'}
        </button>
      </nav>
    </div>
  );
}
