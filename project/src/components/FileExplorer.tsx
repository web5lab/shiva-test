import React from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { useQuery } from 'react-query';
import { getRepositoryContents } from '../lib/api';

interface FileExplorerProps {
  owner: string;
  repo: string;
  path?: string;
  onFileSelect: (file: any) => void;
}

export default function FileExplorer({ owner, repo, path = '', onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

  const { data: contents, isLoading } = useQuery(
    ['contents', owner, repo, path],
    () => getRepositoryContents(owner, repo, path),
    { enabled: !!owner && !!repo }
  );

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-4 rounded w-full" />;
  }

  return (
    <div className="text-sm">
      {contents?.map((item: any) => (
        <div key={item.path} className="py-1">
          {item.type === 'dir' ? (
            <div>
              <button
                onClick={() => toggleFolder(item.path)}
                className="flex items-center space-x-2 hover:bg-gray-100 w-full px-2 py-1 rounded"
              >
                {expandedFolders.has(item.path) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <Folder className="h-4 w-4 text-blue-500" />
                <span>{item.name}</span>
              </button>
              {expandedFolders.has(item.path) && (
                <div className="ml-6">
                  <FileExplorer
                    owner={owner}
                    repo={repo}
                    path={item.path}
                    onFileSelect={onFileSelect}
                  />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onFileSelect(item)}
              className="flex items-center space-x-2 hover:bg-gray-100 w-full px-2 py-1 rounded ml-6"
            >
              <File className="h-4 w-4 text-gray-500" />
              <span>{item.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}