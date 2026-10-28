'use client';

import { useState, useEffect, JSX } from 'react';

interface Medicine {
  id: number;
  medicineName?: string;
  name?: string;
  price?: number | string;
}

interface Batch {
  id: number;
  medicineId?: number;
  medicine_id?: number;
  batchNumber?: string;
  batch_number?: string;
  currentQuantity?: number;
  current_quantity?: number;
  sellingPrice?: number | string;
  purchaseCost?: string;
  medicineName?: string;
  sku?: string;
}

interface CartItem {
  batchId: number;
  medicineId: number;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
}

interface ReceiptData {
  receiptNumber: string;
  items: CartItem[];
  total: number;
  method: string;
  date: string;
}

export default function POSPage(): JSX.Element {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, batchRes] = await Promise.all([
          fetch('http://localhost:5000/api/medicines', { headers: { 'x-tenant-id': '1' } }),
          fetch('http://localhost:5000/api/inventory/batches', { headers: { 'x-tenant-id': '1' } })
        ]);
        
        const medsJson = await medRes.json();
        const bthsJson = await batchRes.json();

        setMedicines(Array.isArray(medsJson) ? medsJson : medsJson.data || medsJson.medicines || []);
        setBatches(Array.isArray(bthsJson) ? bthsJson : bthsJson.data || bthsJson.batches || []);
      } catch (error) {
        console.error('Error fetching POS data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPlaceholderImage = (name: string): string => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=4f46e5&size=100`;

  const addToCart = (batch: Batch) => {
    const medId = batch.medicineId || batch.medicine_id || 1;
    const batchNum = batch.batchNumber || batch.batch_number || 'N/A';
    const qty = batch.currentQuantity ?? batch.current_quantity ?? 0;
    
    if (qty <= 0) return;

    // Resolve name cleanly from batch join or fallback to medicines state
    const safeMeds = Array.isArray(medicines) ? medicines : [];
    const medicine = safeMeds.find(m => m.id === medId);
    const medName = batch.medicineName || medicine?.medicineName || medicine?.name || 'Pharmaceutical Item';
    
    // Check pricing dynamically matching your catalog logic
    const unitPrice = parseFloat(
      (batch.sellingPrice ?? medicine?.price ?? 250).toString()
    );

    const existing = cart.find(item => item.batchId === batch.id);
    const imgUrl = `/${medName}.jpg`;

    if (existing) {
      if (existing.quantity >= qty) return;
      setCart(cart.map(item => 
        item.batchId === batch.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * unitPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        batchId: batch.id,
        medicineId: medId as number,
        medicineName: medName,
        batchNumber: batchNum,
        quantity: 1,
        unitPrice: unitPrice,
        subtotal: unitPrice,
        imageUrl: imgUrl
      }]);
    }
  };

  const removeFromCart = (batchId: number) => {
    setCart(cart.filter(item => item.batchId !== batchId));
  };

  const updateQuantity = (batchId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.batchId === batchId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        return { ...item, quantity: newQty, subtotal: newQty * item.unitPrice };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    const receiptNum = `REC-${Date.now()}`;
    const payload = {
      receiptNumber: receiptNum,
      totalAmount: cartTotal,
      paymentMethod: paymentMethod,
      items: cart.map(item => ({
        medicineId: item.medicineId,
        batchId: item.batchId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/pos/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': '1',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Checkout failed: ${errorText}`);
      }
      
      const now = new Date();
      setReceipt({
        receiptNumber: receiptNum,
        items: [...cart],
        total: cartTotal,
        method: paymentMethod,
        date: `${now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}`
      });
      
      setCart([]);
      setPaymentMethod('cash');
      
      setTimeout(() => {
        window.print();
      }, 300);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please check your backend terminal.');
    } finally {
      setProcessing(false);
    }
  };

  const safeBatches = Array.isArray(batches) ? batches : [];
  const safeMedicines = Array.isArray(medicines) ? medicines : [];
  
  const availableBatches = safeBatches.filter(b => {
    const qty = b.currentQuantity ?? b.current_quantity ?? 0;
    if (qty <= 0) return false;
    if (!searchQuery) return true;
    
    const medId = b.medicineId || b.medicine_id;
    const med = safeMedicines.find(m => m.id === medId);
    const medName = b.medicineName || med?.medicineName || med?.name || '';
    const batchNum = b.batchNumber || b.batch_number || '';
    
    return medName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           batchNum.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white !important;
          }
        }
      `}</style>

      <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-6 print:hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Available Batches for Sale</h2>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search medicine or batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none shadow-sm transition-all"
              />
            </div>
          </div>
          
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
            {loading ? (
              <p className="col-span-full text-center text-gray-500 py-12 font-medium">Loading inventory...</p>
            ) : availableBatches.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12 font-medium">No stock available matching your search.</p>
            ) : (
              availableBatches.map(batch => {
                const medId = batch.medicineId || batch.medicine_id;
                const qty = batch.currentQuantity ?? batch.current_quantity ?? 0;
                const batchNum = batch.batchNumber || batch.batch_number;
                const med = safeMedicines.find(m => m.id === medId);
                const medName = batch.medicineName || med?.medicineName || med?.name || 'Pharmaceutical Item';
                
                const imgSrc = `/${medName}.jpg`;
                const itemPrice = parseFloat((batch.sellingPrice ?? med?.price ?? 250).toString());

                return (
                  <div key={batch.id} 
                    onClick={() => addToCart(batch)}
                    className="border border-gray-200/80 rounded-2xl p-4 cursor-pointer hover:border-[#366498] hover:shadow-lg transition-all bg-white flex flex-col group relative overflow-hidden"
                  >
                    <div className="h-32 w-full mb-3 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
                      <img 
                        src={imgSrc} 
                        alt={medName} 
                        className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage(medName);
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base" title={medName}>{medName}</h3>
                    <p className="text-xs text-gray-500 mb-1">Batch: {batchNum}</p>
                    <p className="text-xs sm:text-sm font-black text-[#62C02A] mb-3">KES {itemPrice.toFixed(2)}</p>
                    <div className="flex justify-between items-center text-xs mt-auto">
                      <span className="font-bold text-[#366498] bg-[#8BCBF0]/20 px-2.5 py-1 rounded-lg">Qty: {qty}</span>
                      <span className="text-gray-400 font-semibold group-hover:text-[#366498] transition-colors">+ Add</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96 xl:w-[420px] flex flex-col bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 flex-shrink-0">
          <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Current Sale</h2>
            <span className="px-3 py-1 bg-[#366498]/10 text-[#366498] text-xs font-bold rounded-full">
              {cart.length} items
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 max-h-[400px] lg:max-h-none">
            {cart.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-2 opacity-40">🛒</span>
                <p className="text-sm font-semibold text-gray-400">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Select items from inventory to begin checkout</p>
              </div>
            ) : cart.map(item => (
              <div key={item.batchId} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0">
                <img src={item.imageUrl} alt={item.medicineName} className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-100 flex-shrink-0 p-1.5 shadow-sm" 
                  onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholderImage(item.medicineName); }}
                />
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-bold text-gray-900 text-sm truncate leading-tight">{item.medicineName}</p>
                  <p className="text-xs text-gray-500 mt-1">Batch: {item.batchNumber}</p>
                  <p className="text-xs font-semibold text-[#366498] mt-0.5">KES {item.unitPrice.toFixed(2)} each</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="font-black text-gray-900 text-sm">KES {item.subtotal.toFixed(2)}</span>
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                    <button onClick={() => updateQuantity(item.batchId, -1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded">-</button>
                    <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.batchId, 1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded">+</button>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.batchId)} 
                  className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-7 h-7 flex items-center justify-center font-bold flex-shrink-0 transition-colors"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl lg:rounded-b-3xl">
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['cash', 'mpesa', 'card'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 text-xs sm:text-sm font-bold capitalize rounded-xl border transition-all ${
                      paymentMethod === method 
                        ? 'bg-[#366498] border-[#366498] text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    {method === 'mpesa' ? 'M-Pesa' : method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-5 pt-3 border-t border-gray-200/60 text-lg sm:text-xl font-black text-gray-900">
              <span>Total Amount:</span>
              <span className="text-[#366498]">KES {cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || processing}
              className="w-full bg-[#62C02A] hover:bg-[#57ad25] text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? 'Processing Payment...' : `Complete & Pay KES {cartTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Overlay */}
      {receipt && (
        <div className="hidden print:flex fixed inset-0 bg-white z-[9999] justify-center pt-16 text-[#0f172a] font-sans">
          <div className="w-full max-w-[700px] px-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-[0.2em] mb-3 uppercase">SMARTCARE</h1>
              <p className="text-[#475569] text-sm font-medium">123 Business Avenue, Nairobi</p>
              <p className="text-[#475569] text-sm font-medium mt-1">Tel: +254 795 707 823</p>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-[#cbd5e1] border-dashed text-sm font-semibold mb-8">
              <div className="text-[#475569]">
                Order: <span className="text-[#0f172a]">{receipt.receiptNumber}</span>
              </div>
              <div className="text-[#475569]">{receipt.date}</div>
            </div>

            <div className="flex justify-between text-xs font-bold text-[#64748b] tracking-widest mb-3">
              <span>ITEM</span>
              <span>AMOUNT</span>
            </div>
            <div className="border-b border-[#e2e8f0] mb-5"></div>

            <div className="space-y-6 mb-8">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[15px]">{item.medicineName}</p>
                    <p className="text-[#64748b] text-sm mt-1">
                      {item.quantity} x KES {item.unitPrice.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="font-bold text-[15px]">
                    {item.subtotal.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#cbd5e1] border-dashed pt-5 pb-5 space-y-3">
              <div className="flex justify-between text-[15px] text-[#475569] font-medium">
                <span>Subtotal</span>
                <span>{(receipt.total / 1.16).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[15px] text-[#475569] font-medium">
                <span>Tax (16%)</span>
                <span>{(receipt.total - (receipt.total / 1.16)).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="border-t border-[#cbd5e1] border-dashed py-6 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-2xl tracking-wide">TOTAL</span>
                <span className="font-black text-2xl tracking-wide">KES {receipt.total.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm pt-2 mb-16">
              <span className="font-bold text-[#64748b] tracking-wider uppercase">PAID VIA:</span>
              <span className="font-bold text-[#0f172a] tracking-wider uppercase">{receipt.method}</span>
            </div>

            <div className="text-center font-bold text-[#0f172a] text-sm">
              Thank you for your business!
            </div>
          </div>
        </div>
      )}
    </>
  );
}