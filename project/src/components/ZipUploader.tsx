import React from 'react';
import { FileEntry } from '../lib/zipUtils';
import FileUploader from './FileUploader';
import FileChangesPreview from './FileChangesPreview';
import RepositorySelector from './RepositorySelector';
import { ArrowRight, Loader } from 'lucide-react';
import { getFileChanges } from '../lib/fileChanges';
import type { FileChange } from '../lib/fileChanges';
import { handleApiError } from '../lib/utils';

interface ZipUploaderProps {
  onComplete: (repo: string, files: FileEntry[]) => void;
  isUploading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

export default function ZipUploader({ 
  onComplete, 
  isUploading = false, 
  error = null,
  onError
}: ZipUploaderProps) {
  const [files, setFiles] = React.useState<FileEntry[] | null>(null);
  const [step, setStep] = React.useState<'upload' | 'select' | 'review'>(
    'upload'
  );
  const [selectedRepo, setSelectedRepo] = React.useState<{ name: string; owner: string } | null>(null);
  const [fileChanges, setFileChanges] = React.useState<FileChange[]>([]);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleFilesExtracted = (extractedFiles: FileEntry[]) => {
    setFiles(extractedFiles);
    setStep('select');
    setLocalError(null);
  };

  const handleRepositorySelect = async (repo: { name: string; owner: string }) => {
    if (!files) return;
    
    setLocalError(null);
    try {
      setSelectedRepo(repo);
      const changes = await getFileChanges(repo.owner, repo.name, files);
      setFileChanges(changes);
      setStep('review');
    } catch (error) {
      const err = handleApiError(error);
      setLocalError(err.message);
      if (err.message.includes('404')) {
        // Repository not found or no access
        setStep('select');
      }
    }
  };

  const handleConfirmChanges = () => {
    if (selectedRepo && files) {
      setLocalError(null);
      try {
        onComplete(selectedRepo.name, files);
      } catch (error) {
        const err = handleApiError(error);
        setLocalError(err.message);
      }
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
            <span className="ml-2">{step === 'review' ? 'Review Changes' : 'Select Repository'}</span>
          </div>
        </div>
        
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600">{error || localError}</p>
          </div>
        )}

        {isUploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-gray-700">Uploading files...</p>
            </div>
          </div>
        )}

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

        {step === 'review' && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('select')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to repository selection
            </button>
            <FileChangesPreview
              changes={fileChanges}
              onConfirm={handleConfirmChanges}
              onCancel={() => setStep('select')}
            />
          </div>
        )}
      </div>
    </div>
  );
}