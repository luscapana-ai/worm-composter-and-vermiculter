import React, { useState, useMemo } from 'react';
import { Plus, Minus, Calculator, Leaf, Trash2, RefreshCw, Loader2, Sparkles, Info } from 'lucide-react';
import { getCompostAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Ingredient {
  id: string;
  name: string;
  type: 'green' | 'brown';
  cnRatio: number; // Approximate C:N ratio
  emoji: string;
}

interface MixItem {
  ingredient: Ingredient;
  parts: number; // Unitless quantity (e.g. "buckets")
}

const INGREDIENTS: Ingredient[] = [
  // Greens (Nitrogen)
  { id: 'g1', name: 'Vegetable Scraps', type: 'green', cnRatio: 15, emoji: '🥦' },
  { id: 'g2', name: 'Coffee Grounds', type: 'green', cnRatio: 20, emoji: '☕' },
  { id: 'g3', name: 'Grass Clippings', type: 'green', cnRatio: 19, emoji: '🌱' },
  { id: 'g4', name: 'Manure (Cow/Horse)', type: 'green', cnRatio: 18, emoji: '🐄' },
  { id: 'g5', name: 'Weeds (Fresh)', type: 'green', cnRatio: 20, emoji: '🌿' },
  // Browns (Carbon)
  { id: 'b1', name: 'Dry Leaves', type: 'brown', cnRatio: 60, emoji: '🍂' },
  { id: 'b2', name: 'Cardboard/Paper', type: 'brown', cnRatio: 175, emoji: '📦' },
  { id: 'b3', name: 'Straw', type: 'brown', cnRatio: 75, emoji: '🌾' },
  { id: 'b4', name: 'Sawdust', type: 'brown', cnRatio: 325, emoji: '🪚' },
  { id: 'b5', name: 'Pine Needles', type: 'brown', cnRatio: 80, emoji: '🌲' },
  { id: 'b6', name: 'Wood Chips', type: 'brown', cnRatio: 400, emoji: '🪵' },
];

const CompostCalculator: React.FC = () => {
  const [mix, setMix] = useState<MixItem[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Calculate weighted average C:N ratio
  // Heuristic: Sum(Parts * Ratio) / Sum(Parts)
  // Note: Scientifically this should be mass-based with %C and %N content, 
  // but volume-based approximation is standard for home gardening.
  const stats = useMemo(() => {
    const totalParts = mix.reduce((acc, item) => acc + item.parts, 0);
    if (totalParts === 0) return { ratio: 0, totalParts: 0, status: 'EMPTY' };

    const weightedSum = mix.reduce((acc, item) => acc + (item.parts * item.ingredient.cnRatio), 0);
    const ratio = weightedSum / totalParts;

    let status = 'IDEAL';
    if (ratio < 20) status = 'TOO_GREEN';
    if (ratio > 40) status = 'TOO_BROWN';

    return { ratio, totalParts, status };
  }, [mix]);

  const addToMix = (ingredient: Ingredient) => {
    setMix(prev => {
      const existing = prev.find(item => item.ingredient.id === ingredient.id);
      if (existing) {
        return prev.map(item => 
          item.ingredient.id === ingredient.id 
          ? { ...item, parts: item.parts + 1 } 
          : item
        );
      }
      return [...prev, { ingredient, parts: 1 }];
    });
    setAdvice(null); // Clear old advice on change
  };

  const updateParts = (id: string, delta: number) => {
    setMix(prev => prev.map(item => {
      if (item.ingredient.id === id) {
        return { ...item, parts: Math.max(1, item.parts + delta) };
      }
      return item;
    }));
    setAdvice(null);
  };

  const removeFromMix = (id: string) => {
    setMix(prev => prev.filter(item => item.ingredient.id !== id));
    setAdvice(null);
  };

  const handleGetAdvice = async () => {
    if (stats.totalParts === 0) return;
    setLoadingAdvice(true);
    try {
      const mixDesc = mix.map(m => `${m.parts} parts ${m.ingredient.name}`).join(', ');
      const result = await getCompostAdvice(mixDesc, stats.ratio);
      setAdvice(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const getMeterColor = (ratio: number) => {
    if (ratio === 0) return 'text-gray-300';
    if (ratio >= 25 && ratio <= 35) return 'text-nature-600'; // Ideal
    if (ratio < 25) return 'text-rose-500'; // Too Green (Smelly)
    return 'text-amber-500'; // Too Brown (Slow)
  };

  const getMeterPosition = (ratio: number) => {
    // Clamp ratio between 10 and 60 for visualization
    const clamped = Math.max(10, Math.min(60, ratio));
    // Map 10-60 to 0-100%
    return ((clamped - 10) / 50) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-nature-100 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-nature-700" />
        </div>
        <h2 className="text-3xl font-bold text-earth-900 mb-2">Smart Compost Calculator</h2>
        <p className="text-earth-600 max-w-2xl mx-auto">
            Balance your Greens (Nitrogen) and Browns (Carbon) to create the perfect pile. 
            Aim for a C:N ratio of 30:1 for fast, odor-free decomposition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ingredients Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-6">
            <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" /> Add Materials
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-nature-600 uppercase tracking-wider mb-3">Greens (Nitrogen Rich)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {INGREDIENTS.filter(i => i.type === 'green').map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => addToMix(ing)}
                      className="flex items-center p-2.5 rounded-lg border border-earth-100 hover:border-nature-300 hover:bg-nature-50 transition-all text-left group"
                    >
                      <span className="text-xl mr-2 group-hover:scale-110 transition-transform">{ing.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-earth-900">{ing.name}</div>
                        <div className="text-xs text-earth-500">C:N ~{ing.cnRatio}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Browns (Carbon Rich)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {INGREDIENTS.filter(i => i.type === 'brown').map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => addToMix(ing)}
                      className="flex items-center p-2.5 rounded-lg border border-earth-100 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group"
                    >
                      <span className="text-xl mr-2 group-hover:scale-110 transition-transform">{ing.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-earth-900">{ing.name}</div>
                        <div className="text-xs text-earth-500">C:N ~{ing.cnRatio}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mix & Calculation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gauge Visualizer */}
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-8 text-center relative overflow-hidden">
             <h3 className="text-earth-500 font-medium text-sm uppercase tracking-widest mb-6">Current C:N Ratio</h3>
             
             <div className="relative h-4 bg-gradient-to-r from-rose-400 via-nature-400 to-amber-400 rounded-full mb-2">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-earth-800 rounded-full shadow-lg transition-all duration-500 ease-out"
                  style={{ left: `calc(${getMeterPosition(stats.ratio)}% - 12px)` }}
                />
             </div>
             <div className="flex justify-between text-xs font-medium text-earth-400 mb-6">
               <span>Green (10:1)</span>
               <span className="text-nature-600 font-bold">Ideal (30:1)</span>
               <span>Brown (60:1)</span>
             </div>

             <div className={`text-5xl font-bold transition-colors duration-300 ${getMeterColor(stats.ratio)}`}>
               {stats.totalParts > 0 ? stats.ratio.toFixed(1) : '--'}<span className="text-2xl text-earth-400">:1</span>
             </div>
             
             <div className="mt-4">
               {stats.totalParts > 0 && (
                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                    ${stats.status === 'IDEAL' ? 'bg-nature-100 text-nature-800' : 
                      stats.status === 'TOO_GREEN' ? 'bg-rose-100 text-rose-800' : 
                      'bg-amber-100 text-amber-800'}`}>
                   {stats.status === 'IDEAL' ? 'Perfect Balance! 🚀' : 
                    stats.status === 'TOO_GREEN' ? 'Too much Nitrogen (Add Browns) 🍂' : 
                    'Too much Carbon (Add Greens) 🌱'}
                 </span>
               )}
             </div>
          </div>

          {/* User's Mix List */}
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-6 min-h-[300px] flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-earth-900">Your Pile Composition</h3>
                <button 
                  onClick={() => { setMix([]); setAdvice(null); }}
                  disabled={mix.length === 0}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium disabled:opacity-30"
                >
                  Clear All
                </button>
             </div>

             {mix.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-earth-400 space-y-3 opacity-60">
                 <Leaf className="w-12 h-12" />
                 <p>Add ingredients to calculate ratio</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {mix.map((item) => (
                   <div key={item.ingredient.id} className="flex items-center justify-between bg-earth-50 p-3 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm mr-3">
                          {item.ingredient.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-earth-800">{item.ingredient.name}</div>
                          <div className="text-xs text-earth-500 capitalize">{item.ingredient.type} (C:N {item.ingredient.cnRatio})</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-white rounded-lg border border-earth-200 p-1">
                           <button 
                             onClick={() => updateParts(item.ingredient.id, -1)}
                             className="p-1 hover:bg-earth-100 rounded text-earth-600"
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <span className="text-sm font-bold w-4 text-center">{item.parts}</span>
                           <button 
                             onClick={() => updateParts(item.ingredient.id, 1)}
                             className="p-1 hover:bg-earth-100 rounded text-earth-600"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                        </div>
                        <button 
                          onClick={() => removeFromMix(item.ingredient.id)}
                          className="p-2 text-earth-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
             )}

             {/* AI Advisor Section */}
             {mix.length > 0 && (
                <div className="mt-8 pt-6 border-t border-earth-100">
                  {!advice ? (
                    <button
                      onClick={handleGetAdvice}
                      disabled={loadingAdvice}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center"
                    >
                      {loadingAdvice ? (
                         <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                         <Sparkles className="w-5 h-5 mr-2" />
                      )}
                      {loadingAdvice ? 'Gemini is thinking...' : 'Ask AI to Optimize Mix'}
                    </button>
                  ) : (
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 animate-fade-in relative">
                       <button 
                         onClick={() => setAdvice(null)}
                         className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-600"
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <div className="flex items-center mb-3">
                          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h4 className="font-bold text-indigo-900">Gemini's Advice</h4>
                       </div>
                       <div className="prose prose-sm prose-indigo text-indigo-900">
                          <ReactMarkdown>{advice}</ReactMarkdown>
                       </div>
                    </div>
                  )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompostCalculator;