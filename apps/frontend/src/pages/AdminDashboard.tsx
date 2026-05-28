import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminWidgets } from '../hooks/useApi';
import { useSocket } from '../hooks/useSocket';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: widgets, isLoading } = useAdminWidgets();

  // Connect Socket.IO to receive live metrics updates
  useSocket({ type: 'pipeline' });

  return (
    <div className="bg-background text-on-surface min-h-screen flex antialiased font-sans">
      {/* Sidebar Navigation */}
      <aside className="h-full w-64 fixed left-0 top-0 bg-background-base border-r border-outline-variant flex flex-col h-screen py-6 z-40">
        <div className="px-6 mb-8">
          <h1 className="font-headline-lg text-primary font-black cursor-pointer" onClick={() => navigate('/')}>PizzaRally Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container/10 text-primary font-bold cursor-pointer">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </span>
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            Orders Board
          </span>
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer" onClick={() => navigate('/admin/menu')}>
            <span className="material-symbols-outlined">restaurant_menu</span>
            Menu Editor
          </span>
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="ml-64 p-8 flex-1 min-h-screen space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">Dashboard</h2>
            <p className="text-on-surface-variant">Real-time revenue metrics, trends, and top selling items.</p>
          </div>
        </header>

        {isLoading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Widget 1 */}
            <div className="bg-surface-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-bold uppercase tracking-wider">Revenue Today</span>
                <span className="material-symbols-outlined text-primary">payments</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold">€{widgets?.revenueToday?.value?.toFixed(2) || '0.00'}</h3>
                <p className="text-xs text-success-green font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +{widgets?.revenueToday?.percentageDelta || 0}% from yesterday
                </p>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="bg-surface-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-bold uppercase tracking-wider">Orders Today</span>
                <span className="material-symbols-outlined text-primary">shopping_basket</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold">{widgets?.ordersToday?.value || 0}</h3>
                <p className="text-xs text-success-green font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +{widgets?.ordersToday?.percentageDelta || 0}% from yesterday
                </p>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="bg-surface-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-bold uppercase tracking-wider">Average Order</span>
                <span className="material-symbols-outlined text-primary">bar_chart</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold">€{widgets?.averageOrderValue?.value?.toFixed(2) || '0.00'}</h3>
                <p className="text-xs text-success-green font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +{widgets?.averageOrderValue?.percentageDelta || 0}% from yesterday
                </p>
              </div>
            </div>

            {/* Widget 4 */}
            <div className="bg-surface-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-bold uppercase tracking-wider">Active Deliveries</span>
                <span className="material-symbols-outlined text-primary">delivery_dining</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold">{widgets?.activeDeliveries || 0}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  In progress right now
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bento bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pt-4">
          <div className="lg:col-span-8 bg-surface-white rounded-xl border border-outline-variant p-6 space-y-6">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Top Selling Products</h3>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant">
                  <th className="py-3 font-bold">Product</th>
                  <th className="py-3 font-bold">Category</th>
                  <th className="py-3 font-bold text-right">Orders</th>
                  <th className="py-3 font-bold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {[
                  { name: 'Truffle Buffalo Margherita', cat: 'Signature Pizzas', orders: 842, rev: '€13,893.00' },
                  { name: 'Diavola Supreme', cat: 'Signature Pizzas', orders: 620, rev: '€8,990.00' },
                  { name: 'Slow-Cooked Beef Ragu', cat: 'Fresh Pasta', orders: 315, rev: '€5,733.00' }
                ].map((item) => (
                  <tr key={item.name} className="hover:bg-surface-container-low/30">
                    <td className="py-4 font-bold">{item.name}</td>
                    <td className="py-4">{item.cat}</td>
                    <td className="py-4 text-right">{item.orders}</td>
                    <td className="py-4 text-right font-bold text-primary">{item.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-4 bg-surface-white rounded-xl border border-outline-variant p-6 space-y-6">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Order Channels</h3>
            <div className="space-y-4 text-sm">
              {[
                { channel: 'Web App', percent: 62, count: 142 },
                { channel: 'Mobile App', percent: 28, count: 84 },
                { channel: 'POS Terminal', percent: 10, count: 38 }
              ].map(chan => (
                <div key={chan.channel} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{chan.channel}</span>
                    <span className="text-on-surface-variant">{chan.percent}% ({chan.count} orders)</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${chan.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
