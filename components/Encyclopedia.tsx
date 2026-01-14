import React, { useState } from 'react';
import { Search, Loader2, ExternalLink } from 'lucide-react';
import { searchEncyclopedia } from '../services/geminiService';
import { SearchResultSource } from '../types';
import ReactMarkdown from 'react-markdown';

const Encyclopedia: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchResultSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const { text, sources: searchSources } = await searchEncyclopedia(query);
      setResult(text);
      setSources(searchSources);
    } catch (err) {
      setError("Failed to fetch information. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const commonTopics = [
    "How to start a worm bin",
    "Carbon to Nitrogen Ratio",
    "Can I compost citrus?",
    "Treating compost mites",
    "Hot vs Cold Composting"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-earth-900 mb-3">Compost Encyclopedia</h2>
        <p className="text-earth-600">
          Powered by Google Search Grounding for the most up-to-date and accurate advice.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about composting (e.g., 'Why do my worms escape?')"
          className="w-full px-6 py-4 rounded-full border-2 border-earth-200 focus:border-nature-500 focus:ring-4 focus:ring-nature-100 outline-none text-lg shadow-sm transition-all pl-14"
        />
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-earth-400 w-6 h-6" />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white px-6 rounded-full font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Common Topics Pills */}
      {!result && !loading && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {commonTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => { setQuery(topic); }}
              className="px-4 py-2 bg-white border border-earth-200 rounded-full text-earth-700 hover:bg-earth-50 hover:border-nature-400 transition-colors text-sm"
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Results Area */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-earth-100 animate-fade-in">
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
        </div>
      )}
    </div>
  );
};

export default Encyclopedia;