import React from 'react';
import { Leaf, Layers, Sprout, Microscope, ShoppingBag, User, ShoppingCart, Calculator, Users, ClipboardList, Newspaper } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  cartCount: number;
  toggleCart: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, cartCount, toggleCart }) => {
  const navItems = [
    { view: AppView.HOME, label: 'Home', icon: <Leaf className="w-5 h-5" /> },
    { view: AppView.NEWS, label: 'News', icon: <Newspaper className="w-5 h-5" /> },
    { view: AppView.TRACKER, label: 'My Bins', icon: <ClipboardList className="w-5 h-5" /> },
    { view: AppView.COMMUNITY, label: 'Community', icon: <Users className="w-5 h-5" /> },
    { view: AppView.COMPOSTING, label: 'Guide', icon: <Layers className="w-5 h-5" /> },
    { view: AppView.VERMICULTURE, label: 'Worms', icon: <Sprout className="w-5 h-5" /> },
    { view: AppView.CALCULATOR, label: 'Calc', icon: <Calculator className="w-5 h-5" /> },
    { view: AppView.DIAGNOSTICS, label: 'Scan', icon: <Microscope className="w-5 h-5" /> },
    { view: AppView.MARKETPLACE, label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-earth-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
            <div className="bg-nature-500 p-1.5 rounded-full">
               <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-nature-100 hidden lg:block">SoilMates</span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1 lg:space-x-2 overflow-x-auto no-scrollbar mask-gradient">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap
                  ${currentView === item.view 
                    ? 'bg-earth-900 text-nature-300' 
                    : 'text-earth-200 hover:bg-earth-700 hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 ml-2 border-l border-earth-700 pl-4 flex-shrink-0">
            <button 
                onClick={() => setView(AppView.PROFILE)}
                className={`p-2 rounded-full hover:bg-earth-700 transition-colors ${currentView === AppView.PROFILE ? 'bg-earth-900 text-nature-300' : 'text-earth-200'}`}
                title="My Profile"
            >
                <User className="w-5 h-5" />
            </button>
            
            <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-earth-700 transition-colors text-earth-200 hover:text-white"
                title="View Cart"
            >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-nature-600 rounded-full border-2 border-earth-800">
                        {cartCount}
                    </span>
                )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;