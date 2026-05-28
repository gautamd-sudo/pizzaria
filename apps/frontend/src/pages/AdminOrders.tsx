import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useApi';
import { useSocket } from '../hooks/useSocket';

export default function AdminOrders() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  
  // Connect Socket.IO to receive live updates in the admin orders pipeline
  useSocket({ type: 'pipeline' });

  const columns = [
    { status: 'new', title: 'New', color: 'bg-warning-gold' },
    { status: 'confirmed', title: 'Confirmed', color: 'bg-primary' },
    { status: 'preparing', title: 'Preparing', color: 'bg-secondary' },
    { status: 'out_for_delivery', title: 'Out for Delivery', color: 'bg-tertiary' },
    { status: 'delivered', title: 'Delivered', color: 'bg-success-green' }
  ];

  const handleTransition = (id: string, currentStatus: string) => {
    let nextStatus = '';
    let driverName = undefined;
    if (currentStatus === 'new') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'out_for_delivery';
    else if (currentStatus === 'out_for_delivery') {
      nextStatus = 'delivered';
      driverName = 'Hans S.';
    }

    if (nextStatus) {
      updateStatus.mutate({ id, status: nextStatus, driverName });
    }
  };

  return (
    <div className="bg-background-base text-on-surface min-h-screen flex antialiased font-sans">
      {/* Sidebar */}
      <aside className="h-full w-64 fixed left-0 top-0 bg-background-base border-r border-outline-variant flex flex-col h-screen py-6 z-40">
        <div className="px-6 mb-8">
          <h1 className="font-headline-lg text-primary font-black cursor-pointer" onClick={() => navigate('/')}>PizzaRally Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer" onClick={() => navigate('/admin')}>
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </span>
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container/10 text-primary font-bold cursor-pointer">
            <span className="material-symbols-outlined">receipt_long</span>
            Orders Board
          </span>
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer" onClick={() => navigate('/admin/menu')}>
            <span className="material-symbols-outlined">restaurant_menu</span>
            Menu Editor
          </span>
        </nav>
      </aside>

      {/* Main Kanban Board Content */}
      <main className="ml-64 p-8 flex-1 min-h-screen flex flex-col space-y-8 overflow-hidden">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">Live Order Management</h2>
          <p className="text-on-surface-variant">Drag-and-drop or trigger pipeline buttons to progress customer order dispatch.</p>
        </div>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="flex-1 flex gap-6 overflow-x-auto pb-6">
            {columns.map((col) => {
              const colOrders = orders?.filter((o) => o.status === col.status) || [];
              return (
                <div key={col.status} className="w-[300px] shrink-0 flex flex-col h-full bg-surface-container-low rounded-xl border border-outline-variant/30 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">{col.title}</span>
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] font-bold">{colOrders.length}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {colOrders.map((order) => (
                      <div key={order.id} className="bg-surface-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] text-on-surface-variant">
                          <span>Order #{order.orderNumber}</span>
                          <span className={`${order.paymentStatus === 'paid' ? 'text-success-green' : 'text-warning-gold'} font-bold`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">Customer Detail</h4>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
                          <span className="font-bold text-primary text-sm">€{order.total.toFixed(2)}</span>
                          {col.status !== 'delivered' && (
                            <button 
                              className="px-3 py-1.5 bg-secondary text-on-secondary text-xs rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all"
                              onClick={() => handleTransition(order.id, order.status)}
                            >
                              {col.status === 'new' && 'Confirm'}
                              {col.status === 'confirmed' && 'Start Prep'}
                              {col.status === 'preparing' && 'Ready'}
                              {col.status === 'out_for_delivery' && 'Done'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
