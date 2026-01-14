import React, { useState, useRef } from 'react';
import { Camera, Video, BrainCircuit, Upload, Loader2, AlertCircle, CheckCircle2, Microscope } from 'lucide-react';
import { DiagnosticMode } from '../types';
import { analyzeImage, analyzeVideo, solveComplexProblem, fileToBase64 } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Diagnostics: React.FC = () => {
  const [activeMode, setActiveMode] = useState<DiagnosticMode>(DiagnosticMode.PHOTO);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setTextInput('');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (activeMode === DiagnosticMode.THINKING) {
        if (!textInput.trim()) throw new Error("Please enter a description of your problem.");
        const analysis = await solveComplexProblem(textInput);
        setResult(analysis);
      } else {
        if (!file) throw new Error("Please upload a file first.");
        const base64 = await fileToBase64(file);
        
        if (activeMode === DiagnosticMode.PHOTO) {
          const analysis = await analyzeImage(base64, file.type, textInput);
          setResult(analysis);
        } else if (activeMode === DiagnosticMode.VIDEO) {
          const analysis = await analyzeVideo(base64, file.type, textInput);
          setResult(analysis);
        }
      }
    } catch (err: any) {
        // Simple error handling
        let msg = "An error occurred during analysis.";
        if (err instanceof Error) msg = err.message;
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-earth-900">AI Diagnostics Hub</h2>
        <p className="text-earth-600 mt-2">
          Use Gemini's advanced multimodal capabilities to inspect your bin.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
        <button
          onClick={() => { setActiveMode(DiagnosticMode.PHOTO); resetState(); }}
          className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
            activeMode === DiagnosticMode.PHOTO 
            ? 'border-nature-500 bg-nature-50 text-nature-800' 
            : 'border-earth-100 bg-white text-earth-500 hover:bg-earth-50'
          }`}
        >
          <Camera className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Photo Check</div>
            <div className="text-xs opacity-75">Identify bugs & moisture</div>
          </div>
        </button>

        <button
          onClick={() => { setActiveMode(DiagnosticMode.VIDEO); resetState(); }}
          className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
            activeMode === DiagnosticMode.VIDEO 
            ? 'border-nature-500 bg-nature-50 text-nature-800' 
            : 'border-earth-100 bg-white text-earth-500 hover:bg-earth-50'
          }`}
        >
          <Video className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Video Audit</div>
            <div className="text-xs opacity-75">Analyze process & movement</div>
          </div>
        </button>

        <button
          onClick={() => { setActiveMode(DiagnosticMode.THINKING); resetState(); }}
          className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
            activeMode === DiagnosticMode.THINKING 
            ? 'border-indigo-500 bg-indigo-50 text-indigo-800' 
            : 'border-earth-100 bg-white text-earth-500 hover:bg-earth-50'
          }`}
        >
          <BrainCircuit className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Deep Thinking</div>
            <div className="text-xs opacity-75">Solve complex problems</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-3xl border border-earth-200 shadow-sm">
          <h3 className="text-xl font-bold text-earth-800 mb-4">
            {activeMode === DiagnosticMode.PHOTO && "Upload Photo"}
            {activeMode === DiagnosticMode.VIDEO && "Upload Video Clip"}
            {activeMode === DiagnosticMode.THINKING && "Describe the Situation"}
          </h3>

          {activeMode !== DiagnosticMode.THINKING && (
            <div className="mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  preview ? 'border-nature-400 bg-nature-50' : 'border-earth-300 hover:border-earth-400 hover:bg-earth-50'
                }`}
              >
                {preview ? (
                   activeMode === DiagnosticMode.VIDEO ? (
                     <video src={preview} controls className="h-full rounded-lg" />
                   ) : (
                     <img src={preview} alt="Preview" className="h-full object-contain rounded-lg" />
                   )
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-earth-400 mb-2" />
                    <span className="text-earth-500 font-medium">Click to upload {activeMode === DiagnosticMode.PHOTO ? 'Image' : 'Video'}</span>
                    <span className="text-earth-400 text-xs mt-1">
                        {activeMode === DiagnosticMode.VIDEO ? 'Max 10MB (Short clips)' : 'Max 5MB'}
                    </span>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept={activeMode === DiagnosticMode.PHOTO ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-earth-700 mb-2">
              {activeMode === DiagnosticMode.THINKING ? "Detailed Problem Description" : "Add a specific question (Optional)"}
            </label>
            <textarea
              className="w-full p-4 rounded-xl border border-earth-200 focus:ring-2 focus:ring-nature-200 focus:border-nature-500 outline-none resize-none h-32 text-earth-800"
              placeholder={activeMode === DiagnosticMode.THINKING 
                ? "E.g., My worm bin smells like ammonia, is very wet, and the population seems to be dying. I live in a humid climate. What step-by-step plan should I follow?" 
                : "E.g., Are these white mites harmful?"}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (activeMode !== DiagnosticMode.THINKING && !file) || (activeMode === DiagnosticMode.THINKING && !textInput.trim())}
            className="w-full bg-earth-800 hover:bg-earth-900 disabled:bg-earth-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                {activeMode === DiagnosticMode.THINKING ? <BrainCircuit className="w-5 h-5" /> : <Microscope className="w-5 h-5" />}
                <span>Start Diagnosis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-earth-50 p-6 rounded-3xl border border-earth-200 min-h-[400px]">
          <h3 className="text-xl font-bold text-earth-800 mb-4 flex items-center">
            Analysis Results
            {result && <CheckCircle2 className="w-5 h-5 text-nature-600 ml-2" />}
          </h3>
          
          {loading && (
            <div className="h-64 flex flex-col items-center justify-center text-earth-500 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-nature-600" />
              <div className="text-center">
                 <p className="font-medium">Gemini is thinking...</p>
                 {activeMode === DiagnosticMode.THINKING && <p className="text-xs max-w-xs mt-1">Complex reasoning budget active. This may take a moment.</p>}
                 {activeMode === DiagnosticMode.VIDEO && <p className="text-xs max-w-xs mt-1">Processing video frames...</p>}
              </div>
            </div>
          )}

          {error && (
             <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <p>{error}</p>
             </div>
          )}

          {!loading && !result && !error && (
            <div className="h-64 flex flex-col items-center justify-center text-earth-400">
               <div className="bg-earth-100 p-4 rounded-full mb-3">
                 <Microscope className="w-8 h-8 opacity-50" />
               </div>
               <p>Results will appear here</p>
            </div>
          )}

          {result && (
            <div className="prose prose-earth max-w-none animate-fade-in">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;