import React, { useState } from 'react';
import { CompostBin, BinLog } from '../types';
import { ClipboardList, Plus, Thermometer, Droplets, Wind, Trash2, LineChart, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { analyzeBinHealth } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface BinTrackerProps {
  bins: CompostBin[];
  onAddBin: (bin: CompostBin) => void;
  onAddLog: (binId: string, log: BinLog) => void;
  onDeleteBin: (binId: string) => void;
}

const BinTracker: React.FC<BinTrackerProps> = ({ bins, onAddBin, onAddLog, onDeleteBin }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const [newBinType, setNewBinType] = useState<'hot' | 'cold' | 'vermicompost'>('cold');

  const [expandedBin, setExpandedBin] = useState<string | null>(null);
  const [logForm, setLogForm] = useState<Partial<BinLog>>({
    moisture: 'ideal',
    smell: 'none',
    notes: ''
  });

  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState(false);

  const handleCreateBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinName) return;
    
    const newBin: CompostBin = {
        id: Date.now().toString(),
        name: newBinName,
        type: newBinType,
        startDate: new Date().toISOString(),
        logs: []
    };
    onAddBin(newBin);
    setNewBinName('');
    setIsCreating(false);
  };

  const handleLogSubmit = (binId: string) => {
    const newLog: BinLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        temperature: logForm.temperature,
        moisture: logForm.moisture as any,
        smell: logForm.smell as any,
        notes: logForm.notes || ''
    };
    onAddLog(binId, newLog);
    setLogForm({ moisture: 'ideal', smell: 'none', notes: '', temperature: undefined });
  };

  const handleAnalyze = async (bin: CompostBin) => {
    if (bin.logs.length === 0) return;
    setAnalyzing(true);
    try {
        const result = await analyzeBinHealth(bin.type, bin.logs);
        setAiAnalysis(prev => ({ ...prev, [bin.id]: result }));
    } catch (e) {
        console.error(e);
    } finally {
        setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-bold text-earth-900">My Bins</h2>
           <p className="text-earth-600 mt-2">Track temperature, moisture, and health over time.</p>
        </div>
        <button 
            onClick={() => setIsCreating(true)}
            className="mt-4 sm:mt-0 bg-nature-600 hover:bg-nature-700 text-white px-4 py-2 rounded-xl font-bold flex items-center shadow-sm"
        >
            <Plus className="w-5 h-5 mr-2" />
            Add Bin
        </button>
      </div>

      {isCreating && (
          <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-sm mb-8 animate-fade-in">
             <h3 className="font-bold text-earth-900 mb-4">Setup New Bin</h3>
             <form onSubmit={handleCreateBin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Bin Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 outline-none"
                        placeholder="e.g. Backyard Pile #1"
                        value={newBinName}
                        onChange={(e) => setNewBinName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Type</label>
                    <select 
                        className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 outline-none bg-white"
                        value={newBinType}
                        onChange={(e) => setNewBinType(e.target.value as any)}
                    >
                        <option value="hot">Hot Composting</option>
                        <option value="cold">Cold Composting</option>
                        <option value="vermicompost">Worm Bin</option>
                    </select>
                </div>
                <div className="flex space-x-3 pt-2">
                    <button type="submit" className="bg-earth-800 text-white px-4 py-2 rounded-lg font-medium">Create</button>
                    <button type="button" onClick={() => setIsCreating(false)} className="bg-white border border-earth-300 text-earth-700 px-4 py-2 rounded-lg font-medium">Cancel</button>
                </div>
             </form>
          </div>
      )}

      {bins.length === 0 ? (
          <div className="text-center py-16 bg-earth-50 rounded-2xl border-2 border-dashed border-earth-200">
             <ClipboardList className="w-12 h-12 text-earth-300 mx-auto mb-3" />
             <p className="text-earth-500 font-medium">No bins being tracked yet.</p>
          </div>
      ) : (
          <div className="space-y-6">
              {bins.map(bin => (
                  <div key={bin.id} className="bg-white rounded-2xl border border-earth-200 shadow-sm overflow-hidden">
                      <div className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-earth-50 transition-colors" onClick={() => setExpandedBin(expandedBin === bin.id ? null : bin.id)}>
                          <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-full ${bin.type === 'hot' ? 'bg-rose-100 text-rose-600' : bin.type === 'vermicompost' ? 'bg-indigo-100 text-indigo-600' : 'bg-nature-100 text-nature-600'}`}>
                                  {bin.type === 'hot' ? <Thermometer className="w-6 h-6" /> : bin.type === 'vermicompost' ? <Sparkles className="w-6 h-6" /> : <Wind className="w-6 h-6" />}
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg text-earth-900">{bin.name}</h3>
                                  <p className="text-sm text-earth-500 capitalize">{bin.type} • Started {new Date(bin.startDate).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <div className="flex items-center space-x-4">
                             <div className="text-right hidden sm:block">
                                 <p className="text-xs font-bold text-earth-400 uppercase">Last Log</p>
                                 <p className="text-sm font-medium text-earth-800">
                                     {bin.logs.length > 0 ? new Date(bin.logs[0].date).toLocaleDateString() : 'Never'}
                                 </p>
                             </div>
                             {expandedBin === bin.id ? <ChevronUp className="w-5 h-5 text-earth-400" /> : <ChevronDown className="w-5 h-5 text-earth-400" />}
                          </div>
                      </div>

                      {expandedBin === bin.id && (
                          <div className="border-t border-earth-100 bg-earth-50 p-6 animate-fade-in">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Log Form */}
                                  <div>
                                      <h4 className="font-bold text-earth-800 mb-3 flex items-center">
                                          <Plus className="w-4 h-4 mr-2" />
                                          Add Daily Log
                                      </h4>
                                      <div className="bg-white p-4 rounded-xl border border-earth-200 space-y-3">
                                          <div className="grid grid-cols-2 gap-3">
                                              <div>
                                                  <label className="text-xs font-bold text-earth-500 uppercase">Temp (°F)</label>
                                                  <input 
                                                    type="number" 
                                                    className="w-full p-2 border border-earth-200 rounded-lg"
                                                    placeholder="e.g. 140"
                                                    value={logForm.temperature || ''}
                                                    onChange={(e) => setLogForm({...logForm, temperature: Number(e.target.value)})}
                                                  />
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-earth-500 uppercase">Moisture</label>
                                                  <select 
                                                    className="w-full p-2 border border-earth-200 rounded-lg bg-white"
                                                    value={logForm.moisture}
                                                    onChange={(e) => setLogForm({...logForm, moisture: e.target.value as any})}
                                                  >
                                                      <option value="dry">Dry</option>
                                                      <option value="ideal">Ideal (Sponge)</option>
                                                      <option value="wet">Wet</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-earth-500 uppercase">Smell</label>
                                              <select 
                                                className="w-full p-2 border border-earth-200 rounded-lg bg-white"
                                                value={logForm.smell}
                                                onChange={(e) => setLogForm({...logForm, smell: e.target.value as any})}
                                              >
                                                  <option value="none">Earthy / None</option>
                                                  <option value="sour">Sour / Vinegar</option>
                                                  <option value="ammonia">Ammonia</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-earth-500 uppercase">Notes</label>
                                              <input 
                                                type="text" 
                                                className="w-full p-2 border border-earth-200 rounded-lg"
                                                placeholder="Turned pile, added browns..."
                                                value={logForm.notes}
                                                onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                                              />
                                          </div>
                                          <button 
                                            onClick={() => handleLogSubmit(bin.id)}
                                            className="w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-2 rounded-lg text-sm"
                                          >
                                              Save Log
                                          </button>
                                      </div>
                                  </div>

                                  {/* Log History */}
                                  <div>
                                      <div className="flex justify-between items-center mb-3">
                                          <h4 className="font-bold text-earth-800 flex items-center">
                                              <ClipboardList className="w-4 h-4 mr-2" />
                                              Recent History
                                          </h4>
                                          <button 
                                            onClick={() => onDeleteBin(bin.id)}
                                            className="text-rose-400 hover:text-rose-600"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </div>
                                      
                                      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                                          {bin.logs.length === 0 ? (
                                              <p className="text-sm text-earth-400 italic">No logs recorded yet.</p>
                                          ) : (
                                              bin.logs.slice().reverse().map(log => (
                                                  <div key={log.id} className="bg-white p-3 rounded-lg border border-earth-100 text-sm">
                                                      <div className="flex justify-between font-bold text-earth-700 mb-1">
                                                          <span>{new Date(log.date).toLocaleDateString()}</span>
                                                          {log.temperature && <span>{log.temperature}°F</span>}
                                                      </div>
                                                      <div className="flex gap-2 text-xs text-earth-500 mb-1">
                                                          <span className={`px-1.5 rounded ${log.moisture === 'ideal' ? 'bg-nature-100 text-nature-700' : 'bg-red-50 text-red-700'}`}>{log.moisture}</span>
                                                          <span className={`px-1.5 rounded ${log.smell === 'none' ? 'bg-nature-100 text-nature-700' : 'bg-red-50 text-red-700'}`}>{log.smell}</span>
                                                      </div>
                                                      <p className="text-earth-600">{log.notes}</p>
                                                  </div>
                                              ))
                                          )}
                                      </div>

                                      {bin.logs.length > 2 && (
                                          <div className="mt-4">
                                              {!aiAnalysis[bin.id] ? (
                                                  <button 
                                                    onClick={() => handleAnalyze(bin)}
                                                    disabled={analyzing}
                                                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
                                                  >
                                                      {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                                      Analyze Trends with AI
                                                  </button>
                                              ) : (
                                                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 prose prose-sm prose-indigo">
                                                      <ReactMarkdown>{aiAnalysis[bin.id]}</ReactMarkdown>
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default BinTracker;