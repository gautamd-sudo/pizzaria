import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts, useUpdateProduct } from '../hooks/useApi';

export default function AdminMenuEditor() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const { data: productsData, isLoading } = useProducts(selectedCatId || undefined, undefined);
  const updateProduct = useUpdateProduct();

  const handleToggleAvailability = (productId: string, currentStatus: boolean) => {
    updateProduct.mutate({
      id: productId,
      data: { isAvailable: !currentStatus }
    });
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
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            Orders Board
          </span>
          <span className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container/10 text-primary font-bold cursor-pointer">
            <span className="material-symbols-outlined">restaurant_menu</span>
            Menu Editor
          </span>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 flex-1 min-h-screen space-y-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">Menu Editor</h2>
          <p className="text-on-surface-variant">Update item structures, prices, and configure real-time inventory switches.</p>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Categories Manager list */}
          <section className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4">
            <h3 className="font-label-md text-on-surface uppercase tracking-wider font-bold mb-2">Categories</h3>
            <div className="space-y-3">
              <button 
                className={`w-full p-4 rounded-xl shadow-sm border text-left flex justify-between items-center transition-all ${!selectedCatId ? 'bg-primary-container/10 border-primary text-primary font-bold' : 'bg-surface-white border-transparent hover:border-primary/20'}`}
                onClick={() => setSelectedCatId('')}
              >
                <span>All Categories</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full p-4 rounded-xl shadow-sm border text-left flex justify-between items-center transition-all ${selectedCatId === cat.id ? 'bg-primary-container/10 border-primary text-primary font-bold' : 'bg-surface-white border-transparent hover:border-primary/20'}`}
                  onClick={() => setSelectedCatId(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              ))}
            </div>
          </section>

          {/* Products List Table */}
          <section className="col-span-12 lg:col-span-8 xl:col-span-9 bg-surface-white rounded-3xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-bold text-base text-on-surface">Products list</h3>
            </div>
            {isLoading ? (
              <p className="p-8 text-center text-sm">Loading products...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant">
                    <tr>
                      <th className="px-6 py-4 font-bold">Product</th>
                      <th className="px-6 py-4 font-bold text-right">Price</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {productsData?.data.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{product.name}</p>
                              <p className="text-xs text-on-surface-variant line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">€{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button 
                              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${product.isAvailable ? 'bg-success-green' : 'bg-outline-variant'}`}
                              onClick={() => handleToggleAvailability(product.id, product.isAvailable)}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${product.isAvailable ? 'right-1' : 'left-1'}`}></div>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
