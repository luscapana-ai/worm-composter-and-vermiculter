import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import CompostingGuide from './components/CompostingGuide';
import VermicultureGuide from './components/VermicultureGuide';
import Diagnostics from './components/Diagnostics';
import Marketplace from './components/Marketplace';
import CartDrawer from './components/CartDrawer';
import Profile from './components/Profile';
import CompostCalculator from './components/CompostCalculator';
import Community from './components/Community';
import BinTracker from './components/BinTracker';
import NewsFeed from './components/NewsFeed';
import { AppView, Product, CartItem, UserProfile, Order, Post, CompostBin, BinLog, Badge } from './types';

// Initial data moved from Marketplace to App for persistence
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Red Wigglers (1 lb)',
    price: 45.00,
    category: 'worms',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/400/400?random=1',
    description: 'The gold standard for vermicomposting. Voracious eaters that thrive in varied conditions.'
  },
  {
    id: '2',
    name: 'Urban Worm Bag',
    price: 129.00,
    category: 'bins',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/400/400?random=2',
    description: 'Breathable, flow-through fabric system. Easy harvesting from the bottom.'
  },
  {
    id: '3',
    name: 'Coconut Coir Brick',
    price: 12.50,
    category: 'starters',
    rating: 4.5,
    imageUrl: 'https://picsum.photos/400/400?random=3',
    description: 'Perfect carbon bedding material. pH neutral and retains moisture excellently.'
  },
  {
    id: '4',
    name: 'Compost Thermometer',
    price: 24.99,
    category: 'tools',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/400/400?random=4',
    description: 'Long probe stainless steel thermometer to monitor your hot compost pile.'
  },
  {
    id: '5',
    name: 'European Nightcrawlers',
    price: 55.00,
    category: 'worms',
    rating: 4.6,
    imageUrl: 'https://picsum.photos/400/400?random=5',
    description: 'Larger worms, great for fishing and composting tougher fibrous material.'
  },
  {
    id: '6',
    name: 'Kitchen Counter Bin',
    price: 35.00,
    category: 'bins',
    rating: 4.3,
    imageUrl: 'https://picsum.photos/400/400?random=6',
    description: 'Odor-free stainless steel bin with charcoal filter for kitchen scraps.'
  }
];

const INITIAL_POSTS: Post[] = [
    {
        id: 'p1',
        author: 'SarahGreen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        content: 'Just harvested my first batch of worm castings! Look at how rich this soil is. 😍 The tomatoes are going to love it.',
        imageUrl: 'https://picsum.photos/600/400?random=50',
        likes: 24,
        comments: [
            { id: 'c1', author: 'CompostKing', text: 'That looks amazing! How long did it take?', timestamp: '2023-10-27T10:00:00Z' }
        ],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        tags: ['Harvest', 'Success']
    },
    {
        id: 'p2',
        author: 'Mike_The_Mulcher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        content: 'Does anyone else have trouble getting their pile up to temperature in the winter? Stuck at 90F.',
        likes: 5,
        comments: [],
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        tags: ['Question', 'Winter']
    }
];

const INITIAL_BADGES: Badge[] = [
    {
        id: 'b1',
        name: 'Early Bird',
        description: 'Joined the SoilMates community',
        icon: '🥚',
        earnedDate: '2023-01-15',
        color: 'nature'
    },
    {
        id: 'b2',
        name: 'Worm Whisperer',
        description: 'Successfully harvested castings',
        icon: '🪱',
        earnedDate: '2023-03-20',
        color: 'rose'
    },
    {
        id: 'b3',
        name: 'Hot Stuff',
        description: 'Achieved a pile temp of 130°F+',
        icon: '🔥',
        color: 'amber'
    },
    {
        id: 'b4',
        name: 'Photo Pro',
        description: 'Uploaded 5 photos to the gallery',
        icon: '📸',
        color: 'sky'
    }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  
  // Sticky Features State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [bins, setBins] = useState<CompostBin[]>([]);

  // Mock User State
  const [user, setUser] = useState<UserProfile>({
    name: 'Eco Warrior',
    email: 'gardener@soilmates.com',
    address: '123 Green Street, Earth City',
    portfolio: [
      {
        id: 'p1',
        imageUrl: 'https://picsum.photos/400/300?random=101',
        caption: 'First successful batch of black gold! 🌿',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        likes: 12
      }
    ],
    badges: INITIAL_BADGES,
    xp: 350,
    level: 1
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Optional: Open cart when adding item
    // setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleCheckoutSuccess = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'processing'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const handleRateProduct = (productId: string, rating: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        // Mock weighted average: assume 10 previous ratings
        const newRating = ((p.rating * 10) + rating) / 11;
        return { ...p, rating: Number(newRating.toFixed(1)) };
      }
      return p;
    }));
  };

  // Community Functions
  const handleAddPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
    // Give XP for posting
    setUser(prev => ({
        ...prev,
        xp: prev.xp + 25
    }));
  };

  // Tracker Functions
  const handleAddBin = (bin: CompostBin) => {
    setBins(prev => [...prev, bin]);
    setUser(prev => ({ ...prev, xp: prev.xp + 50 }));
  };

  const handleDeleteBin = (binId: string) => {
    setBins(prev => prev.filter(b => b.id !== binId));
  };

  const handleAddLog = (binId: string, log: BinLog) => {
    setBins(prev => prev.map(bin => {
        if (bin.id === binId) {
            return { ...bin, logs: [...bin.logs, log] };
        }
        return bin;
    }));
    setUser(prev => ({ ...prev, xp: prev.xp + 10 }));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home setView={setCurrentView} />;
      case AppView.COMPOSTING:
        return <CompostingGuide />;
      case AppView.VERMICULTURE:
        return <VermicultureGuide />;
      case AppView.CALCULATOR:
        return <CompostCalculator />;
      case AppView.DIAGNOSTICS:
        return <Diagnostics />;
      case AppView.MARKETPLACE:
        return (
          <Marketplace 
            products={products} 
            addToCart={addToCart} 
            onAddProduct={addProduct}
            onOpenCart={() => setIsCartOpen(true)}
          />
        );
      case AppView.PROFILE:
        return <Profile user={user} orders={orders} updateUser={setUser} />;
      case AppView.COMMUNITY:
        return <Community posts={posts} onAddPost={handleAddPost} user={user} />;
      case AppView.TRACKER:
        return <BinTracker bins={bins} onAddBin={handleAddBin} onAddLog={handleAddLog} onDeleteBin={handleDeleteBin} />;
      case AppView.NEWS:
        return <NewsFeed />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col font-sans text-slate-800">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
        onRateProduct={handleRateProduct}
      />

      <footer className="bg-earth-900 text-earth-300 py-8 text-center border-t border-earth-800">
        <p className="text-sm">© {new Date().getFullYear()} SoilMates. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;