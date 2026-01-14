import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, Layers, ThermometerSun, Wind, BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { searchTopic } from '../services/geminiService';
import { SearchResultSource } from '../types';
import ReactMarkdown from 'react-markdown';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const CompostingGuide: React.FC = () => {
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
      const { text, sources: searchSources } = await searchTopic(searchQuery, 'Traditional Composting (Hot and Cold)');
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
      title: "The Golden Ratio: Greens vs. Browns",
      icon: <Layers className="w-5 h-5 text-nature-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <p>Successful composting relies on balancing two types of materials: <strong>Nitrogen (Greens)</strong> and <strong>Carbon (Browns)</strong>. The microorganisms that break down your pile need both.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="bg-nature-50 p-4 rounded-xl border border-nature-200">
              <h4 className="font-bold text-nature-800 mb-2 border-b border-nature-200 pb-1">Greens (Nitrogen)</h4>
              <p className="text-xs text-nature-600 mb-2">Provides moisture & nutrients for bacteria.</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-nature-900">
                <li>Vegetable & fruit scraps</li>
                <li>Coffee grounds & tea bags</li>
                <li>Fresh grass clippings</li>
                <li>Plant trimmings</li>
                <li>Manure (herbivores only)</li>
              </ul>
            </div>
            <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
              <h4 className="font-bold text-earth-800 mb-2 border-b border-earth-200 pb-1">Browns (Carbon)</h4>
              <p className="text-xs text-earth-600 mb-2">Provides energy & structure (air flow).</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-earth-900">
                <li>Dry leaves & twigs</li>
                <li>Cardboard & paper (uncoated)</li>
                <li>Straw & hay</li>
                <li>Sawdust (untreated wood)</li>
                <li>Dryer lint (natural fibers)</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-nature-500 text-sm shadow-sm">
            <strong>Rule of Thumb:</strong> Aim for a volume ratio of roughly <strong>2 to 3 parts Browns</strong> for every <strong>1 part Green</strong>. This prevents slimy, smelly piles and ensures efficient breakdown.
          </div>
        </div>
      )
    },
    {
      title: "Methods: Hot vs. Cold Composting",
      icon: <ThermometerSun className="w-5 h-5 text-rose-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
                <h4 className="font-bold text-earth-900 flex items-center mb-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                    Hot Composting (Fast)
                </h4>
                <p className="text-sm mb-2 leading-relaxed">
                    This method optimizes conditions for thermophilic bacteria. You build a large pile (min 3x3x3 ft) all at once. The pile heats up to <strong>130-160°F</strong>, killing weed seeds and pathogens.
                </p>
                <ul className="text-sm space-y-1 text-earth-600">
                    <li>• Ready in 1-3 months</li>
                    <li>• Requires frequent turning (aeration)</li>
                    <li>• Needs careful moisture monitoring</li>
                </ul>
             </div>
             <div className="flex-1">
                <h4 className="font-bold text-earth-900 flex items-center mb-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
                    Cold Composting (Slow)
                </h4>
                <p className="text-sm mb-2 leading-relaxed">
                    The "add as you go" method. You throw scraps in a bin or pile and let nature take its course. It doesn't heat up significantly.
                </p>
                <ul className="text-sm space-y-1 text-earth-600">
                    <li>• Ready in 6-12 months</li>
                    <li>• Low maintenance (little turning)</li>
                    <li>• <strong>Warning:</strong> Does not kill weed seeds or diseases</li>
                </ul>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "What NOT to Compost",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      content: (
        <div className="space-y-3 text-earth-700">
          <p className="text-sm">To avoid attracting pests, creating foul odors, or introducing pathogens to your garden, keep these items out of your backyard bin:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Meat, fish, and bones
             </div>
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Dairy products (cheese, milk)
             </div>
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Oils, grease, and lard
             </div>
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Pet waste (dog/cat/human)
             </div>
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Glossy/coated paper
             </div>
             <div className="flex items-center p-2 rounded bg-red-50 text-red-800 text-sm">
                <span className="mr-2 font-bold text-red-600">❌</span> Diseased plants or invasive weeds
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Troubleshooting Guide",
      icon: <Wind className="w-5 h-5 text-sky-600" />,
      content: (
        <div className="space-y-4 text-earth-700">
          <div className="flex items-start bg-white p-3 rounded-lg border border-earth-100">
            <span className="text-2xl mr-3">👃</span>
            <div>
              <strong className="block text-earth-900">Smells like rotten eggs or ammonia?</strong>
              <p className="text-sm text-earth-600 mt-1">
                <strong>Cause:</strong> Anaerobic conditions (no air) or too much nitrogen.<br/>
                <strong>Fix:</strong> Add carbon (browns) like dry leaves or cardboard and turn the pile to aerate.
              </p>
            </div>
          </div>
          <div className="flex items-start bg-white p-3 rounded-lg border border-earth-100">
            <span className="text-2xl mr-3">🌵</span>
            <div>
              <strong className="block text-earth-900">Pile is dry and nothing is happening?</strong>
              <p className="text-sm text-earth-600 mt-1">
                <strong>Cause:</strong> Too much carbon or lack of moisture.<br/>
                <strong>Fix:</strong> Add greens, water until it feels like a wrung-out sponge, and mix.
              </p>
            </div>
          </div>
          <div className="flex items-start bg-white p-3 rounded-lg border border-earth-100">
            <span className="text-2xl mr-3">🪰</span>
            <div>
              <strong className="block text-earth-900">Swarming with fruit flies?</strong>
              <p className="text-sm text-earth-600 mt-1">
                <strong>Cause:</strong> Exposed food scraps.<br/>
                <strong>Fix:</strong> Bury food scraps deep within the pile and cover the top with a thick layer of browns.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-earth-100 rounded-full mb-4">
            <Layers className="w-8 h-8 text-earth-700" />
        </div>
        <h2 className="text-3xl font-bold text-earth-900 mb-2">Composting Mastery</h2>
        <p className="text-earth-600">
            The art of balancing Greens (Nitrogen) and Browns (Carbon).
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the Compost Coach (e.g., 'Can I compost citrus peels?')"
          className="w-full px-6 py-4 rounded-full border-2 border-earth-200 focus:border-nature-500 focus:ring-4 focus:ring-nature-100 outline-none text-lg shadow-sm transition-all pl-14"
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-earth-400 w-6 h-6" />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white px-6 rounded-full font-medium transition-colors"
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
            className="mt-6 text-nature-700 font-medium hover:text-nature-800 hover:underline"
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
                onClick={() => handleSearch("What is the ideal ratio of brown to green compost materials?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-nature-300 transition-all text-left group"
            >
                <div className="bg-nature-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5 text-nature-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">Browns vs Greens</h3>
                <p className="text-xs text-earth-500">Master the C:N ratio for faster decomposition.</p>
            </button>
            
            <button 
                onClick={() => handleSearch("How to start hot composting pile temperature?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-rose-300 transition-all text-left group"
            >
                <div className="bg-rose-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ThermometerSun className="w-5 h-5 text-rose-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">Hot Composting</h3>
                <p className="text-xs text-earth-500">Cook weed seeds and pathogens at 130°F+.</p>
            </button>

            <button 
                onClick={() => handleSearch("How to aerate compost pile and troubleshoot smells?")}
                className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 hover:shadow-md hover:border-sky-300 transition-all text-left group"
            >
                <div className="bg-sky-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Wind className="w-5 h-5 text-sky-700" />
                </div>
                <h3 className="font-bold text-earth-900 mb-1">Air & Moisture</h3>
                <p className="text-xs text-earth-500">Troubleshoot smells and soggy piles.</p>
            </button>
          </div>

          {/* Encyclopedia Section */}
          <div className="bg-white rounded-3xl border border-earth-200 overflow-hidden shadow-sm">
            <div className="bg-earth-50 p-6 border-b border-earth-200 flex items-center">
              <BookOpen className="w-6 h-6 text-earth-600 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-earth-900">Composting 101: Encyclopedia</h3>
                <p className="text-sm text-earth-500">Essential knowledge for every gardener.</p>
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

export default CompostingGuide;