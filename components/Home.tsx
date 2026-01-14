import React from 'react';
import { AppView } from '../types';
import { ArrowRight, Recycle, Bug, Droplets, Leaf, Sprout } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

interface HomeProps {
  setView: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-earth-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1200/600')] bg-cover bg-center" />
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-nature-100">
            Turn Waste Into Black Gold
          </h1>
          <p className="text-lg md:text-xl text-earth-100 mb-8 leading-relaxed max-w-2xl">
            Your comprehensive AI-powered guide to sustainable soil. 
            Choose your path: Traditional Composting or Worm Farming.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setView(AppView.COMPOSTING)}
              className="bg-nature-600 hover:bg-nature-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Recycle className="w-5 h-5" />
              <span>Explore Composting</span>
            </button>
            
            <button 
              onClick={() => setView(AppView.VERMICULTURE)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Sprout className="w-5 h-5" />
              <span>Start Worm Farming</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Widget Section */}
          <div className="lg:col-span-1">
              <WeatherWidget />
          </div>

          {/* Daily Tip Section */}
          <div className="lg:col-span-2 bg-nature-50 border border-nature-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="bg-nature-100 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-nature-600" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-nature-900">Compost Tip of the Day</h4>
              <p className="text-nature-800 mt-1">
                Don't forget to crush your eggshells! While they add valuable calcium, whole shells take a long time to break down. 
                Worms also use grit to help digest food, so powdered shells are a double win.
              </p>
            </div>
          </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setView(AppView.DIAGNOSTICS)} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bug className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-earth-900 mb-2">Pest Diagnostic</h3>
          <p className="text-earth-600">
            See a strange bug? Snap a photo or take a video. Our Gemini AI will identify it and tell you if it's a friend or foe.
          </p>
        </div>

        <div onClick={() => setView(AppView.DIAGNOSTICS)} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Droplets className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-xl font-bold text-earth-900 mb-2">Moisture Analysis</h3>
          <p className="text-earth-600">
            Bin too wet or too dry? Let our visual AI analyze your bedding and suggest the perfect brown-to-green ratio.
          </p>
        </div>

        <div onClick={() => setView(AppView.MARKETPLACE)} className="cursor-pointer group bg-white p-6 rounded-2xl shadow-sm border border-earth-100 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Recycle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-earth-900 mb-2">Marketplace</h3>
          <p className="text-earth-600">
            Source Red Wigglers, coco coir, and premium bins directly from trusted suppliers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;