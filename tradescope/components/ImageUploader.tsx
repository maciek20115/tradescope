
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  isLoading: boolean;
  imagePreview: string | null;
  onReset: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, imagePreview, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Chart</h2>
      <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-900/50 relative overflow-hidden min-h-[300px] md:min-h-[400px]">
        {imagePreview ? (
          <img src={imagePreview} alt="Chart preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          disabled={isLoading}
        />
        <button
          onClick={handleUploadClick}
          disabled={isLoading}
          className="w-full sm:w-auto flex-grow justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <UploadIcon className="-ml-1 mr-3 h-5 w-5" />
          {isLoading ? 'Analyzing...' : 'Select Chart Image'}
        </button>
        {imagePreview && (
           <button
           onClick={onReset}
           disabled={isLoading}
           className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-50 transition-colors"
         >
           Analyze Another
         </button>
        )}
      </div>
    </div>
  );
};
