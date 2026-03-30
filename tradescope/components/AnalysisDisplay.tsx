import React from 'react';
import { SparkIcon } from './icons/SparkIcon';

interface AnalysisDisplayProps {
  analysis: string;
  isLoading: boolean;
  error: string;
  hasImage: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="h-5 bg-gray-700 rounded w-1/4 pt-4"></div>
     <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

const InitialState: React.FC = () => (
    <div className="text-center text-gray-400 m-auto">
        <SparkIcon className="mx-auto h-16 w-16 text-gray-600"/>
        <h3 className="mt-4 text-lg font-semibold text-gray-200">AI Analysis Awaits</h3>
        <p className="mt-1 text-gray-500">Upload a chart image to receive an expert breakdown from Gemini.</p>
    </div>
);

/**
 * Converts a simple subset of Markdown to HTML, filtering out Confidence and Prediction sections.
 * - ### for h3 tags
 * - **text** for strong tags
 * - Double newlines for paragraphs
 */
const markdownToHtml = (text: string): string => {
    const blocks = text.trim().split(/\n\n+/);
    const htmlBlocks = blocks.map(block => {
        if (!block || block.startsWith('### Confidence') || block.startsWith('### Prediction')) return '';
        
        // Handle ### Heading
        if (block.startsWith('### ')) {
            return `<h3>${block.substring(4)}</h3>`;
        }

        // Handle paragraphs with bold text and line breaks
        const processedBlock = block
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
        
        return `<p>${processedBlock}</p>`;
    });

    return htmlBlocks.join('');
};

/**
 * Extracts the confidence percentage from the analysis text.
 */
const extractConfidence = (text: string): string | null => {
  const confidenceMatch = text.match(/### Confidence\s*\n+\s*\*{0,2}([\d.]+%)\*{0,2}/);
  return confidenceMatch ? confidenceMatch[1] : null;
}

/**
 * Extracts the prediction direction and determines its style.
 */
const extractPrediction = (text: string): { direction: string; style: string; } | null => {
    const predictionMatch = text.match(/### Prediction\s*\n+\s*\*{0,2}Likely (Rise|Fall|Sideways)\*{0,2}/i);
    if (!predictionMatch || !predictionMatch[1]) return null;

    const direction = predictionMatch[1].toUpperCase();

    switch (direction) {
        case 'RISE':
            return { direction: 'RISE', style: 'text-green-400 bg-green-900/50 border-green-700' };
        case 'FALL':
            return { direction: 'FALL', style: 'text-red-400 bg-red-900/50 border-red-700' };
        case 'SIDEWAYS':
            return { direction: 'SIDEWAYS', style: 'text-yellow-400 bg-yellow-900/50 border-yellow-700' };
        default:
            return null;
    }
}


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, isLoading, error, hasImage }) => {
  const confidence = analysis ? extractConfidence(analysis) : null;
  const prediction = analysis ? extractPrediction(analysis) : null;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-semibold text-white">Prediction Analysis</h2>
        {!isLoading && confidence && (
            <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-cyan-400">{confidence.replace('%', '')}</span>
                <span className="text-sm font-medium text-gray-400">% confidence</span>
            </div>
        )}
      </div>
      <div className="flex-grow p-4 bg-gray-900/50 rounded-lg overflow-y-auto">
        {isLoading && <LoadingSkeleton />}
        {error && !isLoading && (
          <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
            <h3 className="font-bold">Analysis Error</h3>
            <p>{error}</p>
          </div>
        )}
        {analysis && !isLoading && !error && (
          <>
            {prediction && (
              <div className={`mb-4 inline-flex items-center justify-center px-4 py-1 rounded-full border ${prediction.style}`}>
                <span className="text-sm font-bold tracking-wider">{prediction.direction}</span>
              </div>
            )}
            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-cyan-400 prose-headings:font-semibold prose-strong:text-gray-100 prose-headings:mb-2 prose-p:my-2"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(analysis) }}
            />
          </>
        )}
        {!isLoading && !error && !analysis && (
            <InitialState/>
        )}
      </div>
    </div>
  );
};
