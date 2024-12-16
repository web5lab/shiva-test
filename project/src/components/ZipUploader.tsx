import React from 'react';
import { FileEntry } from '../lib/zipUtils';
import FileUploader from './FileUploader';
import RepositorySelector from './RepositorySelector';
import { ArrowRight } from 'lucide-react';

interface ZipUploaderProps {
  onComplete: (repo: string, files: FileEntry[]) => void;
}

export default function ZipUploader({ onComplete }: ZipUploaderProps) {
  const [files, setFiles] = React.useState<FileEntry[] | null>(null);
  const [step, setStep] = React.useState<'upload' | 'select'>(
    'upload'
  );

  const handleFilesExtracted = (extractedFiles: FileEntry[]) => {
    setFiles(extractedFiles);
    setStep('select');
  };

  const handleRepositorySelect = (repo: { name: string }) => {
    if (files) {
      onComplete(repo.name, files);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`flex items-center ${
              step === 'upload' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium">
              1
            </span>
            <span className="ml-2">Upload ZIP</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div
            className={`flex items-center ${
              step === 'select' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium">
              2
            </span>
            <span className="ml-2">Select Repository</span>
          </div>
        </div>

        {step === 'upload' && (
          <FileUploader onFilesExtracted={handleFilesExtracted} />
        )}

        {step === 'select' && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('upload')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to upload
            </button>
            <RepositorySelector onSelect={handleRepositorySelect} />
          </div>
        )}
      </div>
    </div>
  );
}