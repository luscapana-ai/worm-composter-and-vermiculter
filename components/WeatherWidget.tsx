import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Thermometer, Wind, MapPin, Loader2, Navigation } from 'lucide-react';
import { getWeatherAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const WeatherWidget: React.FC = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const advice = await getWeatherAdvice(loc);
      setWeatherData(advice);
    } catch (e) {
      setError("Could not load weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Pass coordinates to Gemini, it can handle them
          const coords = `${latitude}, ${longitude}`;
          setLocation("Current Location");
          fetchWeather(coords);
        },
        (err) => {
          setLoading(false);
          setError("Location access denied. Please enter city manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sun className="w-24 h-24 text-sky-400" />
        </div>

        <div className="relative z-10">
            <h3 className="text-lg font-bold text-earth-800 flex items-center mb-4">
                <Thermometer className="w-5 h-5 mr-2 text-rose-500" />
                Compost Weather Watch
            </h3>

            {!weatherData && !loading && (
                <div className="space-y-3">
                    <p className="text-sm text-earth-600 mb-2">Get personalized bin advice based on your local forecast.</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleGeoLocation}
                            className="bg-sky-100 hover:bg-sky-200 text-sky-700 p-3 rounded-xl transition-colors"
                            title="Use My Location"
                        >
                            <Navigation className="w-5 h-5" />
                        </button>
                        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Enter City..."
                                className="flex-1 p-2.5 rounded-xl border border-earth-200 text-sm focus:ring-2 focus:ring-sky-200 outline-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className="bg-earth-800 text-white px-4 py-2 rounded-xl text-sm font-bold"
                            >
                                Check
                            </button>
                        </form>
                    </div>
                    {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
                </div>
            )}

            {loading && (
                <div className="py-8 flex flex-col items-center justify-center text-sky-600">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-xs font-medium">Analyzing forecast...</p>
                </div>
            )}

            {weatherData && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center text-sky-800 text-sm font-bold">
                            <MapPin className="w-4 h-4 mr-1" />
                            {location === "Current Location" ? "Local Forecast" : location}
                        </div>
                        <button 
                            onClick={() => { setWeatherData(null); setLocation(''); }}
                            className="text-xs text-sky-500 hover:text-sky-700 underline"
                        >
                            Change
                        </button>
                    </div>
                    
                    <div className="prose prose-sm prose-sky max-w-none bg-white/50 p-4 rounded-xl border border-sky-100">
                        <ReactMarkdown>{weatherData}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default WeatherWidget;