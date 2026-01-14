import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, CreditCard, ShieldCheck, Loader2, CheckCircle, Star } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  onCheckoutSuccess: () => void;
  onRateProduct: (productId: string, rating: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeFromCart,
  clearCart,
  onCheckoutSuccess,
  onRateProduct
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'processing' | 'success'>('cart');
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [ratedItems, setRatedItems] = useState<Set<string>>(new Set());

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const BUYER_FEE = 1.00;
  const total = subtotal + BUYER_FEE;

  const handleCheckout = () => {
    setPaymentStep('processing');
    // Save items for rating display before clearing
    setPurchasedItems([...cart]);
    
    // Simulate Stripe processing delay
    setTimeout(() => {
      setPaymentStep('success');
      onCheckoutSuccess();
      // Reset after a delay if user doesn't interact, but let them rate first
      // setTimeout(() => {
      //   setPaymentStep('cart');
      //   onClose();
      // }, 8000);
    }, 2000);
  };

  const handleRate = (id: string, rating: number) => {
    onRateProduct(id, rating);
    setRatedItems(prev => new Set(prev).add(id));
  };

  const handleClose = () => {
    onClose();
    // Reset internal state after animation clears
    setTimeout(() => {
        setPaymentStep('cart');
        setPurchasedItems([]);
        setRatedItems(new Set());
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100 bg-earth-50">
            <h2 className="text-xl font-bold text-earth-900">Your Cart</h2>
            <button onClick={handleClose} className="p-2 hover:bg-earth-200 rounded-full transition-colors text-earth-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {paymentStep === 'success' ? (
              <div className="h-full flex flex-col animate-fade-in">
                <div className="text-center space-y-4 mb-8">
                    <div className="w-20 h-20 bg-nature-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-nature-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-earth-900">Payment Successful!</h3>
                    <p className="text-earth-600">Thank you for your order. Rate your items below:</p>
                </div>

                <div className="space-y-4">
                    {purchasedItems.map(item => (
                        <div key={item.id} className="bg-earth-50 p-4 rounded-xl border border-earth-100 flex items-center space-x-4">
                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1">
                                <p className="font-bold text-earth-900 text-sm mb-1">{item.name}</p>
                                {ratedItems.has(item.id) ? (
                                    <span className="text-xs text-nature-600 font-bold flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Rated
                                    </span>
                                ) : (
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star}
                                                onClick={() => handleRate(item.id, star)}
                                                className="hover:scale-110 transition-transform focus:outline-none group"
                                            >
                                                <Star className="w-4 h-4 text-earth-300 group-hover:text-amber-400 group-hover:fill-current transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleClose}
                    className="mt-8 w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
                >
                    Done
                </button>
              </div>
            ) : paymentStep === 'processing' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                 <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                 <div className="space-y-2">
                   <h3 className="text-xl font-bold text-earth-900">Processing Payment</h3>
                   <p className="text-sm text-earth-500 flex items-center justify-center">
                     <ShieldCheck className="w-4 h-4 mr-1" />
                     Securely connecting to Stripe...
                   </p>
                 </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-earth-400 space-y-4">
                <div className="w-16 h-16 bg-earth-50 rounded-full flex items-center justify-center">
                   <CreditCard className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg">Your cart is empty.</p>
                <button onClick={handleClose} className="text-nature-600 font-medium hover:underline">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-earth-200">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-earth-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-earth-500 capitalize">{item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center space-x-2 border border-earth-200 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-earth-100 rounded disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-earth-600" />
                          </button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, 1)}
                             className="p-1 hover:bg-earth-100 rounded"
                          >
                            <Plus className="w-4 h-4 text-earth-600" />
                          </button>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-rose-600 hover:text-rose-500 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Checkout */}
          {paymentStep === 'cart' && cart.length > 0 && (
            <div className="border-t border-earth-100 bg-earth-50 px-6 py-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-earth-600">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-earth-600">
                    <p>App Service Fee</p>
                    <p>${BUYER_FEE.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-bold text-earth-900 pt-2 border-t border-earth-200">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                </div>
              </div>
              
              <p className="mt-0.5 text-xs text-earth-400 mb-6">Shipping and taxes calculated at checkout.</p>
              
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center rounded-xl border border-transparent bg-[#635BFF] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#4B44EF] transition-colors"
              >
                <span className="mr-2">Pay with</span> 
                <span className="font-bold italic">Stripe</span>
              </button>
              <div className="mt-4 flex justify-center text-center text-sm text-earth-500">
                <p>
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-nature-600" />
                  Payments are secure and encrypted.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;