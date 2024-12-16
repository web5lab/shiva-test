import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getFileContent, updateFile } from '../lib/api';
import { Loader, Save, Check, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodeViewerProps {
  file: {
    name: string;
    download_url: string;
    path: string;
    sha: string;
  } | null;
  owner: string;
  repo: string;
}

export default function CodeViewer({ file, owner, repo }: CodeViewerProps) {
  const [editorContent, setEditorContent] = React.useState<string>('');
  const [isEdited, setIsEdited] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery(
    ['file', file?.download_url],
    () => getFileContent(file!.download_url),
    {
      enabled: !!file?.download_url,
      onSuccess: (data) => {
        setEditorContent(data);
        setIsEdited(false);
        setSaveStatus('idle');
      }
    }
  );

  const updateFileMutation = useMutation(
    async () => {
      if (!file) return;
      return updateFile(owner, repo, file.path, editorContent, file.sha);
    },
    {
      onMutate: () => {
        setSaveStatus('saving');
      },
      onSuccess: () => {
        setSaveStatus('saved');
        setIsEdited(false);
        setTimeout(() => setSaveStatus('idle'), 2000);
        queryClient.invalidateQueries(['file', file?.download_url]);
      },
      onError: () => {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  );

  const handleEditorChange = (value: string = '') => {
    setEditorContent(value);
    setIsEdited(value !== content);
  };

  const handleSave = async () => {
    if (!isEdited) return;
    updateFileMutation.mutate();
  };

  const getFileLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      go: 'go',
      rs: 'rust',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      php: 'php',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        <div className="text-center">
          <div className="mb-4">
            <File className="w-12 h-12 mx-auto text-gray-400" />
          </div>
          Select a file to view its contents
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Loader className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{file.path}</span>
        <div className="flex items-center space-x-2">
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Error saving
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center text-green-600 text-sm">
              <Check className="w-4 h-4 mr-1" />
              Saved
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!isEdited || saveStatus === 'saving'}
            className={`px-3 py-1 rounded text-sm flex items-center space-x-1
              ${isEdited
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            {saveStatus === 'saving' ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={getFileLanguage(file.name)}
          value={editorContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}