
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeChartImage } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageAnalysis = useCallback(async (imageDataUrl: string) => {
    if (!imageDataUrl) return;

    setImage(imageDataUrl);
    setIsLoading(true);
    setAnalysis('');
    setError('');

    try {
      // Stripping the prefix for the API call, extracting MIME type
      const [header, base64Image] = imageDataUrl.split(',');
      const mimeType = header.match(/data:(.*?);/)?.[1] ?? 'image/jpeg';
      const result = await analyzeChartImage(base64Image, mimeType);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the chart. The model may be unavailable or the image format is not supported. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImage(null);
    setAnalysis('');
    setError('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
            <ImageUploader 
              onImageUpload={handleImageAnalysis} 
              isLoading={isLoading} 
              imagePreview={image}
              onReset={handleReset}
            />
          </div>
          <div className="flex flex-col bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700">
            <AnalysisDisplay 
              analysis={analysis} 
              isLoading={isLoading} 
              error={error} 
              hasImage={!!image} 
            />
          </div>
        </main>
        <footer className="text-center text-gray-500 mt-12 text-sm">
          <p>&copy; {new Date().getFullYear()} TradeScope. AI-powered insights.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
