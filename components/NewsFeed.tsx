import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2, ExternalLink, RefreshCw, Calendar } from 'lucide-react';
import { fetchCompostNews } from '../services/geminiService';
import { SearchResultSource } from '../types';
import ReactMarkdown from 'react-markdown';

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchResultSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const { text, sources: newsSources } = await fetchCompostNews();
      setNews(text);
      setSources(newsSources);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Unable to load latest news. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
           <div className="inline-flex items-center justify-center p-3 bg-nature-100 rounded-full mb-3">
               <Newspaper className="w-8 h-8 text-nature-700" />
           </div>
           <h2 className="text-3xl font-bold text-earth-900">Soil & Compost News</h2>
           <p className="text-earth-600 mt-2">
             Curated updates, scientific breakthroughs, and trending stories powered by Google Search.
           </p>
        </div>
        
        <button 
           onClick={loadNews}
           disabled={loading}
           className="bg-white hover:bg-earth-50 text-earth-700 border border-earth-200 px-4 py-2 rounded-xl font-medium shadow-sm transition-colors flex items-center"
        >
           {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
           Refresh News
        </button>
      </div>

      {loading && !news && (
          <div className="flex flex-col items-center justify-center py-20 bg-earth-50 rounded-3xl border border-earth-100">
              <Loader2 className="w-12 h-12 text-nature-600 animate-spin mb-4" />
              <p className="text-earth-600 font-medium">Scanning the web for the latest dirt...</p>
          </div>
      )}

      {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-8 flex items-center">
              <span>{error}</span>
          </div>
      )}

      {news && (
          <div className="bg-white rounded-3xl shadow-sm border border-earth-100 overflow-hidden animate-fade-in">
              {/* Header Info */}
              {lastUpdated && (
                <div className="bg-earth-50 px-6 py-3 border-b border-earth-100 flex items-center text-xs text-earth-500 uppercase tracking-wide font-bold">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last Updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              
              <div className="p-8">
                {/* Main Content */}
                <div className="prose prose-earth prose-lg max-w-none mb-10">
                    <ReactMarkdown>{news}</ReactMarkdown>
                </div>

                {/* Sources Section */}
                {sources.length > 0 && (
                    <div className="bg-earth-50 rounded-xl p-6 border border-earth-100">
                        <h4 className="text-sm font-bold text-earth-500 uppercase tracking-wider mb-4">Read Full Stories</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sources.map((source, idx) => (
                                <a 
                                    key={idx}
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 rounded-lg bg-white border border-earth-200 hover:border-nature-400 hover:shadow-md transition-all group"
                                >
                                    <ExternalLink className="w-4 h-4 text-earth-400 mr-3 group-hover:text-nature-600 flex-shrink-0" />
                                    <span className="text-sm text-earth-700 font-medium truncate group-hover:text-nature-800">
                                        {source.title}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
              </div>
          </div>
      )}
    </div>
  );
};

export default NewsFeed;