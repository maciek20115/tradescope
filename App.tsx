
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import { analyzeChart } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the "data:image/jpeg;base64," part
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleImageUpload = useCallback(async (file: File) => {
    handleReset();
    setImageFile(file);
    try {
      const base64String = await fileToBase64(file);
      setImageBase64(base64String);
    } catch (err) {
      setError('Could not process the image file.');
      console.error(err);
    }
  }, []);
  
  const handleAnalyzeClick = useCallback(async () => {
    if (!imageBase64 || !imageFile) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const result = await analyzeChart(imageBase64, imageFile.type);
      setAnalysis(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, imageFile]);
  
  const handleReset = () => {
    setImageFile(null);
    setImageBase64(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-grid-slate-700/[0.2] font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />

        <main className="mt-8">
          {!imageFile && <ImageUploader onImageUpload={handleImageUpload} />}

          {imageFile && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 border-4 border-slate-700 rounded-lg shadow-lg shadow-black/50 overflow-hidden">
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Market chart preview" 
                  className="max-w-full h-auto max-h-[50vh] object-contain"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-full hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Chart'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-8 py-3 bg-slate-700 text-slate-200 font-bold rounded-full hover:bg-slate-600 transition-colors duration-300 disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">Analysis Failed</p>
              <p>{error}</p>
            </div>
          )}

          {analysis && !isLoading && <AnalysisDisplay result={analysis} />}
        </main>
      </div>
    </div>
  );
};

export default App;
