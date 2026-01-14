import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, Sprout, Utensils, Home as HomeIcon, Shovel, BookOpen, ChevronDown, ChevronUp, Thermometer, Droplets, AlertTriangle, Package, ShoppingBag } from 'lucide-react';
import { searchTopic } from '../services/geminiService';
import { SearchResultSource } from '../types';
import ReactMarkdown from 'react-markdown';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const VermicultureGuide: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchResultSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Accordion state for the guide
  const [openSection, setOpenSection] = useState<number | null>(0); // Default first open

  const handleSearch = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const searchQuery = typeof e === 'string' ? e : query;
    if (!searchQuery.trim()) return;

    if (typeof e === 'string') setQuery(e);

    setLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const { text, sources: searchSources } = await searchTopic(searchQuery, 'Vermiculture and Worm Farming (Red Wigglers)');
      setResult(text);
      setSources(searchSources);
    } catch (err) {
      setError("Failed to fetch information. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const guideSections: GuideSection[] = [
    {
      title: "Meet Your Workers: Red Wigglers",
      icon: <Sprout className="w-5 h-5 text-rose-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <p>Not all worms are created equal! For a worm bin, you need specific composting worms, not the earthworms you find in your garden soil.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <h4 className="font-bold text-rose-800 mb-2 border-b border-rose-200 pb-1">Red Wigglers (Eisenia fetida)</h4>
              <p className="text-sm text-rose-900 leading-relaxed">
                The gold standard. They thrive in rotting vegetation, tolerate crowding, and eat half their body weight daily. They live close to the surface.
              </p>
            </div>
            <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
              <h4 className="font-bold text-earth-800 mb-2 border-b border-earth-200 pb-1">Garden Earthworms</h4>
              <p className="text-sm text-earth-900 leading-relaxed">
                <strong>Do NOT use these.</strong> They require deep soil to burrow and will die in a bin environment.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Perfect Habitat",
      icon: <HomeIcon className="w-5 h-5 text-earth-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <p>Worms have three main requirements to stay happy and productive:</p>
          <ul className="space-y-3">
             <li className="flex items-start">
                <div className="bg-sky-100 p-1.5 rounded-lg mr-3 mt-0.5">
                    <Droplets className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                    <strong className="block text-earth-900">Moisture</strong>
                    <span className="text-sm">The bedding should feel like a <strong>wrung-out sponge</strong>. If you squeeze a handful, a drop or two should appear. If it's too dry, they can't breathe.</span>
                </div>
             </li>
             <li className="flex items-start">
                <div className="bg-amber-100 p-1.5 rounded-lg mr-3 mt-0.5">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <strong className="block text-earth-900">Temperature</strong>
                    <span className="text-sm">Ideal range is <strong>55°F - 77°F (13°C - 25°C)</strong>. Avoid freezing cold or extreme heat. Keep the bin in the shade or indoors.</span>
                </div>
             </li>
             <li className="flex items-start">
                <div className="bg-earth-200 p-1.5 rounded-lg mr-3 mt-0.5">
                    <HomeIcon className="w-4 h-4 text-earth-600" />
                </div>
                <div>
                    <strong className="block text-earth-900">Bedding</strong>
                    <span className="text-sm">Use carbon-rich materials like shredded cardboard, coconut coir, or shredded newspaper. This mimics their natural environment of leaf litter.</span>
                </div>
             </li>
          </ul>
        </div>
      )
    },
    {
      title: "Choosing Your Bin Style",
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <p className="text-sm">There are three main ways to house your worms. Choose the one that fits your space and budget.</p>
          
          <div className="space-y-3">
             {/* Flow-Through */}
             <div className="bg-white p-4 rounded-lg border border-earth-200 shadow-sm">
                <h4 className="font-bold text-earth-900 mb-1">Flow-Through Bags (Best All-Rounder)</h4>
                <p className="text-xs text-earth-500 mb-2">Highly recommended for beginners.</p>
                <ul className="text-sm text-earth-600 space-y-1 mb-3">
                    <li><span className="text-nature-600 font-bold">+</span> Breathable fabric prevents boggy conditions.</li>
                    <li><span className="text-nature-600 font-bold">+</span> Easiest harvesting (collect from bottom zipper).</li>
                    <li><span className="text-rose-600 font-bold">-</span> Requires a stand or hanging mount.</li>
                </ul>
                <div className="text-xs text-indigo-600 font-medium flex items-center bg-indigo-50 p-2 rounded">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    <span>Shop Recommendation: <span className="font-bold">Urban Worm Bag</span></span>
                </div>
             </div>

             {/* Stacking Trays */}
             <div className="bg-white p-4 rounded-lg border border-earth-200 shadow-sm">
                <h4 className="font-bold text-earth-900 mb-1">Stacking Tray Systems</h4>
                <p className="text-xs text-earth-500 mb-2">The organized approach.</p>
                <ul className="text-sm text-earth-600 space-y-1 mb-2">
                    <li><span className="text-nature-600 font-bold">+</span> Worms migrate upward, leaving finished compost below.</li>
                    <li><span className="text-nature-600 font-bold">+</span> Compact and neat appearance.</li>
                    <li><span className="text-rose-600 font-bold">-</span> Trays can be heavy to lift; plastic can retain too much heat.</li>
                </ul>
             </div>

             {/* DIY Totes */}
             <div className="bg-white p-4 rounded-lg border border-earth-200 shadow-sm">
                <h4 className="font-bold text-earth-900 mb-1">DIY Plastic Tote</h4>
                <p className="text-xs text-earth-500 mb-2">The budget option.</p>
                <ul className="text-sm text-earth-600 space-y-1 mb-3">
                    <li><span className="text-nature-600 font-bold">+</span> Extremely cheap (under $10).</li>
                    <li><span className="text-rose-600 font-bold">-</span> Hard to control moisture (often gets swampy).</li>
                    <li><span className="text-rose-600 font-bold">-</span> Harvesting is messy (dump and sort).</li>
                </ul>
                 <div className="text-xs text-indigo-600 font-medium flex items-center bg-indigo-50 p-2 rounded">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    <span>Shop Recommendation: <span className="font-bold">Kitchen Counter Bin</span> (for small scale)</span>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Menu: Feed vs. Avoid",
      icon: <Utensils className="w-5 h-5 text-nature-600" />,
      content: (
        <div className="space-y-3 text-earth-700">
          <p className="text-sm">Feed worms small amounts frequently rather than a lot at once. Always bury food under bedding to prevent fruit flies.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-nature-50 p-4 rounded-lg border border-nature-100">
                <h4 className="font-bold text-nature-800 mb-2 flex items-center">
                    <span className="bg-nature-200 text-nature-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">✓</span>
                    Safe to Feed
                </h4>
                <ul className="text-sm space-y-1 text-nature-900 list-disc list-inside">
                    <li>Fruit scraps (apples, bananas, melons)</li>
                    <li>Vegetable scraps (carrots, lettuce)</li>
                    <li>Coffee grounds & filters</li>
                    <li>Crushed eggshells (essential grit!)</li>
                    <li>Tea bags (staple removed)</li>
                </ul>
             </div>
             <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-bold text-red-800 mb-2 flex items-center">
                    <span className="bg-red-200 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">✗</span>
                    Avoid
                </h4>
                <ul className="text-sm space-y-1 text-red-900 list-disc list-inside">
                    <li>Citrus (too acidic)</li>
                    <li>Onions & Garlic (too smelly/strong)</li>
                    <li>Meat, Dairy, or Oily foods</li>
                    <li>Salty processed foods</li>
                    <li>Spicy foods</li>
                </ul>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Troubleshooting",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <div className="flex items-start bg-white p-3 rounded-lg border border-earth-100">
            <span className="text-2xl mr-3">🏃</span>
            <div>
              <strong className="block text-earth-900">Worms trying to escape?</strong>
              <p className="text-sm text-earth-600 mt-1">
                Something is wrong with the conditions. It's likely too wet, too acidic (add crushed eggshells), or there is no air (fluff the bedding).
              </p>
            </div>
          </div>
          <div className="flex items-start bg-white p-3 rounded-lg border border-earth-100">
            <span className="text-2xl mr-3">👃</span>
            <div>
              <strong className="block text-earth-900">Bin smells bad?</strong>
              <p className="text-sm text-earth-600 mt-1">
                You are likely overfeeding. Worms can't keep up with the rot. Stop feeding, add plenty of fresh dry bedding (cardboard/paper) to absorb moisture, and wait.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-earth-200">
            <h4 className="font-bold text-earth-900 mb-4 flex items-center">
              <span className="bg-indigo-100 p-1 rounded mr-2 text-xl">🔍</span> 
              Critter Identification Guide
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Friends */}
              <div className="bg-nature-50 p-4 rounded-xl border border-nature-100">
                <span className="inline-block px-2 py-1 bg-nature-200 text-nature-800 text-xs font-bold rounded-md mb-3">FRIENDS (Do Not Panic)</span>
                <ul className="space-y-3 text-sm text-nature-900">
                  <li className="flex gap-2">
                    <span className="text-lg">🧂</span>
                    <div>
                      <strong>Springtails</strong>
                      <p className="text-xs text-nature-700 leading-tight mt-0.5">Tiny jumping white specks. They eat mold and are a sign of a healthy ecosystem.</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg">⚪</span>
                    <div>
                      <strong>Pot Worms</strong>
                      <p className="text-xs text-nature-700 leading-tight mt-0.5">Tiny white threads often mistaken for baby red wigglers. Harmless decomposers, but high numbers mean high acidity.</p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg">🐞</span>
                    <div>
                      <strong>Mites</strong>
                      <p className="text-xs text-nature-700 leading-tight mt-0.5">Round white/brown/red dots. Decomposers. If the bin is covered in them, it's too wet.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Foes */}
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <span className="inline-block px-2 py-1 bg-rose-200 text-rose-800 text-xs font-bold rounded-md mb-3">FOES (Take Action)</span>
                <ul className="space-y-3 text-sm text-rose-900">
                  <li className="flex gap-2">
                    <span className="text-lg">🦂</span>
                    <div>
                      <strong>Centipedes</strong>
                      <p className="text-xs text-rose-700 leading-tight mt-0.5">Flat, segmented, fast. They are predators that eat worms. <span className="font-bold underline">Remove them manually.</span></p>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-lg">🪰</span>
                    <div>
                      <strong>Fruit Flies</strong>
                      <p className="text-xs text-rose-700 leading-tight mt-0.5">Nuisance clouds. You are leaving food exposed. <span className="font-bold underline">Bury food deeper</span> and add a cardboard "blanket" on top.</p>
                    </div>
                  </li>
                   <li className="flex gap-2">
                    <span className="text-lg">🐜</span>
                    <div>
                      <strong>Ants</strong>
                      <p className="text-xs text-rose-700 leading-tight mt-0.5">Invaders stealing food. Means bin is too dry. <span className="font-bold underline">Add water</span> and grease the bin legs/create a water moat.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-4">
            <Sprout className="w-8 h-8 text-rose-700" />
        </div>
        <h2 className="text-3xl font-bold text-earth-900 mb-2">Worm Farming Guide</h2>
        <p className="text-earth-600">
            Harness the power of Red Wigglers to create premium castings.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the Worm Whisperer (e.g., 'Why are worms crawling up the sides?')"
          className="w-full px-6 py-4 rounded-full border-2 border-earth-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-lg shadow-sm transition-all pl-14"
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-earth-400 w-6 h-6" />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-rose-600 hover:bg-rose-700 disabled:bg-earth-300 text-white px-6 rounded-full font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask'}
        </button>
      </form>

      {/* Results Area */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-12 bg-white rounded-3xl p-8 shadow-sm border border-earth-100 animate-fade-in">
          <div className="prose prose-earth max-w-none mb-8">
             <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-earth-100">
              <h4 className="text-sm font-bold text-earth-500 uppercase tracking-wider mb-4">Sources & References</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg bg-earth-50 hover:bg-nature-50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-earth-400 mr-3 group-hover:text-nature-600" />
                      <span className="text-sm text-earth-700 font-medium truncate group-hover:text-nature-700">
                        {source.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button 
            onClick={() => setResult(null)} 
            className="mt-6 text-rose-700 font-medium hover:text-rose-800 hover:underline"
          >
            ← Back to Guide
          </button>
        </div>
      )}

      {/* Static Encyclopedia Content (Visible when no search result) */}
      {!result && (
        <div className="animate-fade-in">
          {/* Quick Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <button 
                onClick={() => handleSearch("What foods are safe and unsafe for red wiggler worms?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-amber-300 transition-all text-left group"
            >
                <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Utensils className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">The Menu</h3>
                <p className="text-xs text-earth-500">What to feed (and what to avoid) to keep them happy.</p>
            </button>
            
            <button 
                onClick={() => handleSearch("How to prepare bedding for worm farm coconut coir?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-earth-400 transition-all text-left group"
            >
                <div className="bg-earth-200 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <HomeIcon className="w-5 h-5 text-earth-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">Bedding Basics</h3>
                <p className="text-xs text-earth-500">Coco coir, cardboard, and maintaining neutral pH.</p>
            </button>

            <button 
                onClick={() => handleSearch("How to harvest worm castings from a bin?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-nature-300 transition-all text-left group"
            >
                <div className="bg-nature-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shovel className="w-5 h-5 text-nature-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">Harvesting</h3>
                <p className="text-xs text-earth-500">Separate the black gold from your wigglers.</p>
            </button>
          </div>

          {/* Encyclopedia Section */}
          <div className="bg-white rounded-3xl border border-earth-200 overflow-hidden shadow-sm">
            <div className="bg-earth-50 p-6 border-b border-earth-200 flex items-center">
              <BookOpen className="w-6 h-6 text-earth-600 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-earth-900">Worm Farming 101: Encyclopedia</h3>
                <p className="text-sm text-earth-500">Essential knowledge for raising Red Wigglers.</p>
              </div>
            </div>
            
            <div className="divide-y divide-earth-100">
              {guideSections.map((section, index) => (
                <div key={index} className="transition-colors hover:bg-earth-50">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${openSection === index ? 'bg-earth-200' : 'bg-earth-100'}`}>
                        {section.icon}
                      </div>
                      <span className="font-bold text-earth-800 text-lg">{section.title}</span>
                    </div>
                    {openSection === index ? (
                      <ChevronUp className="w-5 h-5 text-earth-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-earth-400" />
                    )}
                  </button>
                  
                  {openSection === index && (
                    <div className="px-6 pb-6 pt-0 animate-fade-in pl-[4.5rem]">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VermicultureGuide;