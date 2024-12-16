import React from 'react';
import { Upload, X } from 'lucide-react';
import { unzipFile, FileEntry } from '../lib/zipUtils';

interface FileUploaderProps {
  onFilesExtracted: (files: FileEntry[]) => void;
}

export default function FileUploader({ onFilesExtracted }: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processZipFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const files = await unzipFile(file);
      onFilesExtracted(files);
    } catch (err) {
      setError('Failed to process ZIP file');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    await processZipFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processZipFile(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop your ZIP file here, or{' '}
                <span className="text-blue-600 hover:text-blue-500">
                  browse
                </span>
              </span>
              <input
                type="file"
                className="hidden"
                accept=".zip"
                onChange={handleFileInput}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">Only ZIP files are supported</p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Processing ZIP file...
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-md bg-red-50 p-4">
          <div className="flex items-center">
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}